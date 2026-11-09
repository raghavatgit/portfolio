import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Layers, CheckCircle2 } from 'lucide-react'

export interface LegoModule {
  id: string
  name: string
  category: string
  color: string
  desc: string
  feature: string
  iconName?: string
}

export const LEGO_MODULES: LegoModule[] = [
  {
    id: 'privacy',
    name: 'Screen Privacy',
    category: 'StreamShield',
    color: '#FF4757', // Vibrant Coral
    desc: 'Hides your private chats and passwords from screen shares on Discord or Zoom.',
    feature: 'Runs in background · Zero lag · 3 MB',
  },
  {
    id: 'systems',
    name: 'Fast Windows Tools',
    category: 'Rust & C++',
    color: '#0066FF', // Electric Cobalt
    desc: 'Lightweight desktop programs built in Rust that start instantly without bloat.',
    feature: 'Uses under 15 MB RAM · No installer needed',
  },
  {
    id: 'navigation',
    name: 'Offline Navigation',
    category: 'NavDrishti',
    color: '#00E676', // Hyper Emerald
    desc: 'Tracks where you walk inside subways and tunnels where satellite GPS cannot reach.',
    feature: 'Uses phone motion sensors · 100% offline',
  },
  {
    id: 'radio',
    name: 'Emergency Radios',
    category: 'Aegis Mesh',
    color: '#FFA502', // Warm Amber
    desc: 'Pocket radio devices that send SOS alerts and messages when cell towers go down.',
    feature: 'LoRa radio mesh · 10+ km range · Zero internet',
  },
  {
    id: 'creative',
    name: 'Video Workflow Bridge',
    category: 'PerpEdit',
    color: '#8B5CF6', // Vivid Violet
    desc: 'One-click tool connecting Adobe After Effects and DaVinci Resolve without rebuilding animations.',
    feature: 'Saves 3+ hours per project · Exact keyframes',
  },
  {
    id: 'space',
    name: '3D Space Simulator',
    category: 'Sidereal',
    color: '#00F0FF', // Electric Cyan
    desc: 'Interactive 3D solar system flight simulation driven by real gravitational orbital math.',
    feature: 'Real-time WebGL · 60 FPS flight physics',
  },
  {
    id: 'media',
    name: 'Agency Showcases',
    category: 'BrandNest',
    color: '#EC4899', // Hot Pink
    desc: 'High-speed video presentation websites tailored for creative agencies and artists.',
    feature: 'Instant video buffering · Custom layouts',
  },
  {
    id: 'audio',
    name: 'Discord Music Player',
    category: 'Vencord Tool',
    color: '#38BDF8', // Glacier Blue
    desc: 'Minimal mini-player inside Discord to control YouTube Music without switching windows.',
    feature: 'Album art display · One-click hotkeys',
  },
]

// 3 Color palettes
const PALETTES = [
  {
    name: 'Vibrant Neo',
    colors: ['#FF4757', '#0066FF', '#00E676', '#FFA502', '#8B5CF6', '#00F0FF', '#EC4899', '#38BDF8'],
  },
  {
    name: 'Solar Warmth',
    colors: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#AF52DE', '#5856D6', '#FF2D55', '#007AFF'],
  },
  {
    name: 'Cyber Minimal',
    colors: ['#00F5D4', '#7B2CBF', '#F72585', '#4CC9F0', '#3A0CA3', '#7209B7', '#4361EE', '#4895EF'],
  },
]

export function LegoCube() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedModule, setSelectedModule] = useState<LegoModule>(LEGO_MODULES[0])
  const [isExploded, setIsExploded] = useState(false)
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // References for animation state
  const explodedRef = useRef(false)
  explodedRef.current = isExploded

  const currentColorsRef = useRef(PALETTES[0].colors)
  currentColorsRef.current = PALETTES[paletteIndex].colors

  const brickMeshesRef = useRef<THREE.Group[]>([])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera (Isometric angle)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(4.2, 3.4, 4.2)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Main Group containing all Lego bricks
    const legoCluster = new THREE.Group()
    scene.add(legoCluster)

    // Lighting (Tactile studio lighting that brings out Lego specular highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.8)
    mainLight.position.set(5, 8, 6)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 1024
    mainLight.shadow.mapSize.height = 1024
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x90e0ef, 1.2)
    fillLight.position.set(-5, -2, -4)
    scene.add(fillLight)

    const topRimLight = new THREE.PointLight(0xffffff, 2, 12)
    topRimLight.position.set(0, 5, 0)
    scene.add(topRimLight)

    // Helper: Create a single Lego brick with 4 cylindrical studs on top
    const brickSize = 0.92
    const brickHeight = 0.75
    const studRadius = 0.14
    const studHeight = 0.12

    const boxGeo = new THREE.BoxGeometry(brickSize, brickHeight, brickSize)
    const studGeo = new THREE.CylinderGeometry(studRadius, studRadius, studHeight, 20)

    const brickGroups: THREE.Group[] = []
    const brickMaterials: THREE.MeshPhysicalMaterial[] = []

    // 2x2x2 positions
    const offsets = [
      { x: -0.5, y: 0.42, z: 0.5 },
      { x: 0.5, y: 0.42, z: 0.5 },
      { x: -0.5, y: 0.42, z: -0.5 },
      { x: 0.5, y: 0.42, z: -0.5 },
      { x: -0.5, y: -0.42, z: 0.5 },
      { x: 0.5, y: -0.42, z: 0.5 },
      { x: -0.5, y: -0.42, z: -0.5 },
      { x: 0.5, y: -0.42, z: -0.5 },
    ]

    offsets.forEach((pos, idx) => {
      const brickGroup = new THREE.Group()
      brickGroup.position.set(pos.x, pos.y, pos.z)
      brickGroup.userData = {
        index: idx,
        basePos: new THREE.Vector3(pos.x, pos.y, pos.z),
        explodeDir: new THREE.Vector3(
          pos.x > 0 ? 0.75 : -0.75,
          pos.y > 0 ? 0.65 : -0.65,
          pos.z > 0 ? 0.75 : -0.75
        ),
      }

      // Material with tactile Lego satin sheen
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(currentColorsRef.current[idx] || '#FF4757'),
        roughness: 0.18,
        metalness: 0.04,
        clearcoat: 0.5,
        clearcoatRoughness: 0.12,
        reflectivity: 0.8,
      })
      brickMaterials.push(mat)

      // Main Brick Body
      const bodyMesh = new THREE.Mesh(boxGeo, mat)
      bodyMesh.castShadow = true
      bodyMesh.receiveShadow = true
      brickGroup.add(bodyMesh)

      // Top 4 Studs (Only on bricks, giving authentic Lego tactile feel)
      const studOffset = 0.23
      const studPositions = [
        [-studOffset, studOffset],
        [studOffset, studOffset],
        [-studOffset, -studOffset],
        [studOffset, -studOffset],
      ]

      studPositions.forEach(([sx, sz]) => {
        const studMesh = new THREE.Mesh(studGeo, mat)
        studMesh.position.set(sx, brickHeight / 2 + studHeight / 2, sz)
        studMesh.castShadow = true
        studMesh.receiveShadow = true
        brickGroup.add(studMesh)
      })

      legoCluster.add(brickGroup)
      brickGroups.push(brickGroup)
    })

    brickMeshesRef.current = brickGroups

    // Raycaster for Hover and Click detection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-100, -100)

    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let rotX = 0
    let rotY = 0
    let targetRotX = 0
    let targetRotY = 0

    // Hover detection
    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        targetRotY += deltaX * 0.008
        targetRotX += deltaY * 0.008
        prevMouseX = e.clientX
        prevMouseY = e.clientY
      } else {
        // Subtle tilt parallax when hovering
        targetRotY = THREE.MathUtils.lerp(targetRotY, mouse.x * 0.25, 0.05)
        targetRotX = THREE.MathUtils.lerp(targetRotX, -mouse.y * 0.2, 0.05)
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
      const allMeshes: THREE.Object3D[] = []
      brickGroups.forEach((g) => allMeshes.push(...g.children))
      const intersects = raycaster.intersectObjects(allMeshes)

      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent as THREE.Group
        if (hitGroup && typeof hitGroup.userData.index === 'number') {
          const idx = hitGroup.userData.index
          if (LEGO_MODULES[idx]) {
            setSelectedModule(LEGO_MODULES[idx])
          }
        }
      }
    }

    const dom = renderer.domElement
    dom.addEventListener('pointermove', onPointerMove)
    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    dom.addEventListener('click', onClick)

    // Animation loop
    let frameId: number

    const animate = () => {
      frameId = requestAnimationFrame(animate)

      // Smooth damped rotation
      rotX = THREE.MathUtils.lerp(rotX, targetRotX, 0.08)
      rotY = THREE.MathUtils.lerp(rotY, targetRotY, 0.08)
      legoCluster.rotation.x = rotX
      legoCluster.rotation.y = rotY

      // Raycast for hover state
      raycaster.setFromCamera(mouse, camera)
      const allMeshes: THREE.Object3D[] = []
      brickGroups.forEach((g) => allMeshes.push(...g.children))
      const intersects = raycaster.intersectObjects(allMeshes)

      let currentHoveredIdx: number | null = null
      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent as THREE.Group
        if (hitGroup && typeof hitGroup.userData.index === 'number') {
          currentHoveredIdx = hitGroup.userData.index
        }
      }
      setHoveredIndex(currentHoveredIdx)

      // Update position of each brick (Normal vs Exploded vs Hovered)
      const exploded = explodedRef.current
      brickGroups.forEach((group, idx) => {
        const base = group.userData.basePos as THREE.Vector3
        const explodeDir = group.userData.explodeDir as THREE.Vector3

        let targetPos = base.clone()

        if (exploded) {
          // Floating apart in space
          targetPos.add(explodeDir)
        }

        if (currentHoveredIdx === idx) {
          // Elevate hovered brick with tactile lift
          targetPos.add(explodeDir.clone().multiplyScalar(0.35))
          group.scale.lerp(new THREE.Vector3(1.06, 1.06, 1.06), 0.15)
        } else {
          group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15)
        }

        group.position.lerp(targetPos, 0.1)

        // Subtle floating breathing motion when exploded
        if (exploded) {
          const time = Date.now() * 0.0015
          group.position.y += Math.sin(time + idx) * 0.002
        }
      })

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
      renderer.dispose()
      boxGeo.dispose()
      studGeo.dispose()
      brickMaterials.forEach((m) => m.dispose())
      if (container.contains(dom)) {
        container.removeChild(dom)
      }
    }
  }, [])

  // Sync color palette changes smoothly
  useEffect(() => {
    const colors = PALETTES[paletteIndex].colors
    brickMeshesRef.current.forEach((group, idx) => {
      group.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
          child.material.color.set(colors[idx] || '#FF4757')
        }
      })
    })
  }, [paletteIndex])

  const handleCyclePalette = () => {
    setPaletteIndex((prev) => (prev + 1) % PALETTES.length)
  }

  const handleToggleExplode = () => {
    setIsExploded((prev) => !prev)
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 3D Canvas Container */}
      <div className="relative w-full h-[400px] sm:h-[450px] flex items-center justify-center">
        {/* Soft background radial glow tinted with selected block's color */}
        <div
          className="absolute w-64 h-64 rounded-full blur-[100px] opacity-25 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: selectedModule.color }}
        />

        {/* The 3D Mount */}
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
          title="Click any Lego block to inspect it. Drag to tilt."
        />

        {/* Minimal Floating Action Controls (Top right corner of the canvas) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleExplode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all backdrop-blur-md border ${
              isExploded
                ? 'bg-cyan-500 text-slate-950 font-semibold border-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'bg-white/[0.06] text-slate-200 hover:bg-white/[0.12] border-white/[0.12]'
            }`}
            title="Separate all Lego blocks to see internal structure"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Snap Together' : 'Disassemble'}</span>
          </button>

          <button
            type="button"
            onClick={handleCyclePalette}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.12] transition-all backdrop-blur-md"
            title={`Switch Color Theme: currently ${PALETTES[paletteIndex].name}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>

        {/* Interaction Hint (Top left) */}
        <div className="absolute top-3 left-3 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive 8-Block Lego Matrix</span>
        </div>
      </div>

      {/* Tactile Lego Block Inspector Card */}
      <div className="w-full px-2 sm:px-4 -mt-2 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedModule.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full p-4 rounded-2xl bg-[#090d18]/90 border border-white/[0.12] backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              {/* Vibrant Lego Color Block Indicator with tactile studs icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md relative overflow-hidden"
                style={{ backgroundColor: selectedModule.color }}
              >
                {/* 2 miniature white dots representing Lego studs */}
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {selectedModule.name}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 border border-white/[0.08]">
                    {selectedModule.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedModule.desc}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedModule.feature}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
              <a
                href="#projects"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.12] text-xs font-semibold tracking-wide text-center transition-all"
              >
                See Project
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Click Strip: 8 colored mini-blocks so mobile users can easily tap any block */}
        <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto py-1">
          {LEGO_MODULES.map((mod, idx) => {
            const isSelected = selectedModule.id === mod.id
            const isHovered = hoveredIndex === idx
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModule(mod)}
                className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-all ${
                  isSelected
                    ? 'bg-white/[0.12] border-white/40 text-white font-semibold shadow-sm'
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.07]'
                }`}
                title={mod.name}
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0 transition-transform duration-200"
                  style={{
                    backgroundColor: currentColorsRef.current[idx] || mod.color,
                    transform: isSelected || isHovered ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
                <span className="hidden md:inline">{mod.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
