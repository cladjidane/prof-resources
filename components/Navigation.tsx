'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Home, Settings } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-accent transition">
            <GraduationCap className="w-8 h-8" />
            <span>Prof Resources</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-1 hover:text-accent transition ${pathname === '/' ? 'text-accent' : ''}`}
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-1 hover:text-accent transition ${isAdmin ? 'text-accent' : ''}`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb pathname={pathname} />
      </nav>
    </header>
  )
}

function Breadcrumb({ pathname }: { pathname: string | null }) {
  if (!pathname || pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  return (
    <div className="mt-2 text-sm text-gray-300 flex items-center gap-2">
      <Link href="/" className="hover:text-white">Accueil</Link>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = decodeURIComponent(segment).replace(/-/g, ' ')

        return (
          <span key={path} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? (
              <span className="text-white capitalize">{label}</span>
            ) : (
              <Link href={path} className="hover:text-white capitalize">{label}</Link>
            )}
          </span>
        )
      })}
    </div>
  )
}
