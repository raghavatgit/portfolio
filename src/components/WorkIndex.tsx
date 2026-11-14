import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { useMascot } from '@/context/MascotContext'
import { SKILLS, WORKS, type Work } from '@/data/profile'

const SKILL_LABEL = Object.fromEntries(SKILLS.map((s) => [s.id, s.label]))

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** 3D isometric wireframe artwork for projects without a screenshot. */
function Plate({ work }: { work: Work }) {
  return (
    <svg viewBox="0 0 260 170" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={`g-${work.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke={work.color} strokeOpacity="0.16" strokeWidth="0.6" />
        </pattern>
        <linearGradient id={`f-${work.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={work.color} stopOpacity="0.32" />
          <stop offset="1" stopColor={work.color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect width="260" height="170" fill="#05070d" />
      <rect width="260" height="170" fill={`url(#g-${work.id})`} />
      <rect width="260" height="170" fill={`url(#f-${work.id})`} />
      {/* Receding 3D perspective floor lines */}
      <path
        d="M10 155 L92 105 M250 155 L168 105 M55 155 L110 105 M205 155 L150 105 M45 135 H215 M75 118 H185"
        stroke={work.color}
        strokeOpacity="0.28"
        strokeWidth="0.7"
      />
      {/* Back wireframe isometric cube faces */}
      <polygon
        points="130,32 172,56 172,102 130,126 88,102 88,56"
        fill={work.color}
        fillOpacity="0.08"
        stroke={work.color}
        strokeOpacity="0.85"
        strokeWidth="1.2"
      />
      {/* Top face */}
      <polygon
        points="130,32 172,56 130,80 88,56"
        fill={work.color}
        fillOpacity="0.22"
        stroke={work.color}
        strokeOpacity="0.95"
        strokeWidth="1"
      />
      {/* Vertical center ridge + inner cube */}
      <path d="M130 80V126 M130 32V80" stroke={work.color} strokeOpacity="0.65" strokeWidth="0.9" />
      <polygon
        points="130,54 148,64 148,84 130,94 112,84 112,64"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      <text x="14" y="156" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#cbd5e1" letterSpacing="1.4">
        {work.kind.toUpperCase()}
      </text>
    </svg>
  )
}

function Preview({ work }: { work: Work }) {
  return (
    <div
      className="preserve-3d relative h-full w-full overflow-hidden border border-white/25 bg-[#05070d] shadow-2xl shadow-black/60"
      style={{ boxShadow: `0 24px 48px -14px rgba(0,0,0,0.65), 0 0 24px -6px ${work.color}40` }}
    >
      {work.image ? (
        <img src={work.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <Plate work={work} />
      )}
      <div
        className="pointer-events-none absolute right-2.5 top-2.5 border border-white/20 bg-black/65 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-200 backdrop-blur-sm"
        style={{ transform: 'translateZ(20px)' }}
      >
        {work.year}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: work.color }} />
    </div>
  )
}

export function WorkIndex() {
  const [open, setOpen] = useState<string | null>('streamshield')
  const [hover, setHover] = useState<Work | null>(null)
  const { setHighlightedBrickIndex } = useMascot()
  const resetTimer = useRef<number>(0)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const vx = useMotionValue(0)
  const vy = useMotionValue(0)

  const sx = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 220, damping: 24, mass: 0.5 })
  const sRotY = useSpring(vx, { stiffness: 260, damping: 22 })
  const sRotX = useSpring(vy, { stiffness: 260, damping: 22 })

  const openLab = (lab: string) => {
    window.dispatchEvent(new CustomEvent('lab:open', { detail: lab }))
    goTo('sandbox')
  }

  return (
    <section id="projects" className="perspective-stage mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8">
      <SectionHeader
        eyebrow="Projects"
        lead="Selected"
        accent="Apps & 3D Tools"
        note="hover & click to explore"
        right={<span>{String(WORKS.length).padStart(2, '0')} builds / 2026</span>}
      />

      <div
        onMouseMove={(e) => {
          mx.set(e.clientX + 34)
          my.set(e.clientY - 96)
          const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v))
          vx.set(clamp(e.movementX * 1.1, 22))
          vy.set(clamp(-e.movementY * 1.1, 18))
          window.clearTimeout(resetTimer.current)
          resetTimer.current = window.setTimeout(() => {
            vx.set(0)
            vy.set(0)
          }, 90)
        }}
        onMouseLeave={() => {
          setHover(null)
          setHighlightedBrickIndex(null)
          vx.set(0)
          vy.set(0)
        }}
      >
        {WORKS.map((w, i) => {
          const isOpen = open === w.id
          return (
            <div key={w.id} className="border-b border-slate-200 transition-colors dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : w.id)}
                onMouseEnter={() => {
                  setHover(w)
                  setHighlightedBrickIndex(w.brick)
                }}
                onMouseLeave={() => setHover(null)}
                aria-expanded={isOpen}
                className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[3.5rem_1.4fr_1fr_5rem_2rem]"
              >
                <span className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className={`font-display text-2xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-4xl ${
                    isOpen ? 'text-flow-vibrant' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {w.title}
                </span>
                <span className="hidden font-mono text-xs text-slate-500 dark:text-slate-400 md:block">{w.kind}</span>
                <span className="hidden font-mono text-xs text-slate-400 md:block">{w.year}</span>
                <Plus
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:text-cyan-500 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, rotateX: -6 }}
                    animate={{ height: 'auto', opacity: 1, rotateX: 0 }}
                    exit={{ height: 0, opacity: 0, rotateX: -4 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top center', transformPerspective: 1000 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-8 pb-10 pl-0 md:grid-cols-12 md:pl-[3.5rem]">
                      <div className="md:col-span-6">
                        <p className="font-serif text-2xl italic leading-snug text-slate-900 dark:text-white sm:text-3xl">
                          {w.line}
                        </p>
                        <ul className="mt-6 space-y-2">
                          {w.facts.map((f) => (
                            <li
                              key={f}
                              className="border-l pl-3 text-sm font-light text-slate-600 dark:text-slate-300"
                              style={{ borderColor: w.color }}
                            >
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col justify-between gap-6 md:col-span-6">
                        {w.image && (
                          <div className="h-44 w-full border border-slate-200 dark:border-white/[0.1] md:hidden">
                            <img src={w.image} alt={`${w.title} preview`} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <p className="font-mono text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {w.skills.map((s) => SKILL_LABEL[s]).join('  /  ')}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
                          {w.repo && (
                            <a
                              href={w.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 border-b border-slate-400 pb-0.5 text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-white dark:hover:text-cyan-300"
                            >
                              View code <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                          {w.live && (
                            <a
                              href={w.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 border-b border-slate-400 pb-0.5 text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-white dark:hover:text-cyan-300"
                            >
                              Open live site <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                          {w.lab && (
                            <button
                              type="button"
                              onClick={() => openLab(w.lab!)}
                              className="inline-flex items-center gap-1 text-flow-vibrant"
                            >
                              Try live 3D demo <ArrowUpRight className="h-3 w-3 text-cyan-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* 3D Velocity-Tilted Cursor Preview Plate */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[55] hidden h-[175px] w-[268px] md:block"
        style={{
          x: sx,
          y: sy,
          rotateY: sRotY,
          rotateX: sRotX,
          transformPerspective: 850,
          transformStyle: 'preserve-3d',
        }}
      >
        <AnimatePresence mode="wait">
          {hover && (
            <motion.div
              key={hover.id}
              className="preserve-3d h-full w-full"
              initial={{ opacity: 0, scale: 0.88, translateZ: -30 }}
              animate={{ opacity: 1, scale: 1, translateZ: 0 }}
              exit={{ opacity: 0, scale: 0.9, translateZ: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Preview work={hover} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
