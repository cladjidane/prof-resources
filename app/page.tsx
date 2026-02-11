import Link from 'next/link'
import { getSchools } from '@/lib/content'
import { ChevronRight, BookOpen, Users } from 'lucide-react'

export default function HomePage() {
  const schools = getSchools()

  return (
    <div className="min-h-[80vh]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Ressources de Cours
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Retrouvez tous les supports de cours, codes sources et présentations
            pour vos formations.
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <span>Cours & TP</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span>{schools.length} écoles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Choisissez votre école
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {schools.map((school) => (
              <Link
                key={school.id}
                href={`/${school.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Header with color */}
                <div
                  className="h-2"
                  style={{ backgroundColor: school.color }}
                />

                <div className="p-6">
                  {/* Logo & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{school.logo}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-accent transition">
                        {school.name}
                      </h3>
                      <p className="text-sm text-gray-500">{school.fullName}</p>
                    </div>
                  </div>

                  {/* Specialties count */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {school.specialties.length} spécialité{school.specialties.length > 1 ? 's' : ''}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Specialties preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {school.specialties.slice(0, 3).map((spec) => (
                      <span
                        key={spec.id}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                      >
                        {spec.name}
                      </span>
                    ))}
                    {school.specialties.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        +{school.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
