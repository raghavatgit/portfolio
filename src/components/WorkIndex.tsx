import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { useMascot } from '@/context/MascotContext'
import { SKILLS, WORKS, type Work } from '@/data/profile'

const SKILL_LABEL = Object.fromEntries(SKILLS.map((s) => [s.id, s.label]))

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Procedural artwork for projects without a screenshot: engineered grid with a signature mark. */
function Plate({ work }: { work: Work }) {
  return (
    <svg viewBox="0 0 260 170" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={`g-${work.id}`} width="13" height="13" patternUnits="userSpaceOnUse">
          <path d="M13 0H0V13" fill="none" stroke={work.color} strokeOpacity="0.22" strokeWidth="0.6" />
        </pattern>
        <linearGradient id={`f-${work.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={work.color} stopOpacity="0.35" />
          <stop offset="1" stopColor={work.color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="260" height="170" fill="#05070d" />
      <rect width="260" height="170" fill={`url(#g-${work.id})`} />
      <rect width="260" height="170" fill={`url(#f-${work.id})`} />
      <circle cx="130" cy="85" r="46" fill="none" stroke={work.color} strokeOpacity="0.55" />
      <circle cx="130" cy="85" r="28" fill="none" stroke={work.color} strokeOpacity="0.85" />
      <path d="M30 85H230M130 12V158" stroke={work.color} strokeOpacity="0.35" strokeWidth="0.8" />
      <rect x="122" y="77" width="16" height="16" fill={work.color} />
      <text x="14" y="154" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#cbd5e1" letterSpacing="1.5">
        {work.kind.toUpperCase()}
      </text>
    </svg>
  )
}

function Preview({ work }: { work: Work }) {
  return (
    <div className="relative h-full w-full overflow-hidden border border-white/20 bg-[#05070d] shadow-2xl shadow-black/50">
      {work.image ? (
        <img src={work.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <Plate work={work} />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: work.color }} />
    </div>
  )
}

export function WorkIndex() {
  const [open, setOpen] = useState<string | null>('streamshield')
  const [hover, setHover] = useState<Work | null>(null)
  const { setHighlightedBrickIndex } = useMascot()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.5 })

  const openLab = (lab: string) => {
    window.dispatchEvent(new CustomEvent('lab:open', { detail: lab }))
    goTo('sandbox')
  }

  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8">
      <SectionHeader
        eyebrow="Selected work"
        lead="Index of"
        accent="Systems & Interfaces"
        note="hover, then open"
        right={<span>{String(WORKS.length).padStart(2, '0')} entries / 2026</span>}
      />

      <div
        onMouseMove={(e) => {
          mx.set(e.clientX + 32)
          my.set(e.clientY - 96)
        }}
        onMouseLeave={() => {
          setHover(null)
          setHighlightedBrickIndex(null)
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
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
                          <img
                            src={w.image}
                            alt={`${w.title} screenshot`}
                            className="h-44 w-full border border-slate-200 object-cover dark:border-white/[0.1] md:hidden"
                          />
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
                              Repository <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                          {w.live && (
                            <a
                              href={w.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 border-b border-slate-400 pb-0.5 text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-white dark:hover:text-cyan-300"
                            >
                              Live <ArrowUpRight className="h-3 w-3" />
                            </a>
                          )}
                          {w.lab && (
                            <button
                              type="button"
                              onClick={() => openLab(w.lab!)}
                              className="inline-flex items-center gap-1 text-flow-vibrant"
                            >
                              Run the simulation <ArrowUpRight className="h-3 w-3 text-cyan-500" />
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

      {/* Cursor following preview plate */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[55] hidden h-[170px] w-[260px] md:block"
        style={{ x: sx, y: sy }}
      >
        <AnimatePresence mode="wait">
          {hover && (
            <motion.div
              key={hover.id}
              className="h-full w-full"
              initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22 }}
            >
              <Preview work={hover} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
