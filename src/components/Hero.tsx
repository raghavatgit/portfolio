import { motion } from 'framer-motion'
import { Shield, Cpu, Radio, Sparkles, ChevronDown } from 'lucide-react'
import { LegoCube } from './LegoCube'

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-14 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Pure Demonstrations & Kinetic Systems Showcase (Zero Boxed Cards, Zero Buttons) */}
        <div className="lg:col-span-6 flex flex-col items-start z-10">
          {/* Institutional / Academic Credentials Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/[0.08] border border-cyan-500/25 text-xs font-mono text-cyan-300 mb-6 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="font-semibold tracking-wide">SYSTEMS &amp; SPATIAL SOFTWARE</span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300">South Asian Univ.</span>
          </motion.div>

          {/* Headline with Constantly Flowing Lively Chromatic Color Scheme */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold tracking-tight text-white leading-[1.06] mb-5"
          >
            Architecting{' '}
            <span className="font-serif italic font-normal text-flow-chromatic text-[1.14em] tracking-normal inline-block pr-1">
              systems, physics &amp; motion
            </span>{' '}
            from the silicon up.
          </motion.h1>

          {/* Concise, Elegant Narrative (Lesser text, no jargon dumps) */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-6 max-w-xl"
          >
            I am <strong className="font-bold text-white">Raghav Goyal</strong> — engineering fast
            desktop tools in Rust, 3D orbital physics, and offline radio meshes without runtime bloat.
          </motion.p>

          {/* Cursive Handwriting Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-2 mb-6 font-cursive text-flow-vibrant text-xl select-none"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>touch, tilt &amp; explore the live physics</span>
          </motion.div>

          {/* Borderless Kinetic Telemetry Rail (Pure Metrics, Zero Boxed Cards) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="w-full py-3.5 border-y border-white/[0.08] mb-6 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm"
          >
            {/* Live Telemetry 1: Memory Footprint */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-white tracking-wide">3.1 MB</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight block">Zero-runtime memory</span>
              </div>
            </div>

            <span className="hidden sm:block w-[1px] h-7 bg-white/[0.08]" />

            {/* Live Telemetry 2: Compositor Latency */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-white tracking-wide">&lt; 0.4ms</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight block">Native Win32 hook</span>
              </div>
            </div>

            <span className="hidden sm:block w-[1px] h-7 bg-white/[0.08]" />

            {/* Live Telemetry 3: RF Radio Range */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-white tracking-wide">10+ km</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight block">Off-grid LoRa mesh</span>
              </div>
            </div>
          </motion.div>

          {/* Gentle Kinetic Scroll Pulse (Zero button styling) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ opacity: { delay: 0.6 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-2 select-none"
          >
            <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Scroll to explore demonstrations &amp; interactive systems</span>
          </motion.div>
        </div>

        {/* Right Column: 3D Lego Cube (Pure Physics & Kinetic Demonstrations, Zero Clutter) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <LegoCube />
        </div>
      </div>
    </section>
  )
}
