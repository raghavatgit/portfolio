import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Clock } from 'lucide-react'
import { useDelhiTime } from '@/hooks/useDelhiTime'

const NAV_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'Sandbox', href: '#sandbox' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const delhiTime = useDelhiTime()

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
          ? 'bg-[#07080b]/80 backdrop-blur-xl border-b border-white/[0.06] py-3.5 shadow-2xl shadow-black/40'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Monogram / Brand */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-sm font-medium tracking-tight text-slate-200 hover:text-white transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.12] text-xs font-mono font-semibold text-amber-400 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-all">
            RG
          </span>
          <span className="font-semibold text-slate-100">Raghav Goyal</span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 pl-1 border-l border-white/10">
            Delhi, IN
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-1 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-full transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right action group */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Delhi Time Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-[11px] font-mono text-slate-300"
            title="Current Local Time in Delhi (IST)"
          >
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>{delhiTime || 'DELHI, IST'}</span>
          </div>

          {/* Contact Button */}
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 text-xs font-medium transition-all duration-200"
          >
            <span>Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="#contact"
            className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium"
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
            className="md:hidden border-b border-white/[0.08] bg-[#07080b]/95 backdrop-blur-2xl px-4 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
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
              <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400 px-3">
                <span>Delhi, India</span>
                <span className="text-amber-400">{delhiTime}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
