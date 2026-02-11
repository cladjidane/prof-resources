import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protection de la route /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')

    if (!adminSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirection automatique si déjà connecté et qu'on va sur /login
  if (request.nextUrl.pathname === '/login') {
    const adminSession = request.cookies.get('admin_session')
    if (adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
