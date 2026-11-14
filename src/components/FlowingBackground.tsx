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
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 120)
    camera.position.set(0, 1.2, 10)

    const worldGroup = new THREE.Group()
    scene.add(worldGroup)

    // Calibrated architectural 3D floor & ceiling grids extending down Z-depth
    const gridFloor = new THREE.GridHelper(64, 48, 0x00f0ff, 0x334155)
    gridFloor.position.set(0, -5.2, -12)
    const floorMats = Array.isArray(gridFloor.material) ? gridFloor.material : [gridFloor.material]
    floorMats.forEach((m) => {
      m.transparent = true
      m.opacity = 0.16
    })
    worldGroup.add(gridFloor)

    const gridRoof = new THREE.GridHelper(64, 32, 0x8b5cf6, 0x1e293b)
    gridRoof.position.set(0, 7.2, -12)
    const roofMats = Array.isArray(gridRoof.material) ? gridRoof.material : [gridRoof.material]
    roofMats.forEach((m) => {
      m.transparent = true
      m.opacity = 0.09
    })
    worldGroup.add(gridRoof)

    // Precision vertical laser columns framing the corridor symmetrically on Left & Right rails
    const pillarGeo = new THREE.BufferGeometry()
    const pillarPts: number[] = []
    const zStations = [-3, -9, -15, -21, -27, -33]
    zStations.forEach((z) => {
      pillarPts.push(-8.2, -5.2, z, -8.2, 7.2, z)
      pillarPts.push(8.2, -5.2, z, 8.2, 7.2, z)
    })
    pillarGeo.setAttribute('position', new THREE.Float32BufferAttribute(pillarPts, 3))
    const pillarMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.12 })
    const pillars = new THREE.LineSegments(pillarGeo, pillarMat)
    worldGroup.add(pillars)

    // Shared sculptural geometries placed at exact symmetric corridor stations
    const cubeEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.3, 1.3, 1.3))
    const innerOctaEdges = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.68, 0))
    const ringGeo = new THREE.TorusGeometry(1.15, 0.014, 8, 48)

    interface Assembly {
      group: THREE.Group
      ringA: THREE.Mesh
      ringB: THREE.Mesh
      core: THREE.LineSegments
      shell: THREE.LineSegments
      matA: THREE.LineBasicMaterial
      matB: THREE.LineBasicMaterial
      ringMatA: THREE.MeshBasicMaterial
      ringMatB: THREE.MeshBasicMaterial
      baseY: number
      phase: number
      side: -1 | 1
    }

    const assemblies: Assembly[] = []
    const placements: { x: number; y: number; z: number; s: number; side: -1 | 1 }[] = [
      { x: -8.2, y: 1.5, z: -3, s: 1.05, side: -1 },
      { x: 8.2, y: -1.1, z: -9, s: 1.2, side: 1 },
      { x: -8.2, y: 0.2, z: -15, s: 1.35, side: -1 },
      { x: 8.2, y: 2.0, z: -21, s: 1.25, side: 1 },
      { x: -8.2, y: -0.9, z: -27, s: 1.4, side: -1 },
      { x: 8.2, y: 1.0, z: -33, s: 1.3, side: 1 },
    ]

    placements.forEach((p, i) => {
      const group = new THREE.Group()
      group.position.set(p.x, p.y, p.z)
      group.scale.setScalar(p.s)

      const matA = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.28 })
      const matB = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.34 })
      const ringMatA = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.22 })
      const ringMatB = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.18 })

      const shell = new THREE.LineSegments(cubeEdges, matA)
      const core = new THREE.LineSegments(innerOctaEdges, matB)
      const ringA = new THREE.Mesh(ringGeo, ringMatA)
      const ringB = new THREE.Mesh(ringGeo, ringMatB)
      ringA.rotation.x = Math.PI / 3
      ringB.rotation.y = Math.PI / 3

      group.add(shell, core, ringA, ringB)
      worldGroup.add(group)
      assemblies.push({
        group,
        ringA,
        ringB,
        core,
        shell,
        matA,
        matB,
        ringMatA,
        ringMatB,
        baseY: p.y,
        phase: i * 1.05,
        side: p.side,
      })
    })

    // Depth survey particles down the corridor
    const ptCount = 150
    const ptGeo = new THREE.BufferGeometry()
    const ptPositions = new Float32Array(ptCount * 3)
    for (let i = 0; i < ptCount; i++) {
      ptPositions[i * 3] = (Math.random() - 0.5) * 34
      ptPositions[i * 3 + 1] = (Math.random() - 0.5) * 14
      ptPositions[i * 3 + 2] = 6 - Math.random() * 44
    }
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3))
    const ptMat = new THREE.PointsMaterial({
      size: 0.085,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.34,
    })
    const points = new THREE.Points(ptGeo, ptMat)
    worldGroup.add(points)

    let targetMouseX = 0
    let targetMouseY = 0
    let smoothMouseX = 0
    let smoothMouseY = 0
    let targetScroll = 0
    let smoothScroll = 0

    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      targetScroll = window.scrollY / maxScroll
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

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
        m.opacity = light ? (idx === 0 ? 0.16 : 0.11) : idx === 0 ? 0.19 : 0.1
      })
      roofMats.forEach((m, idx) => {
        if ('color' in m && m.color instanceof THREE.Color) {
          m.color.setHex(idx === 0 ? c2 : light ? 0xcbd5e1 : 0x1e293b)
        }
        m.opacity = light ? 0.08 : 0.09
      })

      pillarMat.color.setHex(c1)
      pillarMat.opacity = light ? 0.12 : 0.11
      ptMat.color.setHex(c1)
      ptMat.opacity = light ? 0.24 : 0.36

      assemblies.forEach((a) => {
        a.matA.color.setHex(c1)
        a.matB.color.setHex(c2)
        a.ringMatA.color.setHex(c1)
        a.ringMatB.color.setHex(c2)
        a.matA.opacity = light ? 0.25 : 0.28
        a.matB.opacity = light ? 0.28 : 0.34
      })

      renderer!.render(scene, camera)
    }

    if (reducedMotion) {
      syncColorsAndRender()
    } else {
      const tick = () => {
        raf = requestAnimationFrame(tick)
        t += 0.007
        smoothMouseX += (targetMouseX - smoothMouseX) * 0.05
        smoothMouseY += (targetMouseY - smoothMouseY) * 0.05
        smoothScroll += (targetScroll - smoothScroll) * 0.075

        // Fly camera smoothly down the calibrated 3D Z corridor on scroll
        const camZ = 10 - smoothScroll * 22
        camera.position.x = smoothMouseX * 1.15
        camera.position.y = 1.2 - smoothMouseY * 0.65 - smoothScroll * 0.6
        camera.position.z = camZ
        camera.lookAt(smoothMouseX * 0.25, -smoothScroll * 0.4, camZ - 14)

        // Precision synchronized rotation driven cleanly by both time & scroll phase
        const scrollAngle = smoothScroll * Math.PI * 2.5
        assemblies.forEach((a) => {
          a.group.position.y = a.baseY + Math.sin(t * 1.2 + a.phase) * 0.25
          a.shell.rotation.y = a.side * (t * 0.32 + scrollAngle * 0.45) + a.phase
          a.shell.rotation.x = t * 0.18 + scrollAngle * 0.25
          a.core.rotation.y = -a.side * (t * 0.5 + scrollAngle * 0.65)
          a.core.rotation.z = t * 0.24
          a.ringA.rotation.z = scrollAngle * 0.8 + t * 0.4
          a.ringB.rotation.x = -scrollAngle * 0.6 - t * 0.3
        })
        points.rotation.y = smoothMouseX * 0.06 + smoothScroll * 0.22

        syncColorsAndRender()
      }
      tick()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cubeEdges.dispose()
      innerOctaEdges.dispose()
      ringGeo.dispose()
      pillarGeo.dispose()
      pillarMat.dispose()
      ptGeo.dispose()
      ptMat.dispose()
      assemblies.forEach((a) => {
        a.matA.dispose()
        a.matB.dispose()
        a.ringMatA.dispose()
        a.ringMatB.dispose()
      })
      renderer?.dispose()
      if (renderer && host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [])

  const getNodeClasses = () => {
    switch (colorScheme) {
      case 'solar':
        return {
          node1: isLight ? 'bg-amber-400/[0.15]' : 'bg-amber-500/[0.11]',
          node2: isLight ? 'bg-rose-400/[0.13]' : 'bg-rose-600/[0.09]',
          node3: isLight ? 'bg-orange-300/[0.14]' : 'bg-orange-500/[0.09]',
        }
      case 'aurora':
        return {
          node1: isLight ? 'bg-emerald-400/[0.15]' : 'bg-emerald-500/[0.11]',
          node2: isLight ? 'bg-cyan-400/[0.15]' : 'bg-cyan-500/[0.11]',
          node3: isLight ? 'bg-teal-300/[0.13]' : 'bg-teal-500/[0.09]',
        }
      case 'violet':
        return {
          node1: isLight ? 'bg-purple-400/[0.15]' : 'bg-purple-600/[0.11]',
          node2: isLight ? 'bg-pink-400/[0.13]' : 'bg-pink-600/[0.09]',
          node3: isLight ? 'bg-indigo-300/[0.13]' : 'bg-indigo-500/[0.09]',
        }
      case 'chromatic':
      default:
        return {
          node1: isLight ? 'bg-cyan-400/[0.15]' : 'bg-cyan-500/[0.10]',
          node2: isLight ? 'bg-indigo-400/[0.13]' : 'bg-indigo-600/[0.11]',
          node3: isLight ? 'bg-emerald-400/[0.13]' : 'bg-emerald-500/[0.08]',
        }
    }
  }

  const nodes = getNodeClasses()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700"
      aria-hidden="true"
    >
      <div
        className={`animate-flow-1 absolute -top-[15%] left-[10%] h-[50vw] w-[50vw] max-h-[640px] max-w-[640px] rounded-full blur-[150px] transition-colors duration-700 ${nodes.node1}`}
      />
      <div
        className={`animate-flow-2 absolute top-[35%] -right-[10%] h-[55vw] w-[55vw] max-h-[680px] max-w-[680px] rounded-full blur-[160px] transition-colors duration-700 ${nodes.node2}`}
      />
      <div
        className={`animate-flow-3 absolute -bottom-[20%] left-[25%] h-[48vw] w-[48vw] max-h-[600px] max-w-[600px] rounded-full blur-[150px] transition-colors duration-700 ${nodes.node3}`}
      />

      <div ref={canvasHostRef} className="absolute inset-0" />

      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight ? 'bg-slate-50/40' : 'bg-[#06080e]/30'
        }`}
      />
    </div>
  )
}
