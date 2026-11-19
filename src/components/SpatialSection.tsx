import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

interface SpatialSectionProps {
  id: string
  index: string
  children: ReactNode
  className?: string
}

/**
 * Scroll-choreographed 3D viewport section with precision CAD corner registration marks.
 * Uses GPU-composited perspective transforms tied directly to smoothed vertical scroll progress.
 */
export function SpatialSection({ id, children, className = '' }: SpatialSectionProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ['start end', 'end start'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.5 })

  const rotateX = useTransform(smooth, [0, 0.25, 0.75, 1], [5, 0, 0, -4])
  const translateZ = useTransform(smooth, [0, 0.25, 0.75, 1], [-60, 0, 0, -40])
  const translateY = useTransform(smooth, [0, 0.25, 0.75, 1], [24, 0, 0, -18])
  const opacity = useTransform(smooth, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.5])

  return (
    <section
      ref={hostRef}
      id={id}
      className={`relative mx-auto max-w-7xl scroll-mt-24 px-4 py-28 sm:px-8 lg:pr-20 xl:px-8 ${className}`}
      style={{ perspective: '1600px' }}
    >
      {/* Silent datum ticks */}
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-16 h-2 w-2 border-l border-t border-slate-300 dark:border-white/20 sm:left-8" />
      <span aria-hidden="true" className="pointer-events-none absolute right-4 top-16 h-2 w-2 border-r border-t border-slate-300 dark:border-white/20 sm:right-8 lg:right-20 xl:right-8" />

      <motion.div
        style={
          reduce
            ? undefined
            : {
                rotateX,
                z: translateZ,
                y: translateY,
                opacity,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center top',
              }
        }
      >
        {children}
      </motion.div>
    </section>
  )
}

interface ExtrudedSlabProps {
  children: ReactNode
  accentColor?: string
  depth?: number
  className?: string
}

/**
 * Physical CSS 3D slab with front face plus exact machined top/bottom/left/right 3D walls.
 */
export function ExtrudedSlab({ children, accentColor = '#00F0FF', depth = 12, className = '' }: ExtrudedSlabProps) {
  return (
    <div className={`preserve-3d relative ${className}`}>
      {/* Back structural plate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-slate-500/20 bg-slate-900/80 dark:border-white/10 dark:bg-black/80"
        style={{ transform: `translateZ(${-depth}px)` }}
      />

      {/* Top 3D Thickness Wall (y=0, swings from -Y into -Z via rotateX(90deg)) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-full origin-bottom opacity-80"
        style={{
          height: `${depth}px`,
          transform: 'rotateX(90deg)',
          background: `linear-gradient(90deg, ${accentColor}88, rgba(30,41,59,0.9))`,
        }}
      />

      {/* Bottom 3D Thickness Wall (y=H, swings from +Y into -Z via rotateX(-90deg)) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full origin-top opacity-90"
        style={{
          height: `${depth}px`,
          transform: 'rotateX(-90deg)',
          background: `linear-gradient(90deg, ${accentColor}aa, rgba(15,23,42,0.92))`,
        }}
      />

      {/* Left 3D Thickness Wall (x=0, swings from -X into -Z via rotateY(-90deg)) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-full origin-right opacity-75"
        style={{
          width: `${depth}px`,
          transform: 'rotateY(-90deg)',
          background: `linear-gradient(180deg, ${accentColor}77, rgba(15,23,42,0.92))`,
        }}
      />

      {/* Right 3D Thickness Wall (x=W, swings from +X into -Z via rotateY(90deg)) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-full origin-left opacity-85"
        style={{
          width: `${depth}px`,
          transform: 'rotateY(90deg)',
          background: `linear-gradient(180deg, ${accentColor}99, rgba(15,23,42,0.92))`,
        }}
      />

      {/* Front Face */}
      <div className="preserve-3d relative h-full w-full">{children}</div>
    </div>
  )
}
