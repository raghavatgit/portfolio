import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Check, Eye, EyeOff, ShieldCheck, Sparkles, Monitor, Tv } from 'lucide-react'

const EASING_PRESETS = [
  { name: 'Snappy Spring', bezier: [0.16, 1, 0.3, 1], css: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { name: 'Dramatic Glide', bezier: [0.87, 0, 0.13, 1], css: 'cubic-bezier(0.87, 0, 0.13, 1)' },
  { name: 'Natural Ease-Out', bezier: [0, 0, 0.2, 1], css: 'cubic-bezier(0, 0, 0.2, 1)' },
  { name: 'Sharp Decel', bezier: [0.05, 0.7, 0.1, 1], css: 'cubic-bezier(0.05, 0.7, 0.1, 1)' },
]

export function InteractiveSandbox() {
  const [activeTab, setActiveTab] = useState<'easing' | 'privacy'>('easing')

  // Easing tool state
  const [selectedPreset, setSelectedPreset] = useState(EASING_PRESETS[0])
  const [animTrigger, setAnimTrigger] = useState(0)
  const [copiedCss, setCopiedCss] = useState(false)

  // Stream privacy simulator state
  const [discordShielded, setDiscordShielded] = useState(true)
  const [bankingShielded, setBankingShielded] = useState(true)
  const [codeShielded, setCodeShielded] = useState(false)

  const handleCopyCss = () => {
    navigator.clipboard.writeText(selectedPreset.css)
    setCopiedCss(true)
    setTimeout(() => setCopiedCss(false), 1800)
  }

  return (
    <section id="sandbox" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="mb-10">
        <span className="text-xs font-mono font-semibold tracking-wider text-amber-400 uppercase block mb-2">
          Live Interactive Sandbox
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Hands-On Engineering Demos
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light">
          Interact directly with the mathematical curves and systems logic powering my software.
        </p>
      </div>

      {/* Sandbox Container */}
      <div className="rounded-2xl bg-[#0e1017]/80 border border-white/[0.08] backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/80">
        {/* Module Selector Bar */}
        <div className="flex border-b border-white/[0.06] bg-black/30 p-2 sm:p-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('easing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'easing'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Bézier Curves (New-Atlas)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'privacy'
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>DWM Exclusion Simulator (StreamShield)</span>
          </button>
        </div>

        {/* Tab 1: Bézier Easing Playground */}
        {activeTab === 'easing' && (
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Cubic Bézier Dynamics
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Select a velocity preset below or re-run the physics simulation to test how motion
                    curves alter kinetic weight and responsiveness.
                  </p>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 gap-2">
                  {EASING_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset)
                        setAnimTrigger((t) => t + 1)
                      }}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        selectedPreset.name === preset.name
                          ? 'border-amber-400/50 bg-amber-500/10 text-white font-medium'
                          : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="block font-semibold">{preset.name}</span>
                      <span className="text-[10px] font-mono opacity-60">
                        [{preset.bezier.join(', ')}]
                      </span>
                    </button>
                  ))}
                </div>

                {/* Code Copy Box */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-xs font-mono text-amber-300 truncate mr-2">
                    {selectedPreset.css}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCss}
                    className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors shrink-0"
                    title="Copy CSS cubic-bezier"
                  >
                    {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setAnimTrigger((t) => t + 1)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wide uppercase transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Re-run Simulation</span>
                </button>
              </div>

              {/* Visual Track Area */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-black/50 border border-white/[0.06] flex flex-col justify-between min-h-[260px]">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
                  <span>Track: 0% (Origin)</span>
                  <span className="text-amber-400">Target: 100% (Terminal)</span>
                </div>

                {/* Animation Track 1: Solid Puck */}
                <div className="relative w-full h-12 bg-white/[0.03] rounded-xl border border-white/[0.06] flex items-center px-2 mb-4 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1 bg-amber-500" />
                  <div className="absolute inset-y-0 right-0 w-1 bg-emerald-500" />

                  <motion.div
                    key={`puck-${animTrigger}`}
                    initial={{ x: '0%' }}
                    animate={{ x: 'calc(100% - 38px)' }}
                    transition={{
                      duration: 1.2,
                      ease: selectedPreset.bezier as [number, number, number, number],
                    }}
                    className="h-8 w-9 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950 font-mono text-[10px] font-bold"
                  >
                    P1
                  </motion.div>
                </div>

                {/* Animation Track 2: Scaling Spring Bar */}
                <div className="relative w-full h-8 bg-white/[0.02] rounded-lg border border-white/[0.04] overflow-hidden mb-4">
                  <motion.div
                    key={`bar-${animTrigger}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 1.2,
                      ease: selectedPreset.bezier as [number, number, number, number],
                    }}
                    className="h-full bg-gradient-to-r from-cyan-500/30 via-amber-500/40 to-emerald-500/50"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-white/[0.04]">
                  <span>Timeline: 1200ms</span>
                  <span>Kinetic profile: {selectedPreset.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: StreamShield DWM Privacy Simulator */}
        {activeTab === 'privacy' && (
          <div className="p-6 sm:p-8">
            <div className="max-w-2xl mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">
                Windows DWM Display Affinity Simulation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Toggle the shield on any application to observe how StreamShield instructs the Windows
                Desktop Window Manager (`DWM`) to exclude the window from screen capture while keeping
                it live on your local display.
              </p>
            </div>

            {/* Application Toggles */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              <button
                type="button"
                onClick={() => setDiscordShielded(!discordShielded)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  discordShielded
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 border'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 border hover:text-white'
                }`}
              >
                {discordShielded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>Discord DMs {discordShielded ? '(Shielded)' : '(Unprotected)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBankingShielded(!bankingShielded)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  bankingShielded
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 border'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 border hover:text-white'
                }`}
              >
                {bankingShielded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>Banking Tab {bankingShielded ? '(Shielded)' : '(Unprotected)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCodeShielded(!codeShielded)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  codeShielded
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 border'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 border hover:text-white'
                }`}
              >
                {codeShielded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>VS Code IDE {codeShielded ? '(Shielded)' : '(Unprotected)'}</span>
              </button>
            </div>

            {/* Split Screen Simulator View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Screen: Physical Monitor */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-300 pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-white">Your Physical Monitor</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    100% VISIBLE TO YOU
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs">
                    <span className="font-semibold text-indigo-300 block">Discord Client</span>
                    <span className="text-slate-400 text-[11px]">Private conversations &amp; servers</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs">
                    <span className="font-semibold text-rose-300 block">Online Banking</span>
                    <span className="text-slate-400 text-[11px]">Account balances &amp; OTP feeds</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs">
                    <span className="font-semibold text-blue-300 block">VS Code Editor</span>
                    <span className="text-slate-400 text-[11px]">Active project code &amp; terminal</span>
                  </div>
                </div>
              </div>

              {/* Right Screen: Capture Stream / OBS / Discord Share Feed */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-300 pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-white">OBS / Discord Stream Feed</span>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    WHAT AUDIENCE SEES
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Discord simulated feed */}
                  <div
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      discordShielded
                        ? 'bg-black/90 border-dashed border-white/20 text-slate-600'
                        : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                    }`}
                  >
                    {discordShielded ? (
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                        <EyeOff className="w-3 h-3 text-amber-400" />
                        [EXCLUDED BY DWM AFFINITY HOOK]
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold text-indigo-300 block">Discord Client</span>
                        <span className="text-slate-400 text-[11px]">Private conversations &amp; servers</span>
                      </>
                    )}
                  </div>

                  {/* Banking simulated feed */}
                  <div
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      bankingShielded
                        ? 'bg-black/90 border-dashed border-white/20 text-slate-600'
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {bankingShielded ? (
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                        <EyeOff className="w-3 h-3 text-amber-400" />
                        [EXCLUDED BY DWM AFFINITY HOOK]
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold text-rose-300 block">Online Banking</span>
                        <span className="text-slate-400 text-[11px]">Account balances &amp; OTP feeds</span>
                      </>
                    )}
                  </div>

                  {/* Code simulated feed */}
                  <div
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      codeShielded
                        ? 'bg-black/90 border-dashed border-white/20 text-slate-600'
                        : 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                    }`}
                  >
                    {codeShielded ? (
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                        <EyeOff className="w-3 h-3 text-amber-400" />
                        [EXCLUDED BY DWM AFFINITY HOOK]
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold text-blue-300 block">VS Code Editor</span>
                        <span className="text-slate-400 text-[11px]">Active project code &amp; terminal</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
