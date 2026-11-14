import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme, type ColorScheme } from '@/context/ThemeContext'

const SCHEME_HEX: Record<ColorScheme, [number, number]> = {
  chromatic: [0x00f0ff, 0x8b5cf6],
  solar: [0xffa502, 0xff4757],
  aurora: [0x00e676, 0x38bdf8],
  violet: [0xa855f7, 0xec4899],
}

export function FlowingBackground() {
  const { theme, colorScheme } = useTheme()
  const isLight = theme === 'light'
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef({ isLight, colorScheme })
  themeRef.current = { isLight, colorScheme }

  useEffect(() => {
    const host = canvasHostRef.current
    if (!host) return

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    let renderer: THREE.WebGLRenderer | null = null

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }

    const width = host.clientWidth || window.innerWidth
    const height = host.clientHeight || window.innerHeight
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100)
    camera.position.set(0, 1.4, 10)

    const worldGroup = new THREE.Group()
    scene.add(worldGroup)

    // Architectural 3D floor & upper coordinate grid planes
    const gridFloor = new THREE.GridHelper(46, 36, 0x00f0ff, 0x334155)
    gridFloor.position.y = -5.2
    const floorMats = Array.isArray(gridFloor.material) ? gridFloor.material : [gridFloor.material]
    floorMats.forEach((m) => {
      m.transparent = true
      m.opacity = 0.14
    })
    worldGroup.add(gridFloor)

    const gridRoof = new THREE.GridHelper(46, 24, 0x8b5cf6, 0x1e293b)
    gridRoof.position.y = 7.4
    const roofMats = Array.isArray(gridRoof.material) ? gridRoof.material : [gridRoof.material]
    roofMats.forEach((m) => {
      m.transparent = true
      m.opacity = 0.08
    })
    worldGroup.add(gridRoof)

    // Floating sparse 3D architectural wireframes distributed across Z depth
    const polyGeo = new THREE.OctahedronGeometry(0.85, 0)
    const cubeGeo = new THREE.BoxGeometry(1.15, 1.15, 1.15)
    const edgesPoly = new THREE.EdgesGeometry(polyGeo)
    const edgesCube = new THREE.EdgesGeometry(cubeGeo)

    interface Prop3D {
      mesh: THREE.LineSegments
      mat: THREE.LineBasicMaterial
      baseY: number
      speed: number
      phase: number
      accentSlot: 0 | 1
    }
    const props: Prop3D[] = []

    const layout: [number, number, number, number, 0 | 1, boolean][] = [
      [-8.5, 2.2, -5, 1.2, 0, false],
      [9.2, -1.8, -8, 1.5, 1, true],
      [-6.8, -2.5, -13, 1.8, 1, true],
      [7.4, 3.1, -15, 1.1, 0, false],
      [-11.0, 0.4, -22, 2.1, 0, true],
      [10.5, 1.2, -25, 1.9, 1, false],
      [0.8, 4.4, -19, 1.3, 0, false],
    ]

    layout.forEach(([x, y, z, scale, accentSlot, useCube], i) => {
      const mat = new THREE.LineBasicMaterial({
        color: accentSlot === 0 ? 0x00f0ff : 0x8b5cf6,
        transparent: true,
        opacity: 0.22,
      })
      const mesh = new THREE.LineSegments(useCube ? edgesCube : edgesPoly, mat)
      mesh.position.set(x, y, z)
      mesh.scale.setScalar(scale)
      worldGroup.add(mesh)
      props.push({
        mesh,
        mat,
        baseY: y,
        speed: 0.16 + (i % 3) * 0.07,
        phase: i * 1.1,
        accentSlot,
      })
    })

    // Subtle 3D depth stars / survey markers
    const ptCount = 120
    const ptGeo = new THREE.BufferGeometry()
    const ptPositions = new Float32Array(ptCount * 3)
    for (let i = 0; i < ptCount; i++) {
      ptPositions[i * 3] = (Math.random() - 0.5) * 32
      ptPositions[i * 3 + 1] = (Math.random() - 0.5) * 14
      ptPositions[i * 3 + 2] = -Math.random() * 28
    }
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3))
    const ptMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
    })
    const points = new THREE.Points(ptGeo, ptMat)
    worldGroup.add(points)

    let targetMouseX = 0
    let targetMouseY = 0
    let smoothMouseX = 0
    let smoothMouseY = 0
    let scrollRatio = 0

    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollRatio = window.scrollY / maxScroll
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    const onResize = () => {
      if (!host || !renderer) return
      const w = host.clientWidth || window.innerWidth
      const h = host.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    let t = 0
    const syncColorsAndRender = () => {
      const { isLight: light, colorScheme: scheme } = themeRef.current
      const [c1, c2] = SCHEME_HEX[scheme]

      floorMats.forEach((m, idx) => {
        if ('color' in m && m.color instanceof THREE.Color) {
          m.color.setHex(idx === 0 ? c1 : light ? 0x94a3b8 : 0x334155)
        }
        m.opacity = light ? (idx === 0 ? 0.16 : 0.12) : idx === 0 ? 0.18 : 0.1
      })
      roofMats.forEach((m, idx) => {
        if ('color' in m && m.color instanceof THREE.Color) {
          m.color.setHex(idx === 0 ? c2 : light ? 0xcbd5e1 : 0x1e293b)
        }
        m.opacity = light ? 0.07 : 0.08
      })

      ptMat.color.setHex(c1)
      ptMat.opacity = light ? 0.25 : 0.36

      props.forEach((p) => {
        p.mat.color.setHex(p.accentSlot === 0 ? c1 : c2)
        p.mat.opacity = light ? 0.22 : 0.24
      })

      renderer!.render(scene, camera)
    }

    if (reducedMotion) {
      syncColorsAndRender()
    } else {
      const tick = () => {
        raf = requestAnimationFrame(tick)
        t += 0.008
        smoothMouseX += (targetMouseX - smoothMouseX) * 0.045
        smoothMouseY += (targetMouseY - smoothMouseY) * 0.045

        camera.position.x = smoothMouseX * 1.1
        camera.position.y = 1.4 - smoothMouseY * 0.65 - scrollRatio * 1.1
        camera.position.z = 10 - scrollRatio * 6.5
        camera.lookAt(smoothMouseX * 0.25, -scrollRatio * 1.2, -8)

        props.forEach((p) => {
          p.mesh.rotation.x = t * p.speed + p.phase
          p.mesh.rotation.y = t * p.speed * 1.25
          p.mesh.position.y = p.baseY + Math.sin(t * 1.4 + p.phase) * 0.35
        })
        points.rotation.y = t * 0.04 + smoothMouseX * 0.08

        syncColorsAndRender()
      }
      tick()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      polyGeo.dispose()
      cubeGeo.dispose()
      edgesPoly.dispose()
      edgesCube.dispose()
      ptGeo.dispose()
      ptMat.dispose()
      props.forEach((p) => p.mat.dispose())
      renderer?.dispose()
      if (renderer && host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Soft ambient color nodes matching theme and color scheme
  const getNodeClasses = () => {
    switch (colorScheme) {
      case 'solar':
        return {
          node1: isLight ? 'bg-amber-400/[0.16]' : 'bg-amber-500/[0.12]',
          node2: isLight ? 'bg-rose-400/[0.14]' : 'bg-rose-600/[0.10]',
          node3: isLight ? 'bg-orange-300/[0.16]' : 'bg-orange-500/[0.10]',
        }
      case 'aurora':
        return {
          node1: isLight ? 'bg-emerald-400/[0.16]' : 'bg-emerald-500/[0.12]',
          node2: isLight ? 'bg-cyan-400/[0.16]' : 'bg-cyan-500/[0.12]',
          node3: isLight ? 'bg-teal-300/[0.14]' : 'bg-teal-500/[0.10]',
        }
      case 'violet':
        return {
          node1: isLight ? 'bg-purple-400/[0.16]' : 'bg-purple-600/[0.12]',
          node2: isLight ? 'bg-pink-400/[0.14]' : 'bg-pink-600/[0.10]',
          node3: isLight ? 'bg-indigo-300/[0.14]' : 'bg-indigo-500/[0.10]',
        }
      case 'chromatic':
      default:
        return {
          node1: isLight ? 'bg-cyan-400/[0.16]' : 'bg-cyan-500/[0.10]',
          node2: isLight ? 'bg-indigo-400/[0.14]' : 'bg-indigo-600/[0.12]',
          node3: isLight ? 'bg-emerald-400/[0.14]' : 'bg-emerald-500/[0.08]',
        }
    }
  }

  const nodes = getNodeClasses()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700"
      aria-hidden="true"
    >
      {/* Subtle 3D Color Atmosphere */}
      <div
        className={`absolute -top-[15%] left-[10%] h-[50vw] w-[50vw] max-w-[660px] max-h-[660px] rounded-full blur-[150px] animate-flow-1 transition-colors duration-700 ${nodes.node1}`}
      />
      <div
        className={`absolute top-[35%] -right-[10%] h-[55vw] w-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[160px] animate-flow-2 transition-colors duration-700 ${nodes.node2}`}
      />
      <div
        className={`absolute -bottom-[20%] left-[25%] h-[48vw] w-[48vw] max-w-[620px] max-h-[620px] rounded-full blur-[150px] animate-flow-3 transition-colors duration-700 ${nodes.node3}`}
      />

      {/* Interactive 3D Perspective Grid & Spatial Wireframes */}
      <div ref={canvasHostRef} className="absolute inset-0" />

      {/* Atmospheric Vignette for crisp legibility */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight ? 'bg-slate-50/45' : 'bg-[#06080e]/35'
        }`}
      />
    </div>
  )
}
