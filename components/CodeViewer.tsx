'use client'

import { useState } from 'react'
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react'

interface CodeBlock {
  language: string
  code: string
  filename?: string
}

interface Section {
  title: string
  id: string
  blocks: CodeBlock[]
  description?: string
}

interface CodeViewerProps {
  content: string
}

export function CodeViewer({ content }: CodeViewerProps) {
  const sections = parseMarkdownToSections(content)

  return (
    <div className="space-y-8">
      {/* Navigation sticky */}
      <nav className="sticky top-[120px] z-30 bg-white/95 backdrop-blur rounded-lg shadow-md p-4 border">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">Navigation rapide</h3>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-accent hover:text-white rounded-full transition"
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </div>
  )
}

function SectionBlock({ section }: { section: Section }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section id={section.id} className="scroll-mt-48">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-accent text-white rounded-lg flex items-center justify-center text-sm font-bold">
            {section.id.replace('section-', '')}
          </span>
          {section.title}
        </h3>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 space-y-4">
          {section.description && (
            <p className="text-gray-600 text-sm">{section.description}</p>
          )}

          {section.blocks.map((block, index) => (
            <CodeBlock
              key={index}
              code={block.code}
              language={block.language}
              filename={block.filename}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function CodeBlock({
  code,
  language,
  filename
}: {
  code: string
  language: string
  filename?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting based on language
  const highlightedCode = highlightCode(code, language)

  return (
    <div className="code-block relative group">
      {filename && (
        <div className="bg-gray-700 text-gray-300 px-4 py-2 text-sm rounded-t-lg font-mono flex items-center justify-between">
          <span>📄 {filename}</span>
          <span className="text-xs text-gray-500">{language}</span>
        </div>
      )}

      <div className={`relative ${filename ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <button
          onClick={handleCopy}
          className={`copy-btn absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all z-10 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-accent text-white hover:bg-accent-light'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copier
            </>
          )}
        </button>

        <pre className={`bg-[#1e1e2e] text-gray-200 p-4 overflow-x-auto ${filename ? '' : 'rounded-lg'}`}>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  )
}

// Parse markdown content to sections
function parseMarkdownToSections(content: string): Section[] {
  const sections: Section[] = []
  const lines = content.split('\n')

  let currentSection: Section | null = null
  let currentCodeBlock: { language: string; code: string[]; filename?: string } | null = null
  let sectionIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Detect headers (## or ###)
    const headerMatch = line.match(/^#{1,3}\s+(.+)$/)
    if (headerMatch && !currentCodeBlock) {
      if (currentSection) {
        sections.push(currentSection)
      }
      sectionIndex++
      currentSection = {
        title: headerMatch[1].trim(),
        id: `section-${sectionIndex}`,
        blocks: [],
      }
      continue
    }

    // Detect code block start
    const codeStartMatch = line.match(/^```(\w+)?/)
    if (codeStartMatch) {
      if (currentCodeBlock) {
        // End of code block
        if (currentSection) {
          currentSection.blocks.push({
            language: currentCodeBlock.language,
            code: currentCodeBlock.code.join('\n'),
            filename: currentCodeBlock.filename,
          })
        }
        currentCodeBlock = null
      } else {
        // Start of code block
        currentCodeBlock = {
          language: codeStartMatch[1] || 'text',
          code: [],
        }

        // Check if previous line was a filename indicator
        const prevLine = lines[i - 1]
        if (prevLine && (prevLine.includes('📄') || prevLine.match(/^\*\*.+\*\*$/))) {
          currentCodeBlock.filename = prevLine.replace(/[📄*]/g, '').trim()
        }
      }
      continue
    }

    // Add line to code block if we're in one
    if (currentCodeBlock) {
      currentCodeBlock.code.push(line)
      continue
    }

    // Description text
    if (currentSection && line.trim() && !line.startsWith('#') && !line.startsWith('```')) {
      if (!currentSection.description) {
        currentSection.description = line.trim()
      }
    }
  }

  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

// Robust syntax highlighting that prevents regex overlap
function highlightCode(code: string, language: string): string {
  // Basic HTML escaping
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Keywords and patterns based on language
  const patterns: Record<string, Array<{ pattern: RegExp; className: string }>> = {
    php: [
      { pattern: /\b(class|function|public|private|protected|return|if|else|foreach|for|while|new|use|namespace|extends|implements|static|const|abstract|interface|trait)\b/g, className: 'text-purple-400' },
      { pattern: /\$\w+/g, className: 'text-blue-300' },
      { pattern: /(#\[.+?\])/g, className: 'text-yellow-300' },
      { pattern: /('.*?'|".*?")/g, className: 'text-green-300' },
      { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, className: 'text-gray-500' },
    ],
    twig: [
      { pattern: /(\{\{|\}\}|\{%|%\}|\{#|#\})/g, className: 'text-yellow-400' },
      { pattern: /\b(block|extends|include|if|else|endif|for|endfor|endblock|set)\b/g, className: 'text-purple-400' },
      { pattern: /('.*?'|".*?")/g, className: 'text-green-300' },
      { pattern: /(\|[a-z_]+)/g, className: 'text-blue-300' },
    ],
    bash: [
      { pattern: /(#.*$)/gm, className: 'text-gray-500' },
      { pattern: /\b(symfony|npm|composer|php|cd|mkdir|ls)\b/g, className: 'text-green-300' },
      { pattern: /('.*?'|".*?")/g, className: 'text-yellow-300' },
      { pattern: /(\$\w+)/g, className: 'text-blue-300' },
    ],
    html: [
      { pattern: /(&lt;\/?[a-z]+)/gi, className: 'text-blue-400' },
      { pattern: /(\s[a-z-]+)=/gi, className: 'text-yellow-300' },
      { pattern: /(".*?")/g, className: 'text-green-300' },
    ],
    javascript: [
      { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g, className: 'text-purple-400' },
      { pattern: /('.*?'|".*?"|`.*?`)/g, className: 'text-green-300' },
      { pattern: /(\/\/.*$)/gm, className: 'text-gray-500' },
    ],
    json: [
      { pattern: /(".*?"):/g, className: 'text-blue-300' },
      { pattern: /:\s*(".*?")/g, className: 'text-green-300' },
      { pattern: /:\s*(\d+|true|false|null)/g, className: 'text-yellow-300' },
    ],
  }

  const langPatterns = patterns[language] || patterns.html || []

  // Segment-based replacement to avoid matching inside already generated HTML
  let segments: { text: string; isHtml: boolean }[] = [{ text: escaped, isHtml: false }]

  for (const { pattern, className } of langPatterns) {
    const newSegments: typeof segments = []

    for (const segment of segments) {
      // Skip already highlighted segments
      if (segment.isHtml) {
        newSegments.push(segment)
        continue
      }

      let lastIndex = 0
      // Ensure global search
      const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')
      
      let match
      while ((match = regex.exec(segment.text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          newSegments.push({ 
            text: segment.text.slice(lastIndex, match.index), 
            isHtml: false 
          })
        }

        // Add matched text wrapped in span
        newSegments.push({
          text: `<span class="${className}">${match[0]}</span>`,
          isHtml: true
        })

        lastIndex = regex.lastIndex
      }

      // Add remaining text
      if (lastIndex < segment.text.length) {
        newSegments.push({ 
          text: segment.text.slice(lastIndex), 
          isHtml: false 
        })
      }
    }
    segments = newSegments
  }

  return segments.map(s => s.text).join('')
}
