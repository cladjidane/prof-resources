import Link from 'next/link'
import { getSchools, getCourses } from '@/lib/content'
import { School, BookOpen, FileText, Plus, Settings, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const schools = getSchools()
  const courses = getCourses()

  const totalSpecialties = schools.reduce((acc, s) => acc + s.specialties.length, 0)
  const totalResources = courses.reduce((acc, c) => acc + c.resources.length, 0)

  return (
    <div className="min-h-[80vh] bg-gray-100">
      {/* Header */}
      <section className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Administration
          </h1>
          <p className="text-gray-300 mt-2">Gérez vos écoles, spécialités et cours</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<School className="w-8 h-8 text-blue-500" />}
            label="Écoles"
            value={schools.length}
            color="blue"
          />
          <StatCard
            icon={<BarChart3 className="w-8 h-8 text-green-500" />}
            label="Spécialités"
            value={totalSpecialties}
            color="green"
          />
          <StatCard
            icon={<BookOpen className="w-8 h-8 text-purple-500" />}
            label="Cours"
            value={courses.length}
            color="purple"
          />
          <StatCard
            icon={<FileText className="w-8 h-8 text-orange-500" />}
            label="Ressources"
            value={totalResources}
            color="orange"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-accent" />
              Actions rapides
            </h2>
            <div className="space-y-3">
              <ActionButton
                href="/admin/courses/new"
                label="Ajouter un cours"
                description="Créer un nouveau cours avec des ressources"
              />
              <ActionButton
                href="/admin/schools"
                label="Gérer les écoles"
                description="Modifier les écoles et spécialités"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Cours récents</h2>
            {courses.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun cours pour le moment</p>
            ) : (
              <ul className="space-y-2">
                {courses.slice(0, 5).map((course) => {
                  const school = schools.find(s => s.id === course.school)
                  return (
                    <li key={course.id}>
                      <Link
                        href={`/${course.school}/${course.specialty}/${course.id}`}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-800">{course.title}</span>
                        <span
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: school?.color || '#666' }}
                        >
                          {school?.name}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Schools overview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Vue par école</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schools.map((school) => {
              const schoolCourses = courses.filter(c => c.school === school.id)
              return (
                <div
                  key={school.id}
                  className="border rounded-lg p-4"
                  style={{ borderColor: school.color }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{school.logo}</span>
                    <h3 className="font-bold" style={{ color: school.color }}>
                      {school.name}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{school.specialties.length} spécialité(s)</p>
                    <p>{schoolCourses.length} cours</p>
                  </div>
                  <Link
                    href={`/${school.id}`}
                    className="text-sm text-accent hover:underline mt-2 inline-block"
                  >
                    Voir →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-2">💡 Comment ajouter du contenu ?</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              <strong>1. Créer un dossier cours :</strong>{' '}
              <code className="bg-blue-100 px-1 rounded">content/courses/mon-cours/</code>
            </p>
            <p>
              <strong>2. Ajouter meta.json :</strong> avec id, title, description, school, specialty, tags, resources
            </p>
            <p>
              <strong>3. Ajouter les fichiers :</strong> dans <code className="bg-blue-100 px-1 rounded">resources/</code> (code.md, files/*.pptx)
            </p>
            <p>
              <strong>4. Déployer :</strong> <code className="bg-blue-100 px-1 rounded">git push</code> → Vercel auto-deploy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-${color}-50`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function ActionButton({
  href,
  label,
  description
}: {
  href: string
  label: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="block p-3 border rounded-lg hover:border-accent hover:bg-accent/5 transition"
    >
      <p className="font-medium text-gray-800">{label}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
