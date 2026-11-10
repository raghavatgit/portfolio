import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'
import { useMascot } from '@/context/MascotContext'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { soundEnabled, setSoundEnabled } = useMascot()

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
          ? 'bg-[#06080e]/90 backdrop-blur-2xl py-3 border-b border-white/[0.08] shadow-2xl shadow-black/80'
          : 'bg-transparent py-5 border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Title: ONLY the cursive name raghavgoyal. */}
        <a
          href="#"
          className="group inline-flex items-baseline transition-transform duration-300 py-1"
          title="raghavgoyal"
        >
          <span className="font-brush text-3xl sm:text-4xl text-flow-chromatic select-none tracking-wide drop-shadow-[0_2px_18px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform inline-block">
            raghavgoyal.
          </span>
        </a>

        {/* Right Plate: Sharp Architectural Conduits (No sloppy rounded boxes, no pulsating dots) */}
        <div className="flex items-center gap-6 text-xs font-mono">
          {/* Audio Physics Chime Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors py-1"
            title={soundEnabled ? 'Mute physics audio' : 'Enable physics audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider">
              {soundEnabled ? 'SFX ON' : 'SFX MUTED'}
            </span>
          </button>

          <span className="w-[1px] h-3.5 bg-white/10 hidden sm:block" />

          {/* GitHub Conduit: Clean typography, no sloppy rounded box */}
          <a
            href="https://github.com/raghavatgit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors py-1 group"
            title="GitHub: @raghavatgit"
          >
            <GithubIcon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] tracking-wide">
              github<span className="text-cyan-400">/</span>raghavatgit
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
