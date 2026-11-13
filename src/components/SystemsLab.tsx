import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { useTheme } from '@/context/ThemeContext'
import type { ColorScheme } from '@/context/ThemeContext'
import type { LabId } from '@/data/profile'

interface Palette {
  fg: string
  dim: string
  accent: string
  warn: string
  light: boolean
}

type PaletteRef = { current: Palette }

const LIGHT_ACCENT: Record<ColorScheme, string> = {
  chromatic: '#0284c7',
  solar: '#c2410c',
  aurora: '#047857',
  violet: '#7c3aed',
}
const DARK_ACCENT: Record<ColorScheme, string> = {
  chromatic: '#00F0FF',
  solar: '#FFA502',
  aurora: '#00E676',
  violet: '#C084FC',
}

const MONO = '11px "JetBrains Mono", ui-monospace, monospace'

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gauss() {
  let u = 0
  let v = 0
  while (!u) u = Math.random()
  while (!v) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function setupCanvas(wrap: HTMLDivElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  const size = { w: 0, h: 0 }
  const fit = () => {
    const r = wrap.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.floor(r.width * dpr))
    canvas.height = Math.max(1, Math.floor(r.height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    size.w = r.width
    size.h = r.height
  }
  fit()
  const ro = new ResizeObserver(fit)
  ro.observe(wrap)
  return { ctx, size, dispose: () => ro.disconnect() }
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, pal: Palette) {
  ctx.fillStyle = pal.light ? 'rgba(15,23,42,0.10)' : 'rgba(226,232,240,0.09)'
  for (let x = 14; x < w; x += 28) {
    for (let y = 14; y < h; y += 28) ctx.fillRect(x, y, 1.2, 1.2)
  }
}

/* ------------------------------------------------------------------ */
/* Aegis-Raksha: multi-hop LoRa flood with TTL and ring buffer dedupe   */
/* ------------------------------------------------------------------ */

interface MNode {
  x: number
  y: number
  dead: boolean
  seen: Set<number>
  reached: number
  hop: number
  flash: number
}
interface MEv {
  from: MNode
  to: MNode
  sentAt: number
  due: number
  ttl: number
  pid: number
  hop: number
}

function MeshSim({ pal }: { pal: PaletteRef }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [range, setRange] = useState(0.2)
  const [ttl, setTtl] = useState(5)
  const [seed, setSeed] = useState(7)
  const [stats, setStats] = useState({ reached: 0, total: 16, tx: 0, suppressed: 0, hops: 0 })
  const rangeRef = useRef(range)
  const ttlRef = useRef(ttl)
  rangeRef.current = range
  ttlRef.current = ttl

  useEffect(() => {
    const wrapEl = wrap.current
    const cv = canvas.current
    if (!wrapEl || !cv) return
    const { ctx, size, dispose } = setupCanvas(wrapEl, cv)
    const rnd = mulberry32(seed)

    const nodes: MNode[] = []
    let guard = 0
    while (nodes.length < 16 && guard++ < 4000) {
      const x = 0.05 + rnd() * 0.9
      const y = 0.1 + rnd() * 0.8
      if (nodes.every((n) => Math.hypot((n.x - x) * 2.6, n.y - y) > 0.17)) {
        nodes.push({ x, y, dead: false, seen: new Set(), reached: -1, hop: 0, flash: -1e9 })
      }
    }

    let events: MEv[] = []
    let pid = 0
    let curPid = -1
    let tx = 0
    let suppressed = 0
    let maxHop = 0
    let hover = -1

    const R = () => rangeRef.current * size.w
    const dist = (a: MNode, b: MNode) => Math.hypot((a.x - b.x) * size.w, (a.y - b.y) * size.h)

    const broadcast = (from: MNode, t: number, hop: number, now: number) => {
      tx++
      for (const n of nodes) {
        if (n === from || n.dead) continue
        const d = dist(from, n)
        if (d <= R()) {
          events.push({ from, to: n, sentAt: now, due: now + 340 + d * 0.9 + Math.random() * 140, ttl: t, pid: curPid, hop })
        }
      }
    }

    const originate = (i: number) => {
      const n = nodes[i]
      if (n.dead) return
      const now = performance.now()
      pid++
      curPid = pid
      events = []
      tx = 0
      suppressed = 0
      maxHop = 0
      n.seen.add(pid)
      n.reached = pid
      n.hop = 0
      n.flash = now
      broadcast(n, ttlRef.current, 1, now)
    }

    const nearest = (e: PointerEvent | MouseEvent) => {
      const r = cv.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      let best = -1
      let bd = 18
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x * size.w - mx, n.y * size.h - my)
        if (d < bd) {
          bd = d
          best = i
        }
      })
      return best
    }

    const onMove = (e: PointerEvent) => {
      hover = nearest(e)
    }
    const onLeave = () => {
      hover = -1
    }
    const onClick = (e: MouseEvent) => {
      const i = nearest(e)
      if (i < 0) return
      if (e.shiftKey) nodes[i].dead = !nodes[i].dead
      else originate(i)
    }
    const onCtx = (e: MouseEvent) => {
      e.preventDefault()
      const i = nearest(e)
      if (i >= 0) nodes[i].dead = !nodes[i].dead
    }
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerleave', onLeave)
    cv.addEventListener('click', onClick)
    cv.addEventListener('contextmenu', onCtx)

    // Seed one packet so the lab is alive on load.
    const bootTimer = window.setTimeout(() => originate(0), 500)

    let raf = 0
    let lastStat = 0
    let lastKey = ''
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const p = pal.current

      const due = events.filter((e) => e.due <= now).sort((a, b) => a.due - b.due)
      if (due.length) {
        events = events.filter((e) => e.due > now)
        for (const e of due) {
          if (e.to.dead) continue
          if (e.to.seen.has(e.pid)) {
            suppressed++
            continue
          }
          e.to.seen.add(e.pid)
          e.to.reached = e.pid
          e.to.hop = e.hop
          e.to.flash = now
          if (e.hop > maxHop) maxHop = e.hop
          if (e.ttl > 1) broadcast(e.to, e.ttl - 1, e.hop + 1, now)
        }
      }

      ctx.clearRect(0, 0, size.w, size.h)
      drawGrid(ctx, size.w, size.h, p)

      // Links in range
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          if (a.dead || b.dead) continue
          if (dist(a, b) <= R()) {
            ctx.strokeStyle = p.light ? 'rgba(15,23,42,0.13)' : 'rgba(226,232,240,0.11)'
            ctx.beginPath()
            ctx.moveTo(a.x * size.w, a.y * size.h)
            ctx.lineTo(b.x * size.w, b.y * size.h)
            ctx.stroke()
          }
        }
      }

      // Range halo for hovered node
      if (hover >= 0) {
        const n = nodes[hover]
        ctx.strokeStyle = p.accent
        ctx.globalAlpha = 0.35
        ctx.setLineDash([4, 5])
        ctx.beginPath()
        ctx.arc(n.x * size.w, n.y * size.h, R(), 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      // Packets in flight
      for (const e of events) {
        const k = Math.min(1, Math.max(0, (now - e.sentAt) / (e.due - e.sentAt)))
        const x1 = e.from.x * size.w
        const y1 = e.from.y * size.h
        const x2 = e.to.x * size.w
        const y2 = e.to.y * size.h
        const cx = x1 + (x2 - x1) * k
        const cy = y1 + (y2 - y1) * k
        ctx.strokeStyle = p.accent
        ctx.globalAlpha = 0.45
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(cx, cy)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.fillStyle = p.accent
        ctx.fillRect(cx - 2.5, cy - 2.5, 5, 5)
      }

      // Nodes
      ctx.font = MONO
      nodes.forEach((n, i) => {
        const x = n.x * size.w
        const y = n.y * size.h
        const reached = n.reached === curPid && curPid >= 0
        const age = now - n.flash
        if (age < 800) {
          ctx.strokeStyle = p.accent
          ctx.globalAlpha = 1 - age / 800
          ctx.beginPath()
          ctx.arc(x, y, 8 + age * 0.05, 0, Math.PI * 2)
          ctx.stroke()
          ctx.globalAlpha = 1
        }
        if (n.dead) {
          ctx.strokeStyle = p.warn
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(x - 5, y - 5)
          ctx.lineTo(x + 5, y + 5)
          ctx.moveTo(x + 5, y - 5)
          ctx.lineTo(x - 5, y + 5)
          ctx.stroke()
          ctx.lineWidth = 1
          return
        }
        if (reached) {
          ctx.fillStyle = `hsl(${190 + n.hop * 30} ${p.light ? 80 : 90}% ${p.light ? 42 : 58}%)`
          const s = n.hop === 0 ? 10 : 7
          ctx.fillRect(x - s / 2, y - s / 2, s, s)
          ctx.fillStyle = p.dim
          ctx.fillText(String(n.hop), x + 8, y - 8)
        } else {
          ctx.strokeStyle = p.dim
          ctx.strokeRect(x - 3.5, y - 3.5, 7, 7)
        }
        if (i === hover) {
          ctx.strokeStyle = p.accent
          ctx.strokeRect(x - 9, y - 9, 18, 18)
        }
      })

      if (now - lastStat > 140) {
        lastStat = now
        const reached = nodes.filter((n) => n.reached === curPid && curPid >= 0).length
        const key = `${reached}|${tx}|${suppressed}|${maxHop}`
        if (key !== lastKey) {
          lastKey = key
          setStats({ reached, total: nodes.length, tx, suppressed, hops: maxHop })
        }
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(bootTimer)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerleave', onLeave)
      cv.removeEventListener('click', onClick)
      cv.removeEventListener('contextmenu', onCtx)
      dispose()
    }
  }, [seed, pal])

  return (
    <div>
      <div ref={wrap} className="relative h-[380px] w-full">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      </div>
      <Controls
        readout={`reached ${stats.reached}/${stats.total}   tx ${stats.tx}   deduped ${stats.suppressed}   max hop ${stats.hops}`}
        hint="Click a node to send a distress packet. Shift click or right click kills a node."
      >
        <Slider label="Radio range" value={range} min={0.1} max={0.34} step={0.01} onChange={setRange} fmt={(v) => `${Math.round(v * 100)}%`} />
        <Slider label="TTL" value={ttl} min={1} max={8} step={1} onChange={setTtl} fmt={(v) => String(v)} />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="border-b border-slate-400 pb-0.5 font-mono text-xs text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-white dark:hover:text-cyan-300"
        >
          Scatter nodes
        </button>
      </Controls>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* NavDrishti: GPS-denied dead reckoning with Kalman style fusion       */
/* ------------------------------------------------------------------ */

function InertialSim({ pal }: { pal: PaletteRef }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [noise, setNoise] = useState(0.5)
  const [fusion, setFusion] = useState(true)
  const [err, setErr] = useState({ raw: 0, fused: 0 })
  const noiseRef = useRef(noise)
  const fusionRef = useRef(fusion)
  noiseRef.current = noise
  fusionRef.current = fusion
  const shockRef = useRef(0)

  useEffect(() => {
    const wrapEl = wrap.current
    const cv = canvas.current
    if (!wrapEl || !cv) return
    const { ctx, size, dispose } = setupCanvas(wrapEl, cv)

    type V = { x: number; y: number }
    const MPP = 0.05 // metres per pixel (simulated scale)
    const path = (th: number): V => ({
      x: size.w * 0.5 + size.w * 0.36 * Math.sin(th),
      y: size.h * 0.5 + size.h * 0.3 * Math.sin(2 * th + 0.6),
    })

    let t = 0
    let theta = 0
    let truth = path(0)
    let raw: V = { ...truth }
    let fused: V = { ...truth }
    let psi = 0 // accumulated gyro heading error
    const gyroBias = (Math.random() > 0.5 ? 1 : -1) * 0.012
    const bias: V = { x: 0, y: 0 }
    let sigma = 2
    let corrTimer = 0

    const trailT: V[] = []
    const trailR: V[] = []
    const trailF: V[] = []
    const marks: V[] = []

    const onClick = () => {
      shockRef.current = 1
    }
    cv.addEventListener('click', onClick)

    let raf = 0
    let last = performance.now()
    let lastStat = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const p = pal.current
      const nz = noiseRef.current
      t += dt

      const omega = 0.55 * (0.55 + 0.45 * Math.sin(0.5 * t)) + 0.015
      theta += omega * dt
      const prev = truth
      truth = path(theta)
      const v: V = { x: (truth.x - prev.x) / Math.max(dt, 1e-4), y: (truth.y - prev.y) / Math.max(dt, 1e-4) }
      const stopped = omega < 0.12

      if (shockRef.current) {
        bias.x += (Math.random() - 0.5) * 120
        bias.y += (Math.random() - 0.5) * 120
        shockRef.current = 0
      }

      // IMU model: gyro heading drift, velocity noise, random walk bias
      psi += (gyroBias * (0.4 + nz) + gauss() * 0.01 * nz) * dt
      bias.x += gauss() * 8 * nz * dt
      bias.y += gauss() * 8 * nz * dt
      const c = Math.cos(psi)
      const s = Math.sin(psi)
      const vm: V = {
        x: v.x * c - v.y * s + bias.x + gauss() * 10 * nz,
        y: v.x * s + v.y * c + bias.y + gauss() * 10 * nz,
      }

      raw = { x: raw.x + vm.x * dt, y: raw.y + vm.y * dt }
      fused = { x: fused.x + vm.x * dt, y: fused.y + vm.y * dt }
      sigma += (4 + 38 * nz) * dt

      // Measurement updates: ZUPT while stopped, landmark/odometry fix otherwise
      corrTimer += dt
      if (corrTimer > 0.1 && fusionRef.current) {
        corrTimer = 0
        const sm = 2 + 6 * nz
        const meas: V = { x: truth.x + gauss() * sm, y: truth.y + gauss() * sm }
        const K = stopped ? 0.32 : 0.05
        fused = { x: fused.x + K * (meas.x - fused.x), y: fused.y + K * (meas.y - fused.y) }
        sigma *= 1 - K
        if (stopped && marks.length < 40 && Math.random() < 0.35) marks.push({ ...fused })
        // ZUPT also zeroes the learned velocity bias
        if (stopped) {
          bias.x *= 0.8
          bias.y *= 0.8
        }
      }

      trailT.push({ ...truth })
      trailR.push({ ...raw })
      trailF.push({ ...fused })
      if (trailT.length > 420) {
        trailT.shift()
        trailR.shift()
        trailF.shift()
      }
      if (marks.length > 14) marks.shift()

      ctx.clearRect(0, 0, size.w, size.h)
      drawGrid(ctx, size.w, size.h, p)

      const stroke = (pts: V[], color: string, w: number) => {
        ctx.lineWidth = w
        ctx.strokeStyle = color
        const n = pts.length
        const step = Math.max(1, Math.floor(n / 8))
        for (let i = 0; i < n - 1; i += step) {
          ctx.globalAlpha = 0.12 + 0.88 * (i / n)
          ctx.beginPath()
          ctx.moveTo(pts[i].x, pts[i].y)
          const end = Math.min(n - 1, i + step)
          for (let k = i + 1; k <= end; k++) ctx.lineTo(pts[k].x, pts[k].y)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      stroke(trailR, p.warn, 1.4)
      if (fusionRef.current) stroke(trailF, p.accent, 2)
      stroke(trailT, p.fg, 1.2)

      // Confidence circle around fused estimate
      if (fusionRef.current) {
        ctx.strokeStyle = p.accent
        ctx.globalAlpha = 0.5
        ctx.setLineDash([3, 4])
        ctx.beginPath()
        ctx.arc(fused.x, fused.y, Math.min(sigma, 120), 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
        ctx.fillStyle = p.accent
        for (const m of marks) {
          ctx.save()
          ctx.translate(m.x, m.y)
          ctx.rotate(Math.PI / 4)
          ctx.fillRect(-2.5, -2.5, 5, 5)
          ctx.restore()
        }
      }

      // Heads
      ctx.fillStyle = p.fg
      ctx.fillRect(truth.x - 4, truth.y - 4, 8, 8)
      ctx.fillStyle = p.warn
      ctx.fillRect(raw.x - 3, raw.y - 3, 6, 6)
      if (fusionRef.current) {
        ctx.fillStyle = p.accent
        ctx.fillRect(fused.x - 3, fused.y - 3, 6, 6)
      }

      ctx.font = MONO
      ctx.fillStyle = p.dim
      ctx.fillText('truth', truth.x + 10, truth.y - 8)
      ctx.fillStyle = p.warn
      ctx.fillText('imu only', raw.x + 10, raw.y + 14)
      if (fusionRef.current) {
        ctx.fillStyle = p.accent
        ctx.fillText('fused', fused.x + 10, fused.y + 4)
      }
      if (stopped) {
        ctx.fillStyle = p.dim
        ctx.fillText('ZUPT window', 14, size.h - 14)
      }

      if (now - lastStat > 200) {
        lastStat = now
        setErr({
          raw: Math.hypot(raw.x - truth.x, raw.y - truth.y) * MPP,
          fused: Math.hypot(fused.x - truth.x, fused.y - truth.y) * MPP,
        })
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      cv.removeEventListener('click', onClick)
      dispose()
    }
  }, [pal])

  return (
    <div>
      <div ref={wrap} className="relative h-[380px] w-full">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      </div>
      <Controls
        readout={`drift imu ${err.raw.toFixed(1)} m   fused ${fusion ? err.fused.toFixed(1) : 'off'} m`}
        hint="Click the canvas to shock the IMU bias. Simulated scale, not field data."
      >
        <Slider label="IMU noise" value={noise} min={0.05} max={1} step={0.05} onChange={setNoise} fmt={(v) => v.toFixed(2)} />
        <button
          type="button"
          onClick={() => setFusion((f) => !f)}
          className="border-b border-slate-400 pb-0.5 font-mono text-xs text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-white dark:hover:text-cyan-300"
        >
          Kalman fusion: {fusion ? 'on' : 'off'}
        </button>
      </Controls>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* StreamShield: what you see vs. what the capture pipeline receives    */
/* ------------------------------------------------------------------ */

const WINDOWS = [
  { id: 'chat', title: 'Private messages', body: 'hey, are you free later?' },
  { id: 'bank', title: 'Banking', body: 'balance  48,210.00' },
  { id: 'code', title: 'Editor', body: 'fn main() { shield(); }' },
]

function CloakSim() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({ chat: true, bank: true, code: false })
  return (
    <div className="grid grid-cols-1 gap-px bg-slate-200 dark:bg-white/[0.1] md:grid-cols-2">
      {(['Your monitor', 'Capture pipeline (OBS, Discord, Zoom)'] as const).map((label, side) => (
        <div key={label} className="bg-white p-6 dark:bg-[#07090f]">
          <div className="mb-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-slate-500">
            <span>{label}</span>
            <span className={side === 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-500'}>
              {side === 0 ? 'full view' : 'filtered'}
            </span>
          </div>
          <div className="space-y-3">
            {WINDOWS.map((w) => {
              const masked = side === 1 && hidden[w.id]
              return (
                <div
                  key={w.id}
                  className="flex h-16 items-center justify-between border px-4 transition-all duration-300"
                  style={{
                    borderColor: masked ? 'rgba(244,63,94,0.5)' : undefined,
                    borderStyle: masked ? 'dashed' : 'solid',
                    background: masked
                      ? 'repeating-linear-gradient(135deg, rgba(244,63,94,0.07) 0 6px, transparent 6px 12px)'
                      : undefined,
                  }}
                >
                  {masked ? (
                    <span className="font-mono text-[11px] text-rose-500">excluded from capture</span>
                  ) : (
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{w.title}</div>
                      <div className="font-mono text-[11px] text-slate-500">{w.body}</div>
                    </div>
                  )}
                  {side === 0 && (
                    <button
                      type="button"
                      onClick={() => setHidden((h) => ({ ...h, [w.id]: !h[w.id] }))}
                      className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-300"
                    >
                      {hidden[w.id] ? <EyeOff className="h-3.5 w-3.5 text-rose-500" /> : <Eye className="h-3.5 w-3.5" />}
                      {hidden[w.id] ? 'shielded' : 'exposed'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Controls({ readout, hint, children }: { readout: string; hint: string; children: ReactNode }) {
  return (
    <div className="border-t border-slate-200 px-5 py-4 dark:border-white/[0.1]">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">{children}</div>
      <div className="mt-3 flex flex-col gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 sm:flex-row sm:justify-between">
        <span className="whitespace-pre text-slate-800 dark:text-slate-200">{readout}</span>
        <span>{hint}</span>
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  fmt: (v: number) => string
}) {
  return (
    <label className="flex items-center gap-3 font-mono text-xs text-slate-600 dark:text-slate-300">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-28 accent-cyan-500"
      />
      <span className="w-9 text-slate-900 dark:text-white">{fmt(value)}</span>
    </label>
  )
}

const TABS: { id: LabId; label: string; project: string }[] = [
  { id: 'mesh', label: 'Mesh flood', project: 'Aegis-Raksha' },
  { id: 'inertial', label: 'Dead reckoning', project: 'NavDrishti' },
  { id: 'cloak', label: 'Capture cloak', project: 'StreamShield' },
]

export function SystemsLab() {
  const [tab, setTab] = useState<LabId>('mesh')
  const { theme, colorScheme } = useTheme()
  const light = theme === 'light'
  const pal = useRef<Palette>({ fg: '', dim: '', accent: '', warn: '', light })
  pal.current = {
    light,
    fg: light ? '#0f172a' : '#e2e8f0',
    dim: light ? '#64748b' : '#94a3b8',
    accent: light ? LIGHT_ACCENT[colorScheme] : DARK_ACCENT[colorScheme],
    warn: light ? '#be123c' : '#FF4757',
  }

  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<LabId>).detail
      if (id) setTab(id)
    }
    window.addEventListener('lab:open', onOpen)
    return () => window.removeEventListener('lab:open', onOpen)
  }, [])

  return (
    <section id="sandbox" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8">
      <SectionHeader
        eyebrow="Systems lab"
        lead="Run the"
        accent="Real Algorithms"
        accentClass="text-flow-vibrant"
        note="touch them"
        right={<span>Rebuilt in canvas, runs in your browser</span>}
      />

      <div className="mb-0 flex flex-wrap gap-x-8 gap-y-2 border-b border-slate-200 dark:border-white/[0.1]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative pb-3 text-sm transition-colors ${
              tab === t.id
                ? 'font-semibold text-slate-950 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">{t.project}</span>
            {tab === t.id && (
              <motion.span layoutId="lab-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-flow" />
            )}
          </button>
        ))}
      </div>

      <div className="border-x border-b border-slate-200 bg-white/50 backdrop-blur-sm transition-colors dark:border-white/[0.1] dark:bg-black/25">
        {tab === 'mesh' && <MeshSim pal={pal} />}
        {tab === 'inertial' && <InertialSim pal={pal} />}
        {tab === 'cloak' && <CloakSim />}
      </div>
    </section>
  )
}
