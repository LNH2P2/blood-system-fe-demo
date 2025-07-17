'use client'

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

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        login,
        logout
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
