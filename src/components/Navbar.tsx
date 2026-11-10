import { useState, useEffect } from 'react'
import { Sun, Moon, Volume2, VolumeX, Palette } from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'
import { useMascot } from '@/context/MascotContext'
import { useTheme, COLOR_SCHEMES } from '@/context/ThemeContext'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showPalettes, setShowPalettes] = useState(false)
  const { soundEnabled, setSoundEnabled } = useMascot()
  const { theme, toggleTheme, colorScheme, setColorScheme } = useTheme()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 dark:bg-[#06080e]/90 backdrop-blur-2xl py-3 border-b border-black/[0.06] dark:border-white/[0.08] shadow-lg shadow-black/[0.03] dark:shadow-2xl dark:shadow-black/80'
          : 'bg-transparent py-5 border-b border-black/[0.03] dark:border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Title: ONLY the cursive name raghavgoyal. */}
        <a
          href="#"
          className="group inline-flex items-baseline transition-transform duration-300 py-1"
          title="raghavgoyal"
        >
          <span className="font-brush text-3xl sm:text-4xl text-flow-chromatic select-none tracking-wide drop-shadow-[0_2px_14px_rgba(0,240,255,0.25)] group-hover:scale-105 transition-transform inline-block">
            raghavgoyal.
          </span>
        </a>

        {/* Right Architectural Plate: Theme Toggle, Palette Selector & Conduits */}
        <div className="flex items-center gap-5 text-xs font-mono">
          {/* Associated Color Schemes Palette Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPalettes(!showPalettes)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors py-1"
              title="Change color scheme"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden md:inline text-[11px] uppercase tracking-wider capitalize">
                {colorScheme}
              </span>
            </button>

            {/* Floating Palette Dropdown */}
            {showPalettes && (
              <div
                className="absolute right-0 top-full mt-2 p-2 rounded-2xl bg-white/95 dark:bg-[#090d18]/95 border border-black/[0.08] dark:border-white/[0.12] backdrop-blur-2xl shadow-xl z-50 flex flex-col gap-1 min-w-[170px]"
                onMouseLeave={() => setShowPalettes(false)}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-400 px-2 py-1 block">
                  Color Schemes
                </span>
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    type="button"
                    onClick={() => {
                      setColorScheme(scheme.id)
                      setShowPalettes(false)
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors ${
                      colorScheme === scheme.id
                        ? 'bg-slate-100 dark:bg-white/[0.1] text-slate-900 dark:text-white font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{scheme.name}</span>
                    <div className="flex items-center gap-1">
                      {scheme.colors.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="w-px h-3.5 bg-black/[0.08] dark:bg-white/10 hidden sm:block" />

          {/* Light / Dark Theme Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 transition-colors py-1"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Dark</span>
              </>
            )}
          </button>

          <span className="w-px h-3.5 bg-black/[0.08] dark:bg-white/10 hidden sm:block" />

          {/* Audio Physics Chime Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors py-1"
            title={soundEnabled ? 'Mute physics audio' : 'Enable physics audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 opacity-50" />
            )}
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider">
              {soundEnabled ? 'SFX' : 'MUTED'}
            </span>
          </button>

          <span className="w-px h-3.5 bg-black/[0.08] dark:bg-white/10 hidden sm:block" />

          {/* GitHub Conduit: Clean architectural typography */}
          <a
            href="https://github.com/raghavatgit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white transition-colors py-1 group"
            title="GitHub: @raghavatgit"
          >
            <GithubIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] tracking-wide">
              github<span className="text-cyan-600 dark:text-cyan-400">/</span>raghavatgit
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
