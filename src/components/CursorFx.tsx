import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'

/** Scroll progress hairline plus a subtle trailing cursor ring (fine pointers only). */
export function CursorFx() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.35 })
  const [fine, setFine] = useState(false)
  const [active, setActive] = useState(false)
  const activeRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setFine(mq.matches)
    if (!mq.matches) return

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target as HTMLElement | null
      const hit = !!el?.closest?.('a,button,input,canvas,[data-cursor]')
      if (hit !== activeRef.current) {
        activeRef.current = hit
        setActive(hit)
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-flow pointer-events-none"
        style={{ scaleX: progress }}
      />
      {fine && (
        <motion.div
          aria-hidden="true"
          className="fixed top-0 left-0 z-[60] pointer-events-none border border-cyan-500/70 dark:border-cyan-300/70 mix-blend-normal"
          style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
          animate={{ width: active ? 38 : 16, height: active ? 38 : 16, rotate: active ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        />
      )}
    </>
  )
}
