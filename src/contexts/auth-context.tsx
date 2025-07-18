'use client'

import { authApi } from '@/apis/auth.api'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useEffect, useState } from 'react'

interface JwtPayload {
  sub: string
  email: string
  username: string
  image?: string
  hospitalId?: string
  role: string
  iat: number
  exp: number
}

interface AuthContextType {
  user: JwtPayload | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  refreshAccessToken: () => Promise<string | undefined>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<JwtPayload | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token') || Cookies.get('access_token')
    if (storedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken)
        setAccessToken(storedToken)
        setUser(decoded)
      } catch (error) {
        console.error('Lỗi khi giải mã token:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
      }
    }
  }, [])

  useEffect(() => {
    if (!user?.exp) return

    const now = Math.floor(Date.now() / 1000)
    const expiresIn = user.exp - now

    const timeout = setTimeout(() => {
      refreshAccessToken()
    }, (expiresIn - 60) * 1000) // gọi trước khi hết hạn 1 phút

    return () => clearTimeout(timeout)
  }, [user])

  const login = (accessToken: string, refreshToken: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken)
      setAccessToken(accessToken)
      setUser(decoded)

      // Lưu vào localStorage
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)

      // Lưu vào cookie (có thể set expires, path,...)
      Cookies.set('access_token', accessToken, { expires: 1 / 24 }) // expires: 1 day
      Cookies.set('refresh_token', refreshToken, { expires: 7 })
    } catch (error) {
      console.error('Lỗi khi login & decode token:', error)
    }
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
  }

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token') || Cookies.get('refresh_token')
    if (!refreshToken) return

    try {
      const response = await authApi.refreshToken(refreshToken.toString())
      const newAccessToken = response.payload.data.access_token // giả sử API trả về new access token
      const decoded = jwtDecode<JwtPayload>(newAccessToken)
      console.log('decode:', decoded)
      setAccessToken(newAccessToken)
      setUser(decoded)

      localStorage.setItem('access_token', newAccessToken)
      Cookies.set('access_token', newAccessToken, { expires: 1 / 24 })

      return newAccessToken
    } catch (error) {
      console.error('Lỗi khi refresh token:', error)
      logout() // Nếu refresh thất bại thì logout
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
