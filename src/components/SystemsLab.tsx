import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Rotate3d } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { SpatialSection } from '@/components/SpatialSection'
import { useTheme, type ColorScheme } from '@/context/ThemeContext'
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

/** Perspective 3D -> 2D screen projection for interactive floor scenes. */
function project3D(
  wx: number,
  wy: number,
  wz: number,
  yaw: number,
  pitch: number,
  w: number,
  h: number,
  scaleFactor = 0.62
) {
  const cosY = Math.cos(yaw)
  const sinY = Math.sin(yaw)
  const cosP = Math.cos(pitch)
  const sinP = Math.sin(pitch)

  const rx = wx * cosY - wz * sinY
  const rz = wx * sinY + wz * cosY
  const ry = wy * cosP - rz * sinP
  const tz = wy * sinP + rz * cosP

  const camDist = 3.1
  const depth = Math.max(0.55, camDist - tz)
  const fov = Math.min(w * scaleFactor, h * 1.18)
  const s = fov / depth

  return {
    x: w * 0.5 + rx * s,
    y: h * 0.56 - ry * s,
    s,
    depth,
  }
}

function draw3DFloorGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  yaw: number,
  pitch: number,
  pal: Palette
) {
  const half = 1.0
  const steps = 8
  ctx.strokeStyle = pal.light ? 'rgba(15,23,42,0.09)' : 'rgba(226,232,240,0.08)'
  ctx.lineWidth = 1

  for (let i = 0; i <= steps; i++) {
    const u = -half + (i / steps) * (half * 2)
    const a1 = project3D(u, 0, -half, yaw, pitch, w, h)
    const a2 = project3D(u, 0, half, yaw, pitch, w, h)
    ctx.beginPath()
    ctx.moveTo(a1.x, a1.y)
    ctx.lineTo(a2.x, a2.y)
    ctx.stroke()

    const b1 = project3D(-half, 0, u, yaw, pitch, w, h)
    const b2 = project3D(half, 0, u, yaw, pitch, w, h)
    ctx.beginPath()
    ctx.moveTo(b1.x, b1.y)
    ctx.lineTo(b2.x, b2.y)
    ctx.stroke()
  }
}

/** Live X / Y / Z orientation triad in the top-right corner, rotating with the view. */
function draw3DGizmo(ctx: CanvasRenderingContext2D, w: number, yaw: number, pitch: number, pal: Palette) {
  const cx = w - 44
  const cy = 42
  const L = 20
  const cosY = Math.cos(yaw)
  const sinY = Math.sin(yaw)
  const cosP = Math.cos(pitch)
  const sinP = Math.sin(pitch)
  const proj = (x: number, y: number, z: number) => {
    const rx = x * cosY - z * sinY
    const rz = x * sinY + z * cosY
    const ry = y * cosP - rz * sinP
    const depth = y * sinP + rz * cosP
    return { x: cx + rx * L, y: cy - ry * L, depth }
  }
  const axes = [
    { v: proj(1, 0, 0), label: 'X', color: pal.warn },
    { v: proj(0, 1, 0), label: 'Y', color: pal.light ? '#047857' : '#00E676' },
    { v: proj(0, 0, 1), label: 'Z', color: pal.accent },
  ].sort((a, b) => a.v.depth - b.v.depth)

  ctx.save()
  ctx.font = '10px "JetBrains Mono", ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const a of axes) {
    ctx.globalAlpha = 0.45 + 0.45 * Math.max(0, Math.min(1, (a.v.depth + 1) / 2))
    ctx.strokeStyle = a.color
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(a.v.x, a.v.y)
    ctx.stroke()
    ctx.fillStyle = a.color
    const lx = cx + (a.v.x - cx) * 1.4
    const ly = cy + (a.v.y - cy) * 1.4
    ctx.fillText(a.label, lx, ly)
  }
  ctx.globalAlpha = 1
  ctx.fillStyle = pal.dim
  ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3)
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/* 1. Aegis-Raksha: 3D Offline Emergency Radio Mesh                   */
/* ------------------------------------------------------------------ */

interface MNode {
  wx: number
  wz: number
  elev: number
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
  const [range, setRange] = useState(0.55)
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

    // Place 16 radio towers on the 3D floor (-0.9 .. +0.9)
    const nodes: MNode[] = []
    let guard = 0
    while (nodes.length < 16 && guard++ < 4000) {
      const wx = (rnd() - 0.5) * 1.72
      const wz = (rnd() - 0.5) * 1.56
      if (nodes.every((n) => Math.hypot(n.wx - wx, n.wz - wz) > 0.28)) {
        nodes.push({
          wx,
          wz,
          elev: 0.08 + rnd() * 0.14,
          dead: false,
          seen: new Set(),
          reached: -1,
          hop: 0,
          flash: -1e9,
        })
      }
    }

    let events: MEv[] = []
    let pid = 0
    let curPid = -1
    let tx = 0
    let suppressed = 0
    let maxHop = 0
    let hover = -1

    let yaw = 0.42
    let pitch = 0.62
    let dragging = false
    let moved = false
    let downX = 0
    let downY = 0
    let lastX = 0
    let lastY = 0

    const R = () => rangeRef.current
    const dist3 = (a: MNode, b: MNode) => Math.hypot(a.wx - b.wx, a.wz - b.wz)

    const broadcast = (from: MNode, t: number, hop: number, now: number) => {
      tx++
      for (const n of nodes) {
        if (n === from || n.dead) continue
        const d = dist3(from, n)
        if (d <= R()) {
          events.push({ from, to: n, sentAt: now, due: now + 320 + d * 420 + Math.random() * 120, ttl: t, pid: curPid, hop })
        }
      }
    }

    const originate = (i: number) => {
      const n = nodes[i]
      if (!n || n.dead) return
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

    const nearest = (clientX: number, clientY: number) => {
      const r = cv.getBoundingClientRect()
      const mx = clientX - r.left
      const my = clientY - r.top
      let best = -1
      let bd = 24
      nodes.forEach((n, i) => {
        const pTip = project3D(n.wx, n.elev, n.wz, yaw, pitch, size.w, size.h)
        const pBase = project3D(n.wx, 0, n.wz, yaw, pitch, size.w, size.h)
        const d = Math.min(Math.hypot(pTip.x - mx, pTip.y - my), Math.hypot(pBase.x - mx, pBase.y - my))
        if (d < bd) {
          bd = d
          best = i
        }
      })
      return best
    }

    const onDown = (e: PointerEvent) => {
      if (e.button === 2) return
      dragging = true
      moved = false
      downX = e.clientX
      downY = e.clientY
      lastX = e.clientX
      lastY = e.clientY
      cv.setPointerCapture(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      if (dragging) {
        if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) moved = true
        yaw += (e.clientX - lastX) * 0.0065
        pitch = Math.max(0.28, Math.min(1.18, pitch + (e.clientY - lastY) * 0.0055))
        lastX = e.clientX
        lastY = e.clientY
        return
      }
      hover = nearest(e.clientX, e.clientY)
    }

    const onUp = (e: PointerEvent) => {
      if (dragging) {
        dragging = false
        try {
          cv.releasePointerCapture(e.pointerId)
        } catch {}
        if (!moved) {
          const i = nearest(e.clientX, e.clientY)
          if (i >= 0) {
            if (e.shiftKey) nodes[i].dead = !nodes[i].dead
            else originate(i)
          }
        }
      }
    }

    const onLeave = () => {
      hover = -1
    }

    const onCtx = (e: MouseEvent) => {
      e.preventDefault()
      const i = nearest(e.clientX, e.clientY)
      if (i >= 0) nodes[i].dead = !nodes[i].dead
    }

    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointerleave', onLeave)
    cv.addEventListener('contextmenu', onCtx)

    const bootTimer = window.setTimeout(() => originate(0), 420)

    let raf = 0
    let lastStat = 0
    let lastKey = ''

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const p = pal.current
      if (!dragging) yaw += 0.0009

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
      draw3DFloorGrid(ctx, size.w, size.h, yaw, pitch, p)
      draw3DGizmo(ctx, size.w, yaw, pitch, p)

      // Elevated 3D radio links between antenna tips in range
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          if (a.dead || b.dead) continue
          if (dist3(a, b) <= R()) {
            const pA = project3D(a.wx, a.elev, a.wz, yaw, pitch, size.w, size.h)
            const pB = project3D(b.wx, b.elev, b.wz, yaw, pitch, size.w, size.h)
            ctx.strokeStyle = p.light ? 'rgba(15,23,42,0.14)' : 'rgba(226,232,240,0.12)'
            ctx.beginPath()
            ctx.moveTo(pA.x, pA.y)
            ctx.lineTo(pB.x, pB.y)
            ctx.stroke()
          }
        }
      }

      // 3D ground reach ring when hovering a station
      if (hover >= 0) {
        const hn = nodes[hover]
        const segs = 40
        ctx.strokeStyle = p.accent
        ctx.globalAlpha = 0.45
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        for (let k = 0; k <= segs; k++) {
          const ang = (k / segs) * Math.PI * 2
          const pt = project3D(hn.wx + Math.cos(ang) * R(), 0.01, hn.wz + Math.sin(ang) * R(), yaw, pitch, size.w, size.h)
          if (k === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      // 3D parabolic radio arcs for messages in flight
      for (const e of events) {
        const k = Math.min(1, Math.max(0, (now - e.sentAt) / (e.due - e.sentAt)))
        const curX = e.from.wx + (e.to.wx - e.from.wx) * k
        const curZ = e.from.wz + (e.to.wz - e.from.wz) * k
        const arcLift = Math.sin(k * Math.PI) * 0.24
        const curY = e.from.elev + (e.to.elev - e.from.elev) * k + arcLift

        const tailK = Math.max(0, k - 0.28)
        const txW = e.from.wx + (e.to.wx - e.from.wx) * tailK
        const tzW = e.from.wz + (e.to.wz - e.from.wz) * tailK
        const tyW = e.from.elev + (e.to.elev - e.from.elev) * tailK + Math.sin(tailK * Math.PI) * 0.24

        const pHead = project3D(curX, curY, curZ, yaw, pitch, size.w, size.h)
        const pTail = project3D(txW, tyW, tzW, yaw, pitch, size.w, size.h)
        ctx.strokeStyle = p.accent
        ctx.lineWidth = 1.6
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.moveTo(pTail.x, pTail.y)
        ctx.lineTo(pHead.x, pHead.y)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.fillStyle = p.accent
        ctx.fillRect(pHead.x - 3, pHead.y - 3, 6, 6)
      }

      // Sort towers back-to-front so near towers overlap far towers
      const sorted = nodes
        .map((n, idx) => ({
          n,
          idx,
          base: project3D(n.wx, 0, n.wz, yaw, pitch, size.w, size.h),
          tip: project3D(n.wx, n.elev, n.wz, yaw, pitch, size.w, size.h),
        }))
        .sort((a, b) => b.base.depth - a.base.depth)

      ctx.font = MONO
      for (const { n, idx, base, tip } of sorted) {
        const reached = n.reached === curPid && curPid >= 0
        const age = now - n.flash

        // Expanding 3D ground signal ring
        if (age < 850) {
          const rad = 0.04 + (age / 850) * 0.28
          ctx.strokeStyle = p.accent
          ctx.globalAlpha = (1 - age / 850) * 0.75
          ctx.beginPath()
          for (let s = 0; s <= 24; s++) {
            const ang = (s / 24) * Math.PI * 2
            const rp = project3D(n.wx + Math.cos(ang) * rad, 0.01, n.wz + Math.sin(ang) * rad, yaw, pitch, size.w, size.h)
            if (s === 0) ctx.moveTo(rp.x, rp.y)
            else ctx.lineTo(rp.x, rp.y)
          }
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        // Base marker on floor
        ctx.fillStyle = p.light ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.18)'
        ctx.fillRect(base.x - 2.5, base.y - 2.5, 5, 5)

        if (n.dead) {
          ctx.strokeStyle = p.warn
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(tip.x - 5, tip.y - 5)
          ctx.lineTo(tip.x + 5, tip.y + 5)
          ctx.moveTo(tip.x + 5, tip.y - 5)
          ctx.lineTo(tip.x - 5, tip.y + 5)
          ctx.stroke()
          ctx.lineWidth = 1
          continue
        }

        // Vertical antenna stem
        ctx.strokeStyle = reached ? p.accent : p.dim
        ctx.globalAlpha = reached ? 0.85 : 0.45
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(base.x, base.y)
        ctx.lineTo(tip.x, tip.y)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.lineWidth = 1

        if (reached) {
          ctx.fillStyle = `hsl(${190 + n.hop * 28} ${p.light ? 82 : 92}% ${p.light ? 42 : 58}%)`
          const box = n.hop === 0 ? 10 : 7
          ctx.fillRect(tip.x - box / 2, tip.y - box / 2, box, box)
          ctx.fillStyle = p.dim
          ctx.fillText(String(n.hop), tip.x + 8, tip.y - 6)
        } else {
          ctx.strokeStyle = p.dim
          ctx.strokeRect(tip.x - 3.5, tip.y - 3.5, 7, 7)
        }

        if (idx === hover) {
          ctx.strokeStyle = p.accent
          ctx.strokeRect(tip.x - 8, tip.y - 8, 16, 16)
        }
      }

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
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointerleave', onLeave)
      cv.removeEventListener('contextmenu', onCtx)
      dispose()
    }
  }, [seed, pal])

  return (
    <div>
      <div ref={wrap} className="relative h-[390px] w-full cursor-grab active:cursor-grabbing">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full touch-none" />
      </div>
      <Controls
        readout={`reached ${stats.reached}/${stats.total}   signals ${stats.tx}   repeats blocked ${stats.suppressed}   max jumps ${stats.hops}`}
        hint="Click any tower to send an SOS. Drag background to tilt 3D view. Right-click turns tower off."
      >
        <Slider
          label="Signal reach"
          value={range}
          min={0.3}
          max={0.85}
          step={0.02}
          onChange={setRange}
          fmt={(v) => `${Math.round(v * 100)}%`}
        />
        <Slider label="Max hops" value={ttl} min={1} max={8} step={1} onChange={setTtl} fmt={(v) => String(v)} />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="border-b border-slate-400 pb-0.5 font-mono text-xs text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-white dark:hover:text-cyan-300"
        >
          Shuffle towers
        </button>
      </Controls>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. NavDrishti: 3D Indoor Tracking Without GPS                      */
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
    const METERS_PER_UNIT = 25 // simulated 3D floor half-extent in meters
    const path = (th: number): V => ({
      x: 0.72 * Math.sin(th),
      y: 0.62 * Math.sin(2 * th + 0.6),
    })

    let t = 0
    let theta = 0
    let truth = path(0)
    let raw: V = { ...truth }
    let fused: V = { ...truth }
    let psi = 0
    const gyroBias = (Math.random() > 0.5 ? 1 : -1) * 0.014
    const bias: V = { x: 0, y: 0 }
    let sigma = 0.04
    let corrTimer = 0

    const trailT: V[] = []
    const trailR: V[] = []
    const trailF: V[] = []
    const marks: V[] = []

    let yaw = 0.35
    let pitch = 0.66
    let dragging = false
    let moved = false
    let downX = 0
    let downY = 0
    let lastX = 0
    let lastY = 0

    const onDown = (e: PointerEvent) => {
      dragging = true
      moved = false
      downX = e.clientX
      downY = e.clientY
      lastX = e.clientX
      lastY = e.clientY
      cv.setPointerCapture(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) moved = true
      yaw += (e.clientX - lastX) * 0.0065
      pitch = Math.max(0.28, Math.min(1.18, pitch + (e.clientY - lastY) * 0.0055))
      lastX = e.clientX
      lastY = e.clientY
    }

    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      try {
        cv.releasePointerCapture(e.pointerId)
      } catch {}
      if (!moved) {
        shockRef.current = 1
      }
    }

    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)

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
      if (!dragging) yaw += 0.0008

      const omega = 0.55 * (0.55 + 0.45 * Math.sin(0.5 * t)) + 0.015
      theta += omega * dt
      const prev = truth
      truth = path(theta)
      const v: V = { x: (truth.x - prev.x) / Math.max(dt, 1e-4), y: (truth.y - prev.y) / Math.max(dt, 1e-4) }
      const stopped = omega < 0.12

      if (shockRef.current) {
        bias.x += (Math.random() - 0.5) * 0.42
        bias.y += (Math.random() - 0.5) * 0.42
        shockRef.current = 0
      }

      psi += (gyroBias * (0.4 + nz) + gauss() * 0.012 * nz) * dt
      bias.x += gauss() * 0.032 * nz * dt
      bias.y += gauss() * 0.032 * nz * dt
      const c = Math.cos(psi)
      const s = Math.sin(psi)
      const vm: V = {
        x: v.x * c - v.y * s + bias.x + gauss() * 0.045 * nz,
        y: v.x * s + v.y * c + bias.y + gauss() * 0.045 * nz,
      }

      raw = { x: raw.x + vm.x * dt, y: raw.y + vm.y * dt }
      fused = { x: fused.x + vm.x * dt, y: fused.y + vm.y * dt }
      sigma += (0.015 + 0.14 * nz) * dt

      // Pause-check & smoothing corrections
      corrTimer += dt
      if (corrTimer > 0.1 && fusionRef.current) {
        corrTimer = 0
        const sm = 0.01 + 0.025 * nz
        const meas: V = { x: truth.x + gauss() * sm, y: truth.y + gauss() * sm }
        const K = stopped ? 0.34 : 0.055
        fused = { x: fused.x + K * (meas.x - fused.x), y: fused.y + K * (meas.y - fused.y) }
        sigma *= 1 - K
        if (stopped && marks.length < 24 && Math.random() < 0.35) marks.push({ ...fused })
        if (stopped) {
          bias.x *= 0.78
          bias.y *= 0.78
        }
      }

      trailT.push({ ...truth })
      trailR.push({ ...raw })
      trailF.push({ ...fused })
      if (trailT.length > 360) {
        trailT.shift()
        trailR.shift()
        trailF.shift()
      }
      if (marks.length > 14) marks.shift()

      ctx.clearRect(0, 0, size.w, size.h)
      draw3DFloorGrid(ctx, size.w, size.h, yaw, pitch, p)
      draw3DGizmo(ctx, size.w, yaw, pitch, p)

      const stroke3D = (pts: V[], elev: number, color: string, width: number) => {
        ctx.lineWidth = width
        ctx.strokeStyle = color
        const n = pts.length
        const step = Math.max(1, Math.floor(n / 8))
        for (let i = 0; i < n - 1; i += step) {
          ctx.globalAlpha = 0.12 + 0.88 * (i / n)
          ctx.beginPath()
          const p0 = project3D(pts[i].x, elev, pts[i].y, yaw, pitch, size.w, size.h)
          ctx.moveTo(p0.x, p0.y)
          const end = Math.min(n - 1, i + step)
          for (let k = i + 1; k <= end; k++) {
            const pk = project3D(pts[k].x, elev, pts[k].y, yaw, pitch, size.w, size.h)
            ctx.lineTo(pk.x, pk.y)
          }
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        ctx.lineWidth = 1
      }

      // Ground paths + elevated smart smoothed ribbon
      stroke3D(trailR, 0.015, p.warn, 1.5)
      stroke3D(trailT, 0.01, p.fg, 1.3)
      if (fusionRef.current) {
        stroke3D(trailF, 0.14, p.accent, 2.2)
      }

      const pTruth = project3D(truth.x, 0.01, truth.y, yaw, pitch, size.w, size.h)
      const pRaw = project3D(raw.x, 0.015, raw.y, yaw, pitch, size.w, size.h)
      const pFusedTop = project3D(fused.x, 0.14, fused.y, yaw, pitch, size.w, size.h)
      const pFusedBase = project3D(fused.x, 0.01, fused.y, yaw, pitch, size.w, size.h)

      if (fusionRef.current) {
        // Vertical beacon stem from smoothed tracker down to the floor
        ctx.strokeStyle = p.accent
        ctx.globalAlpha = 0.55
        ctx.beginPath()
        ctx.moveTo(pFusedBase.x, pFusedBase.y)
        ctx.lineTo(pFusedTop.x, pFusedTop.y)
        ctx.stroke()

        // Projected 3D uncertainty ring on floor
        const rad = Math.min(sigma, 0.36)
        ctx.setLineDash([3, 4])
        ctx.beginPath()
        for (let k = 0; k <= 24; k++) {
          const ang = (k / 24) * Math.PI * 2
          const pr = project3D(
            fused.x + Math.cos(ang) * rad,
            0.01,
            fused.y + Math.sin(ang) * rad,
            yaw,
            pitch,
            size.w,
            size.h
          )
          if (k === 0) ctx.moveTo(pr.x, pr.y)
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1

        // Pause-reset anchors
        ctx.fillStyle = p.accent
        for (const m of marks) {
          const pm = project3D(m.x, 0.01, m.y, yaw, pitch, size.w, size.h)
          ctx.fillRect(pm.x - 2, pm.y - 2, 4, 4)
        }
      }

      // Tracked markers
      ctx.fillStyle = p.fg
      ctx.fillRect(pTruth.x - 4, pTruth.y - 4, 8, 8)
      ctx.fillStyle = p.warn
      ctx.fillRect(pRaw.x - 3, pRaw.y - 3, 6, 6)
      if (fusionRef.current) {
        ctx.fillStyle = p.accent
        ctx.fillRect(pFusedTop.x - 3.5, pFusedTop.y - 3.5, 7, 7)
      }

      ctx.font = MONO
      ctx.fillStyle = p.dim
      ctx.fillText('Real path', pTruth.x + 10, pTruth.y - 6)
      ctx.fillStyle = p.warn
      ctx.fillText('Raw sensor', pRaw.x + 10, pRaw.y + 12)
      if (fusionRef.current) {
        ctx.fillStyle = p.accent
        ctx.fillText('Smart path', pFusedTop.x + 10, pFusedTop.y - 2)
      }
      if (stopped) {
        ctx.fillStyle = p.dim
        ctx.fillText('Pause reset active', 16, size.h - 14)
      }

      if (now - lastStat > 200) {
        lastStat = now
        setErr({
          raw: Math.hypot(raw.x - truth.x, raw.y - truth.y) * METERS_PER_UNIT,
          fused: Math.hypot(fused.x - truth.x, fused.y - truth.y) * METERS_PER_UNIT,
        })
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerup', onUp)
      dispose()
    }
  }, [pal])

  return (
    <div>
      <div ref={wrap} className="relative h-[390px] w-full cursor-grab active:cursor-grabbing">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full touch-none" />
      </div>
      <Controls
        readout={`sensor drift ${err.raw.toFixed(1)} m   smart path ${fusion ? err.fused.toFixed(1) : 'off'} m`}
        hint="Click to bump the motion sensor. Drag anywhere to rotate the 3D floor."
      >
        <Slider
          label="Sensor wobble"
          value={noise}
          min={0.05}
          max={1}
          step={0.05}
          onChange={setNoise}
          fmt={(v) => v.toFixed(2)}
        />
        <button
          type="button"
          onClick={() => setFusion((f) => !f)}
          className="border-b border-slate-400 pb-0.5 font-mono text-xs text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/30 dark:text-white dark:hover:text-cyan-300"
        >
          Smart smoothing: {fusion ? 'on' : 'off'}
        </button>
      </Controls>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. StreamShield: Interactive 3D Window Depth Layers                */
/* ------------------------------------------------------------------ */

const WINDOWS = [
  { id: 'chat', title: 'Private chat', body: 'hey, are you free later?', z: 0 },
  { id: 'bank', title: 'Banking tab', body: 'balance  48,210.00', z: 36 },
  { id: 'code', title: 'Code editor', body: 'work in progress', z: 72 },
]

function CloakSim() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({ chat: true, bank: true, code: false })
  const [angle, setAngle] = useState(24)
  const toggleWindow = (id: string) => setHidden((h) => ({ ...h, [id]: !h[id] }))

  return (
    <div>
      <div className="grid grid-cols-1 gap-px bg-slate-200 dark:bg-white/[0.1] md:grid-cols-2">
        {(['What your monitor shows', 'What Discord, OBS & Zoom see'] as const).map((label, side) => (
          <div key={label} className="perspective-stage overflow-hidden bg-white p-6 dark:bg-[#07090f]">
            <div className="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-slate-500">
              <span>{label}</span>
              <span className={side === 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-500'}>
                {side === 0 ? 'all layers' : 'private layers removed'}
              </span>
            </div>

            <div
              className="preserve-3d mx-auto max-w-md space-y-3 py-3 transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${angle * 0.45}deg) rotateY(${side === 0 ? angle * 0.75 : -angle * 0.75}deg)`,
              }}
            >
              {WINDOWS.map((w) => {
                const isShielded = hidden[w.id]
                const masked = side === 1 && isShielded
                const zOffset = masked ? w.z + 52 : w.z

                return (
                  <div
                    key={w.id}
                    onClick={() => side === 0 && toggleWindow(w.id)}
                    className={`preserve-3d flex h-16 items-center justify-between border px-4 transition-all duration-500 ${
                      side === 0 ? 'cursor-pointer hover:border-cyan-500/60' : ''
                    } ${
                      masked
                        ? 'opacity-55'
                        : 'bg-slate-50/90 shadow-lg shadow-black/5 dark:bg-[#0d1220]/90 dark:shadow-black/50'
                    }`}
                    style={{
                      transform: `translateZ(${zOffset}px)`,
                      borderColor: masked ? 'rgba(244,63,94,0.55)' : undefined,
                      borderStyle: masked ? 'dashed' : 'solid',
                      background: masked
                        ? 'repeating-linear-gradient(135deg, rgba(244,63,94,0.08) 0 6px, transparent 6px 12px)'
                        : undefined,
                    }}
                  >
                    {masked ? (
                      <span className="font-mono text-[11px] text-rose-500">
                        Hidden from screen share
                      </span>
                    ) : (
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{w.title}</div>
                        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{w.body}</div>
                      </div>
                    )}

                    {side === 0 && (
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-300">
                        {isShielded ? (
                          <EyeOff className="h-3.5 w-3.5 text-rose-500" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        )}
                        {isShielded ? 'hidden' : 'shared'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Controls
        readout={`${Object.values(hidden).filter(Boolean).length} of ${WINDOWS.length} windows hidden from stream`}
        hint="Click any window on the left to toggle privacy. Drag the slider to tilt window layers in 3D."
      >
        <Slider
          label="3D layer tilt"
          value={angle}
          min={0}
          max={42}
          step={1}
          onChange={setAngle}
          fmt={(v) => `${v}°`}
        />
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <Rotate3d className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
          Z-depth view active
        </span>
      </Controls>
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
        className="slider-elite w-28"
      />
      <span className="w-9 text-slate-900 dark:text-white">{fmt(value)}</span>
    </label>
  )
}

const TABS: { id: LabId; label: string; project: string }[] = [
  { id: 'mesh', label: 'Offline Radio Mesh', project: 'Aegis-Raksha' },
  { id: 'inertial', label: 'Indoor Tracking', project: 'NavDrishti' },
  { id: 'cloak', label: 'Screen Privacy Shield', project: 'StreamShield' },
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
    <SpatialSection id="sandbox" index="02 / 05">
      <SectionHeader
        eyebrow="Interactive demos"
        lead="Try the"
        accent="Live 3D Systems"
        accentClass="text-flow-vibrant"
        note="click & drag inside"
        right={<span>Runs smoothly inside your browser</span>}
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

      <div className="border-x border-b border-slate-200 bg-white/55 backdrop-blur-sm transition-colors dark:border-white/[0.1] dark:bg-black/30">
        {tab === 'mesh' && <MeshSim pal={pal} />}
        {tab === 'inertial' && <InertialSim pal={pal} />}
        {tab === 'cloak' && <CloakSim />}
      </div>
    </SpatialSection>
  )
}
