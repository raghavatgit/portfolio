import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Boxes,
  Activity,
  Cpu,
  Compass,
  Radio,
  Sparkles,
} from 'lucide-react'
import { useMascot, type SectionId } from '@/context/MascotContext'

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

// Soft audio feedback
class DockSFX {
  private ctx: AudioContext | null = null
  public enabled = true

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
  }

  playTick(freq = 1200) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03)
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {}
  }
}

const dockSfx = new DockSFX()

export function RightNavDock() {
  const { activeSection, setActiveSection, soundEnabled } = useMascot()
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null)

  useEffect(() => {
    dockSfx.enabled = soundEnabled
  }, [soundEnabled])

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
      <nav className="preserve-3d relative flex flex-col items-center gap-1.5 border border-slate-300/90 bg-white/85 p-1.5 shadow-[4px_4px_0_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-colors dark:border-white/[0.14] dark:bg-[#080b16]/90 dark:shadow-[4px_4px_0_rgba(0,240,255,0.12)]">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          const isHovered = hoveredId === item.id

          return (
            <div key={item.id} className="relative flex items-center justify-center">
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
                  dockSfx.playTick(800 + idx * 100)
                  setActiveSection(item.id)
                }}
                onMouseEnter={() => {
                  setHoveredId(item.id)
                  dockSfx.playTick(1200)
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

        <div className="pt-1 text-slate-400 transition-colors hover:text-cyan-500 dark:text-white/30">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      </nav>
    </aside>
  )
}

