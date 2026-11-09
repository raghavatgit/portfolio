import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface FaceInfo {
  title: string
  subtitle: string
  tech: string
  color: string
}

const FACES: FaceInfo[] = [
  { title: 'SYSTEMS', subtitle: 'Win32 & DWM Compositor', tech: 'Rust 2021 · C++ · ASLR', color: '#00f0ff' },
  { title: 'STREAMSHIELD', subtitle: 'Real-Time Privacy Engine', tech: 'Tauri v2 · DLL Injection', color: '#6366f1' },
  { title: 'CREATIVE', subtitle: 'Multi-Host Bridges', tech: 'ExtendScript · Fusion Lua', color: '#a855f7' },
  { title: 'NAVDISHTI', subtitle: 'GPS-Denied Dead Reckoning', tech: 'EKF · Temporal ConvNets', color: '#10b981' },
  { title: 'AEGIS MESH', subtitle: 'Ad-Hoc Radio Network', tech: 'ESP32 · LoRa SX1276', color: '#ec4899' },
  { title: 'ARCH & CORE', subtitle: 'High-Performance Runtimes', tech: 'Memory Safety · Standalone', color: '#38bdf8' },
]

export function InteractiveCube() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [activeFace, setActiveFace] = useState<FaceInfo>(FACES[0])
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 4.8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Helper to generate dynamic canvas texture for each face
    function createFaceTexture(face: FaceInfo): THREE.CanvasTexture {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')!

      // Dark glass background
      ctx.fillStyle = '#080a12'
      ctx.fillRect(0, 0, 512, 512)

      // Outer accent border
      ctx.lineWidth = 12
      ctx.strokeStyle = face.color
      ctx.strokeRect(16, 16, 480, 480)

      // Inner corner brackets
      ctx.lineWidth = 6
      ctx.strokeStyle = '#ffffff'
      const corner = 40
      // Top-left
      ctx.beginPath()
      ctx.moveTo(32, 32 + corner)
      ctx.lineTo(32, 32)
      ctx.lineTo(32 + corner, 32)
      ctx.stroke()
      // Top-right
      ctx.beginPath()
      ctx.moveTo(480 - corner, 32)
      ctx.lineTo(480, 32)
      ctx.lineTo(480, 32 + corner)
      ctx.stroke()
      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(32, 480 - corner)
      ctx.lineTo(32, 480)
      ctx.lineTo(32 + corner, 480)
      ctx.stroke()
      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(480 - corner, 480)
      ctx.lineTo(480, 480)
      ctx.lineTo(480, 480 - corner)
      ctx.stroke()

      // Center glowing dot
      ctx.fillStyle = face.color
      ctx.beginPath()
      ctx.arc(256, 120, 16, 0, Math.PI * 2)
      ctx.fill()

      // Title
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 42px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(face.title, 256, 230)

      // Subtitle
      ctx.fillStyle = '#94a3b8'
      ctx.font = '24px "Outfit", sans-serif'
      ctx.fillText(face.subtitle, 256, 290)

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(120, 340)
      ctx.lineTo(392, 340)
      ctx.stroke()

      // Tech Stack Pill
      ctx.fillStyle = face.color
      ctx.font = '600 20px "JetBrains Mono", monospace'
      ctx.fillText(face.tech, 256, 390)

      const texture = new THREE.CanvasTexture(canvas)
      texture.anisotropy = 8
      return texture
    }

    // Create 6 materials for the 6 faces
    const materials = FACES.map((face) => {
      const texture = createFaceTexture(face)
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.96,
        reflectivity: 0.9,
      })
    })

    // Cube Mesh
    const boxGeometry = new THREE.BoxGeometry(2.1, 2.1, 2.1)
    const cube = new THREE.Mesh(boxGeometry, materials)
    scene.add(cube)

    // Outer wireframe cage
    const wireGeo = new THREE.BoxGeometry(2.16, 2.16, 2.16)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const wireframe = new THREE.Mesh(wireGeo, wireMat)
    cube.add(wireframe)

    // Inner glowing sphere core
    const sphereGeo = new THREE.SphereGeometry(0.7, 24, 24)
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    cube.add(sphere)

    // Particle Cloud around the cube
    const particleCount = 200
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6
      particlePos[i + 1] = (Math.random() - 0.5) * 6
      particlePos[i + 2] = (Math.random() - 0.5) * 6
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 10)
    pointLight1.position.set(3, 3, 4)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xa855f7, 2.5, 10)
    pointLight2.position.set(-3, -3, 3)
    scene.add(pointLight2)

    // Drag / Interaction State
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let velX = 0.005
    let velY = 0.006

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      setIsInteracting(true)
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY
      velX = deltaY * 0.006
      velY = deltaX * 0.006
      cube.rotation.x += velX
      cube.rotation.y += velY
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onPointerUp = () => {
      isDragging = false
      setTimeout(() => setIsInteracting(false), 800)
    }

    const dom = renderer.domElement
    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    let frameId: number

    // Determine the face most pointing towards +Z (camera)
    const faceNormals = [
      new THREE.Vector3(1, 0, 0),  // Face 0: Right (+X)
      new THREE.Vector3(-1, 0, 0), // Face 1: Left (-X)
      new THREE.Vector3(0, 1, 0),  // Face 2: Top (+Y)
      new THREE.Vector3(0, -1, 0), // Face 3: Bottom (-Y)
      new THREE.Vector3(0, 0, 1),  // Face 4: Front (+Z)
      new THREE.Vector3(0, 0, -1), // Face 5: Back (-Z)
    ]

    const forward = new THREE.Vector3(0, 0, 1)

    const animate = () => {
      frameId = requestAnimationFrame(animate)

      if (!isDragging) {
        // Natural gentle orbit
        cube.rotation.x += velX
        cube.rotation.y += velY
        // Damping velocity toward steady cruise speed
        velX = THREE.MathUtils.lerp(velX, 0.004, 0.02)
        velY = THREE.MathUtils.lerp(velY, 0.007, 0.02)
      }

      // Rotate sphere core in opposite direction for visual depth
      sphere.rotation.y -= 0.015
      sphere.rotation.x += 0.008

      // Slow particle float
      particles.rotation.y += 0.001

      // Find face closest to camera
      let bestDot = -Infinity
      let bestIndex = 0
      faceNormals.forEach((normal, idx) => {
        const worldNormal = normal.clone().applyQuaternion(cube.quaternion)
        const dot = worldNormal.dot(forward)
        if (dot > bestDot) {
          bestDot = dot
          bestIndex = idx
        }
      })

      if (FACES[bestIndex]) {
        setActiveFace(FACES[bestIndex])
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
      dom.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      renderer.dispose()
      boxGeometry.dispose()
      wireGeo.dispose()
      sphereGeo.dispose()
      particleGeo.dispose()
      materials.forEach((m) => m.dispose())
      if (container.contains(dom)) {
        container.removeChild(dom)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] flex flex-col items-center justify-center select-none">
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Click and drag to rotate the 3D systems cube"
      />

      {/* Dynamic HUD Overlay underneath */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-[#080a14]/90 border border-white/[0.12] backdrop-blur-xl shadow-xl shadow-black/80 pointer-events-none">
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: activeFace.color }}
        />
        <span className="text-xs font-mono font-semibold text-white tracking-wider">
          {activeFace.title}
        </span>
        <span className="text-white/20">|</span>
        <span className="text-[11px] font-mono text-slate-300">
          {activeFace.tech}
        </span>
        <span className="text-white/20 hidden sm:inline">|</span>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          {isInteracting ? 'Controlling Inertia' : 'Drag to Rotate 360°'}
        </span>
      </div>
    </div>
  )
}
