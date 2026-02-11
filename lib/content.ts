import fs from 'fs'
import path from 'path'

// Types
export interface Specialty {
  id: string
  name: string
  fullName: string
  year: string
}

export interface School {
  id: string
  name: string
  fullName: string
  color: string
  logo: string
  specialties: Specialty[]
}

export interface Resource {
  id: string
  type: 'code' | 'slides' | 'download'
  title: string
  file: string
  icon?: string
}

export interface Course {
  id: string
  title: string
  description: string
  school: string
  specialty: string
  tags: string[]
  resources: Resource[]
  createdAt?: string
  updatedAt?: string
}

// Data paths
const CONTENT_DIR = path.join(process.cwd(), 'content')
const SCHOOLS_FILE = path.join(CONTENT_DIR, 'schools.json')
const COURSES_DIR = path.join(CONTENT_DIR, 'courses')

// Schools
export function getSchools(): School[] {
  const data = fs.readFileSync(SCHOOLS_FILE, 'utf-8')
  const { schools } = JSON.parse(data)
  return schools
}

export function getSchool(id: string): School | undefined {
  const schools = getSchools()
  return schools.find(s => s.id === id)
}

export function getSpecialty(schoolId: string, specialtyId: string): Specialty | undefined {
  const school = getSchool(schoolId)
  return school?.specialties.find(s => s.id === specialtyId)
}

// Courses
export function getCourses(): Course[] {
  if (!fs.existsSync(COURSES_DIR)) {
    return []
  }

  const courseDirs = fs.readdirSync(COURSES_DIR)
  const courses: Course[] = []

  for (const dir of courseDirs) {
    const metaPath = path.join(COURSES_DIR, dir, 'meta.json')
    if (fs.existsSync(metaPath)) {
      const data = fs.readFileSync(metaPath, 'utf-8')
      courses.push(JSON.parse(data))
    }
  }

  return courses
}

export function getCoursesBySchool(schoolId: string): Course[] {
  return getCourses().filter(c => c.school === schoolId)
}

export function getCoursesBySpecialty(schoolId: string, specialtyId: string): Course[] {
  return getCourses().filter(c => c.school === schoolId && c.specialty === specialtyId)
}

export function getCourse(courseId: string): Course | undefined {
  return getCourses().find(c => c.id === courseId)
}

export function getCourseContent(courseId: string, resourceFile: string): string | null {
  const coursePath = path.join(COURSES_DIR, courseId, 'resources', resourceFile)
  if (fs.existsSync(coursePath)) {
    return fs.readFileSync(coursePath, 'utf-8')
  }
  return null
}

export function getCourseFilePath(courseId: string, file: string): string {
  return path.join(COURSES_DIR, courseId, 'resources', file)
}
