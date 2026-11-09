import { useState, useEffect } from 'react'
import { Compass } from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#06080e]/80 backdrop-blur-2xl border-b border-white/[0.06] py-3 shadow-2xl shadow-black/80'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brandmark: raghavgoyal with flowing chromatic gradient */}
        <a
          href="#"
          className="group flex items-baseline gap-1.5 transition-all duration-300 py-1"
          title="raghavgoyal"
        >
          <span className="font-brush text-3xl sm:text-[38px] tracking-wide text-flow-chromatic select-none drop-shadow-[0_2px_14px_rgba(0,240,255,0.25)] group-hover:scale-103 transition-transform inline-block">
            raghavgoyal
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.9)] animate-pulse" />
        </a>

        {/* Center: Advanced Spatial Telemetry Ribbon */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          {/* Spatial Coordinates */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <Compass className="w-3 h-3 text-cyan-400/80 animate-spin" style={{ animationDuration: '16s' }} />
            <span>28.5355° N, 77.2090° E</span>
          </div>

          <span className="w-[1px] h-3 bg-white/10" />

          {/* Kinetic Harmonic Waveform (Live demonstration visualizer) */}
          <div className="flex items-center gap-0.5 h-3 px-1" title="Real-time physics frequency">
            <span className="w-0.5 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="w-0.5 h-2 rounded-full bg-indigo-400 animate-pulse delay-75" />
            <span className="w-0.5 h-3.5 rounded-full bg-purple-400 animate-pulse delay-150" />
            <span className="w-0.5 h-1.5 rounded-full bg-pink-400 animate-pulse delay-100" />
            <span className="w-0.5 h-2.5 rounded-full bg-emerald-400 animate-pulse delay-200" />
          </div>

          <span className="w-[1px] h-3 bg-white/10" />

          {/* System Telemetry Beacon */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400/90 font-medium tracking-wider">SYSTEM 60FPS</span>
          </div>
        </div>

        {/* Right: Minimalist Spatial Portal (Zero clunky buttons) */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/raghavatgit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-all group"
            title="GitHub: @raghavatgit"
          >
            <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform text-cyan-400" />
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400 group-hover:text-white">
              raghavatgit
            </span>
          </a>

          {/* Discreet status aura */}
          <div className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(0,240,255,0.7)] hidden sm:block" />
        </div>
      </div>
    </header>
  )
}
