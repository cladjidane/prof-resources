import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth'

export async function POST(request: Request) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  const ADMIN_SECRET = process.env.ADMIN_SECRET

  if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Configuration serveur manquante' },
      { status: 500 }
    )
  }

  const body = await request.json()
  const { password } = body

  if (password === ADMIN_PASSWORD) {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const token = signToken(timestamp)

    cookies().set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, message: 'Mot de passe incorrect' },
    { status: 401 }
  )
}
