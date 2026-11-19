import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { LegoCube } from './LegoCube'

const FACTS = [
  { v: '275 KB', l: 'Tiny Windows speedup', c: 'text-slate-900 dark:text-white' },
  { v: '< 50 ms', l: 'Instant cold start', c: 'text-cyan-600 dark:text-cyan-400' },
  { v: '15 KB', l: 'Pure CSS 3D size', c: 'text-amber-600 dark:text-amber-400' },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const textY = useTransform(smoothScroll, [0, 1], [0, -48])
  const textZ = useTransform(smoothScroll, [0, 1], [0, -70])
  const textRotX = useTransform(smoothScroll, [0, 1], [0, -6])
  const cubeY = useTransform(smoothScroll, [0, 1], [0, 32])
  const cubeScale = useTransform(smoothScroll, [0, 1], [1, 0.94])

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-4.5, 4.5]), { stiffness: 140, damping: 20 })
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [4.5, -4.5]), { stiffness: 140, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-stage relative mx-auto flex min-h-[92vh] max-w-7xl items-center overflow-hidden px-4 pb-16 pt-24 sm:px-8 lg:pr-20 xl:px-8"
    >
      <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div
          style={
            reduce
              ? undefined
              : {
                  rotateX: tiltX,
                  rotateY: tiltY,
                  y: textY,
                  z: textZ,
                  transformStyle: 'preserve-3d',
                }
          }
          className="z-10 flex flex-col items-start lg:col-span-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
          >
            Delhi / South Asian University '29
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={reduce ? undefined : { z: 28, rotateX: textRotX }}
            className="mb-6 text-4xl font-extrabold leading-[1.04] tracking-tight text-slate-900 transition-colors dark:text-white sm:text-5xl lg:text-[64px]"
          >
            Engineering{' '}
            <span className="inline-block pr-1 font-serif text-[1.12em] font-normal italic tracking-normal text-flow-chromatic">
              depth, speed &amp; motion
            </span>{' '}
            in 3D.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={reduce ? undefined : { z: 14 }}
            className="mb-10 max-w-lg text-base font-light leading-relaxed text-slate-600 transition-colors dark:text-slate-300 sm:text-lg"
          >
            <strong className="font-semibold text-slate-950 dark:text-white">Raghav Goyal</strong>. Fast Windows apps,
            indoor tracking without GPS, and offline radio networks.
          </motion.p>

          {/* Metrics step outward in Z toward the cube */}
          <div className="preserve-3d mb-10 grid w-full grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 transition-colors dark:divide-white/[0.08] dark:border-white/[0.08]">
            {FACTS.map((f, i) => (
              <motion.div
                key={f.v}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={reduce ? undefined : { z: 12 + i * 8 }}
                className={i === 0 ? 'py-4 pr-4' : i === 2 ? 'py-4 pl-4' : 'px-4 py-4'}
              >
                <div className={`font-mono text-sm font-bold tabular-nums tracking-wide ${f.c}`}>{f.v}</div>
                <span className="mt-1 block font-mono text-[11px] tracking-tight text-slate-500 dark:text-slate-400">
                  {f.l}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex select-none items-center gap-3 font-mono text-xs text-slate-500 dark:text-slate-400"
          >
            <motion.span
              animate={reduce ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <ChevronDown className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            </motion.span>
            <span>Scroll</span>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <span
              role="button"
              tabIndex={0}
              onClick={() => window.dispatchEvent(new Event('palette:open'))}
              onKeyDown={(e) => e.key === 'Enter' && window.dispatchEvent(new Event('palette:open'))}
              className="cursor-pointer border-b border-slate-300 pb-0.5 text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/25 dark:text-slate-200 dark:hover:text-cyan-300"
            >
              Ctrl K
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: cubeY, scale: cubeScale }}
          className="relative flex items-center justify-center lg:col-span-6"
        >
          <LegoCube />
        </motion.div>
      </div>
    </section>
  )
}
