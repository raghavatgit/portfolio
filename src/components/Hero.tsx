import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { LegoCube } from './LegoCube'

const FACTS = [
  { v: '275 KB', l: 'AnxiouslyOptimized binary', c: 'text-slate-900 dark:text-white' },
  { v: '< 50 ms', l: 'cold boot, zero deps', c: 'text-cyan-600 dark:text-cyan-400' },
  { v: '15 KB', l: 'ContactMe, gzipped 3D', c: 'text-amber-600 dark:text-amber-400' },
]

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center overflow-hidden px-4 pb-14 pt-24 sm:px-8">
      <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="z-10 flex flex-col items-start lg:col-span-6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-slate-900 transition-colors dark:text-white sm:text-5xl lg:text-[62px]"
          >
            Architecting{' '}
            <span className="inline-block pr-1 font-serif text-[1.14em] font-normal italic tracking-normal text-flow-chromatic">
              systems, physics &amp; motion
            </span>{' '}
            from the silicon up.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 max-w-xl text-base font-light leading-relaxed text-slate-600 transition-colors dark:text-slate-300 sm:text-lg"
          >
            <strong className="font-bold text-slate-950 dark:text-white">Raghav Goyal</strong>, computer science
            undergraduate at South Asian University. Native Windows tools, inertial navigation, and radio meshes
            that outlive the network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 flex select-none items-center gap-2 font-cursive text-xl text-flow-vibrant"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>touch, tilt &amp; explore the live physics</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
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
              Press Ctrl K to navigate
            </button>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center lg:col-span-6">
          <LegoCube />
        </div>
      </div>
    </section>
  )
}
