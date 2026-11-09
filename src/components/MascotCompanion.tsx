import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Volume2, VolumeX, ArrowUp, Sparkles } from 'lucide-react'

// Lightweight mini Web Audio Synth for companion
class CompanionSFX {
  private ctx: AudioContext | null = null
  public enabled = true

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playPop(note = 659.25) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(note, this.ctx.currentTime)
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.25)
    } catch {}
  }
}

const miniSfx = new CompanionSFX()

const MASCOT_COLORS = [
  '#FF3366',
  '#0066FF',
  '#00F0FF',
  '#00E676',
  '#FFB800',
  '#8B5CF6',
  '#FF4757',
  '#38BDF8',
]

export function MascotCompanion() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [isExploded, setIsExploded] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [showBubble, setShowBubble] = useState(true)

  const explodedRef = useRef(false)
  explodedRef.current = isExploded

  // Show only when scrolled past Hero (scrollY > 400)
  useEffect(() => {
    const handleScroll = () => {
      const pastHero = window.scrollY > 450
      setVisible(pastHero)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-hide the welcome bubble after 6 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setShowBubble(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [visible])

  // Miniature Three.js Scene for the floating mascot
  useEffect(() => {
    if (!visible) return
    const container = mountRef.current
    if (!container) return

    const size = 96
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50)
    camera.position.set(3.8, 3.2, 3.8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambient)
    const direct = new THREE.DirectionalLight(0xffffff, 2.5)
    direct.position.set(4, 6, 4)
    scene.add(direct)

    const group = new THREE.Group()
    scene.add(group)

    // Central glowing mini core
    const coreGeo = new THREE.IcosahedronGeometry(0.35, 1)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    group.add(core)

    // 8 Lego Bricks
    const brickSize = 0.8
    const brickGeo = new THREE.BoxGeometry(brickSize, brickSize, brickSize)
    const studGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16)

    const offsets = [
      { x: -0.44, y: 0.44, z: 0.44 },
      { x: 0.44, y: 0.44, z: 0.44 },
      { x: -0.44, y: 0.44, z: -0.44 },
      { x: 0.44, y: 0.44, z: -0.44 },
      { x: -0.44, y: -0.44, z: 0.44 },
      { x: 0.44, y: -0.44, z: 0.44 },
      { x: -0.44, y: -0.44, z: -0.44 },
      { x: 0.44, y: -0.44, z: -0.44 },
    ]

    const brickGroups: THREE.Group[] = []

    offsets.forEach((pos, idx) => {
      const bGroup = new THREE.Group()
      bGroup.position.set(pos.x, pos.y, pos.z)
      bGroup.userData = {
        basePos: new THREE.Vector3(pos.x, pos.y, pos.z),
        explodeDir: new THREE.Vector3(
          pos.x > 0 ? 0.6 : -0.6,
          pos.y > 0 ? 0.6 : -0.6,
          pos.z > 0 ? 0.6 : -0.6
        ),
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(MASCOT_COLORS[idx]),
        roughness: 0.15,
        clearcoat: 0.8,
      })

      const body = new THREE.Mesh(brickGeo, mat)
      bGroup.add(body)

      // 1 Top Stud for cute mini mascot proportion
      const stud = new THREE.Mesh(studGeo, mat)
      stud.position.set(0, brickSize / 2 + 0.05, 0)
      bGroup.add(stud)

      group.add(bGroup)
      brickGroups.push(bGroup)
    })

    let frameId: number
    let clock = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      clock += 0.02

      group.rotation.y += 0.015
      core.rotation.x -= 0.02

      const exploded = explodedRef.current
      brickGroups.forEach((bGroup) => {
        const base = bGroup.userData.basePos as THREE.Vector3
        const explodeDir = bGroup.userData.explodeDir as THREE.Vector3
        let target = base.clone()
        if (exploded) {
          target.add(explodeDir)
        }
        bGroup.position.lerp(target, 0.1)
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      brickGeo.dispose()
      studGeo.dispose()
      coreGeo.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [visible])

  const handleClickMascot = () => {
    miniSfx.playPop(783.99)
    setIsExploded((prev) => !prev)
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 30 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 pointer-events-auto"
        >
          {/* Handwritten Cursive Speech Bubble */}
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="px-3.5 py-1.5 rounded-2xl bg-[#0b0e1a]/95 border border-cyan-400/40 backdrop-blur-xl shadow-xl shadow-black/80 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="font-cursive text-cyan-200 text-base tracking-wide whitespace-nowrap">
                  Click me to play anywhere! ✨
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Mascot Orb with Controls */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#080b16]/90 border border-white/[0.14] backdrop-blur-2xl shadow-2xl shadow-black/90">
            {/* Quick Action: Explode */}
            <button
              type="button"
              onClick={() => {
                miniSfx.playPop(523.25)
                setIsExploded(!isExploded)
              }}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-slate-300 hover:text-white transition-colors"
              title="Disassemble / Snap Mascot"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* Quick Action: Scroll to Top */}
            <button
              type="button"
              onClick={handleScrollToTop}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-slate-300 hover:text-white transition-colors"
              title="Return to Hero"
            >
              <ArrowUp className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !soundOn
                setSoundOn(next)
                miniSfx.enabled = next
              }}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-slate-300 hover:text-white transition-colors"
              title={soundOn ? 'Mute' : 'Unmute'}
            >
              {soundOn ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* 3D Mini Mascot Canvas */}
            <div
              ref={mountRef}
              onClick={handleClickMascot}
              className="w-12 h-12 rounded-full bg-cyan-500/[0.08] border border-cyan-400/30 flex items-center justify-center cursor-pointer hover:scale-108 transition-transform shadow-inner shadow-cyan-500/20"
              title="Raghav's 3D Lego Mascot: Click to snap/explode!"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
