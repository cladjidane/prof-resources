import { NextRequest, NextResponse } from 'next/server'
import { getCourseFilePath } from '@/lib/content'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('course')
  const file = searchParams.get('file')

  if (!courseId || !file) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const filePath = getCourseFilePath(courseId, file)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath)
  const fileName = path.basename(file)

  // Determine content type
  const ext = path.extname(file).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.zip': 'application/zip',
    '.html': 'text/html',
    '.md': 'text/markdown',
  }

  const contentType = contentTypes[ext] || 'application/octet-stream'

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  })
}
