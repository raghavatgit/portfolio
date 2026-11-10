import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Volume2, VolumeX, ArrowUp, Sparkles, Activity, Radio } from 'lucide-react'
import { useMascot } from '@/context/MascotContext'

// Procedural audio synth for companion
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

  playNote(freq = 659.25) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.3)
    } catch {}
  }
}

const miniSfx = new CompanionSFX()

const MASCOT_COLORS = [
  '#FF3366', // 0: Coral (StreamShield)
  '#0066FF', // 1: Cobalt
  '#00F0FF', // 2: Cyan (Sidereal)
  '#00E676', // 3: Emerald (NavDrishti)
  '#FFA502', // 4: Amber (Aegis-Raksha)
  '#8B5CF6', // 5: Violet (New-Atlas)
  '#EC4899', // 6: Pink (BrandNest)
  '#38BDF8', // 7: Glacier (Discord Player)
]

export function MascotCompanion() {
  const mountRef = useRef<HTMLDivElement>(null)
  const {
    isDocked,
    activeSection,
    hoveredProject,
    highlightedBrickIndex,
    mascotMode,
    setMascotMode,
    soundEnabled,
    setSoundEnabled,
  } = useMascot()

  const [localExploded, setLocalExploded] = useState(false)
  const [bubbleText, setBubbleText] = useState('Your 3D Lego Mascot ✨')
  const [showControls, setShowControls] = useState(false)

  // Sync sound setting
  useEffect(() => {
    miniSfx.enabled = soundEnabled
  }, [soundEnabled])

  // Context-aware speech bubble text
  useEffect(() => {
    if (hoveredProject) {
      setBubbleText(`Spotlighting ${hoveredProject} ✨`)
    } else {
      switch (activeSection) {
        case 'projects':
          setBubbleText('Interactive Project Core 🚀')
          break
        case 'sandbox':
          setBubbleText('Testing motion physics 🌊')
          break
        case 'stack':
          setBubbleText('Skills blueprint exploded 📐')
          break
        case 'about':
          setBubbleText('Crafted in Delhi ☕')
          break
        case 'contact':
          setBubbleText('Beacon open ~ say hello! 📡')
          break
        default:
          setBubbleText('Click to snap & play anywhere ✨')
          break
      }
    }
  }, [activeSection, hoveredProject])

  // Miniature Three.js Scene for the floating mascot
  const brickGroupsRef = useRef<THREE.Group[]>([])
  const coreRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    if (!isDocked) return
    const container = mountRef.current
    if (!container) return

    const size = 110
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50)
    camera.position.set(4.0, 3.2, 4.0)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 2.0)
    scene.add(ambient)
    const direct = new THREE.DirectionalLight(0xffffff, 2.6)
    direct.position.set(5, 7, 5)
    scene.add(direct)

    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // Glowing Central Core
    const coreGeo = new THREE.IcosahedronGeometry(0.32, 1)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    masterGroup.add(core)
    coreRef.current = core

    // 8 Lego Bricks
    const brickSize = 0.82
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
        index: idx,
        basePos: new THREE.Vector3(pos.x, pos.y, pos.z),
        explodeDir: new THREE.Vector3(
          pos.x > 0 ? 0.65 : -0.65,
          pos.y > 0 ? 0.65 : -0.65,
          pos.z > 0 ? 0.65 : -0.65
        ),
      }

      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(MASCOT_COLORS[idx]),
        roughness: 0.14,
        clearcoat: 0.85,
        clearcoatRoughness: 0.1,
      })

      const body = new THREE.Mesh(brickGeo, mat)
      bGroup.add(body)

      const stud = new THREE.Mesh(studGeo, mat)
      stud.position.set(0, brickSize / 2 + 0.05, 0)
      bGroup.add(stud)

      masterGroup.add(bGroup)
      brickGroups.push(bGroup)
    })

    brickGroupsRef.current = brickGroups

    let frameId: number
    let clock = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      clock += 0.02

      masterGroup.rotation.y += 0.012
      core.rotation.x -= 0.015

      // Mode Reactions
      const isExploded = localExploded || mascotMode === 'exploded'
      const isWave = mascotMode === 'wave'
      const isBeacon = mascotMode === 'beacon'

      if (coreRef.current && isBeacon) {
        const pulse = 1 + Math.sin(clock * 5) * 0.25
        coreRef.current.scale.set(pulse, pulse, pulse)
      }

      brickGroups.forEach((bGroup, idx) => {
        const base = bGroup.userData.basePos as THREE.Vector3
        const explodeDir = bGroup.userData.explodeDir as THREE.Vector3
        let target = base.clone()

        if (isExploded) {
          target.add(explodeDir)
          target.y += Math.sin(clock * 2 + idx) * 0.05
        } else if (isWave) {
          target.y += Math.sin(clock * 3 + idx * 0.8) * 0.25
        }

        // Spotlight Reaction: if this brick is spotlighted by the user hovering a project card
        if (highlightedBrickIndex === idx) {
          target.add(explodeDir.clone().multiplyScalar(0.5))
          bGroup.scale.lerp(new THREE.Vector3(1.22, 1.22, 1.22), 0.15)
        } else {
          bGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15)
        }

        bGroup.position.lerp(target, 0.12)
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
  }, [isDocked, localExploded, mascotMode, highlightedBrickIndex])

  const handleClickMascot = () => {
    miniSfx.playNote(783.99)
    setLocalExploded((prev) => !prev)
  }

  const handleScrollToTop = () => {
    miniSfx.playNote(1046.5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isDocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 40 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5 pointer-events-auto select-none"
        >
          {/* Cursive Context-Aware Status Bubble */}
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-[#090d18]/95 border border-cyan-500/30 dark:border-cyan-400/40 backdrop-blur-xl shadow-lg dark:shadow-xl shadow-black/10 dark:shadow-black/80 flex items-center gap-2 transition-colors"
          >
            {activeSection === 'contact' ? (
              <Radio className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            ) : activeSection === 'sandbox' ? (
              <Activity className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
            )}
            <span className="font-cursive text-cyan-700 dark:text-cyan-200 text-base tracking-wide whitespace-nowrap">
              {bubbleText}
            </span>
          </motion.div>

          {/* Floating Mascot HUD Dock */}
          <div className="flex items-center gap-2 p-2 rounded-full bg-white/90 dark:bg-[#080b16]/92 border border-slate-200 dark:border-white/[0.15] backdrop-blur-2xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/95 transition-colors">
            {/* Expanded Controls on Hover */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-1.5 overflow-hidden pr-1"
                >
                  {/* Explode Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      miniSfx.playNote(523.25)
                      setLocalExploded(!localExploded)
                      setMascotMode(localExploded ? 'assembled' : 'exploded')
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      localExploded ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/[0.06] text-slate-300 hover:text-white'
                    }`}
                    title="Disassemble / Assemble"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>

                  {/* Return to Hero */}
                  <button
                    type="button"
                    onClick={handleScrollToTop}
                    className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-slate-300 hover:text-white transition-colors"
                    title="Return to Hero Stage"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Sound Toggle */}
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-slate-300 hover:text-white transition-colors"
                    title={soundEnabled ? 'Mute' : 'Unmute'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Interactive Mascot Canvas Orb */}
            <div
              ref={mountRef}
              onClick={handleClickMascot}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-cyan-400/40 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.25)] relative overflow-hidden"
              title="Raghav's 3D Lego Mascot: Click to snap/explode or hover for controls"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
