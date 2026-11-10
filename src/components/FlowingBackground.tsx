import { useTheme } from '@/context/ThemeContext'

export function FlowingBackground() {
  const { theme, colorScheme } = useTheme()
  const isLight = theme === 'light'

  // Dynamic node color mappings based on color scheme
  const getNodeClasses = () => {
    switch (colorScheme) {
      case 'solar':
        return {
          node1: isLight ? 'bg-amber-400/[0.18]' : 'bg-amber-500/[0.14]',
          node2: isLight ? 'bg-rose-400/[0.16]' : 'bg-rose-600/[0.12]',
          node3: isLight ? 'bg-orange-300/[0.18]' : 'bg-orange-500/[0.12]',
          node4: isLight ? 'bg-yellow-300/[0.15]' : 'bg-yellow-500/[0.08]',
        }
      case 'aurora':
        return {
          node1: isLight ? 'bg-emerald-400/[0.18]' : 'bg-emerald-500/[0.14]',
          node2: isLight ? 'bg-cyan-400/[0.18]' : 'bg-cyan-500/[0.14]',
          node3: isLight ? 'bg-teal-300/[0.16]' : 'bg-teal-500/[0.12]',
          node4: isLight ? 'bg-sky-400/[0.15]' : 'bg-sky-600/[0.09]',
        }
      case 'violet':
        return {
          node1: isLight ? 'bg-purple-400/[0.18]' : 'bg-purple-600/[0.14]',
          node2: isLight ? 'bg-pink-400/[0.16]' : 'bg-pink-600/[0.12]',
          node3: isLight ? 'bg-indigo-300/[0.16]' : 'bg-indigo-500/[0.12]',
          node4: isLight ? 'bg-fuchsia-400/[0.15]' : 'bg-fuchsia-600/[0.09]',
        }
      case 'chromatic':
      default:
        return {
          node1: isLight ? 'bg-cyan-400/[0.18]' : 'bg-cyan-500/[0.12]',
          node2: isLight ? 'bg-indigo-400/[0.16]' : 'bg-indigo-600/[0.14]',
          node3: isLight ? 'bg-emerald-400/[0.15]' : 'bg-emerald-500/[0.1]',
          node4: isLight ? 'bg-fuchsia-400/[0.14]' : 'bg-fuchsia-600/[0.08]',
        }
    }
  }

  const nodes = getNodeClasses()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700"
      aria-hidden="true"
    >
      {/* Node 1 */}
      <div
        className={`absolute -top-[15%] left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[140px] animate-flow-1 transition-colors duration-700 ${nodes.node1}`}
      />

      {/* Node 2 */}
      <div
        className={`absolute top-[35%] -right-[10%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full blur-[160px] animate-flow-2 transition-colors duration-700 ${nodes.node2}`}
      />

      {/* Node 3 */}
      <div
        className={`absolute -bottom-[20%] left-[25%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[150px] animate-flow-3 transition-colors duration-700 ${nodes.node3}`}
      />

      {/* Node 4 */}
      <div
        className={`absolute top-[70%] -left-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[140px] animate-flow-4 transition-colors duration-700 ${nodes.node4}`}
      />

      {/* Atmospheric Vignette overlay */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight ? 'bg-slate-50/70 backdrop-blur-[2px]' : 'bg-[#06080e]/60'
        }`}
      />
    </div>
  )
}
