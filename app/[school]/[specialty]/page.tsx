import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSchool, getSpecialty, getCoursesBySpecialty } from '@/lib/content'
import { ChevronRight, Code, FileText, Download, Tag } from 'lucide-react'

interface Props {
  params: { school: string; specialty: string }
}

export default function SpecialtyPage({ params }: Props) {
  const school = getSchool(params.school)
  const specialty = school ? getSpecialty(params.school, params.specialty) : undefined

  if (!school || !specialty) {
    notFound()
  }

  const courses = getCoursesBySpecialty(school.id, specialty.id)

  return (
    <div>
      {/* Header */}
      <section
        className="py-12 text-white"
        style={{ background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}dd 100%)` }}
      >
        <div className="container mx-auto px-4">
          <p className="text-sm opacity-80 mb-2">{school.name}</p>
          <h1 className="text-4xl font-bold">{specialty.name}</h1>
          <p className="text-lg opacity-90 mt-2">{specialty.fullName}</p>
          <p className="text-sm opacity-70 mt-1">{specialty.year}</p>
        </div>
      </section>

      {/* Courses */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Cours disponibles ({courses.length})
          </h2>

          {courses.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Aucun cours disponible pour le moment</p>
              <p className="text-sm mt-2">Les ressources seront bientôt ajoutées</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/${school.id}/${specialty.id}/${course.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-accent transition">
                        {course.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {course.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Resources preview */}
                    <div className="flex gap-4 text-sm text-gray-500">
                      {course.resources.some(r => r.type === 'code') && (
                        <span className="flex items-center gap-1">
                          <Code className="w-4 h-4 text-green-500" />
                          Code
                        </span>
                      )}
                      {course.resources.some(r => r.type === 'slides') && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-blue-500" />
                          Slides
                        </span>
                      )}
                      {course.resources.some(r => r.type === 'download') && (
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-purple-500" />
                          Fichiers
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
