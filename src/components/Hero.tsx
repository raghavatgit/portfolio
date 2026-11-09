import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Copy, Check, ExternalLink, Shield, Cpu, Radio } from 'lucide-react'
import { GithubIcon, LinkedinIcon, DiscordIcon } from '@/components/icons/SocialIcons'
import { LegoCube } from './LegoCube'

export function Hero() {
  const [discordCopied, setDiscordCopied] = useState(false)

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText('@johnmaybesnow')
    setDiscordCopied(true)
    setTimeout(() => setDiscordCopied(false), 2000)
  }

  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Clear, Human, High-Impact Introduction */}
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
            <span className="font-semibold tracking-wide">SOFTWARE ENGINEER</span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300">CS @ South Asian Univ.</span>
          </motion.div>

          {/* Simple, Powerful Headline with Luxury Italic Serif Accent */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.08] mb-5"
          >
            Building{' '}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-rose-300 text-[1.12em] tracking-normal pr-1">
              fast, reliable software
            </span>{' '}
            from the ground up.
          </motion.h1>

          {/* Natural, Simple, Professional Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-6 max-w-xl"
          >
            Hi, I&apos;m <strong className="font-semibold text-white">Raghav Goyal</strong>. I build
            software that runs at full speed, protects privacy, and works even when the internet is
            down — from lightweight desktop tools and offline motion tracking to emergency radios.
          </motion.p>

          {/* Cursive handwritten annotation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mb-3 font-cursive text-cyan-300 text-lg -rotate-1 select-none"
          >
            <span>✍️ zero bloat, native speed &amp; crafted with care</span>
          </motion.div>

          {/* 3 Demonstrative Real-World Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="w-full grid grid-cols-3 gap-2.5 mb-8"
          >
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono mb-1 font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>3 MB App</span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight block">
                Single file download with zero extra drivers
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono mb-1 font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Instant</span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight block">
                Hides windows from screen shares in under 1ms
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono mb-1 font-semibold">
                <Radio className="w-3.5 h-3.5" />
                <span>Offline</span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight block">
                Sends SOS alerts without cell towers or web
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 w-full"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold text-xs tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/25"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleCopyDiscord}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-mono transition-all"
              title="Copy Discord handle"
            >
              {discordCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied @johnmaybesnow</span>
                </>
              ) : (
                <>
                  <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Discord: @johnmaybesnow</span>
                  <Copy className="w-3 h-3 text-slate-500" />
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 pl-1">
              <a
                href="https://github.com/raghavatgit"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                title="GitHub - @raghavatgit"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/raghav-goyal-216a913b4"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                title="LinkedIn - Raghav Goyal"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:goyalraghav1289@gmail.com"
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                title="Email Inquiry"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Pure Focus on the Interactive Lego Cube */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          {/* Playful Cursive Mascot Tag */}
          <div className="absolute -top-4 right-6 z-20 font-cursive text-amber-300 text-lg rotate-2 pointer-events-none select-none drop-shadow flex items-center gap-1">
            <span>✨ click &amp; drag in 3D</span>
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
