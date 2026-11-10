import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  Radio,
  Sparkles,
  Layers,
  Compass,
  Play,
  RotateCcw,
  Zap,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'
import { useMascot } from '@/context/MascotContext'

interface Project {
  id: string
  title: string
  brickIndex: number
  color: string
  category: string
  tagline: string
  summary: string
  image?: string
  stack: string[]
  metrics: { label: string; value: string }[]
  github?: string
  status: string
  interactiveType: 'stream-cloak' | 'orbital-physics' | 'imu-radar' | 'video-reel' | 'lora-packet' | 'curve-bridge'
}

const PROJECTS: Project[] = [
  {
    id: 'streamshield',
    title: 'StreamShield',
    brickIndex: 0,
    color: '#FF4757', // Coral
    category: 'Systems & Privacy',
    tagline: 'Invisible on Stream · Visible to You',
    summary:
      'Windows desktop tool written in Rust that cloaks confidential windows from screen capture APIs with zero GPU latency.',
    image: '/assets/projects/streamshield-logo.png',
    stack: ['Rust', 'Windows API', 'Tauri v2', 'TypeScript'],
    metrics: [
      { label: 'Binary Footprint', value: '3.1 MB' },
      { label: 'Hook Latency', value: '< 0.4ms' },
      { label: 'Stream Drop', value: '0 FPS' },
    ],
    github: 'https://github.com/raghavatgit/StreamShield',
    status: 'Ready to Run',
    interactiveType: 'stream-cloak',
  },
  {
    id: 'sidereal',
    title: 'Sidereal',
    brickIndex: 2,
    color: '#00F0FF', // Cyan
    category: '3D & Orbital Physics',
    tagline: 'Interactive 60 FPS Keplerian Spaceflight',
    summary:
      'Real-time orbital gravity simulator and steerable spacecraft engine built with Three.js, WebGL, and custom Euler physics.',
    image: '/assets/projects/sidereal.png',
    stack: ['Three.js', 'WebGL', 'Physics Engine', 'TypeScript'],
    metrics: [
      { label: 'Simulation Rate', value: '60 FPS' },
      { label: 'Physics Loop', value: 'Keplerian' },
      { label: 'Lighting', value: 'Custom GLSL' },
    ],
    status: 'Live Simulation',
    interactiveType: 'orbital-physics',
  },
  {
    id: 'navdrishti',
    title: 'NavDrishti',
    brickIndex: 3,
    color: '#00E676', // Emerald
    category: 'Inertial Sensors & IoT',
    tagline: 'Indoor Positioning When Satellites Fail',
    summary:
      'Sensor-fused IMU dead-reckoning engine tracking indoor coordinates via Kalman filters when satellite GPS is unreachable.',
    stack: ['Python', 'IMU Sensors', 'Kalman Filters', 'Leaflet'],
    metrics: [
      { label: 'Indoor Drift', value: '< 0.8m' },
      { label: 'GPS Required', value: '0%' },
      { label: 'Sample Rate', value: '100 Hz' },
    ],
    github: 'https://github.com/raghavatgit/NavDrishti',
    status: 'Research Engine',
    interactiveType: 'imu-radar',
  },
  {
    id: 'brandnest',
    title: 'BrandNest',
    brickIndex: 6,
    color: '#EC4899', // Pink
    category: 'Creative Showcase',
    tagline: 'Ultra-Fast 4K Agency Showreel Platform',
    summary:
      'High-impact media presentation platform featuring instant video streaming, smooth page transitions, and bespoke typography.',
    image: '/assets/projects/brandnest.png',
    stack: ['React', 'Video Optimization', 'Modern CSS', 'Tailwind'],
    metrics: [
      { label: 'Load Buffer', value: '< 120ms' },
      { label: 'Layout Shift', value: '0.00 CLS' },
      { label: 'Asset Caching', value: 'Edge-Pushed' },
    ],
    status: 'Client Platform',
    interactiveType: 'video-reel',
  },
  {
    id: 'aegis-raksha',
    title: 'Aegis-Raksha',
    brickIndex: 4,
    color: '#FFA502', // Amber
    category: 'Hardware & RF Mesh',
    tagline: 'Decentralized Long-Range Radio Comms',
    summary:
      'Pocket-sized emergency radio hardware relaying encrypted SOS alerts and GPS telemetry across 10+ km without cellular towers.',
    stack: ['ESP32 Hardware', 'LoRa 868MHz', 'C++', 'Offline App'],
    metrics: [
      { label: 'Radio Line-of-Sight', value: '10+ km' },
      { label: 'Cell Tower Need', value: 'Zero' },
      { label: 'Battery Lifespan', value: '48+ hrs' },
    ],
    github: 'https://github.com/raghavatgit/Aegis-Raksha',
    status: 'Hardware Prototype',
    interactiveType: 'lora-packet',
  },
  {
    id: 'new-atlas',
    title: 'PerpEdit (New-Atlas)',
    brickIndex: 5,
    color: '#8B5CF6', // Purple
    category: 'Creative Tooling',
    tagline: 'One-Click After Effects & Resolve Bridge',
    summary:
      'Motion translation tool that reads Bézier animation curves, cuts, and layers in After Effects and maps them into DaVinci Resolve.',
    stack: ['TypeScript', 'After Effects SDK', 'DaVinci Fusion Lua'],
    metrics: [
      { label: 'Time Saved', value: '3+ hrs/cut' },
      { label: 'Curve Fidelity', value: '100% Exact' },
      { label: 'Script Execution', value: 'Native' },
    ],
    status: 'Active Workflow',
    interactiveType: 'curve-bridge',
  },
  {
    id: 'vencord-ytm-player',
    title: 'Discord Music Player',
    brickIndex: 7,
    color: '#38BDF8', // Glacier Blue
    category: 'Native Integrations',
    tagline: 'Dynamic Art Palette & Chat Controls',
    summary:
      'Zero-distraction mini-player embedded directly inside Discord chat with dynamic background palette syncing and instant hotkeys.',
    stack: ['TypeScript', 'Vencord API', 'Canvas Color API'],
    metrics: [
      { label: 'Gaming FPS Lag', value: '0.0%' },
      { label: 'Palette Extraction', value: 'Real-time' },
      { label: 'Memory Use', value: '< 1 MB' },
    ],
    github: 'https://github.com/raghavatgit/vencord-ytm-player',
    status: 'Open Source',
    interactiveType: 'stream-cloak',
  },
]

export function ProjectsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { setHoveredProject } = useMascot()

  // Interactive Demonstration States
  const [isShieldActive, setIsShieldActive] = useState(true)
  const [orbitalSpeed, setOrbitalSpeed] = useState(1.4)
  const [radarPings, setRadarPings] = useState(3)
  const [packetHops, setPacketHops] = useState(4)

  const activeProject = PROJECTS[selectedIndex]

  const handleSelectProject = (index: number) => {
    setSelectedIndex(index)
    setHoveredProject(PROJECTS[index].id)
  }

  const handlePrev = () => {
    const nextIdx = (selectedIndex - 1 + PROJECTS.length) % PROJECTS.length
    handleSelectProject(nextIdx)
  }

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % PROJECTS.length
    handleSelectProject(nextIdx)
  }

  return (
    <section id="projects" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header: Minimal, Typographic & Lively (No Cards) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>INTERACTIVE DEMONSTRATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-3 flex-wrap">
            <span>Featured</span>
            <span className="font-serif italic font-normal text-flow-chromatic text-[1.08em]">
              Works &amp; Systems
            </span>
            <span className="font-cursive text-amber-300 text-xl font-normal select-none -rotate-2">
              ~ live demonstrations
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
            Every tool is engineered to solve a physical problem. Tap through the live stage to explore each architecture.
          </p>
        </div>

        {/* Navigation Step Ticker */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">
            <strong className="text-white font-bold">{String(selectedIndex + 1).padStart(2, '0')}</strong>
            <span className="text-white/20 mx-1">/</span>
            <span>{String(PROJECTS.length).padStart(2, '0')}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-all"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-all"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Horizon Project Selector Bar (Borderless, Fluid, Lego Color Studs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar select-none border-b border-white/[0.05]">
        {PROJECTS.map((project, idx) => {
          const isSelected = selectedIndex === idx
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => handleSelectProject(idx)}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className={`relative flex items-center gap-2.5 px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                isSelected
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              {/* Lego Stud matching Mascot brick */}
              <span
                className="w-2.5 h-2.5 rounded-[3px] shrink-0 transition-transform flex items-center justify-center relative shadow-sm"
                style={{
                  backgroundColor: project.color,
                  boxShadow: isSelected ? `0 0 10px ${project.color}` : 'none',
                  transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                <span className="w-1 h-1 rounded-full bg-white/80" />
              </span>

              <span>{project.title}</span>

              {/* Active Gliding Pill with Fluid Spring */}
              {isSelected && (
                <motion.div
                  layoutId="active-project-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full border"
                  style={{
                    borderColor: `${project.color}60`,
                    backgroundColor: `${project.color}15`,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* The Cinematic Stage: Grand, Borderless, Demonstrative (Zero Boxed Cards) */}
      <div className="relative">
        {/* Dynamic Project Ambient Glow */}
        <div
          className="pointer-events-none absolute -top-10 -left-10 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 transition-all duration-700"
          style={{ backgroundColor: activeProject.color }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column: Visual Media & Live Physics Demonstration Stage */}
            <div className="lg:col-span-7 relative">
              {/* Visual Showcase Frame with Dynamic Glow */}
              <div className="relative rounded-3xl overflow-hidden bg-[#070a12] border border-white/[0.1] shadow-2xl group">
                {activeProject.image ? (
                  <div className="relative w-full h-72 sm:h-96 overflow-hidden">
                    <img
                      src={activeProject.image}
                      alt={`${activeProject.title} demonstration`}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 opacity-90"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  /* Procedural Fallback Stage for Hardware / Research */
                  <div className="w-full h-72 sm:h-96 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-gradient-to-br from-[#080d1a] to-[#04060b]">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${activeProject.color}15`, border: `1.5px solid ${activeProject.color}40` }}
                    >
                      {activeProject.id === 'navdrishti' && <Compass className="w-10 h-10" style={{ color: activeProject.color }} />}
                      {activeProject.id === 'aegis-raksha' && <Radio className="w-10 h-10" style={{ color: activeProject.color }} />}
                      {activeProject.id === 'new-atlas' && <Layers className="w-10 h-10" style={{ color: activeProject.color }} />}
                      {activeProject.id === 'vencord-ytm-player' && <Zap className="w-10 h-10" style={{ color: activeProject.color }} />}
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-1">
                      {activeProject.category}
                    </span>
                    <h4 className="text-xl font-bold text-white tracking-tight">{activeProject.tagline}</h4>
                  </div>
                )}

                {/* Live Interactive Physics Overlay on the Media Stage */}
                <div className="p-4 sm:p-5 bg-[#090d19]/90 border-t border-white/[0.08] backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
                  {/* Interactive Demo Control 1: StreamShield Cloak Simulator */}
                  {activeProject.interactiveType === 'stream-cloak' && (
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-400">Stream Cloak Mode:</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            isShieldActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isShieldActive ? 'SHIELDED (INVISIBLE)' : 'EXPOSED'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsShieldActive(!isShieldActive)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono text-white transition-all border border-white/[0.1]"
                      >
                        {isShieldActive ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>Toggle Cloak</span>
                      </button>
                    </div>
                  )}

                  {/* Interactive Demo Control 2: Sidereal Orbital Velocity Slider */}
                  {activeProject.interactiveType === 'orbital-physics' && (
                    <div className="w-full flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                        <span>Kepler Orbital Speed:</span>
                        <strong className="text-cyan-300">{orbitalSpeed.toFixed(1)}x</strong>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={orbitalSpeed}
                        onChange={(e) => setOrbitalSpeed(parseFloat(e.target.value))}
                        className="w-36 accent-cyan-400 cursor-pointer"
                        title="Simulate orbital velocity"
                      />
                    </div>
                  )}

                  {/* Interactive Demo Control 3: NavDrishti IMU Inertial Step Pulse */}
                  {activeProject.interactiveType === 'imu-radar' && (
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Dead-Reckoning Coordinates:</span>
                        <strong className="text-emerald-300 font-mono">X:{radarPings * 1.4}m, Y:{radarPings * 0.9}m</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRadarPings((p) => p + 1)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Accumulate Step</span>
                      </button>
                    </div>
                  )}

                  {/* Interactive Demo Control 4: Aegis-Raksha Packet Hop */}
                  {activeProject.interactiveType === 'lora-packet' && (
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>Ad-Hoc Mesh Distance:</span>
                        <strong className="text-amber-300 font-mono">{(packetHops * 2.5).toFixed(1)} km</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPacketHops((h) => (h >= 6 ? 1 : h + 1))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono transition-all"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Relay Hop (+2.5km)</span>
                      </button>
                    </div>
                  )}

                  {/* Generic Status Meta */}
                  {(activeProject.interactiveType === 'video-reel' || activeProject.interactiveType === 'curve-bridge') && (
                    <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 text-purple-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Zero Buffer Hardware Pre-render</span>
                      </span>
                      <span className="text-emerald-400 font-semibold">{activeProject.status}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: High-Signal Details, Minimalist Telemetry & Source (Zero Clutter) */}
            <div className="lg:col-span-5 flex flex-col items-start space-y-6">
              {/* Category & Mascot Connection Tag */}
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium border"
                  style={{
                    backgroundColor: `${activeProject.color}15`,
                    borderColor: `${activeProject.color}40`,
                    color: activeProject.color,
                  }}
                >
                  {activeProject.category}
                </span>

                <span className="text-slate-400 text-xs font-mono">
                  Mascot Brick #{activeProject.brickIndex}
                </span>
              </div>

              {/* Title & Tagline with Dynamic Flowing Gradient */}
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
                  {activeProject.title}
                </h3>
                <p className="font-serif italic text-lg sm:text-xl text-flow-vibrant">
                  &ldquo;{activeProject.tagline}&rdquo;
                </p>
              </div>

              {/* Razor-Sharp Summary (Lesser text, high impact) */}
              <p className="text-base text-slate-300 leading-relaxed font-light">
                {activeProject.summary}
              </p>

              {/* Borderless Micro-Telemetry Strip (Pure numbers, no card containers) */}
              <div className="w-full py-4 border-y border-white/[0.08] grid grid-cols-3 gap-3">
                {activeProject.metrics.map((metric) => (
                  <div key={metric.label}>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white block">
                      {metric.value}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block tracking-tight">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Technology Stack Pills */}
              <div className="flex flex-wrap gap-1.5">
                {activeProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Direct Actions: GitHub Link & Demonstration */}
              <div className="flex items-center gap-3 pt-2">
                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-xs font-medium text-white border border-white/[0.12] transition-all group"
                  >
                    <GithubIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>View Architecture on GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                )}

                <span className="text-xs font-cursive text-cyan-300 select-none">
                  ~ interactive module active
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
