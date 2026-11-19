import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { ExtrudedSlab, SpatialSection } from '@/components/SpatialSection'
import { useMascot } from '@/context/MascotContext'
import { SKILLS, WORKS, type Work } from '@/data/profile'
import { sfx } from '@/utils/sfx'

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
      <path
        d="M10 155 L92 105 M250 155 L168 105 M55 155 L110 105 M205 155 L150 105 M45 135 H215 M75 118 H185"
        stroke={work.color}
        strokeOpacity="0.28"
        strokeWidth="0.7"
      />
      <polygon
        points="130,32 172,56 172,102 130,126 88,102 88,56"
        fill={work.color}
        fillOpacity="0.08"
        stroke={work.color}
        strokeOpacity="0.85"
        strokeWidth="1.2"
      />
      <polygon
        points="130,32 172,56 130,80 88,56"
        fill={work.color}
        fillOpacity="0.22"
        stroke={work.color}
        strokeOpacity="0.95"
        strokeWidth="1"
      />
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

function PreviewFace({ work }: { work: Work }) {
  return (
    <ExtrudedSlab accentColor={work.color} depth={11} className="h-full w-full">
      <div
        className="preserve-3d relative h-full w-full overflow-hidden border border-white/25 bg-[#05070d]"
        style={{ boxShadow: `0 22px 44px -14px rgba(0,0,0,0.65), 0 0 22px -6px ${work.color}38` }}
      >
        {work.image ? (
          <img src={work.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <Plate work={work} />
        )}
        <div
          className="pointer-events-none absolute right-2.5 top-2.5 border border-white/25 bg-black/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-200 backdrop-blur-sm"
          style={{ transform: 'translateZ(20px)' }}
        >
          {work.year}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: work.color }} />
      </div>
    </ExtrudedSlab>
  )
}

/** Interactive 3D tiltable slab inside an expanded project row. */
function InlineWorkSlab({ work }: { work: Work }) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 180, damping: 20 })
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 20 })

  return (
    <div
      className="perspective-stage py-2 pr-3"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        className="h-44 w-full max-w-[300px]"
      >
        <PreviewFace work={work} />
      </motion.div>
    </div>
  )
}

export function WorkIndex() {
  const [open, setOpen] = useState<string | null>('streamshield')
  const [hover, setHover] = useState<Work | null>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const { setHighlightedBrickIndex } = useMascot()
  const resetTimer = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <SpatialSection id="projects" index="01 / 05">
      <SectionHeader
        eyebrow="Projects"
        lead="Selected"
        accent="Apps & 3D Tools"
        note="hover & click to explore"
        right={<span>{String(WORKS.length).padStart(2, '0')} builds / 2026</span>}
      />

      <div
        onMouseMove={(e) => {
          mx.set(e.clientX + 36)
          my.set(e.clientY - 98)
          const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v))
          vx.set(clamp(e.movementX * 1.1, 24))
          vy.set(clamp(-e.movementY * 1.1, 20))
          window.clearTimeout(resetTimer.current)
          resetTimer.current = window.setTimeout(() => {
            vx.set(0)
            vy.set(0)
          }, 90)
        }}
        onMouseLeave={() => {
          setHover(null)
          setHoverIdx(null)
          setHighlightedBrickIndex(null)
          vx.set(0)
          vy.set(0)
        }}
        className="preserve-3d"
      >
        {WORKS.map((w, i) => {
          const isOpen = open === w.id
          const d = hoverIdx === null ? 99 : Math.abs(hoverIdx - i)
          const rowTransform =
            d === 0
              ? 'translateZ(22px) translateX(6px)'
              : d === 1
                ? `translateZ(9px) translateX(2px) rotateX(${hoverIdx! > i ? 1.5 : -1.5}deg)`
                : 'translateZ(0px)'
          const lit = d === 0 || isOpen
          return (
            <div
              key={w.id}
              className="row-3d border-b border-slate-200 dark:border-white/[0.08]"
              style={{ transform: rowTransform, opacity: hoverIdx === null || d <= 1 || isOpen ? 1 : 0.55 }}
            >
              <button
                type="button"
                onClick={() => {
                  sfx.playSnap(isOpen ? 1450 : 1900)
                  setOpen(isOpen ? null : w.id)
                }}
                onMouseEnter={() => {
                  setHover(w)
                  setHoverIdx(i)
                  setHighlightedBrickIndex(w.brick)
                  sfx.playTick(1950 + i * 65)
                }}
                onMouseLeave={() => setHover(null)}
                aria-expanded={isOpen}
                className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[3.5rem_1.4fr_1fr_5rem_2rem]"
              >
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex items-center gap-4">
                  {/* Isometric prism mark that turns in 3D */}
                  <span
                    aria-hidden="true"
                    className="row-3d hidden h-2.5 w-2.5 shrink-0 md:block"
                    style={{
                      backgroundColor: lit ? w.color : 'transparent',
                      border: `1px solid ${w.color}`,
                      transform: lit
                        ? 'rotateX(35deg) rotateY(45deg) rotateZ(45deg) scale(1.25)'
                        : 'rotateZ(45deg) scale(0.85)',
                      boxShadow: lit ? `0 0 12px ${w.color}80` : 'none',
                    }}
                  />
                  <span
                    className={`font-display text-2xl font-bold tracking-tight md:text-4xl ${
                      isOpen ? 'text-flow-vibrant' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {w.title}
                  </span>
                </span>
                <span className="hidden font-mono text-xs text-slate-500 dark:text-slate-400 md:block">{w.kind}</span>
                <span className="hidden font-mono text-xs tabular-nums text-slate-400 md:block">{w.year}</span>
                <Plus
                  className={`h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:text-cyan-500 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, rotateX: -7 }}
                    animate={{ height: 'auto', opacity: 1, rotateX: 0 }}
                    exit={{ height: 0, opacity: 0, rotateX: -5 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top center', transformPerspective: 1000 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 items-start gap-8 pb-10 pl-0 md:grid-cols-12 md:pl-[3.5rem]">
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
                        <p className="mt-6 font-mono text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {w.skills.map((s) => SKILL_LABEL[s]).join('  /  ')}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
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

                      <div className="flex justify-start md:col-span-6 md:justify-end">
                        <InlineWorkSlab work={w} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Portal-mounted 3D Velocity-Tilted Cursor Preview Slab */}
      {mounted &&
        createPortal(
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
                  initial={{ opacity: 0, scale: 0.88, z: -30 }}
                  animate={{ opacity: 1, scale: 1, z: 0 }}
                  exit={{ opacity: 0, scale: 0.9, z: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <PreviewFace work={hover} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>,
          document.body
        )}
    </SpatialSection>
  )
}
