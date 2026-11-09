import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Check, Eye, EyeOff, ShieldCheck, Sparkles, Monitor, Tv } from 'lucide-react'

const EASING_PRESETS = [
  { name: 'Snappy Spring', label: 'Bouncy & Quick', bezier: [0.16, 1, 0.3, 1], css: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { name: 'Dramatic Glide', label: 'Smooth Cinematic', bezier: [0.87, 0, 0.13, 1], css: 'cubic-bezier(0.87, 0, 0.13, 1)' },
  { name: 'Natural Ease-Out', label: 'Gentle Stop', bezier: [0, 0, 0.2, 1], css: 'cubic-bezier(0, 0, 0.2, 1)' },
  { name: 'Sharp Decel', label: 'Instant Reaction', bezier: [0.05, 0.7, 0.1, 1], css: 'cubic-bezier(0.05, 0.7, 0.1, 1)' },
]

export function InteractiveSandbox() {
  const [activeTab, setActiveTab] = useState<'easing' | 'privacy'>('easing')

  // Easing tool state
  const [selectedPreset, setSelectedPreset] = useState(EASING_PRESETS[0])
  const [animTrigger, setAnimTrigger] = useState(0)
  const [copiedCss, setCopiedCss] = useState(false)

  // Stream privacy simulator state
  const [chatShielded, setChatShielded] = useState(true)
  const [bankShielded, setBankShielded] = useState(true)
  const [notesShielded, setNotesShielded] = useState(false)

  const handleCopyCss = () => {
    navigator.clipboard.writeText(selectedPreset.css)
    setCopiedCss(true)
    setTimeout(() => setCopiedCss(false), 1800)
  }

  return (
    <section id="sandbox" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>TRY IT YOURSELF</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-2 flex-wrap">
          <span>Interactive</span>
          <span className="font-serif italic font-normal text-flow-vibrant text-[1.08em]">
            Playground
          </span>
          <span className="font-cursive text-cyan-300 text-xl font-normal select-none rotate-1">
            ~ test it live
          </span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
          Play with live simulations of the software logic — see how smooth acceleration curves feel,
          or test how window hiding protects your screen share.
        </p>
      </div>

      {/* Sandbox Container */}
      <div className="rounded-3xl bg-[#090d18]/85 border border-white/[0.09] backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/80">
        {/* Module Selector Bar */}
        <div className="flex flex-wrap border-b border-white/[0.07] bg-black/40 p-2 sm:p-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('easing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'easing'
                ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Smooth Motion Curves</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'privacy'
                ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Screen Privacy Simulator</span>
          </button>
        </div>

        {/* Tab 1: Bézier Easing Playground */}
        {activeTab === 'easing' && (
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    How Animation Curves Feel
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Natural objects don&apos;t move in straight robotic lines; they accelerate, glide,
                    and decelerate smoothly. Pick a curve below and click &ldquo;Launch Motion&rdquo; to test
                    how it feels.
                  </p>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 gap-2.5">
                  {EASING_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset)
                        setAnimTrigger((t) => t + 1)
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPreset.name === preset.name
                          ? 'bg-cyan-500/[0.12] border-cyan-400/50 text-white shadow-sm'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="text-xs font-semibold block text-slate-200">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-cyan-300 font-mono mt-0.5 block">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* CSS snippet & copy */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.07] flex items-center justify-between gap-2">
                  <div className="font-mono text-[11px] text-slate-300 truncate">
                    {selectedPreset.css}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCss}
                    className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition-colors shrink-0"
                    title="Copy CSS transition code"
                  >
                    {copiedCss ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setAnimTrigger((t) => t + 1)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wide transition-all shadow-lg shadow-cyan-500/25"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Motion Simulation</span>
                </button>
              </div>

              {/* Visualization Canvas Column */}
              <div className="lg:col-span-7 flex flex-col gap-6 p-6 rounded-2xl bg-black/50 border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Interactive Runner Track</span>
                  <span className="text-cyan-400 font-semibold">{selectedPreset.name}</span>
                </div>

                {/* Physical Kinetic Runner */}
                <div className="space-y-4 py-2">
                  <div className="relative w-full h-12 bg-white/[0.03] border border-white/[0.07] rounded-xl flex items-center px-3 overflow-hidden">
                    <div className="absolute left-0 right-0 h-[1px] bg-white/[0.08]" />
                    <motion.div
                      key={`runner-${animTrigger}`}
                      initial={{ x: 0 }}
                      animate={{ x: 'calc(100% - 2.5rem)' }}
                      transition={{
                        duration: 1.2,
                        ease: selectedPreset.bezier as [number, number, number, number],
                      }}
                      className="w-10 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-mono font-bold text-xs shadow-lg shadow-cyan-500/40 relative z-10"
                    >
                      🚀
                    </motion.div>
                  </div>

                  <div className="relative w-full h-8 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center px-3 overflow-hidden">
                    <motion.div
                      key={`glow-bar-${animTrigger}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{
                        duration: 1.2,
                        ease: selectedPreset.bezier as [number, number, number, number],
                      }}
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <span>Start (0.0s)</span>
                  <span>Kinetic Acceleration</span>
                  <span>Settled (1.2s)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Screen Privacy / Window Hiding Simulator */}
        {activeTab === 'privacy' && (
          <div className="p-6 sm:p-8">
            <div className="max-w-2xl mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                How StreamShield Hides Windows
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Toggle the shield button on any window below to see what happens. The window stays
                completely visible to you on your desktop monitor, but instantly disappears from your
                Discord or Zoom stream broadcast!
              </p>
            </div>

            {/* Dual Display Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Monitor: What you see on your physical screen */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.1] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-slate-200">
                        YOUR MONITOR (You See Everything)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      Normal View
                    </span>
                  </div>

                  {/* 3 Sim Windows */}
                  <div className="space-y-3">
                    {/* Window 1 */}
                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Private Discord Chat
                        </span>
                        <span className="text-[10px] text-slate-400">Personal messages &amp; tags</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setChatShielded(!chatShielded)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                          chatShielded
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.15]'
                        }`}
                      >
                        {chatShielded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{chatShielded ? 'Shielded' : 'Exposed'}</span>
                      </button>
                    </div>

                    {/* Window 2 */}
                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Banking / Crypto Wallet
                        </span>
                        <span className="text-[10px] text-slate-400">Sensitive account balances</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBankShielded(!bankShielded)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                          bankShielded
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.15]'
                        }`}
                      >
                        {bankShielded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{bankShielded ? 'Shielded' : 'Exposed'}</span>
                      </button>
                    </div>

                    {/* Window 3 */}
                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Project Code Window
                        </span>
                        <span className="text-[10px] text-slate-400">Work files &amp; notes</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotesShielded(!notesShielded)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                          notesShielded
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.15]'
                        }`}
                      >
                        {notesShielded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{notesShielded ? 'Shielded' : 'Exposed'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-slate-400 font-mono">
                  All 3 windows remain 100% visible on your screen.
                </div>
              </div>

              {/* Right Monitor: What your stream viewers see */}
              <div className="p-5 rounded-2xl bg-[#060810] border border-white/[0.1] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-mono font-bold text-slate-200">
                        STREAM BROADCAST (What Viewers See)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      Live Feed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Window 1 on Stream */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-300 ${
                        chatShielded
                          ? 'bg-transparent border-dashed border-white/[0.1] text-slate-600'
                          : 'bg-white/[0.04] border-white/[0.08] text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">
                          {chatShielded ? '🔒 Hidden from Stream' : 'Private Discord Chat'}
                        </span>
                        <span className="text-[10px] font-mono">
                          {chatShielded ? 'Invisible' : 'Visible'}
                        </span>
                      </div>
                    </div>

                    {/* Window 2 on Stream */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-300 ${
                        bankShielded
                          ? 'bg-transparent border-dashed border-white/[0.1] text-slate-600'
                          : 'bg-white/[0.04] border-white/[0.08] text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">
                          {bankShielded ? '🔒 Hidden from Stream' : 'Banking / Crypto Wallet'}
                        </span>
                        <span className="text-[10px] font-mono">
                          {bankShielded ? 'Invisible' : 'Visible'}
                        </span>
                      </div>
                    </div>

                    {/* Window 3 on Stream */}
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-300 ${
                        notesShielded
                          ? 'bg-transparent border-dashed border-white/[0.1] text-slate-600'
                          : 'bg-white/[0.04] border-white/[0.08] text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">
                          {notesShielded ? '🔒 Hidden from Stream' : 'Project Code Window'}
                        </span>
                        <span className="text-[10px] font-mono">
                          {notesShielded ? 'Invisible' : 'Visible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] font-mono text-emerald-400">
                  {chatShielded && bankShielded
                    ? '✓ Privacy Protected: Private apps are invisible on stream'
                    : '⚠ Caution: Unshielded windows are broadcasting'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
