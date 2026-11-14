import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { LegoCube } from './LegoCube'

const FACTS = [
  { v: '275 KB', l: 'Tiny Windows speedup app', c: 'text-slate-900 dark:text-white' },
  { v: '< 50 ms', l: 'Instant launch, zero bloat', c: 'text-cyan-600 dark:text-cyan-400' },
  { v: '15 KB', l: 'Pure CSS 3D website size', c: 'text-amber-600 dark:text-amber-400' },
]

export function Hero() {
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-stage relative mx-auto flex min-h-[90vh] max-w-7xl items-center overflow-hidden px-4 pb-14 pt-24 sm:px-8"
    >
      <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
          className="z-10 flex flex-col items-start lg:col-span-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ transform: 'translateZ(26px)' }}
            className="mb-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-slate-900 transition-colors dark:text-white sm:text-5xl lg:text-[62px]"
          >
            Building{' '}
            <span className="inline-block pr-1 font-serif text-[1.14em] font-normal italic tracking-normal text-flow-chromatic">
              3D interfaces, fast tools &amp; live physics
            </span>{' '}
            from scratch.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ transform: 'translateZ(14px)' }}
            className="mb-6 max-w-xl text-base font-light leading-relaxed text-slate-600 transition-colors dark:text-slate-300 sm:text-lg"
          >
            <strong className="font-bold text-slate-950 dark:text-white">Raghav Goyal</strong>, computer science
            student at South Asian University. I make lightweight Windows apps, indoor tracking without GPS, and
            offline radio networks that work even when the grid drops.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ transform: 'translateZ(18px)' }}
            className="mb-8 flex select-none items-center gap-2 font-cursive text-xl text-flow-vibrant"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>click, spin &amp; pull the 3D cube apart</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ transform: 'translateZ(10px)' }}
            className="mb-8 flex w-full flex-wrap items-center justify-between gap-6 border-y border-slate-200 py-4 transition-colors dark:border-white/[0.08]"
          >
            {FACTS.map((f, i) => (
              <div key={f.v} className="flex items-center gap-6">
                <div>
                  <div className={`font-mono text-sm font-bold tracking-wide ${f.c}`}>[ {f.v} ]</div>
                  <span className="mt-0.5 block font-mono text-[11px] tracking-tight text-slate-500 dark:text-slate-400">
                    {f.l}
                  </span>
                </div>
                {i < FACTS.length - 1 && <span className="hidden h-8 w-px bg-slate-200 dark:bg-white/[0.08] sm:block" />}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 4, 0] }}
            transition={{ opacity: { delay: 0.5 }, y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
            className="flex select-none items-center gap-3 font-mono text-xs text-slate-500 dark:text-slate-400"
          >
            <ChevronDown className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Scroll to explore</span>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('palette:open'))}
              className="border-b border-slate-400 pb-0.5 text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-slate-200 dark:hover:text-cyan-300"
            >
              Press Ctrl K to search
            </button>
          </motion.div>
        </motion.div>

        <div className="relative flex items-center justify-center lg:col-span-6">
          <LegoCube />
        </div>
      </div>
    </section>
  )
}
