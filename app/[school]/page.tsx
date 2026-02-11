import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSchool, getCoursesBySchool } from '@/lib/content'
import { ChevronRight, BookOpen, Calendar } from 'lucide-react'

interface Props {
  params: { school: string }
}

export default function SchoolPage({ params }: Props) {
  const school = getSchool(params.school)

  if (!school) {
    notFound()
  }

  const courses = getCoursesBySchool(school.id)

  return (
    <div>
      {/* Header */}
      <section
        className="py-12 text-white"
        style={{ background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}dd 100%)` }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{school.logo}</span>
            <div>
              <h1 className="text-4xl font-bold">{school.name}</h1>
              <p className="text-lg opacity-90">{school.fullName}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Spécialités
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {school.specialties.map((specialty) => {
              const specialtyCourses = courses.filter(c => c.specialty === specialty.id)

              return (
                <Link
                  key={specialty.id}
                  href={`/${school.id}/${specialty.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-accent transition">
                        {specialty.name}
                      </h3>
                      <p className="text-sm text-gray-500">{specialty.fullName}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {specialty.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {specialtyCourses.length} cours
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateStaticParams() {
  const { getSchools } = await import('@/lib/content')
  const schools = getSchools()
  return schools.map((school) => ({
    school: school.id,
  }))
}
