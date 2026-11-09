import { motion } from 'framer-motion'
import { Shield, Cpu, Radio, Sparkles, ChevronDown } from 'lucide-react'
import { LegoCube } from './LegoCube'

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-14 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Pure Demonstrations & Kinetic Systems Showcase (Zero Clunky Buttons) */}
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

          {/* Concise, Elegant Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-6 max-w-xl"
          >
            I am <strong className="font-bold text-white">Raghav Goyal</strong> — engineering fast
            desktop tools in Rust, motion tracking algorithms, and real-time offline radio networks
            without runtime bloat.
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

          {/* 3 Live Demonstrative Telemetry Modules (Pure Physics & Metrics, Zero Buttons) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="w-full grid grid-cols-3 gap-3 mb-6"
          >
            {/* Live Telemetry 1: Memory Footprint */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md relative overflow-hidden group hover:border-cyan-400/40 transition-colors">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>3.1 MB</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              </div>
              <span className="text-[11px] text-slate-300 block font-medium leading-tight mb-2">
                Memory Footprint
              </span>
              {/* Dynamic Kinetic Meter */}
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ['20%', '28%', '22%', '30%', '20%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Live Telemetry 2: Compositor Latency */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md relative overflow-hidden group hover:border-cyan-400/40 transition-colors">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>&lt; 0.4ms</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <span className="text-[11px] text-slate-300 block font-medium leading-tight mb-2">
                Hook Latency
              </span>
              {/* Dynamic Kinetic Meter */}
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ['70%', '95%', '85%', '98%', '70%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                />
              </div>
            </div>

            {/* Live Telemetry 3: RF Radio Range */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md relative overflow-hidden group hover:border-cyan-400/40 transition-colors">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>10+ km</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <span className="text-[11px] text-slate-300 block font-medium leading-tight mb-2">
                Offline LoRa Mesh
              </span>
              {/* Dynamic Kinetic Waveform */}
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: ['40%', '80%', '65%', '90%', '40%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                />
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
            <span>Scroll to explore projects &amp; interactive modules</span>
          </motion.div>
        </div>

        {/* Right Column: 3D Lego Cube (Pure Physics & Kinetic Demonstrations, Zero Clutter) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          {/* Subtle Cursive Physics Cue */}
          <div className="absolute -top-5 right-6 z-20 font-cursive text-amber-300 text-lg rotate-2 pointer-events-none select-none drop-shadow flex items-center gap-1">
            <span>✨ direct spring recoil physics</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full relative rounded-3xl bg-[#090d18]/60 border border-white/[0.08] backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden p-1 sm:p-2"
          >
            {/* The 3D Tactile Lego Cube */}
            <LegoCube />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
