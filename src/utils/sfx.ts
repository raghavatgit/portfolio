// Ultra-swift procedural Web Audio engine for tactile 3D UI & physics cues.
// Designed for sub-15ms micro-ticks and 65-75ms harmonic transients (zero muddy tails).

const NOTES = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66, 1318.51, 1479.98]

class TactileAudioEngine {
  private ctx: AudioContext | null = null
  public enabled = true
  private lastTickAt = 0

  private ensure(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctor) this.ctx = new Ctor()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  /** 9ms escapement micro-tick for hover & 3D wave propagation. */
  playTick(freq = 2200) {
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now()
    if (nowMs - this.lastTickAt < 18) return
    this.lastTickAt = nowMs

    try {
      const ctx = this.ensure()
      if (!ctx) return
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.0085)

      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(0.028, t + 0.0005)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.009)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.0095)
    } catch {}
  }

  /** 16ms dual-transient mechanical detent snap for clicks, toggles & copy actions. */
  playSnap(freq = 1750) {
    try {
      const ctx = this.ensure()
      if (!ctx) return
      const t = ctx.currentTime

      // Crisp upper click (6ms)
      const hi = ctx.createOscillator()
      const hiGain = ctx.createGain()
      hi.type = 'sine'
      hi.frequency.setValueAtTime(freq * 1.45, t)
      hi.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.006)
      hiGain.gain.setValueAtTime(0.04, t)
      hiGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.0065)
      hi.connect(hiGain)
      hiGain.connect(ctx.destination)
      hi.start(t)
      hi.stop(t + 0.007)

      // Tactile body thud (15ms)
      const lo = ctx.createOscillator()
      const loGain = ctx.createGain()
      lo.type = 'triangle'
      lo.frequency.setValueAtTime(310, t)
      lo.frequency.exponentialRampToValueAtTime(105, t + 0.015)
      loGain.gain.setValueAtTime(0.045, t)
      loGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016)
      lo.connect(loGain)
      loGain.connect(ctx.destination)
      lo.start(t)
      lo.stop(t + 0.0165)
    } catch {}
  }

  /** 75ms crystalline harmonic pluck for 3D brick impacts & ripples. */
  playChime(noteIdx = 0) {
    try {
      const ctx = this.ensure()
      if (!ctx) return
      const t = ctx.currentTime
      const freq = NOTES[Math.abs(noteIdx) % NOTES.length]

      // Fast fundamental body (75ms)
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq * 1.02, t)
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.005)

      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(0.085, t + 0.0015)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.078)

      // Glass octave harmonic transient (18ms)
      const over = ctx.createOscillator()
      const overGain = ctx.createGain()
      over.type = 'sine'
      over.frequency.setValueAtTime(freq * 2, t)
      overGain.gain.setValueAtTime(0.032, t)
      overGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018)
      over.connect(overGain)
      overGain.connect(ctx.destination)
      over.start(t)
      over.stop(t + 0.019)
    } catch {}
  }

  /** Swift pitch-specific tap (65ms) for mascot & dock actions. */
  playNote(freq = 880) {
    try {
      const ctx = this.ensure()
      if (!ctx) return
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq * 1.03, t)
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.004)

      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(0.07, t + 0.0012)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.062)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.065)
    } catch {}
  }

  /** 62ms pneumatic magnetic latch sweep for 3D assembly/disassembly. */
  playExplode(opening = true) {
    try {
      const ctx = this.ensure()
      if (!ctx) return
      const t = ctx.currentTime

      this.playSnap(opening ? 2100 : 1500)

      const osc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      const startF = opening ? 240 : 1120
      const endF = opening ? 1120 : 220
      osc.frequency.setValueAtTime(startF, t)
      osc.frequency.exponentialRampToValueAtTime(endF, t + 0.058)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1800, t)

      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(0.065, t + 0.004)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.062)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.064)
    } catch {}
  }
}

export const sfx = new TactileAudioEngine()
