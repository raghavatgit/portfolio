import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CornerDownLeft } from 'lucide-react'
import { useTheme, COLOR_SCHEMES } from '@/context/ThemeContext'
import { useMascot } from '@/context/MascotContext'
import { PROFILE, WORKS } from '@/data/profile'

interface Command {
  id: string
  group: string
  label: string
  hint?: string
  run: () => void
}

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toggleTheme, setColorScheme, theme } = useTheme()
  const { soundEnabled, setSoundEnabled } = useMascot()

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = [
      { id: 's-top', group: 'Go to', label: 'Home', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      { id: 's-work', group: 'Go to', label: 'Work index', hint: 'projects', run: () => goTo('projects') },
      { id: 's-lab', group: 'Go to', label: 'Systems lab', hint: 'simulations', run: () => goTo('sandbox') },
      { id: 's-stack', group: 'Go to', label: 'Skill graph', hint: 'stack', run: () => goTo('stack') },
      { id: 's-about', group: 'Go to', label: 'About', run: () => goTo('about') },
      { id: 's-contact', group: 'Go to', label: 'Contact', run: () => goTo('contact') },
      {
        id: 'a-theme',
        group: 'Appearance',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        run: toggleTheme,
      },
      ...COLOR_SCHEMES.map((s) => ({
        id: `c-${s.id}`,
        group: 'Appearance',
        label: `Color scheme: ${s.name}`,
        run: () => setColorScheme(s.id),
      })),
      {
        id: 'a-sound',
        group: 'Appearance',
        label: soundEnabled ? 'Mute physics audio' : 'Enable physics audio',
        run: () => setSoundEnabled(!soundEnabled),
      },
      ...WORKS.filter((w) => w.repo).map((w) => ({
        id: `r-${w.id}`,
        group: 'Open repository',
        label: w.title,
        hint: w.kind,
        run: () => window.open(w.repo, '_blank', 'noopener'),
      })),
      { id: 'l-gh', group: 'Links', label: 'GitHub profile', run: () => window.open(PROFILE.github, '_blank', 'noopener') },
      { id: 'l-li', group: 'Links', label: 'LinkedIn', run: () => window.open(PROFILE.linkedin, '_blank', 'noopener') },
      { id: 'l-portal', group: 'Links', label: '3D space portal', run: () => window.open(PROFILE.portal, '_blank', 'noopener') },
      {
        id: 'l-mail',
        group: 'Links',
        label: 'Copy email address',
        hint: PROFILE.email,
        run: () => void navigator.clipboard.writeText(PROFILE.email),
      },
    ]
    return list
  }, [theme, soundEnabled, toggleTheme, setColorScheme, setSoundEnabled])

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return commands
    return commands.filter((c) => {
      const hay = `${c.group} ${c.label} ${c.hint ?? ''}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }, [commands, query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette:open', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette:open', onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => setCursor(0), [query])

  const run = (c?: Command) => {
    if (!c) return
    setOpen(false)
    setTimeout(c.run, 60)
  }

  const onInputKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[cursor])
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[14vh] px-4 bg-white/60 dark:bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            initial={{ y: -14, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="w-full max-w-xl border border-slate-300 dark:border-white/[0.14] bg-white dark:bg-[#080b14] shadow-2xl shadow-black/20 dark:shadow-black/80"
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/[0.1] px-4">
              <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Jump to a section, switch theme, open a repo"
                className="w-full bg-transparent py-4 font-mono text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
              <span className="font-mono text-[10px] text-slate-400">ESC</span>
            </div>

            <div className="max-h-[52vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-4 py-6 font-mono text-xs text-slate-500">No match</div>
              )}
              {filtered.map((c, i) => {
                const header = c.group !== lastGroup
                lastGroup = c.group
                return (
                  <div key={c.id}>
                    {header && (
                      <div className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                        {c.group}
                      </div>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => run(c)}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                        i === cursor
                          ? 'bg-slate-100 dark:bg-white/[0.07] text-slate-950 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-3 w-px ${i === cursor ? 'bg-cyan-500' : 'bg-transparent'}`}
                        />
                        {c.label}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                        {c.hint}
                        {i === cursor && <CornerDownLeft className="h-3 w-3" />}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
