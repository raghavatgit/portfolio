import { ArrowUp } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.06] py-12 px-4 sm:px-8 max-w-7xl mx-auto transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-brush text-3xl text-flow-chromatic select-none drop-shadow-[0_2px_10px_rgba(0,240,255,0.2)]">
            raghavgoyal.
          </span>
          <span className="text-slate-300 dark:text-white/20">/</span>
          <span>&copy; 2026 Delhi, India</span>
          <span className="text-slate-300 dark:text-white/20">/</span>
          <span className="font-cursive text-cyan-600 dark:text-cyan-300 text-sm">systems &amp; motion</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">Zero Runtime Bloat</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          </button>
        </div>
      </div>
    </footer>
  )
}
