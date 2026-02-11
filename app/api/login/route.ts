import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json()
  const { password } = body

  // En production, ce mot de passe doit venir d'une variable d'environnement
  // Ex: process.env.ADMIN_PASSWORD
  // Pour l'instant, je mets une valeur par défaut si la variable n'existe pas
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

  if (password === ADMIN_PASSWORD) {
    // Création du cookie de session
    // HttpOnly = inaccessible via JS (sécurité XSS)
    // Secure = HTTPS uniquement (en prod)
    cookies().set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
