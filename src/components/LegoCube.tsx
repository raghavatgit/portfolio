import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/context/ThemeContext'

// Procedural Audio Synthesizer for Tactile Physics
class SoundEngine {
  private ctx: AudioContext | null = null
  public enabled = true

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playTick(freq = 1400) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.02)
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.02)
    } catch {}
  }

  playChime(noteIdx = 0) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      // Pentatonic harmony across 8 Lego pieces: C5, D5, E5, G5, A5, C6, D6, E6
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51]
      const freq = notes[noteIdx % notes.length]
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.35)
    } catch {}
  }

  playExplode() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(800, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.14)
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.14)
    } catch {}
  }
}

const sfx = new SoundEngine()

// 8 Hyper-Vibrant Neon Cyber Colors for the 8 Lego Bricks
const VIBRANT_BRICK_COLORS = [
  '#FF1853', // 0: Laser Neon Crimson
  '#0066FF', // 1: Electric Cobalt
  '#00F5FF', // 2: Hyper Cyber Cyan
  '#00FF88', // 3: Radioactive Emerald
  '#FFAA00', // 4: Solar Gold Amber
  '#9D00FF', // 5: Ultra Electric Violet
  '#FF007F', // 6: Vivid Hot Magenta
  '#00D4FF', // 7: Glacier Sky Blue
]

export function LegoCube() {
  const mountRef = useRef<HTMLDivElement>(null)
  const isExplodedRef = useRef(false)
  const topTwistRef = useRef(0)
  const targetTopTwistRef = useRef(0)
  const { colorScheme, theme } = useTheme()
  const colorSchemeRef = useRef(colorScheme)
  colorSchemeRef.current = colorScheme
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene & Perspective Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(4.5, 3.8, 4.5)
    camera.lookAt(0, 0, 0)

    // Renderer
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
    renderer.toneMappingExposure = 1.35
    container.appendChild(renderer.domElement)

    // Master Group
    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    const topLayerGroup = new THREE.Group()
    const bottomLayerGroup = new THREE.Group()
    masterGroup.add(topLayerGroup)
    masterGroup.add(bottomLayerGroup)

    // Vibrant Multi-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambientLight)

    // Key Directional Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5)
    keyLight.position.set(7, 11, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.0001
    scene.add(keyLight)

    // Vibrant Cyan Rim Light
    const cyanRim = new THREE.DirectionalLight(0x00f5ff, 3.2)
    cyanRim.position.set(-8, -4, -6)
    scene.add(cyanRim)

    // Vibrant Magenta Bounce Light
    const magentaRim = new THREE.DirectionalLight(0xff007f, 2.8)
    magentaRim.position.set(6, -5, -7)
    scene.add(magentaRim)

    // Point Light from Top for High-Gloss Specular Reflections
    const specularLight = new THREE.PointLight(0xffffff, 2.5, 14)
    specularLight.position.set(0, 6, 0)
    scene.add(specularLight)

    // Central Glowing Quantum Core
    const coreGeo = new THREE.IcosahedronGeometry(0.38, 2)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 1.1,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.95,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    masterGroup.add(coreMesh)

    // Core Wireframe Halo
    const haloGeo = new THREE.IcosahedronGeometry(0.5, 1)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    coreMesh.add(haloMesh)

    // Glowing Particle Field (Sparks orbiting the cube)
    const particleCount = 180
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    const pColor1 = new THREE.Color('#00F5FF')
    const pColor2 = new THREE.Color('#FF007F')

    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 0.7 + Math.random() * 2.0
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      particlePos[i] = r * Math.sin(phi) * Math.cos(theta)
      particlePos[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      particlePos[i + 2] = r * Math.cos(phi)

      const mixed = pColor1.clone().lerp(pColor2, Math.random())
      particleColors[i] = mixed.r
      particleColors[i + 1] = mixed.g
      particleColors[i + 2] = mixed.b
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
    const particleCloud = new THREE.Points(particleGeo, particleMat)
    masterGroup.add(particleCloud)

    // Architectural Lego Brick Geometries with Rich Physical Detail
    const brickSize = 0.94
    const brickHeight = 0.76
    const studRadius = 0.15
    const studHeight = 0.14
    const tubeRadius = 0.22
    const tubeHeight = 0.12

    // Main Brick Body
    const boxGeo = new THREE.BoxGeometry(brickSize, brickHeight, brickSize, 2, 2, 2)
    // Stud Geometry (Cylinder)
    const studGeo = new THREE.CylinderGeometry(studRadius, studRadius, studHeight, 28)
    // Embossed Lego Stud Ring
    const studRingGeo = new THREE.TorusGeometry(studRadius * 0.72, 0.022, 12, 24)
    // Bottom Anti-Stud Socket Tube
    const tubeGeo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeHeight, 24, 1, true)

    const brickGroups: THREE.Group[] = []
    const brickMaterials: THREE.MeshPhysicalMaterial[] = []

    const positions = [
      // Top layer (Y > 0)
      { x: -0.5, y: 0.43, z: 0.5, isTop: true },
      { x: 0.5, y: 0.43, z: 0.5, isTop: true },
      { x: -0.5, y: 0.43, z: -0.5, isTop: true },
      { x: 0.5, y: 0.43, z: -0.5, isTop: true },
      // Bottom layer (Y < 0)
      { x: -0.5, y: -0.43, z: 0.5, isTop: false },
      { x: 0.5, y: -0.43, z: 0.5, isTop: false },
      { x: -0.5, y: -0.43, z: -0.5, isTop: false },
      { x: 0.5, y: -0.43, z: -0.5, isTop: false },
    ]

    positions.forEach((pos, idx) => {
      const bGroup = new THREE.Group()
      bGroup.position.set(pos.x, pos.y, pos.z)
      bGroup.userData = {
        index: idx,
        isTop: pos.isTop,
        basePos: new THREE.Vector3(pos.x, pos.y, pos.z),
        explodeDir: new THREE.Vector3(
          pos.x > 0 ? 0.95 : -0.95,
          pos.y > 0 ? 0.85 : -0.85,
          pos.z > 0 ? 0.95 : -0.95
        ),
        elasticOffset: new THREE.Vector3(0, 0, 0),
        elasticVelocity: new THREE.Vector3(0, 0, 0),
        spinVelocity: 0,
        isHovered: false,
      }

      const baseColor = new THREE.Color(VIBRANT_BRICK_COLORS[idx])

      // Ultra-Glossy Lacquered Lego Plastic Material with Clearcoat Reflections
      const mat = new THREE.MeshPhysicalMaterial({
        color: baseColor,
        roughness: 0.08,
        metalness: 0.06,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 1.0,
        emissive: baseColor,
        emissiveIntensity: 0.12,
      })
      brickMaterials.push(mat)

      // Main Brick Chassis
      const body = new THREE.Mesh(boxGeo, mat)
      body.castShadow = true
      body.receiveShadow = true
      bGroup.add(body)

      // 4 Physical Studs on top of each brick
      const studOffset = 0.24
      const studs = [
        [-studOffset, studOffset],
        [studOffset, studOffset],
        [-studOffset, -studOffset],
        [studOffset, -studOffset],
      ]

      studs.forEach(([sx, sz]) => {
        // Stud Pillar
        const stud = new THREE.Mesh(studGeo, mat)
        stud.position.set(sx, brickHeight / 2 + studHeight / 2, sz)
        stud.castShadow = true
        stud.receiveShadow = true
        bGroup.add(stud)

        // Embossed Lego Rim on top of Stud
        const studRing = new THREE.Mesh(studRingGeo, mat)
        studRing.rotation.x = Math.PI / 2
        studRing.position.set(sx, brickHeight / 2 + studHeight + 0.005, sz)
        bGroup.add(studRing)
      })

      // Underside Anti-Stud Tube (Architectural Lego Detail)
      const underTube = new THREE.Mesh(tubeGeo, mat)
      underTube.position.set(0, -brickHeight / 2 + tubeHeight / 2, 0)
      bGroup.add(underTube)

      if (pos.isTop) {
        topLayerGroup.add(bGroup)
      } else {
        bottomLayerGroup.add(bGroup)
      }

      brickGroups.push(bGroup)
    })

    // Laser connection lines connecting quantum core to each brick
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const linePositions = new Float32Array(8 * 2 * 3)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat)
    masterGroup.add(lineSegments)

    // Raycaster & Interaction State
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
        // Natural magnetic tilt following cursor
        targetRotY = THREE.MathUtils.lerp(targetRotY, mouse.x * 0.45, 0.08)
        targetRotX = THREE.MathUtils.lerp(targetRotX, -mouse.y * 0.4, 0.08)
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

    // Direct Click on any individual Lego piece: Elastic Recoil, 360 Spin & Musical Pentatonic Chime
    const onClick = () => {
      raycaster.setFromCamera(mouse, camera)
      const allMeshes: THREE.Object3D[] = []
      brickGroups.forEach((g) => allMeshes.push(...g.children))
      const intersects = raycaster.intersectObjects(allMeshes)

      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent as THREE.Group
        if (hitGroup && typeof hitGroup.userData.index === 'number') {
          const idx = hitGroup.userData.index
          // High-energy spring impulse: pop outward!
          hitGroup.userData.elasticVelocity.add(
            hitGroup.userData.explodeDir.clone().multiplyScalar(0.48)
          )
          hitGroup.userData.spinVelocity = 0.45
          sfx.playChime(idx)
        }
      } else {
        // Subtle background tick
        sfx.playTick(1100)
      }
    }

    // Double-Click: Toggle CAD Exploded View
    const onDoubleClick = () => {
      isExplodedRef.current = !isExplodedRef.current
      sfx.playExplode()
    }

    // Context Menu (Right Click): Twist Top Layer 90° with ratchet feel
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      targetTopTwistRef.current += Math.PI / 2
      sfx.playChime(4)
    }

    // Mouse Wheel: Dynamic Perspective Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.003, 3.2, 7.5)
      camera.position.x = camera.position.z
    }

    const dom = renderer.domElement
    dom.addEventListener('pointermove', onPointerMove)
    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    dom.addEventListener('click', onClick)
    dom.addEventListener('dblclick', onDoubleClick)
    dom.addEventListener('contextmenu', onContextMenu)
    dom.addEventListener('wheel', onWheel, { passive: false })

    // Animation & Physics Engine Loop
    let frameId: number
    let clockTime = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      clockTime += 0.024

      // Master Rotation Damping
      rotX = THREE.MathUtils.lerp(rotX, targetRotX, 0.08)
      rotY = THREE.MathUtils.lerp(rotY, targetRotY, 0.08)
      masterGroup.rotation.x = rotX
      masterGroup.rotation.y = rotY

      // Top Layer Twist Interpolation
      topTwistRef.current = THREE.MathUtils.lerp(
        topTwistRef.current,
        targetTopTwistRef.current,
        0.14
      )
      topLayerGroup.rotation.y = topTwistRef.current

      // Quantum Core Rotation & Dynamic Pulsing
      coreMesh.rotation.y += 0.025
      coreMesh.rotation.x += 0.018
      const corePulse = 1 + Math.sin(clockTime * 2.8) * 0.1
      coreMesh.scale.set(corePulse, corePulse, corePulse)
      haloMesh.rotation.z -= 0.012

      // Dynamically adapt studio rim light colors based on selected scheme
      if (colorSchemeRef.current === 'solar') {
        cyanRim.color.setHex(0xffa502)
        magentaRim.color.setHex(0xff4757)
      } else if (colorSchemeRef.current === 'aurora') {
        cyanRim.color.setHex(0x00ff88)
        magentaRim.color.setHex(0x00f5ff)
      } else if (colorSchemeRef.current === 'violet') {
        cyanRim.color.setHex(0xa855f7)
        magentaRim.color.setHex(0xff007f)
      } else {
        cyanRim.color.setHex(0x00f5ff)
        magentaRim.color.setHex(0xff007f)
      }

      // Orbiting Spark Swirl
      particleCloud.rotation.y -= 0.005
      particleCloud.rotation.z += 0.003

      // Hover Raycasting
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

      if (currentHoveredIdx !== null && currentHoveredIdx !== lastHoveredIdx) {
        sfx.playTick(1600)
      }
      lastHoveredIdx = currentHoveredIdx

      // Kinetic Physics & Spring-Mass Dynamics
      const isExploded = isExplodedRef.current
      const linePosAttr = lineSegments.geometry.attributes.position as THREE.BufferAttribute

      brickGroups.forEach((group, idx) => {
        const base = group.userData.basePos as THREE.Vector3
        const explodeDir = group.userData.explodeDir as THREE.Vector3
        const mat = brickMaterials[idx]

        let target = base.clone()

        if (isExploded) {
          // Exploded view with floating breathing oscillation
          target.add(explodeDir)
          target.y += Math.sin(clockTime * 2.2 + idx) * 0.045
        } else {
          // Subtle zero-gravity kinetic floating
          target.y += Math.sin(clockTime * 1.8 + idx * 0.7) * 0.035
        }

        // Magnetic Proximity Lift & Emissive Flare on Hover
        if (currentHoveredIdx === idx) {
          target.add(explodeDir.clone().multiplyScalar(0.42))
          group.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.22)
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.55, 0.2)
        } else {
          group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.22)
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.12, 0.1)
        }

        // Spring-Mass Hooke's Law Physics for Elastic Recoil
        const springForce = group.userData.elasticOffset.clone().multiplyScalar(-0.2)
        group.userData.elasticVelocity.add(springForce)
        group.userData.elasticVelocity.multiplyScalar(0.86) // damping
        group.userData.elasticOffset.add(group.userData.elasticVelocity)

        target.add(group.userData.elasticOffset)
        group.position.lerp(target, 0.14)

        // Spin Decay
        if (group.userData.spinVelocity > 0.001) {
          group.rotation.y += group.userData.spinVelocity
          group.userData.spinVelocity *= 0.92
        } else {
          group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, 0.1)
        }

        // Connecting Laser Lines in Exploded Mode
        if (linePosAttr) {
          linePosAttr.setXYZ(idx * 2, 0, 0, 0)
          const worldPos = group.position.clone()
          if (group.userData.isTop) {
            worldPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), topTwistRef.current)
          }
          linePosAttr.setXYZ(idx * 2 + 1, worldPos.x, worldPos.y, worldPos.z)
        }
      })

      // Update Laser Lines
      const targetLineOpacity = isExploded ? 0.55 : 0
      lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, targetLineOpacity, 0.12)
      linePosAttr.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Resize Handler
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
      dom.removeEventListener('contextmenu', onContextMenu)
      dom.removeEventListener('wheel', onWheel)
      renderer.dispose()
      boxGeo.dispose()
      studGeo.dispose()
      studRingGeo.dispose()
      tubeGeo.dispose()
      coreGeo.dispose()
      haloGeo.dispose()
      particleGeo.dispose()
      lineGeo.dispose()
      brickMaterials.forEach((m) => m.dispose())
      if (container.contains(dom)) {
        container.removeChild(dom)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center select-none overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Direct 3D Lego Physics: Click piece to recoil & chime · Drag to orbit · Double-click to explode CAD view · Right-click to twist layer"
      />

      {/* Clean Interaction Legend: No sloppy rounded boxes, no pulsating dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 select-none pointer-events-none">
        <span className="text-cyan-600 dark:text-cyan-300">Click piece to recoil</span>
        <span className="text-slate-300 dark:text-white/20">/</span>
        <span>Double-click to explode</span>
        <span className="text-slate-300 dark:text-white/20">/</span>
        <span>Drag to rotate</span>
      </div>
    </div>
  )
}
