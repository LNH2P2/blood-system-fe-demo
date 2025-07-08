// middleware.ts
import { jwtDecode } from 'jwt-decode'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

interface JwtPayload {
  sub: string
  email: string
  username: string
  role: string
  iat: number
  exp: number
}

const PUBLIC_PATHS = ['/vi/login', '/vi/register', '/unauthorized', '/vi/verify-otp', '/vi/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Cho phép truy cập các tài nguyên tĩnh (handled by matcher below too)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/api') // optional: allow API requests
  ) {
    return NextResponse.next()
  }

  // ✅ Bỏ qua middleware nếu route là public
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('access_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/vi/login', request.url))
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const now = Math.floor(Date.now() / 1000)

    if (decoded.exp < now) {
      return NextResponse.redirect(new URL('/vi/login', request.url))
    }

    if (pathname.startsWith('/vi/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Invalid token:', error)
    return NextResponse.redirect(new URL('/vi/login', request.url))
  }
}
