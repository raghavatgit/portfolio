import React, { createContext, useContext, useState, useEffect } from 'react'

export type ThemeMode = 'dark' | 'light'
export type ColorScheme = 'chromatic' | 'solar' | 'aurora' | 'violet'

export interface ColorSchemeOption {
  id: ColorScheme
  name: string
  accentColor: string
  colors: string[]
}

export const COLOR_SCHEMES: ColorSchemeOption[] = [
  {
    id: 'chromatic',
    name: 'Prism Chromatic',
    accentColor: '#00F0FF',
    colors: ['#00F0FF', '#8B5CF6', '#EC4899', '#00E676'],
  },
  {
    id: 'solar',
    name: 'Solar Sunset',
    accentColor: '#FFA502',
    colors: ['#FFA502', '#FF4757', '#EC4899', '#FFD000'],
  },
  {
    id: 'aurora',
    name: 'Nordic Aurora',
    accentColor: '#00E676',
    colors: ['#00E676', '#00F0FF', '#38BDF8', '#10B981'],
  },
  {
    id: 'violet',
    name: 'Cyber Orchid',
    accentColor: '#A855F7',
    colors: ['#A855F7', '#EC4899', '#6366F1', '#D946EF'],
  },
]

export interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rg_theme') as ThemeMode | null
      if (saved === 'dark' || saved === 'light') return saved
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light'
      }
    }
    return 'dark'
  })

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rg_color_scheme') as ColorScheme | null
      if (saved && ['chromatic', 'solar', 'aurora', 'violet'].includes(saved)) {
        return saved
      }
    }
    return 'chromatic'
  })

  // Synchronize with document element
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
    root.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('rg_theme', theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-color-scheme', colorScheme)
    try {
      localStorage.setItem('rg_color_scheme', colorScheme)
    } catch {}
  }, [colorScheme])

  const setTheme = (t: ThemeMode) => {
    setThemeState(t)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        colorScheme,
        setColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

