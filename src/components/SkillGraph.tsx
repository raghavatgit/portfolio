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
  z: number
  vx: number
  vy: number
  vz: number
  r: number
  brick?: number
  deg: number
  tagline?: string
  // Per-frame screen projection cache
  sx: number
  sy: number
  tz: number
  scale: number
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
      cv.width = Math.max(1, Math.floor(r.width * dpr))
      cv.height = Math.max(1, Math.floor(r.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      size.w = r.width
      size.h = r.height
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrapEl)

    // Initialize 3D force constellation on golden-angle Fibonacci sphere
    const nodes: GNode[] = []
    const byId = new Map<string, GNode>()
    const edges: [GNode, GNode][] = []

    WORKS.forEach((w, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / WORKS.length)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const rad = 148
      const n: GNode = {
        id: w.id,
        label: w.title,
        kind: 'work',
        color: w.color,
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.cos(phi),
        z: rad * Math.sin(phi) * Math.sin(theta),
        vx: 0,
        vy: 0,
        vz: 0,
        r: 7.5,
        brick: w.brick,
        deg: 0,
        tagline: w.line,
        sx: 0,
        sy: 0,
        tz: 0,
        scale: 1,
      }
      nodes.push(n)
      byId.set(n.id, n)
    })

    SKILLS.forEach((s, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / SKILLS.length)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + WORKS.length)
      const rad = 95
      const n: GNode = {
        id: s.id,
        label: s.label,
        kind: 'skill',
        color: '#94a3b8',
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.cos(phi),
        z: rad * Math.sin(phi) * Math.sin(theta),
        vx: 0,
        vy: 0,
        vz: 0,
        r: 3.5,
        deg: 0,
        sx: 0,
        sy: 0,
        tz: 0,
        scale: 1,
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
      if (n.kind === 'skill') n.r = 3 + Math.min(4.8, n.deg * 0.95)
    })

    let hover: GNode | null = null
    let dragNode: GNode | null = null
    let orbiting = false
    let lastX = 0
    let lastY = 0
    let yaw = 0.4
    let pitch = 0.22
    let spinY = 0.002
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
      let bestDist = 1e9
      for (const n of nodes) {
        const d = Math.hypot(n.sx - x, n.sy - y)
        if (d < n.r * n.scale + 12 && d < bestDist) {
          bestDist = d
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

    const onDown = (e: PointerEvent) => {
      const p = pt(e)
      lastX = p.x
      lastY = p.y
      const hit = pick(p.x, p.y)
      if (hit) {
        dragNode = hit
        alpha = 0.6
      } else {
        orbiting = true
      }
      cv.setPointerCapture(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      const p = pt(e)
      if (dragNode) {
        const dx = p.x - lastX
        const dy = p.y - lastY
        const cosY = Math.cos(yaw)
        const sinY = Math.sin(yaw)
        const invS = 1 / Math.max(0.45, dragNode.scale)
        dragNode.x += dx * cosY * invS
        dragNode.z -= dx * sinY * invS
        dragNode.y += dy * invS
        dragNode.vx = 0
        dragNode.vy = 0
        dragNode.vz = 0
        alpha = Math.max(alpha, 0.4)
      } else if (orbiting) {
        const dx = p.x - lastX
        const dy = p.y - lastY
        yaw += dx * 0.0065
        pitch = Math.max(-1.05, Math.min(1.05, pitch + dy * 0.0055))
        spinY = dx * 0.0022
      } else {
        setHover(pick(p.x, p.y))
      }
      lastX = p.x
      lastY = p.y
    }

    const onUp = (e: PointerEvent) => {
      dragNode = null
      orbiting = false
      try {
        cv.releasePointerCapture(e.pointerId)
      } catch {}
    }

    const onLeave = () => {
      if (!dragNode && !orbiting) setHover(null)
    }

    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointerleave', onLeave)

    const fov = 560
    const camZ = 470
    let raf = 0

    const projectVec = (x: number, y: number, z: number, cosY: number, sinY: number, cosP: number, sinP: number) => {
      const rx = x * cosY + z * sinY
      const rz1 = -x * sinY + z * cosY
      const ry = y * cosP - rz1 * sinP
      const tz = y * sinP + rz1 * cosP
      const depth = Math.max(120, camZ - tz)
      const scale = fov / depth
      return {
        sx: size.w * 0.5 + rx * scale,
        sy: size.h * 0.5 + ry * scale,
        tz,
        scale,
      }
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const w = size.w
      const h = size.h
      const L = lightRef.current

      if (!orbiting && !hover && !dragNode) {
        yaw += spinY
        spinY += (0.0022 - spinY) * 0.03
      } else if (!orbiting) {
        spinY *= 0.9
      }

      // 3D Force simulation (repulsion + edge springs + soft spherical gravity)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          let dx = a.x - b.x
          let dy = a.y - b.y
          let dz = a.z - b.z
          const d2 = Math.max(dx * dx + dy * dy + dz * dz, 140)
          const d = Math.sqrt(d2)
          const k = (a.kind === 'work' ? 2800 : 1200) * (b.kind === 'work' ? 1.15 : 1)
          const f = (k / d2) * alpha
          dx /= d
          dy /= d
          dz /= d
          a.vx += dx * f
          a.vy += dy * f
          a.vz += dz * f
          b.vx -= dx * f
          b.vy -= dy * f
          b.vz -= dz * f
        }
      }

      for (const [a, b] of edges) {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dz = b.z - a.z
        const d = Math.max(Math.hypot(dx, dy, dz), 1)
        const f = (d - 115) * 0.015
        const fx = (dx / d) * f
        const fy = (dy / d) * f
        const fz = (dz / d) * f
        a.vx += fx
        a.vy += fy
        a.vz += fz
        b.vx -= fx
        b.vy -= fy
        b.vz -= fz
      }

      for (const n of nodes) {
        n.vx += -n.x * 0.0045
        n.vy += -n.y * 0.0045
        n.vz += -n.z * 0.0045
        if (n === dragNode) continue
        n.vx *= 0.84
        n.vy *= 0.84
        n.vz *= 0.84
        n.x = Math.max(-240, Math.min(240, n.x + n.vx))
        n.y = Math.max(-195, Math.min(195, n.y + n.vy))
        n.z = Math.max(-220, Math.min(220, n.z + n.vz))
      }
      alpha = Math.max(0.14, alpha * 0.996)

      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)
      const cosP = Math.cos(pitch)
      const sinP = Math.sin(pitch)

      for (const n of nodes) {
        const pr = projectVec(n.x, n.y, n.z, cosY, sinY, cosP, sinP)
        n.sx = pr.sx
        n.sy = pr.sy
        n.tz = pr.tz
        n.scale = pr.scale
      }

      ctx.clearRect(0, 0, w, h)
      const near = hover ? neighbors(hover) : null
      const fg = L ? '15,23,42' : '226,232,240'

      // Faint 3D coordinate rings (equator & prime meridian) so sphere volume is tangible
      ctx.strokeStyle = L ? 'rgba(15,23,42,0.07)' : 'rgba(226,232,240,0.07)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2
        const pr = projectVec(Math.cos(a) * 190, 0, Math.sin(a) * 190, cosY, sinY, cosP, sinP)
        if (i === 0) ctx.moveTo(pr.sx, pr.sy)
        else ctx.lineTo(pr.sx, pr.sy)
      }
      ctx.stroke()

      ctx.beginPath()
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2
        const pr = projectVec(0, Math.cos(a) * 190, Math.sin(a) * 190, cosY, sinY, cosP, sinP)
        if (i === 0) ctx.moveTo(pr.sx, pr.sy)
        else ctx.lineTo(pr.sx, pr.sy)
      }
      ctx.stroke()

      // Draw edges sorted back-to-front by midpoint depth
      const sortedEdges = edges
        .map(([a, b]) => ({ a, b, depth: (a.tz + b.tz) * 0.5 }))
        .sort((u, v) => u.depth - v.depth)

      for (const { a, b, depth } of sortedEdges) {
        const depthFade = Math.max(0.18, Math.min(1, (depth + 220) / 400))
        const on = near ? near.has(a) && near.has(b) && (a === hover || b === hover) : false
        ctx.strokeStyle = a.color
        ctx.globalAlpha = near ? (on ? 0.92 : 0.04) : 0.24 * depthFade
        ctx.lineWidth = on ? 1.8 : 1
        ctx.beginPath()
        ctx.moveTo(a.sx, a.sy)
        ctx.lineTo(b.sx, b.sy)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Draw nodes sorted back-to-front (Painter's algorithm)
      const sortedNodes = [...nodes].sort((a, b) => a.tz - b.tz)
      ctx.textBaseline = 'middle'

      for (const n of sortedNodes) {
        const lit = !near || near.has(n)
        const depthFade = Math.max(0.28, Math.min(1, (n.tz + 230) / 380))
        ctx.globalAlpha = lit ? depthFade : 0.14
        const rad = n.r * n.scale

        if (n.kind === 'work') {
          // 3D rotated diamond/cube project emblem
          ctx.fillStyle = n.color
          ctx.beginPath()
          ctx.moveTo(n.sx, n.sy - rad * 1.25)
          ctx.lineTo(n.sx + rad * 1.15, n.sy)
          ctx.lineTo(n.sx, n.sy + rad * 1.25)
          ctx.lineTo(n.sx - rad * 1.15, n.sy)
          ctx.closePath()
          ctx.fill()

          // Brighter top facet to emphasize 3D form
          ctx.fillStyle = 'rgba(255,255,255,0.28)'
          ctx.beginPath()
          ctx.moveTo(n.sx, n.sy - rad * 1.25)
          ctx.lineTo(n.sx + rad * 1.15, n.sy)
          ctx.lineTo(n.sx, n.sy - rad * 0.1)
          ctx.lineTo(n.sx - rad * 1.15, n.sy)
          ctx.closePath()
          ctx.fill()

          if (n === hover) {
            ctx.strokeStyle = `rgb(${fg})`
            ctx.lineWidth = 1.2
            ctx.strokeRect(n.sx - rad - 5, n.sy - rad - 5, rad * 2 + 10, rad * 2 + 10)
          }

          const fontPx = Math.max(9.5, Math.round(11.5 * Math.min(1.22, n.scale)))
          ctx.font = `600 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`
          ctx.fillStyle = `rgb(${fg})`
          ctx.fillText(n.label, n.sx + rad * 1.35 + 6, n.sy)
        } else {
          ctx.fillStyle = L ? `rgba(${fg},0.65)` : `rgba(${fg},0.68)`
          ctx.beginPath()
          ctx.arc(n.sx, n.sy, rad, 0, Math.PI * 2)
          ctx.fill()

          const fontPx = Math.max(8.5, Math.round(10 * Math.min(1.18, n.scale)))
          ctx.font = `${fontPx}px "JetBrains Mono", ui-monospace, monospace`
          ctx.fillStyle = `rgba(${fg},${lit && near ? 0.96 : 0.65})`
          ctx.fillText(n.label, n.sx + rad + 5, n.sy)
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointerleave', onLeave)
      setHighlightedBrickIndex(null)
    }
  }, [setHighlightedBrickIndex])

  return (
    <div>
      <div ref={wrap} className="relative h-[530px] w-full cursor-grab border-y border-slate-200 active:cursor-grabbing dark:border-white/[0.08]">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full touch-none" />
      </div>
      <div className="mt-3 flex min-h-[2.5rem] flex-col justify-between gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 sm:flex-row">
        <span className="text-slate-800 dark:text-slate-200">
          {info ? (
            <>
              {info.title} <span className="text-slate-400">/</span> {info.line}
            </>
          ) : (
            'Drag empty space to spin in 3D, or hover any point to trace connections.'
          )}
        </span>
        <span>{WORKS.length} projects / {SKILLS.length} skills</span>
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
        eyebrow="Tools & tech"
        lead="Skills in"
        accent="3D Orbit"
        accentClass="text-flow-aurora"
        note="spin & explore"
        right={<span>{pulse ? `${pulse.repos} public repos` : '19 public repos'}</span>}
      />

      {/* Code languages bar from public GitHub repos */}
      <div className="mb-14">
        <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <span>Code split across GitHub</span>
          <span className="normal-case tracking-normal text-slate-800 dark:text-slate-200">
            {active ? `${active.name} (${active.pct}% of code)` : 'Hover any color bar to see % share'}
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

      {/* GitHub milestones */}
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
          Latest update: <span className="text-slate-800 dark:text-slate-200">{pulse.latest.name}</span>{' '}
          {timeAgo(pulse.latest.at)}
        </p>
      )}
    </section>
  )
}
