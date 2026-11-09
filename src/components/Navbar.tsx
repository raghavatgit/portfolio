import { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06080e]/80 backdrop-blur-2xl border-b border-white/[0.08] py-3 shadow-2xl shadow-black/60'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo: raghavgoyal written in cursive signature */}
        <a
          href="#"
          className="group flex items-baseline gap-1.5 transition-all duration-300 py-1"
          title="raghavgoyal"
        >
          <span className="font-brush text-3xl sm:text-[38px] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-cyan-300 group-hover:from-cyan-300 group-hover:via-white group-hover:to-indigo-300 transition-all duration-300 select-none drop-shadow-[0_2px_14px_rgba(0,240,255,0.3)]">
            raghavgoyal
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.9)] animate-pulse group-hover:scale-125 transition-transform" />
        </a>

        {/* Right Action Group */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/raghavatgit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="GitHub Repositories"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">raghavatgit</span>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all duration-200"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  )
}
