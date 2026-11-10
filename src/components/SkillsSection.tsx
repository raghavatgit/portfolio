import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Shield, Sparkles, Radio, Layers, Cpu } from 'lucide-react'
import { useMascot } from '@/context/MascotContext'

interface SkillTrack {
  id: string
  title: string
  brickIndex: number
  color: string
  icon: typeof Shield
  philosophy: string
  telemetry: string
  skills: string[]
}

const SKILL_TRACKS: SkillTrack[] = [
  {
    id: 'systems',
    title: 'Fast Systems & Silicon',
    brickIndex: 0,
    color: '#FF4757', // Coral
    icon: Shield,
    philosophy: 'Stripping out runtime garbage collection and targeting native OS APIs directly.',
    telemetry: '0.4ms Native Hook · 3.1 MB Footprint',
    skills: ['Rust', 'C & C++', 'Win32 APIs', 'Memory Management', 'Tauri v2 Desktop'],
  },
  {
    id: 'spatial',
    title: '3D Graphics & Orbital Physics',
    brickIndex: 2,
    color: '#00F0FF', // Cyan
    icon: Sparkles,
    philosophy: 'Keplerian orbital math and smooth Euler physics rendered at full 60 FPS in WebGL.',
    telemetry: '60 FPS WebGL · Custom Shaders',
    skills: ['Three.js', 'WebGL', 'Orbital Mechanics', 'GLSL Shaders', 'Web Audio API'],
  },
  {
    id: 'hardware',
    title: 'Offline RF & Smart Sensors',
    brickIndex: 4,
    color: '#FFA502', // Amber
    icon: Radio,
    philosophy: 'Sub-meter indoor dead reckoning and autonomous wireless radio meshes without internet.',
    telemetry: '10+ km Mesh · Zero Satellite Lag',
    skills: ['ESP32 Microcontrollers', 'LoRa Radio', 'IMU Motion Sensors', 'Kalman Filters', 'C++ Embedded'],
  },
  {
    id: 'bridges',
    title: 'Creative Motion Automation',
    brickIndex: 5,
    color: '#8B5CF6', // Purple
    icon: Cpu,
    philosophy: 'One-click mathematical bridges converting Bézier motion curves between post-production suites.',
    telemetry: 'Exact Bézier Curves · 3h Saved/Cut',
    skills: ['After Effects SDK', 'DaVinci Fusion Lua', 'Bézier Math', 'Python Automation', 'Canvas APIs'],
  },
  {
    id: 'interfaces',
    title: 'Fluid Interactive Interfaces',
    brickIndex: 3,
    color: '#00E676', // Emerald
    icon: Layers,
    philosophy: 'Immediate physical feedback, tactile spring-mass recoil, and zero visual stutter.',
    telemetry: 'Tactile Springs · Sub-frame Feedback',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion Springs', 'WebSockets'],
  },
]

export function SkillsSection() {
  const [activeTrackId, setActiveTrackId] = useState<string>(SKILL_TRACKS[0].id)
  const { setHighlightedBrickIndex } = useMascot()

  return (
    <section id="stack" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Header: Minimal, Architectural (Zero Boxed Cards) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3 backdrop-blur-md">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>TECHNICAL SPECTRUM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-3 flex-wrap">
            <span>Capabilities &amp;</span>
            <span className="font-serif italic font-normal text-flow-aurora text-[1.08em]">
              Technical Craft
            </span>
            <span className="font-cursive text-emerald-300 text-xl font-normal select-none -rotate-1">
              ~ architectural depth
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
            Organized as an active frequency matrix. Hover or tap any spectrum lane to inspect its capabilities and live telemetry.
          </p>
        </div>

        {/* Live Active Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive Matrix Synced with Mascot</span>
        </div>
      </div>

      {/* The Architectural Frequency Matrix: Borderless, Flowing, Reactive */}
      <div className="space-y-4">
        {SKILL_TRACKS.map((track) => {
          const Icon = track.icon
          const isActive = activeTrackId === track.id

          return (
            <div
              key={track.id}
              onMouseEnter={() => {
                setActiveTrackId(track.id)
                setHighlightedBrickIndex(track.brickIndex)
              }}
              onMouseLeave={() => setHighlightedBrickIndex(null)}
              className={`relative rounded-2xl transition-all duration-300 border ${
                isActive
                  ? 'bg-white/[0.03] border-white/[0.14] shadow-xl shadow-black/40'
                  : 'bg-transparent border-white/[0.05] hover:border-white/[0.1]'
              } p-5 sm:p-7 overflow-hidden`}
            >
              {/* Dynamic Atmospheric Color Aura */}
              {isActive && (
                <div
                  className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] opacity-15 transition-opacity duration-500"
                  style={{ backgroundColor: track.color }}
                />
              )}

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Column 1: Domain Title, Lego Stud & Philosophy */}
                <div className="lg:col-span-5 flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Lego Stud corresponding to Mascot */}
                    <span
                      className="w-3 h-3 rounded-[3px] flex items-center justify-center relative shadow-sm shrink-0"
                      style={{
                        backgroundColor: track.color,
                        boxShadow: isActive ? `0 0 12px ${track.color}` : 'none',
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-white/90" />
                    </span>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{track.title}</span>
                      <Icon className="w-4 h-4 opacity-60" style={{ color: track.color }} />
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-md">
                    {track.philosophy}
                  </p>
                </div>

                {/* Column 2: Live Kinetic Frequency Meter (Demonstration) */}
                <div className="lg:col-span-3 flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                    {track.telemetry}
                  </span>

                  {/* Animated Harmonic Frequency Bars */}
                  <div className="flex items-center gap-1 h-6">
                    {[0.3, 0.7, 0.45, 0.9, 0.6, 0.85, 0.4, 0.75, 1.0, 0.5, 0.8, 0.35].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={
                          isActive
                            ? {
                                height: [`${h * 24}px`, `${((h * 1.4) % 1) * 24 + 4}px`, `${h * 24}px`],
                              }
                            : { height: `${h * 14}px` }
                        }
                        transition={{
                          duration: 1.2 + (i % 4) * 0.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="w-1 rounded-full transition-colors duration-300"
                        style={{
                          backgroundColor: isActive ? track.color : 'rgba(255, 255, 255, 0.15)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Column 3: Skill Badges */}
                <div className="lg:col-span-4 flex flex-wrap gap-1.5 justify-start lg:justify-end">
                  {track.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 ${
                        isActive
                          ? 'bg-white/[0.08] text-white border border-white/[0.15] shadow-sm'
                          : 'bg-white/[0.02] text-slate-400 border border-white/[0.04]'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
