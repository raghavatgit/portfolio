import React, { createContext, useContext, useState, useEffect } from 'react'

export type SectionId = 'hero' | 'projects' | 'sandbox' | 'stack' | 'about' | 'contact'

export interface MascotContextType {
  activeSection: SectionId
  setActiveSection: (section: SectionId) => void
  hoveredProject: string | null
  setHoveredProject: (projectId: string | null) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  mascotMode: 'assembled' | 'exploded' | 'wave' | 'beacon'
  setMascotMode: (mode: 'assembled' | 'exploded' | 'wave' | 'beacon') => void
  highlightedBrickIndex: number | null
  setHighlightedBrickIndex: (idx: number | null) => void
  isDocked: boolean
  setIsDocked: (docked: boolean) => void
}

const MascotContext = createContext<MascotContextType | undefined>(undefined)

// Mapping from project ID to brick index (0-7)
export const PROJECT_TO_BRICK: Record<string, number> = {
  streamshield: 0, // Neon Coral
  systems: 1,      // Electric Cobalt
  sidereal: 2,     // Electric Cyan
  navdrishti: 3,   // Hyper Emerald
  'aegis-raksha': 4, // Warm Amber
  'new-atlas': 5,  // Ultra Violet
  brandnest: 6,    // Flame Red / Pink
  'vencord-ytm-player': 7, // Glacier Blue
}

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mascotMode, setMascotMode] = useState<'assembled' | 'exploded' | 'wave' | 'beacon'>('assembled')
  const [highlightedBrickIndex, setHighlightedBrickIndex] = useState<number | null>(null)
  const [isDocked, setIsDocked] = useState(false)

  // Track scroll position to determine scroll-docking state
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docked = scrollY > 380
      setIsDocked(docked)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section-driven context awareness
  useEffect(() => {
    switch (activeSection) {
      case 'hero':
        setMascotMode('assembled')
        setHighlightedBrickIndex(null)
        break
      case 'projects':
        // When in projects, highlight brick based on hovered project
        if (hoveredProject && PROJECT_TO_BRICK[hoveredProject] !== undefined) {
          setHighlightedBrickIndex(PROJECT_TO_BRICK[hoveredProject])
          setMascotMode('assembled')
        } else {
          setHighlightedBrickIndex(null)
        }
        break
      case 'sandbox':
        setMascotMode('wave')
        setHighlightedBrickIndex(null)
        break
      case 'stack':
        setMascotMode('exploded')
        setHighlightedBrickIndex(null)
        break
      case 'about':
        setMascotMode('assembled')
        setHighlightedBrickIndex(null)
        break
      case 'contact':
        setMascotMode('beacon')
        setHighlightedBrickIndex(null)
        break
    }
  }, [activeSection, hoveredProject])

  return (
    <MascotContext.Provider
      value={{
        activeSection,
        setActiveSection,
        hoveredProject,
        setHoveredProject,
        soundEnabled,
        setSoundEnabled,
        mascotMode,
        setMascotMode,
        highlightedBrickIndex,
        setHighlightedBrickIndex,
        isDocked,
        setIsDocked,
      }}
    >
      {children}
    </MascotContext.Provider>
  )
}

export function useMascot() {
  const ctx = useContext(MascotContext)
  if (!ctx) {
    throw new Error('useMascot must be used within MascotProvider')
  }
  return ctx
}
