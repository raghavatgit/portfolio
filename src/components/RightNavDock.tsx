import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Boxes,
  Activity,
  Cpu,
  Compass,
  Radio,
} from 'lucide-react'
import { useMascot, type SectionId } from '@/context/MascotContext'
import { sfx } from '@/utils/sfx'

interface NavItem {
  id: SectionId
  label: string
  subtitle: string
  icon: typeof Boxes
  color: string
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    subtitle: 'apps & builds',
    icon: Boxes,
    color: '#00F0FF',
  },
  {
    id: 'sandbox',
    label: '3D Lab',
    subtitle: 'try live demos',
    icon: Activity,
    color: '#A855F7',
  },
  {
    id: 'stack',
    label: 'Skills',
    subtitle: '3D skill map',
    icon: Cpu,
    color: '#10B981',
  },
  {
    id: 'about',
    label: 'About',
    subtitle: 'story & setup',
    icon: Compass,
    color: '#F59E0B',
  },
  {
    id: 'contact',
    label: 'Contact',
    subtitle: 'say hello',
    icon: Radio,
    color: '#FF4757',
  },
]

export function RightNavDock() {
  const { activeSection, setActiveSection } = useMascot()
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null)

  // Track sections intersecting viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId)
          }
        })
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0,
      }
    )

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [setActiveSection])

  return (
    <aside
      aria-label="Vertical Section Navigation"
      className="perspective-stage pointer-events-auto fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 select-none sm:right-5 md:block"
    >
      {/* Precision Machined Architectural Rail (no rounded pills) */}
      <nav className="preserve-3d relative flex flex-col items-center gap-1.5 border border-slate-200 bg-white/85 p-1.5 shadow-2xl shadow-black/10 backdrop-blur-2xl transition-colors dark:border-white/[0.12] dark:bg-[#080b16]/90 dark:shadow-black/80">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          const isHovered = hoveredId === item.id
          const hIdx = NAV_ITEMS.findIndex((n) => n.id === hoveredId)
          const d = hIdx < 0 ? 99 : Math.abs(hIdx - idx)
          const wave =
            d === 0
              ? 'translateZ(18px) translateX(-3px) scale(1.12)'
              : d === 1
                ? 'translateZ(8px) translateX(-1.5px) scale(1.04)'
                : 'translateZ(0px)'

          return (
            <div key={item.id} className="row-3d relative flex items-center justify-center" style={{ transform: wave }}>
              {/* Sliding 3D Tooltips */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 14, rotateY: -14 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: 8, rotateY: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{ transformOrigin: 'right center' }}
                    className="pointer-events-none absolute right-full z-50 mr-3 flex items-center gap-2.5 whitespace-nowrap border border-slate-300 bg-white/95 px-3 py-1.5 shadow-xl shadow-black/10 backdrop-blur-2xl transition-colors dark:border-white/[0.16] dark:bg-[#090d18]/95 dark:shadow-black/80"
                  >
                    <span
                      className="h-2 w-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold tracking-wide text-slate-900 dark:text-white">
                        {item.label}
                      </span>
                      <span className="mt-0.5 font-cursive text-sm leading-none text-cyan-600 dark:text-cyan-300">
                        {item.subtitle}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <a
                href={`#${item.id}`}
                onClick={() => {
                  sfx.playSnap(1600 + idx * 140)
                  setActiveSection(item.id)
                }}
                onMouseEnter={() => {
                  setHoveredId(item.id)
                  sfx.playTick(2100 + idx * 110)
                }}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative flex h-10 w-10 items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'font-bold text-slate-900 dark:text-white'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.08] dark:hover:text-white'
                }`}
                aria-label={`Jump to ${item.label}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-dock-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0"
                    style={{
                      backgroundColor: `${item.color}1e`,
                      border: `1.5px solid ${item.color}`,
                      boxShadow: `0 0 14px ${item.color}45`,
                    }}
                  />
                )}

                <div className="relative z-10 transition-transform duration-300 group-hover:scale-115">
                  <Icon
                    className="h-4 w-4 transition-colors duration-200"
                    style={{
                      color: isActive || isHovered ? item.color : undefined,
                    }}
                  />
                </div>

                {/* Square Lego stud registration marker */}
                <span
                  className={`absolute right-1 top-1 h-1 w-1 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              </a>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

