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
    subtitle: 'systems & tools',
    icon: Boxes,
    color: '#00F0FF', // Cyan
  },
  {
    id: 'sandbox',
    label: 'Playground',
    subtitle: 'live physics',
    icon: Activity,
    color: '#A855F7', // Violet
  },
  {
    id: 'stack',
    label: 'Skills',
    subtitle: 'technical craft',
    icon: Cpu,
    color: '#10B981', // Emerald
  },
  {
    id: 'about',
    label: 'About Me',
    subtitle: 'story & philosophy',
    icon: Compass,
    color: '#F59E0B', // Amber
  },
  {
    id: 'contact',
    label: 'Contact',
    subtitle: 'say hello',
    icon: Radio,
    color: '#FF4757', // Coral
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
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-auto"
    >
      {/* Vertical Dock Capsule */}
      <nav className="relative flex flex-col items-center gap-2 p-2 rounded-full bg-[#080b16]/90 border border-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/90">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          const isHovered = hoveredId === item.id

          return (
            <div key={item.id} className="relative flex items-center justify-center">
              {/* Sliding Cursive Tooltip to the Left on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 12, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.9 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-[#090d18]/95 border border-white/[0.15] backdrop-blur-2xl shadow-xl shadow-black/80 flex items-center gap-2 whitespace-nowrap pointer-events-none z-50"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {item.label}
                      </span>
                      <span className="font-cursive text-cyan-300 text-sm leading-none mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Improvised Logo Button */}
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
                className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 group ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
                aria-label={`Jump to ${item.label}`}
              >
                {/* Active Indicator Spring Background */}
                {isActive && (
                  <motion.div
                    layoutId="active-dock-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: `${item.color}25`,
                      border: `1.5px solid ${item.color}`,
                      boxShadow: `0 0 16px ${item.color}60`,
                    }}
                  />
                )}

                {/* Animated Improvised Logo Icon */}
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-125">
                  <Icon
                    className="w-5 h-5 transition-colors duration-200"
                    style={{
                      color: isActive || isHovered ? item.color : undefined,
                    }}
                  />
                </div>

                {/* Subtle Stud Marker matching the Lego Motif */}
                <span
                  className={`absolute -top-0.5 right-1.5 w-1.5 h-1.5 rounded-full transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              </a>
            </div>
          )
        })}

        {/* Bottom Sparkle Marker */}
        <div className="pt-1 text-white/30 hover:text-cyan-400 transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </nav>
    </aside>
  )
}

