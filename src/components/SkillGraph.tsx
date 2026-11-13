import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { SectionHeader } from '@/components/SectionHeader'
import { useMascot } from '@/context/MascotContext'
import { useTheme } from '@/context/ThemeContext'
import { useGithubPulse, timeAgo } from '@/hooks/useGithubPulse'
import { LANGUAGES, PROFILE, SKILLS, STATS, WORKS } from '@/data/profile'

interface GNode {
  id: string
  label: string
  kind: 'work' | 'skill'
  color: string
  x: number
  y: number
  vx: number
  vy: number
  r: number
  brick?: number
  deg: number
  tagline?: string
}

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => c.stop()
  }, [inView, to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

function SkillGraphCanvas() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const { setHighlightedBrickIndex } = useMascot()
  const light = theme === 'light'
  const lightRef = useRef(light)
  lightRef.current = light
  const [info, setInfo] = useState<{ title: string; line: string } | null>(null)

  useEffect(() => {
    const wrapEl = wrap.current
    const cv = canvas.current
    if (!wrapEl || !cv) return
    const ctx = cv.getContext('2d')!
    const size = { w: 0, h: 0 }
    const fit = () => {
      const r = wrapEl.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.floor(r.width * dpr)
      cv.height = Math.floor(r.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      size.w = r.width
      size.h = r.height
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrapEl)

    // Build graph
    const nodes: GNode[] = []
    const byId = new Map<string, GNode>()
    const edges: [GNode, GNode][] = []
    const cx0 = size.w / 2
    const cy0 = size.h / 2
    WORKS.forEach((w, i) => {
      const a = (i / WORKS.length) * Math.PI * 2
      const n: GNode = {
        id: w.id,
        label: w.title,
        kind: 'work',
        color: w.color,
        x: cx0 + Math.cos(a) * size.h * 0.3,
        y: cy0 + Math.sin(a) * size.h * 0.3,
        vx: 0,
        vy: 0,
        r: 7,
        brick: w.brick,
        deg: 0,
        tagline: w.line,
      }
      nodes.push(n)
      byId.set(n.id, n)
    })
    SKILLS.forEach((s) => {
      const n: GNode = {
        id: s.id,
        label: s.label,
        kind: 'skill',
        color: '#94a3b8',
        x: cx0 + (Math.random() - 0.5) * size.w * 0.6,
        y: cy0 + (Math.random() - 0.5) * size.h * 0.6,
        vx: 0,
        vy: 0,
        r: 3,
        deg: 0,
      }
      nodes.push(n)
      byId.set(n.id, n)
    })
    WORKS.forEach((w) => {
      w.skills.forEach((sid) => {
        const a = byId.get(w.id)
        const b = byId.get(sid)
        if (a && b) {
          edges.push([a, b])
          a.deg++
          b.deg++
        }
      })
    })
    nodes.forEach((n) => {
      if (n.kind === 'skill') n.r = 3 + Math.min(5, n.deg * 1.1)
    })

    let hover: GNode | null = null
    let drag: GNode | null = null
    let alpha = 1
    const neighbors = (n: GNode) => {
      const s = new Set<GNode>([n])
      edges.forEach(([a, b]) => {
        if (a === n) s.add(b)
        if (b === n) s.add(a)
      })
      return s
    }

    const pt = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const pick = (x: number, y: number) => {
      let best: GNode | null = null
      let bd = 1e9
      for (const n of nodes) {
        const d = Math.hypot(n.x - x, n.y - y)
        if (d < n.r + 10 && d < bd) {
          bd = d
          best = n
        }
      }
      return best
    }
    const setHover = (n: GNode | null) => {
      if (n === hover) return
      hover = n
      if (n?.kind === 'work') {
        setHighlightedBrickIndex(n.brick ?? null)
        setInfo({ title: n.label, line: n.tagline ?? '' })
      } else if (n) {
        const used = WORKS.filter((w) => w.skills.includes(n.id)).map((w) => w.title)
        setHighlightedBrickIndex(null)
        setInfo({ title: n.label, line: `Used in ${used.join(', ')}` })
      } else {
        setHighlightedBrickIndex(null)
        setInfo(null)
      }
    }
    const onMove = (e: PointerEvent) => {
      const p = pt(e)
      if (drag) {
        drag.x = p.x
        drag.y = p.y
        drag.vx = 0
        drag.vy = 0
        alpha = Math.max(alpha, 0.5)
      } else setHover(pick(p.x, p.y))
    }
    const onDown = (e: PointerEvent) => {
      const p = pt(e)
      const n = pick(p.x, p.y)
      if (n) {
        drag = n
        alpha = 0.7
        cv.setPointerCapture(e.pointerId)
      }
    }
    const onUp = () => {
      drag = null
    }
    const onLeave = () => {
      if (!drag) setHover(null)
    }
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointerleave', onLeave)

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const w = size.w
      const h = size.h
      const L = lightRef.current

      // forces
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          let dx = a.x - b.x
          let dy = a.y - b.y
          const d2 = Math.max(dx * dx + dy * dy, 60)
          const d = Math.sqrt(d2)
          const k = (a.kind === 'work' ? 5200 : 2400) * (b.kind === 'work' ? 1.2 : 1)
          const f = k / d2
          dx /= d
          dy /= d
          a.vx += dx * f * alpha
          a.vy += dy * f * alpha
          b.vx -= dx * f * alpha
          b.vy -= dy * f * alpha
        }
      }
      for (const [a, b] of edges) {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.max(Math.hypot(dx, dy), 1)
        const f = (d - 92) * 0.014
        const fx = (dx / d) * f
        const fy = (dy / d) * f
        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy
      }
      for (const n of nodes) {
        n.vx += (w / 2 - n.x) * 0.0035
        n.vy += (h / 2 - n.y) * 0.0055
        if (n === drag) continue
        n.vx *= 0.82
        n.vy *= 0.82
        n.x = Math.min(w - 70, Math.max(20, n.x + n.vx))
        n.y = Math.min(h - 18, Math.max(18, n.y + n.vy))
      }
      alpha = Math.max(0.12, alpha * 0.996)

      // draw
      ctx.clearRect(0, 0, w, h)
      const near = hover ? neighbors(hover) : null
      const fg = L ? '15,23,42' : '226,232,240'

      for (const [a, b] of edges) {
        const on = near ? near.has(a) && near.has(b) && (a === hover || b === hover) : false
        ctx.strokeStyle = a.color
        ctx.globalAlpha = near ? (on ? 0.9 : 0.05) : 0.22
        ctx.lineWidth = on ? 1.6 : 1
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      ctx.font = '11px "JetBrains Mono", ui-monospace, monospace'
      ctx.textBaseline = 'middle'
      for (const n of nodes) {
        const lit = !near || near.has(n)
        ctx.globalAlpha = lit ? 1 : 0.18
        if (n.kind === 'work') {
          ctx.fillStyle = n.color
          ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2)
          if (n === hover) {
            ctx.strokeStyle = `rgb(${fg})`
            ctx.lineWidth = 1
            ctx.strokeRect(n.x - n.r - 4, n.y - n.r - 4, n.r * 2 + 8, n.r * 2 + 8)
          }
          ctx.font = '600 12px "JetBrains Mono", ui-monospace, monospace'
          ctx.fillStyle = `rgb(${fg})`
          ctx.fillText(n.label, n.x + n.r + 8, n.y)
        } else {
          ctx.fillStyle = L ? `rgba(${fg},0.55)` : `rgba(${fg},0.6)`
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.font = '10.5px "JetBrains Mono", ui-monospace, monospace'
          ctx.fillStyle = `rgba(${fg},${lit && near ? 0.95 : 0.55})`
          ctx.fillText(n.label, n.x + n.r + 5, n.y)
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointerleave', onLeave)
      setHighlightedBrickIndex(null)
    }
  }, [setHighlightedBrickIndex])

  return (
    <div>
      <div ref={wrap} className="relative h-[520px] w-full border-y border-slate-200 dark:border-white/[0.08]">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full touch-none" />
      </div>
      <div className="mt-3 flex min-h-[2.5rem] flex-col justify-between gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 sm:flex-row">
        <span className="text-slate-800 dark:text-slate-200">
          {info ? (
            <>
              {info.title} <span className="text-slate-400">/</span> {info.line}
            </>
          ) : (
            'Hover a node to trace its connections. Drag to reshape the graph.'
          )}
        </span>
        <span>{WORKS.length} projects / {SKILLS.length} technologies</span>
      </div>
    </div>
  )
}

export function SkillGraph() {
  const pulse = useGithubPulse(PROFILE.handle)
  const [lang, setLang] = useState<string | null>(null)
  const total = LANGUAGES.reduce((s, l) => s + l.pct, 0)
  const active = LANGUAGES.find((l) => l.name === lang)

  return (
    <section id="stack" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8">
      <SectionHeader
        eyebrow="Technical spectrum"
        lead="Stack as a"
        accent="Living Graph"
        accentClass="text-flow-aurora"
        note="drawn from my repos"
        right={<span>{pulse ? `${pulse.repos} public repositories` : '19 public repositories'}</span>}
      />

      {/* Language spectrum, measured across every public repository */}
      <div className="mb-14">
        <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <span>Language spectrum</span>
          <span className="normal-case tracking-normal text-slate-800 dark:text-slate-200">
            {active ? `${active.name} ${active.pct}%` : 'bytes of code, all public repos'}
          </span>
        </div>
        <div className="flex h-3 w-full overflow-hidden" onMouseLeave={() => setLang(null)}>
          {LANGUAGES.map((l, i) => (
            <motion.div
              key={l.name}
              onMouseEnter={() => setLang(l.name)}
              initial={{ width: 0 }}
              whileInView={{ width: `${(l.pct / total) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="h-full cursor-crosshair transition-opacity"
              style={{ backgroundColor: l.color, opacity: lang && lang !== l.name ? 0.25 : 1 }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          {LANGUAGES.slice(0, 8).map((l) => (
            <span key={l.name} className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2" style={{ backgroundColor: l.color }} />
              {l.name}
            </span>
          ))}
        </div>
      </div>

      <SkillGraphCanvas />

      {/* Activity, counted up on view */}
      <div className="mt-16 grid grid-cols-2 gap-y-10 border-t border-slate-200 pt-10 dark:border-white/[0.08] md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-display text-5xl font-extrabold tracking-tight text-flow-chromatic sm:text-6xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {pulse?.latest && (
        <p className="mt-8 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          Latest push <span className="text-slate-800 dark:text-slate-200">{pulse.latest.name}</span>{' '}
          {timeAgo(pulse.latest.at)}
        </p>
      )}
    </section>
  )
}
