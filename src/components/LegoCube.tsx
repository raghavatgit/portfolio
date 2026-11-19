import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/context/ThemeContext'
import { sfx } from '@/utils/sfx'

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
  const propagateRef = useRef<(idx: number) => void>(() => {})
  const actionsRef = useRef<{ explode: () => void; twist: () => void; wave: () => void }>({
    explode: () => {},
    twist: () => {},
    wave: () => {},
  })
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

    // 3D Stage Pedestal: Grounded architectural compass rings beneath the floating cube
    const stageGroup = new THREE.Group()
    stageGroup.position.y = -2.05
    scene.add(stageGroup)

    const outerRingGeo = new THREE.RingGeometry(2.15, 2.18, 64)
    outerRingGeo.rotateX(-Math.PI / 2)
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    })
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat)
    stageGroup.add(outerRingMesh)

    const innerRingGeo = new THREE.RingGeometry(1.38, 1.40, 48)
    innerRingGeo.rotateX(-Math.PI / 2)
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    })
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat)
    stageGroup.add(innerRingMesh)

    const crosshairPts: number[] = []
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      crosshairPts.push(Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4, Math.cos(a) * 2.35, 0, Math.sin(a) * 2.35)
    }
    const stageTicksGeo = new THREE.BufferGeometry()
    stageTicksGeo.setAttribute('position', new THREE.Float32BufferAttribute(crosshairPts, 3))
    const stageTicksMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.24 })
    const stageTicks = new THREE.LineSegments(stageTicksGeo, stageTicksMat)
    stageGroup.add(stageTicks)

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
          propagateRef.current(idx)
        }
      } else {
        // Subtle background tick
        sfx.playTick(1100)
      }
    }

    // Double-Click: Toggle CAD Exploded View
    const onDoubleClick = () => {
      isExplodedRef.current = !isExplodedRef.current
      sfx.playExplode(isExplodedRef.current)
    }

    // Context Menu (Right Click): Twist Top Layer 90° with ratchet feel
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      targetTopTwistRef.current += Math.PI / 2
      sfx.playSnap(1950)
    }

    // 3D wave propagation: impulse travels to bricks sharing a face (differ on exactly one axis)
    const neighborsOf = (idx: number) => {
      const a = brickGroups[idx].userData.basePos as THREE.Vector3
      return brickGroups.filter((g, j) => {
        if (j === idx) return false
        const b = g.userData.basePos as THREE.Vector3
        const diff = Number(Math.sign(a.x) !== Math.sign(b.x)) + Number(Math.sign(a.y) !== Math.sign(b.y)) + Number(Math.sign(a.z) !== Math.sign(b.z))
        return diff === 1
      })
    }
    const timers: number[] = []
    const kick = (g: THREE.Group, s: number) => {
      g.userData.elasticVelocity.add((g.userData.explodeDir as THREE.Vector3).clone().multiplyScalar(s))
    }
    propagateRef.current = (idx: number) => {
      neighborsOf(idx).forEach((g) => timers.push(window.setTimeout(() => kick(g, 0.2), 38)))
    }
    actionsRef.current = {
      explode: () => {
        isExplodedRef.current = !isExplodedRef.current
        sfx.playExplode(isExplodedRef.current)
      },
      twist: () => {
        targetTopTwistRef.current += Math.PI / 2
        sfx.playSnap(1950)
      },
      wave: () => {
        // Ripple across the cube in Gray-code order so each step moves to a face neighbor
        const order = [0, 1, 3, 2, 6, 7, 5, 4]
        order.forEach((idx, step) => {
          timers.push(
            window.setTimeout(() => {
              kick(brickGroups[idx], 0.34)
              brickGroups[idx].userData.spinVelocity = 0.25
              sfx.playChime(step)
            }, step * 44)
          )
        })
      },
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
    let scrollFactor = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      clockTime += 0.024

      const rawScroll = Math.min(1, Math.max(0, window.scrollY / 620))
      scrollFactor = THREE.MathUtils.lerp(scrollFactor, rawScroll, 0.085)

      // Master Rotation Damping + Scroll Choreography
      rotX = THREE.MathUtils.lerp(rotX, targetRotX, 0.08)
      rotY = THREE.MathUtils.lerp(rotY, targetRotY, 0.08)
      masterGroup.rotation.x = rotX + scrollFactor * 0.22
      masterGroup.rotation.y = rotY + scrollFactor * 0.85
      camera.position.y = 3.8 + scrollFactor * 0.95
      camera.lookAt(0, -scrollFactor * 0.15, 0)

      // Top Layer Twist Interpolation (manual right-click + scroll spin)
      topTwistRef.current = THREE.MathUtils.lerp(
        topTwistRef.current,
        targetTopTwistRef.current + scrollFactor * (Math.PI * 0.5),
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

      outerRingMat.color.copy(cyanRim.color)
      innerRingMat.color.copy(magentaRim.color)
      outerRingMat.opacity = themeRef.current === 'light' ? 0.34 : 0.24
      innerRingMat.opacity = themeRef.current === 'light' ? 0.26 : 0.18
      stageGroup.rotation.y = rotY * 0.35 + clockTime * 0.04

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
          // Scroll expands bricks smoothly apart in 3D space even before manual click
          if (scrollFactor > 0.01) {
            target.add(explodeDir.clone().multiplyScalar(scrollFactor * 0.85))
          }
          // Subtle zero-gravity kinetic floating
          target.y += Math.sin(clockTime * 1.8 + idx * 0.7) * 0.035
        }

        // Magnetic Proximity Lift & Emissive Flare on Hover, with sympathetic lift on face neighbors
        const hoveredBase =
          currentHoveredIdx !== null ? (brickGroups[currentHoveredIdx].userData.basePos as THREE.Vector3) : null
        const isNeighbor =
          hoveredBase !== null &&
          currentHoveredIdx !== idx &&
          Number(Math.sign(hoveredBase.x) !== Math.sign(base.x)) +
            Number(Math.sign(hoveredBase.y) !== Math.sign(base.y)) +
            Number(Math.sign(hoveredBase.z) !== Math.sign(base.z)) ===
            1
        if (currentHoveredIdx === idx) {
          target.add(explodeDir.clone().multiplyScalar(0.42))
          group.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.22)
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.55, 0.2)
        } else if (isNeighbor) {
          target.add(explodeDir.clone().multiplyScalar(0.12))
          group.scale.lerp(new THREE.Vector3(1.03, 1.03, 1.03), 0.18)
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.24, 0.15)
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

      // Update Laser Lines (visible when opened manually OR during scroll disassembly)
      const targetLineOpacity = isExploded ? 0.55 : Math.min(0.45, scrollFactor * 0.65)
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
      timers.forEach((t) => window.clearTimeout(t))
      renderer.dispose()
      boxGeo.dispose()
      studGeo.dispose()
      studRingGeo.dispose()
      tubeGeo.dispose()
      coreGeo.dispose()
      haloGeo.dispose()
      particleGeo.dispose()
      lineGeo.dispose()
      outerRingGeo.dispose()
      outerRingMat.dispose()
      innerRingGeo.dispose()
      innerRingMat.dispose()
      stageTicksGeo.dispose()
      stageTicksMat.dispose()
      brickMaterials.forEach((m) => m.dispose())
      if (container.contains(dom)) {
        container.removeChild(dom)
      }
    }
  }, [])

  return (
    <div className="relative flex h-[520px] w-full select-none items-center justify-center overflow-hidden sm:h-[580px]">
      {/* Precision corner alignment brackets around 3D stage */}
      <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 border-l border-t border-slate-300 dark:border-white/20" />
      <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 border-r border-t border-slate-300 dark:border-white/20" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-2 h-3.5 w-3.5 border-b border-l border-slate-300 dark:border-white/20" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 right-2 h-3.5 w-3.5 border-b border-r border-slate-300 dark:border-white/20" />

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="relative z-10 h-full w-full cursor-grab active:cursor-grabbing"
        title="Click a piece to bounce · Drag to spin · Double-click to open up · Right-click to twist"
      />

      {/* Legend: each verb is a quiet text trigger, no boxes */}
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 select-none items-center gap-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
        {(
          [
            ['Open', () => actionsRef.current.explode()],
            ['Twist', () => actionsRef.current.twist()],
            ['Wave', () => actionsRef.current.wave()],
          ] as const
        ).map(([label, run]) => (
          <span key={label} className="flex items-center gap-3">
            <span
              role="button"
              tabIndex={0}
              onClick={run}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), run())}
              className="cursor-pointer border-b border-transparent pb-px transition-colors hover:border-cyan-500 hover:text-cyan-600 focus-visible:border-cyan-500 focus-visible:outline-none dark:hover:text-cyan-300"
            >
              {label}
            </span>
            <span className="text-slate-300 dark:text-white/20">/</span>
          </span>
        ))}
        <span>Drag to orbit</span>
      </div>
    </div>
  )
}
