import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Procedural Audio Synthesizer
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
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
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
      // Pentatonic harmony: C5, D5, E5, G5, A5, C6, D6, E6
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51]
      const freq = notes[noteIdx % notes.length]
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.38)
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
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.12)
    } catch {}
  }
}

const sfx = new SoundEngine()

// 8 Base Hue Offsets for constantly flowing colors
const HUE_OFFSETS = [0.0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.87]

export function LegoCube() {
  const mountRef = useRef<HTMLDivElement>(null)
  const isExplodedRef = useRef(false)
  const topTwistRef = useRef(0)
  const targetTopTwistRef = useRef(0)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene & Perspective Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(4.6, 3.8, 4.6)
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
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // Master Group
    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    const topLayerGroup = new THREE.Group()
    const bottomLayerGroup = new THREE.Group()
    masterGroup.add(topLayerGroup)
    masterGroup.add(bottomLayerGroup)

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
    keyLight.position.set(6, 10, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.0001
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x70d6ff, 1.5)
    fillLight.position.set(-6, -3, -5)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xffffff, 2.8, 16)
    rimLight.position.set(0, 6, 0)
    scene.add(rimLight)

    // Central Glowing Quantum Core
    const coreGeo = new THREE.IcosahedronGeometry(0.36, 2)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.92,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    masterGroup.add(coreMesh)

    // Core Wireframe Halo
    const haloGeo = new THREE.IcosahedronGeometry(0.48, 1)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    coreMesh.add(haloMesh)

    // Particle Swarm
    const particleCount = 140
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 0.6 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      particlePos[i] = r * Math.sin(phi) * Math.cos(theta)
      particlePos[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      particlePos[i + 2] = r * Math.cos(phi)
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const particleCloud = new THREE.Points(particleGeo, particleMat)
    masterGroup.add(particleCloud)

    // 8 Lego Bricks
    const brickSize = 0.92
    const brickHeight = 0.76
    const studRadius = 0.14
    const studHeight = 0.13

    const boxGeo = new THREE.BoxGeometry(brickSize, brickHeight, brickSize)
    const studGeo = new THREE.CylinderGeometry(studRadius, studRadius, studHeight, 24)

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
          pos.x > 0 ? 0.85 : -0.85,
          pos.y > 0 ? 0.8 : -0.8,
          pos.z > 0 ? 0.85 : -0.85
        ),
        elasticOffset: new THREE.Vector3(0, 0, 0),
        elasticVelocity: new THREE.Vector3(0, 0, 0),
        spinVelocity: 0,
      }

      // Satin, clearcoat physical material with chromatic sheen
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(HUE_OFFSETS[idx], 0.9, 0.55),
        roughness: 0.14,
        metalness: 0.05,
        clearcoat: 0.9,
        clearcoatRoughness: 0.08,
        reflectivity: 0.95,
      })
      brickMaterials.push(mat)

      // Main Block Body
      const body = new THREE.Mesh(boxGeo, mat)
      body.castShadow = true
      body.receiveShadow = true
      bGroup.add(body)

      // 4 Physical Studs on top
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
        bGroup.add(stud)
      })

      if (pos.isTop) {
        topLayerGroup.add(bGroup)
      } else {
        bottomLayerGroup.add(bGroup)
      }

      brickGroups.push(bGroup)
    })

    // Laser lines connecting core to bricks in exploded view
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    const linePositions = new Float32Array(8 * 2 * 3)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat)
    masterGroup.add(lineSegments)

    // Raycaster & Pointer Interaction Physics
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-100, -100)

    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let rotX = 0.08
    let rotY = 0.08
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
        // Natural magnetic tilt towards cursor
        targetRotY = THREE.MathUtils.lerp(targetRotY, mouse.x * 0.4, 0.06)
        targetRotX = THREE.MathUtils.lerp(targetRotX, -mouse.y * 0.35, 0.06)
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

    // Direct Click on Brick: Elastic Recoil, 360 Spin & Musical Harmony
    const onClick = () => {
      raycaster.setFromCamera(mouse, camera)
      const allMeshes: THREE.Object3D[] = []
      brickGroups.forEach((g) => allMeshes.push(...g.children))
      const intersects = raycaster.intersectObjects(allMeshes)

      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent as THREE.Group
        if (hitGroup && typeof hitGroup.userData.index === 'number') {
          const idx = hitGroup.userData.index
          // Elastic spring impulse: pop outward!
          hitGroup.userData.elasticVelocity.add(
            hitGroup.userData.explodeDir.clone().multiplyScalar(0.4)
          )
          hitGroup.userData.spinVelocity = 0.4
          sfx.playChime(idx)
        }
      } else {
        sfx.playTick(900)
      }
    }

    // Double-Click: Toggle CAD Exploded View directly
    const onDoubleClick = () => {
      isExplodedRef.current = !isExplodedRef.current
      sfx.playExplode()
    }

    // Context Menu (Right Click): Twist Top Layer 90 degrees
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      targetTopTwistRef.current += Math.PI / 2
      sfx.playChime(4)
    }

    const dom = renderer.domElement
    dom.addEventListener('pointermove', onPointerMove)
    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    dom.addEventListener('click', onClick)
    dom.addEventListener('dblclick', onDoubleClick)
    dom.addEventListener('contextmenu', onContextMenu)

    // Animation & Physics Engine Loop
    let frameId: number
    let clockTime = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      clockTime += 0.022

      // Rotation Damping
      rotX = THREE.MathUtils.lerp(rotX, targetRotX, 0.08)
      rotY = THREE.MathUtils.lerp(rotY, targetRotY, 0.08)
      masterGroup.rotation.x = rotX
      masterGroup.rotation.y = rotY

      // Top Layer Twist Interpolation
      topTwistRef.current = THREE.MathUtils.lerp(
        topTwistRef.current,
        targetTopTwistRef.current,
        0.12
      )
      topLayerGroup.rotation.y = topTwistRef.current

      // Quantum Core Rotation & Dynamic Pulsing
      coreMesh.rotation.y += 0.022
      coreMesh.rotation.x += 0.015
      const corePulse = 1 + Math.sin(clockTime * 2.5) * 0.09
      coreMesh.scale.set(corePulse, corePulse, corePulse)
      haloMesh.rotation.z -= 0.01

      // Particle Cloud Swirl
      particleCloud.rotation.y -= 0.004
      particleCloud.rotation.z += 0.002

      // Continuously Flowing Lively Colors across the bricks
      brickMaterials.forEach((mat, idx) => {
        // Continuous hue wave
        const flowingHue = (clockTime * 0.04 + HUE_OFFSETS[idx]) % 1.0
        mat.color.setHSL(flowingHue, 0.92, 0.56)
      })

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
        sfx.playTick(1500)
      }
      lastHoveredIdx = currentHoveredIdx

      // Kinetic Physics & Spring-Mass Dynamics
      const isExploded = isExplodedRef.current
      const linePosAttr = lineSegments.geometry.attributes.position as THREE.BufferAttribute

      brickGroups.forEach((group, idx) => {
        const base = group.userData.basePos as THREE.Vector3
        const explodeDir = group.userData.explodeDir as THREE.Vector3

        let target = base.clone()

        if (isExploded) {
          // Exploded view with floating breathing oscillation
          target.add(explodeDir)
          target.y += Math.sin(clockTime * 2.2 + idx) * 0.04
        } else {
          // Subtle zero-gravity kinetic floating
          target.y += Math.sin(clockTime * 1.8 + idx * 0.7) * 0.03
        }

        // Magnetic Proximity Lift when hovered
        if (currentHoveredIdx === idx) {
          target.add(explodeDir.clone().multiplyScalar(0.38))
          group.scale.lerp(new THREE.Vector3(1.08, 1.08, 1.08), 0.2)
        } else {
          group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2)
        }

        // Spring-Mass Hooke's Law Physics for Elastic Recoil
        const springForce = group.userData.elasticOffset.clone().multiplyScalar(-0.18)
        group.userData.elasticVelocity.add(springForce)
        group.userData.elasticVelocity.multiplyScalar(0.85) // damping
        group.userData.elasticOffset.add(group.userData.elasticVelocity)

        target.add(group.userData.elasticOffset)
        group.position.lerp(target, 0.12)

        // Spin Decay
        if (group.userData.spinVelocity > 0.001) {
          group.rotation.y += group.userData.spinVelocity
          group.userData.spinVelocity *= 0.93
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
      const targetLineOpacity = isExploded ? 0.45 : 0
      lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, targetLineOpacity, 0.1)
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
      renderer.dispose()
      boxGeo.dispose()
      studGeo.dispose()
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
      {/* Dynamic Ambient Fluid Backlight */}
      <div className="pointer-events-none absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Direct 3D Physics: Click brick to spring-bounce · Drag to rotate · Double-click to explode"
      />

      {/* Discreet Kinetic Gesture Legend (Zero buttons, pure kinetic hint) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#080b16]/75 border border-white/[0.08] backdrop-blur-xl text-[10px] font-mono text-slate-400 pointer-events-none select-none">
        <span className="flex items-center gap-1 text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Click to recoil</span>
        </span>
        <span className="text-white/20">·</span>
        <span>Double-click to explode</span>
        <span className="text-white/20">·</span>
        <span>Drag to orbit</span>
      </div>
    </div>
  )
}
