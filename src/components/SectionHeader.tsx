import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  eyebrow: string
  lead: string
  accent: string
  accentClass?: string
  note?: string
  right?: ReactNode
  sub?: string
}

/** Quiet architectural header: mono datum, display headline lifted on its own Z plane. */
export function SectionHeader({ eyebrow, lead, accent, accentClass = 'text-flow-chromatic', right, sub }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1000, transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
      className="mb-14 flex flex-col gap-6 border-b border-slate-200 pb-8 transition-colors dark:border-white/[0.08] md:flex-row md:items-end md:justify-between"
    >
      <div className="preserve-3d">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </div>
        <h2
          style={{ transform: 'translateZ(16px)' }}
          className="flex flex-wrap items-baseline gap-x-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl"
        >
          <span>{lead}</span>
          <span className={`font-serif text-[1.08em] font-normal italic ${accentClass}`}>{accent}</span>
        </h2>
        {sub && (
          <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {sub}
          </p>
        )}
      </div>
      {right && <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{right}</div>}
    </motion.div>
  )
}
