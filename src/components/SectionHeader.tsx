import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

interface Props {
  eyebrow: string
  lead: string
  accent: string
  accentClass?: string
  note?: string
  right?: ReactNode
  sub?: string
}

/** Shared section header: hairline rule, mono eyebrow, serif italic flowing accent, cursive note. */
export function SectionHeader({ eyebrow, lead, accent, accentClass = 'text-flow-chromatic', note, right, sub }: Props) {
  return (
    <div className="mb-12 flex flex-col gap-6 border-b border-slate-200 pb-8 transition-colors dark:border-white/[0.08] md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="flex flex-wrap items-baseline gap-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span>{lead}</span>
          <span className={`font-serif text-[1.08em] font-normal italic ${accentClass}`}>{accent}</span>
          {note && (
            <span className="-rotate-1 select-none font-cursive text-xl font-normal text-amber-600 dark:text-amber-300">
              {note}
            </span>
          )}
        </h2>
        {sub && (
          <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {sub}
          </p>
        )}
      </div>
      {right && <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{right}</div>}
    </div>
  )
}
