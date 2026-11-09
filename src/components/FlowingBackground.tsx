export function FlowingBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic Luminous Flowing Node 1: Electric Cyan */}
      <div className="absolute -top-[15%] left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-cyan-500/[0.12] blur-[140px] animate-flow-1" />

      {/* Dynamic Luminous Flowing Node 2: Vivid Violet / Indigo */}
      <div className="absolute top-[35%] -right-[10%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full bg-indigo-600/[0.14] blur-[160px] animate-flow-2" />

      {/* Dynamic Luminous Flowing Node 3: Vivid Emerald */}
      <div className="absolute -bottom-[20%] left-[25%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-emerald-500/[0.1] blur-[150px] animate-flow-3" />

      {/* Dynamic Luminous Flowing Node 4: Fuchsia / Magenta accent */}
      <div className="absolute top-[70%] -left-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-fuchsia-600/[0.08] blur-[140px] animate-flow-4" />

      {/* Very subtle dark vignette */}
      <div className="absolute inset-0 bg-[#06080e]/60" />
    </div>
  )
}
