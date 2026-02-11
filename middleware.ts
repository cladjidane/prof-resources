import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth-edge'

export async function middleware(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET || ''

  // Protection de la route /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')

    if (!adminSession || !(await verifyTokenEdge(adminSession.value, secret))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirection automatique si déjà connecté et qu'on va sur /login
  if (request.nextUrl.pathname === '/login') {
    const adminSession = request.cookies.get('admin_session')
    if (adminSession && (await verifyTokenEdge(adminSession.value, secret))) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
