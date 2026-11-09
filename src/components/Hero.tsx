import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Copy, Check, ExternalLink, Terminal, Shield, Cpu, Layers } from 'lucide-react'
import { GithubIcon, LinkedinIcon, DiscordIcon } from '@/components/icons/SocialIcons'

export function Hero() {
  const [discordCopied, setDiscordCopied] = useState(false)

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText('@johnmaybesnow')
    setDiscordCopied(true)
    setTimeout(() => setDiscordCopied(false), 2000)
  }

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Ambient background subtle radial glow - restrained, no loud gradients */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-amber-500/[0.04] blur-[120px] rounded-full"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-start max-w-3xl">
        {/* Availability / Context Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>CS @ South Asian University, Delhi</span>
          <span className="text-white/20">·</span>
          <span className="text-amber-400 font-medium">Open to Summer '27 Roles</span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6"
        >
          Software, systems, and creative tools built with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            precision.
          </span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light mb-8 max-w-2xl"
        >
          Hi, I’m <strong className="font-semibold text-white">Raghav Goyal</strong>. I build
          low-level Windows utilities in Rust, custom creative engine bridges for video editors, and
          resilient web applications. Focused on software that stays fast and doesn't break.
        </motion.p>

        {/* Action Group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-3.5 mb-14"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <span>Explore Engineering Work</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={handleCopyDiscord}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-sm font-medium transition-all"
            title="Click to copy Discord handle"
          >
            {discordCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-mono text-xs">Copied @johnmaybesnow</span>
              </>
            ) : (
              <>
                <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-xs">Discord: @johnmaybesnow</span>
                <Copy className="w-3 h-3 text-slate-500 ml-0.5" />
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 pl-1">
            <a
              href="https://github.com/raghavatgit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
              aria-label="GitHub Profile"
              title="GitHub - @raghavatgit"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/raghav-goyal-216a913b4"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
              aria-label="LinkedIn Profile"
              title="LinkedIn - Raghav Goyal"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:goyalraghav1289@gmail.com"
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
              aria-label="Send Email"
              title="Email - goyalraghav1289@gmail.com"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Architectural Pillars / Domains */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-white/[0.06]"
        >
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-semibold text-slate-200">Systems & Win32</span>
              <span className="block text-[11px] font-mono text-slate-400">Rust · DWM · ASLR</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-semibold text-slate-200">Creative Engines</span>
              <span className="block text-[11px] font-mono text-slate-400">AE · Resolve · Lua</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-semibold text-slate-200">Signals & Inertial</span>
              <span className="block text-[11px] font-mono text-slate-400">Kalman · LoRa · ESP32</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-semibold text-slate-200">Full-Stack & Web</span>
              <span className="block text-[11px] font-mono text-slate-400">React 19 · TS · Vite</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
