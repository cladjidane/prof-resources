import { Heart } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-gray-400 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-1">
          © {year} Prof Resources - Fait avec
          <Heart className="w-4 h-4 text-accent fill-accent" />
          pour mes étudiants
        </p>
        <p className="text-sm mt-2">
          UBO · ISEN · UIT
        </p>
      </div>
    </footer>
  )
}
