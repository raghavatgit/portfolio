import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Layers,
  Sparkles,
  RotateCw,
  Activity,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react'

// Procedural Audio Synthesizer for tactile feedback
class SoundFX {
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

  playTick() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.02)
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.02)
    } catch {
      // AudioContext unavailable
    }
  }

  playPop(noteIndex = 0) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      // Pentatonic scale frequencies: C5, D5, E5, G5, A5, C6, D6, E6
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51]
      const freq = notes[noteIndex % notes.length]

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.35)
    } catch {
      // AudioContext unavailable
    }
  }

  playSnap() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.05)
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.05)
    } catch {
      // AudioContext unavailable
    }
  }
}

const sfx = new SoundFX()

// Vibrant, expertly graded color themes
const PALETTES = [
  {
    name: 'Vibrant Chroma',
    colors: [
      '#FF3366', // Hot Coral / Neon Pink
      '#0066FF', // Cobalt Azure
      '#00F0FF', // Electric Cyan
      '#00E676', // Hyper Emerald
      '#FFB800', // Warm Gold
      '#8B5CF6', // Ultra Violet
      '#FF4757', // Flame Red
      '#38BDF8', // Glacier Blue
    ],
    coreColor: '#00F0FF',
  },
  {
    name: 'Cyber Stealth',
    colors: [
      '#1E2235', // Midnight Slate
      '#00F5D4', // Mint Cyan
      '#7B2CBF', // Deep Royal Violet
      '#F72585', // Neon Magenta
      '#4CC9F0', // Sky Neon
      '#242B42', // Obsidian Carbon
      '#FFB703', // Electric Amber
      '#4361EE', // Hyper Indigo
    ],
    coreColor: '#F72585',
  },
  {
    name: 'Candy Pop',
    colors: [
      '#FF6B6B', // Watermelon
      '#4ECDC4', // Seafoam
      '#FFE66D', // Lemon
      '#9B5DE5', // Lavender
      '#F15BB5', // Bubblegum
      '#00BBF9', // Sky Pop
      '#00F5D4', // Spearmint
      '#FEE440', // Sunshine
    ],
    coreColor: '#FFE66D',
  },
]

type CubeMode = 'assembled' | 'exploded' | 'wave'

export function LegoCube() {
  const mountRef = useRef<HTMLDivElement>(null)

  // Interaction State
  const [cubeMode, setCubeMode] = useState<CubeMode>('assembled')
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeBrickIdx, setActiveBrickIdx] = useState<number | null>(null)

  // Mutable refs for RAF loop
  const modeRef = useRef<CubeMode>('assembled')
  modeRef.current = cubeMode

  const colorsRef = useRef(PALETTES[0].colors)
  colorsRef.current = PALETTES[paletteIdx].colors

  const topLayerRotRef = useRef(0)
  const targetTopLayerRotRef = useRef(0)

  const brickGroupsRef = useRef<THREE.Group[]>([])
  const coreMeshRef = useRef<THREE.Mesh | null>(null)
  const coreParticlesRef = useRef<THREE.Points | null>(null)
  const connectingLinesRef = useRef<THREE.LineSegments | null>(null)

  useEffect(() => {
    sfx.enabled = soundEnabled
  }, [soundEnabled])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(4.5, 3.6, 4.5)
    camera.lookAt(0, 0, 0)

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // Master Group
    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // Separate group for top layer to enable Rubik layer twisting
    const topLayerGroup = new THREE.Group()
    const bottomLayerGroup = new THREE.Group()
    masterGroup.add(topLayerGroup)
    masterGroup.add(bottomLayerGroup)

    // Lighting (Tactile studio environment with clearcoat reflections)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0)
    keyLight.position.set(6, 10, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.0001
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x70d6ff, 1.4)
    fillLight.position.set(-6, -2, -5)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xffffff, 2.5, 15)
    rimLight.position.set(0, 6, 0)
    scene.add(rimLight)

    // Central Glowing Quantum Core (Revealed when exploded)
    const coreGeo = new THREE.IcosahedronGeometry(0.38, 2)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(PALETTES[0].coreColor),
      emissive: new THREE.Color(PALETTES[0].coreColor),
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.9,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    masterGroup.add(coreMesh)
    coreMeshRef.current = coreMesh

    // Core Wireframe Halo
    const coreWireGeo = new THREE.IcosahedronGeometry(0.44, 1)
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat)
    coreMesh.add(coreWire)

    // Core Particle Aura
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 0.5 + Math.random() * 0.9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i + 2] = radius * Math.cos(phi)
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })
    const coreParticles = new THREE.Points(particleGeo, particleMat)
    masterGroup.add(coreParticles)
    coreParticlesRef.current = coreParticles

    // Construct the 8 Modular Lego Bricks
    const brickSize = 0.92
    const brickHeight = 0.76
    const studRadius = 0.14
    const studHeight = 0.13

    const boxGeo = new THREE.BoxGeometry(brickSize, brickHeight, brickSize)
    const studGeo = new THREE.CylinderGeometry(studRadius, studRadius, studHeight, 24)

    const brickGroups: THREE.Group[] = []
    const brickMaterials: THREE.MeshPhysicalMaterial[] = []

    // 2x2x2 coordinate layout
    const brickPositions = [
      // Top Layer (Y > 0)
      { x: -0.5, y: 0.43, z: 0.5, isTop: true },
      { x: 0.5, y: 0.43, z: 0.5, isTop: true },
      { x: -0.5, y: 0.43, z: -0.5, isTop: true },
      { x: 0.5, y: 0.43, z: -0.5, isTop: true },
      // Bottom Layer (Y < 0)
      { x: -0.5, y: -0.43, z: 0.5, isTop: false },
      { x: 0.5, y: -0.43, z: 0.5, isTop: false },
      { x: -0.5, y: -0.43, z: -0.5, isTop: false },
      { x: 0.5, y: -0.43, z: -0.5, isTop: false },
    ]

    brickPositions.forEach((pos, idx) => {
      const brickGroup = new THREE.Group()
      brickGroup.position.set(pos.x, pos.y, pos.z)
      brickGroup.userData = {
        index: idx,
        isTop: pos.isTop,
        basePos: new THREE.Vector3(pos.x, pos.y, pos.z),
        explodeOffset: new THREE.Vector3(
          pos.x > 0 ? 0.8 : -0.8,
          pos.y > 0 ? 0.75 : -0.75,
          pos.z > 0 ? 0.8 : -0.8
        ),
        targetScale: 1,
        spinAngle: 0,
        spinVelocity: 0,
      }

      // Satin, high-sheen plastic physical material
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorsRef.current[idx] || '#FF3366'),
        roughness: 0.14,
        metalness: 0.05,
        clearcoat: 0.85,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
      })
      brickMaterials.push(mat)

      // Main Block Body
      const body = new THREE.Mesh(boxGeo, mat)
      body.castShadow = true
      body.receiveShadow = true
      brickGroup.add(body)

      // 4 Physical Cylindrical Studs on top
      const studOffset = 0.23
      const studs = [
        [-studOffset, studOffset],
        [studOffset, studOffset],
        [-studOffset, -studOffset],
        [studOffset, -studOffset],
      ]

      studs.forEach(([sx, sz]) => {
        const stud = new THREE.Mesh(studGeo, mat)
        stud.position.set(sx, brickHeight / 2 + studHeight / 2, sz)
        stud.castShadow = true
        stud.receiveShadow = true
        brickGroup.add(stud)
      })

      // Add to appropriate layer
      if (pos.isTop) {
        topLayerGroup.add(brickGroup)
      } else {
        bottomLayerGroup.add(brickGroup)
      }

      brickGroups.push(brickGroup)
    })

    brickGroupsRef.current = brickGroups

    // Futuristic connecting laser lines for exploded mode
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const linePositions = new Float32Array(8 * 2 * 3) // 8 lines from core to 8 bricks
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat)
    masterGroup.add(lineSegments)
    connectingLinesRef.current = lineSegments

    // Raycasting & Pointer Tracking
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-100, -100)

    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let rotX = 0.1
    let rotY = 0.1
    let targetRotX = 0
    let targetRotY = 0

    let lastHoveredIdx: number | null = null

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        targetRotY += deltaX * 0.009
        targetRotX += deltaY * 0.009
        prevMouseX = e.clientX
        prevMouseY = e.clientY
      } else {
        // Natural parallax tilt
        targetRotY = THREE.MathUtils.lerp(targetRotY, mouse.x * 0.35, 0.06)
        targetRotX = THREE.MathUtils.lerp(targetRotX, -mouse.y * 0.3, 0.06)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const allObjects: THREE.Object3D[] = []
      brickGroups.forEach((g) => allObjects.push(...g.children))
      const intersects = raycaster.intersectObjects(allObjects)

      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent as THREE.Group
        if (hitGroup && typeof hitGroup.userData.index === 'number') {
          const idx = hitGroup.userData.index
          setActiveBrickIdx(idx)
          // Trigger snappy 360 spin & acoustic chime note!
          hitGroup.userData.spinVelocity = 0.35
          sfx.playPop(idx)
        }
      } else {
        // Clicking outside snaps sounds
        sfx.playSnap()
      }
    }

    const onDoubleClick = () => {
      // Snappy reset to original isometric view
      targetRotX = 0
      targetRotY = 0
      sfx.playSnap()
    }

    const dom = renderer.domElement
    dom.addEventListener('pointermove', onPointerMove)
    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    dom.addEventListener('click', onClick)
    dom.addEventListener('dblclick', onDoubleClick)

    // Main Kinetic Loop
    let frameId: number
    let clockTime = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      clockTime += 0.02

      // Damped rotation for master group
      rotX = THREE.MathUtils.lerp(rotX, targetRotX, 0.07)
      rotY = THREE.MathUtils.lerp(rotY, targetRotY, 0.07)
      masterGroup.rotation.x = rotX
      masterGroup.rotation.y = rotY

      // Rubik Layer Twist interpolation
      topLayerRotRef.current = THREE.MathUtils.lerp(
        topLayerRotRef.current,
        targetTopLayerRotRef.current,
        0.1
      )
      topLayerGroup.rotation.y = topLayerRotRef.current

      // Core rotation & pulsing
      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.y += 0.02
        coreMeshRef.current.rotation.x += 0.012
        const pulse = 1 + Math.sin(clockTime * 2) * 0.08
        coreMeshRef.current.scale.set(pulse, pulse, pulse)
      }

      // Particle aura spin
      if (coreParticlesRef.current) {
        coreParticlesRef.current.rotation.y -= 0.005
        coreParticlesRef.current.rotation.z += 0.003
      }

      // Hover Raycast
      raycaster.setFromCamera(mouse, camera)
      const allObjects: THREE.Object3D[] = []
      brickGroups.forEach((g) => allObjects.push(...g.children))
      const intersects = raycaster.intersectObjects(allObjects)

      let currentHoveredIdx: number | null = null
      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent as THREE.Group
        if (hitGroup && typeof hitGroup.userData.index === 'number') {
          currentHoveredIdx = hitGroup.userData.index
        }
      }

      // Play tick on hover change
      if (currentHoveredIdx !== null && currentHoveredIdx !== lastHoveredIdx) {
        sfx.playTick()
      }
      lastHoveredIdx = currentHoveredIdx

      // Mode-based Brick Kinetic Update
      const mode = modeRef.current
      const linePosAttr = connectingLinesRef.current?.geometry.attributes.position as
        | THREE.BufferAttribute
        | undefined

      brickGroups.forEach((group, idx) => {
        const base = group.userData.basePos as THREE.Vector3
        const explodeDir = group.userData.explodeOffset as THREE.Vector3

        let targetPos = base.clone()

        if (mode === 'exploded') {
          targetPos.add(explodeDir)
          // Subtle breathing float
          targetPos.y += Math.sin(clockTime * 2 + idx) * 0.04
        } else if (mode === 'wave') {
          // Hypnotic kinetic wave oscillation
          const waveHeight = Math.sin(clockTime * 3 + idx * 0.8) * 0.35
          targetPos.y += waveHeight
        }

        // Lift hovered or active brick
        if (currentHoveredIdx === idx) {
          targetPos.add(explodeDir.clone().multiplyScalar(0.4))
          group.scale.lerp(new THREE.Vector3(1.08, 1.08, 1.08), 0.18)
        } else {
          group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.18)
        }

        group.position.lerp(targetPos, 0.12)

        // Spin animation when clicked
        if (group.userData.spinVelocity > 0.001) {
          group.rotation.y += group.userData.spinVelocity
          group.userData.spinVelocity *= 0.92
        } else {
          group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, 0.1)
        }

        // Update connecting laser lines in exploded mode
        if (linePosAttr) {
          // Point 1: Core center (0, 0, 0)
          linePosAttr.setXYZ(idx * 2, 0, 0, 0)
          // Point 2: Brick center in master coordinate space
          const worldPos = group.position.clone()
          if (group.userData.isTop) {
            worldPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), topLayerRotRef.current)
          }
          linePosAttr.setXYZ(idx * 2 + 1, worldPos.x, worldPos.y, worldPos.z)
        }
      })

      // Update line opacity
      if (connectingLinesRef.current) {
        const mat = connectingLinesRef.current.material as THREE.LineBasicMaterial
        const targetOpacity = mode === 'exploded' ? 0.45 : 0
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1)
        if (linePosAttr) {
          linePosAttr.needsUpdate = true
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const onResize = () => {
      if (!container) return
      const newW = container.clientWidth
      const newH = container.clientHeight
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      dom.removeEventListener('pointermove', onPointerMove)
      dom.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      dom.removeEventListener('click', onClick)
      dom.removeEventListener('dblclick', onDoubleClick)
      renderer.dispose()
      boxGeo.dispose()
      studGeo.dispose()
      coreGeo.dispose()
      coreWireGeo.dispose()
      particleGeo.dispose()
      lineGeo.dispose()
      brickMaterials.forEach((m) => m.dispose())
      if (container.contains(dom)) {
        container.removeChild(dom)
      }
    }
  }, [])

  // Update Palette Colors
  useEffect(() => {
    const palette = PALETTES[paletteIdx]
    brickGroupsRef.current.forEach((group, idx) => {
      group.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
          child.material.color.set(palette.colors[idx] || '#FF3366')
        }
      })
    })

    if (coreMeshRef.current) {
      const mat = coreMeshRef.current.material as THREE.MeshPhysicalMaterial
      mat.color.set(palette.coreColor)
      mat.emissive.set(palette.coreColor)
    }
  }, [paletteIdx])

  // Multifunctional Actions
  const handleToggleExplode = () => {
    sfx.playSnap()
    setCubeMode((prev) => (prev === 'exploded' ? 'assembled' : 'exploded'))
  }

  const handleToggleWave = () => {
    sfx.playTick()
    setCubeMode((prev) => (prev === 'wave' ? 'assembled' : 'wave'))
  }

  const handleTwistLayer = () => {
    sfx.playPop(3)
    targetTopLayerRotRef.current += Math.PI / 2 // Rotate 90 degrees
  }

  const handleCyclePalette = () => {
    sfx.playTick()
    setPaletteIdx((prev) => (prev + 1) % PALETTES.length)
  }

  const handleReset = () => {
    sfx.playSnap()
    setCubeMode('assembled')
    targetTopLayerRotRef.current = 0
  }

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center select-none overflow-hidden">
      {/* Dynamic Ambient Core Glow */}
      <div
        className="pointer-events-none absolute w-80 h-80 rounded-full blur-[110px] opacity-25 transition-all duration-700"
        style={{
          backgroundColor:
            activeBrickIdx !== null
              ? PALETTES[paletteIdx].colors[activeBrickIdx]
              : PALETTES[paletteIdx].coreColor,
        }}
      />

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Interact with the 3D Lego construct: Click bricks, drag to rotate, double-click to center"
      />

      {/* Sleek, Futuristic, Iconographic Multifunctional Controls Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-[#070a14]/85 border border-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/90">
        {/* Action 1: Disassemble / Explode */}
        <button
          type="button"
          onClick={handleToggleExplode}
          className={`p-2.5 rounded-full transition-all ${
            cubeMode === 'exploded'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
              : 'bg-white/[0.05] hover:bg-white/[0.12] text-slate-200'
          }`}
          title="CAD Disassemble / Reassemble"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Action 2: Kinetic Wave */}
        <button
          type="button"
          onClick={handleToggleWave}
          className={`p-2.5 rounded-full transition-all ${
            cubeMode === 'wave'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/[0.05] hover:bg-white/[0.12] text-slate-200'
          }`}
          title="Kinetic Wave Oscillation"
        >
          <Activity className="w-4 h-4" />
        </button>

        {/* Action 3: Twist 90° */}
        <button
          type="button"
          onClick={handleTwistLayer}
          className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 transition-all hover:rotate-90 duration-300"
          title="Twist Top Layer 90°"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Action 4: Palette Switcher */}
        <button
          type="button"
          onClick={handleCyclePalette}
          className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-amber-300 transition-all"
          title={`Switch Color Grade (${PALETTES[paletteIdx].name})`}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Action 5: Sound Feedback */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2.5 rounded-full transition-all ${
            soundEnabled
              ? 'bg-white/[0.05] hover:bg-white/[0.12] text-cyan-300'
              : 'bg-white/[0.02] text-slate-500'
          }`}
          title={soundEnabled ? 'Mute Audio Synth' : 'Enable Audio Synth'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Action 6: Reset Angle */}
        <button
          type="button"
          onClick={handleReset}
          className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 transition-all"
          title="Reset View & Position"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
