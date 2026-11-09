import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code2, Play, Layers, User, Send } from 'lucide-react'

const SECTIONS = [
  { id: 'projects', label: 'Projects', icon: Code2 },
  { id: 'sandbox', label: 'Playground', icon: Play },
  { id: 'stack', label: 'Skills & Tools', icon: Layers },
  { id: 'about', label: 'About Me', icon: User },
  { id: 'contact', label: 'Contact', icon: Send },
]

export function SectionNav() {
  const [activeSection, setActiveSection] = useState('projects')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0,
      }
    )

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="sticky top-20 z-40 w-full flex justify-center px-4 py-2 pointer-events-none mb-12">
      <nav
        aria-label="Sections navigation"
        className="pointer-events-auto inline-flex items-center gap-1 p-1.5 rounded-full bg-[#0e1017]/85 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/80 max-w-full overflow-x-auto scrollbar-none"
      >
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-white/[0.1] border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                />
              )}
              <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="relative z-10">{label}</span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}

