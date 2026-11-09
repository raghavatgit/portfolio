import { ArrowUp } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-white/[0.06] py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.06] text-[10px] text-cyan-400 font-bold">
            RG
          </span>
          <span>Raghav Goyal &copy; 2026</span>
          <span className="text-white/20">·</span>
          <span>Delhi, India</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400">Engineered with React 19 &amp; Tailwind</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  )
}

