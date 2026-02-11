import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSchool, getSpecialty, getCourse, getCourseContent } from '@/lib/content'
import { Code, FileText, Download, ExternalLink, Tag, Calendar } from 'lucide-react'
import { CodeViewer } from '@/components/CodeViewer'

interface Props {
  params: { school: string; specialty: string; course: string }
}

export default async function CoursePage({ params }: Props) {
  const school = getSchool(params.school)
  const specialty = school ? getSpecialty(params.school, params.specialty) : undefined
  const course = getCourse(params.course)

  if (!school || !specialty || !course) {
    notFound()
  }

  // Get code content if exists
  const codeResource = course.resources.find(r => r.type === 'code')
  let codeContent: string | null = null
  if (codeResource) {
    codeContent = getCourseContent(course.id, codeResource.file)
  }

  return (
    <div>
      {/* Header */}
      <section
        className="py-12 text-white"
        style={{ background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}dd 100%)` }}
      >
        <div className="container mx-auto px-4">
          <p className="text-sm opacity-80 mb-2">
            {school.name} / {specialty.name}
          </p>
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="text-lg opacity-90 mt-2">{course.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-3 py-1 bg-white/20 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Resource cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {course.resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                courseId={course.id}
                schoolColor={school.color}
              />
            ))}
          </div>

          {/* Code viewer if code resource exists */}
          {codeContent && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Code className="w-6 h-6 text-green-500" />
                Code à copier
              </h2>
              <CodeViewer content={codeContent} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ResourceCard({
  resource,
  courseId,
  schoolColor
}: {
  resource: { id: string; type: string; title: string; file: string }
  courseId: string
  schoolColor: string
}) {
  const icons = {
    code: <Code className="w-8 h-8 text-green-500" />,
    slides: <FileText className="w-8 h-8 text-blue-500" />,
    download: <Download className="w-8 h-8 text-purple-500" />,
  }

  const bgColors = {
    code: 'bg-green-50 border-green-200',
    slides: 'bg-blue-50 border-blue-200',
    download: 'bg-purple-50 border-purple-200',
  }

  const isDownload = resource.type === 'download'
  const href = isDownload
    ? `/api/download?course=${courseId}&file=${resource.file}`
    : `#${resource.type}`

  return (
    <a
      href={href}
      download={isDownload}
      className={`block p-6 rounded-xl border-2 ${bgColors[resource.type as keyof typeof bgColors]} hover:shadow-md transition`}
    >
      <div className="flex items-center gap-4">
        {icons[resource.type as keyof typeof icons]}
        <div>
          <h3 className="font-semibold text-gray-800">{resource.title}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {resource.type === 'download' ? (
              <>
                <Download className="w-3 h-3" />
                Télécharger
              </>
            ) : (
              <>
                <ExternalLink className="w-3 h-3" />
                Voir
              </>
            )}
          </p>
        </div>
      </div>
    </a>
  )
}
