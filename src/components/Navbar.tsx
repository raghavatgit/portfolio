import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Terminal } from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Playground', href: '#sandbox' },
  { label: 'Skills & Tools', href: '#stack' },
  { label: 'About Me', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06080e]/85 backdrop-blur-2xl border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/60'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo: raghavgoyal written in cursive as the brand logo itself */}
        <a
          href="#"
          className="group flex items-baseline gap-1 transition-all duration-300 py-1"
          title="raghavgoyal"
        >
          <span className="font-brush text-3xl sm:text-[36px] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-cyan-300 group-hover:from-cyan-300 group-hover:via-white group-hover:to-indigo-300 transition-all duration-300 select-none drop-shadow-[0_2px_14px_rgba(0,240,255,0.3)]">
            raghavgoyal
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.9)] animate-pulse group-hover:scale-125 transition-transform" />
        </a>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full p-1 backdrop-blur-xl">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-full transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Group */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/raghavatgit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="GitHub Repositories"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>raghavatgit</span>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-200"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="#contact"
            className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-xs font-semibold"
          >
            Connect
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-white/[0.08] bg-[#06080e]/95 backdrop-blur-2xl px-5 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between">
                <a
                  href="https://github.com/raghavatgit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-mono text-cyan-400"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>github.com/raghavatgit</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
