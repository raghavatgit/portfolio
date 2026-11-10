import { motion } from 'framer-motion'
import { Sparkles, ChevronDown } from 'lucide-react'
import { LegoCube } from './LegoCube'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-14 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Pure Demonstrations & Kinetic Typography (Zero Sloppy Boxes, Zero Pulsating Dots, Zero Em-dashes) */}
        <div className="lg:col-span-6 flex flex-col items-start z-10">
          {/* Headline with Constantly Flowing Lively Chromatic Color Scheme */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.06] mb-5 transition-colors"
          >
            Architecting{' '}
            <span className="font-serif italic font-normal text-flow-chromatic text-[1.14em] tracking-normal inline-block pr-1">
              systems, physics &amp; motion
            </span>{' '}
            from the silicon up.
          </motion.h1>

          {/* Concise, Elegant Narrative (No em-dashes, clean and high signal) */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light mb-6 max-w-xl transition-colors"
          >
            I am <strong className="font-bold text-slate-950 dark:text-white">Raghav Goyal</strong>, engineering fast
            desktop tools in Rust, 3D orbital physics, and offline radio meshes without runtime bloat.
          </motion.p>

          {/* Cursive Handwriting Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mb-8 font-cursive text-flow-vibrant text-xl select-none"
          >
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>touch, tilt &amp; explore the live physics</span>
          </motion.div>

          {/* Architectural Telemetry Rail (Pure Numbers, No Sloppy Rounded Boxes, No Pulsating Dots) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="w-full py-4 border-y border-slate-200 dark:border-white/[0.08] mb-8 flex flex-wrap items-center justify-between gap-6 transition-colors"
          >
            {/* Telemetry 1: Memory Footprint */}
            <div>
              <div className="font-mono text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                [ 3.1 MB ]
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tight block mt-0.5">
                Zero-runtime memory
              </span>
            </div>

            <span className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-white/[0.08]" />

            {/* Telemetry 2: Hook Latency */}
            <div>
              <div className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400 tracking-wide">
                [ &lt; 0.4ms ]
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tight block mt-0.5">
                Native Win32 hook
              </span>
            </div>

            <span className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-white/[0.08]" />

            {/* Telemetry 3: RF Range */}
            <div>
              <div className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 tracking-wide">
                [ 10+ km ]
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tight block mt-0.5">
                Off-grid LoRa mesh
              </span>
            </div>
          </motion.div>

          {/* Gentle Kinetic Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 4, 0] }}
            transition={{ opacity: { delay: 0.5 }, y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
            className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 select-none"
          >
            <ChevronDown className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Scroll to explore demonstrations &amp; interactive systems</span>
          </motion.div>
        </div>

        {/* Right Column: 3D Lego Cube (Pure Physics, High Vibrance, Enhanced Lego Pieces & Interactions) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <LegoCube />
        </div>
      </div>
    </section>
  )
}
