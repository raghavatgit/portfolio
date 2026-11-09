import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Shield, Radio, Sliders, CheckCircle2 } from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'

interface Project {
  id: string
  title: string
  category: 'systems' | 'creative' | 'iot'
  tagline: string
  problem: string
  solution: string
  stack: string[]
  metrics: string[]
  github?: string
  status: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    id: 'streamshield',
    title: 'StreamShield',
    category: 'systems',
    tagline: 'Per-Application Stream Privacy Manager for Windows',
    problem:
      'Sharing entire screens on OBS, Discord, or Zoom often leaks private messages, browser tabs, or code credentials by accident.',
    solution:
      'Injects a Win32 hook into target process windows to apply Windows Desktop Window Manager SetWindowDisplayAffinity. Excluded apps vanish completely on stream feeds while staying 100% visible on your monitor.',
    stack: ['Rust 2021', 'Tauri v2', 'Win32 DWM', 'Remote ASLR Injection', 'TypeScript'],
    metrics: ['3.1 MB Portable Binary', '0 ms Capture Lag', 'MPO GPU Optimized', 'Zero Drivers'],
    github: 'https://github.com/raghavatgit/StreamShield',
    status: 'Production v0.2.0',
    featured: true,
  },
  {
    id: 'navdrishti',
    title: 'NavDrishti',
    category: 'systems',
    tagline: 'GPS-Denied Dead Reckoning & Inertial Navigation Engine',
    problem:
      'GPS signals fail completely in underground tunnels, heavy urban canyons, and shielded indoor facilities, creating catastrophic position drift.',
    solution:
      'Fuses raw IMU telemetry (accelerometer, gyroscope) using an Extended Kalman Filter (EKF) combined with Temporal Convolutional Networks (TCN) to estimate step trajectories and suppress cumulative sensor drift.',
    stack: ['Python', 'Extended Kalman Filter', 'Temporal ConvNets', 'Leaflet', 'IMU Fusion'],
    metrics: ['Sub-meter indoor tracking', 'Real-time drift correction', 'Geospatial visualizer'],
    github: 'https://github.com/raghavatgit/NavDrishti',
    status: 'Research & Implementation',
    featured: true,
  },
  {
    id: 'aegis-raksha',
    title: 'Aegis-Raksha',
    category: 'iot',
    tagline: 'Decentralized Emergency Mesh Network for Disaster Zones',
    problem:
      'When earthquakes or floods knock out cellular towers and power grids, survivors and search teams lose all communication channels.',
    solution:
      'Ad-hoc multi-hop mesh network built on ESP32 microcontrollers and LoRa SX1276 transceivers. Delivers encrypted SOS beacons and medical distress packets peer-to-peer over kilometers to offline mobile apps.',
    stack: ['ESP32', 'LoRa SX1276 (868/915 MHz)', 'BLE', 'Flutter', 'C++ / FreeRTOS'],
    metrics: ['Up to 12 km rural range', 'Zero internet reliance', 'Battery optimized sleep'],
    github: 'https://github.com/raghavatgit/Aegis-Raksha',
    status: 'Hardware Prototype',
    featured: true,
  },
  {
    id: 'new-atlas',
    title: 'New-Atlas (PerpEdit)',
    category: 'creative',
    tagline: 'Multi-Host Creative Engine & Animation Workflow Hub',
    problem:
      'Professional video creators waste hours repeating manual keyframe easing curves, battling timeline clutter, and styling captions across different host apps.',
    solution:
      'Dual-bridge architecture connecting After Effects (ExtendScript/UXP) and DaVinci Resolve (Lua). Offers an interactive Bézier curve editor, GPU plugin bypass manager, local AI speech-to-text, and Ed25519 cryptographic token licensing.',
    stack: ['TypeScript', 'ExtendScript', 'Resolve Fusion Lua', 'Ed25519', 'React 19'],
    metrics: ['Dual-host AE + Resolve', 'Interactive Bézier Curves', 'Offline license grace'],
    status: 'In Active Development',
    featured: true,
  },
  {
    id: 'vencord-ytm-player',
    title: 'vencord-ytm-player',
    category: 'creative',
    tagline: 'Zero-Lag YouTube Music Mini-Player & Discord Presence',
    problem:
      'Switching browser tabs just to pause, skip, or inspect playback breaks flow while gaming or programming.',
    solution:
      'Desktop companion for Vencord and YouTube Music. Injects optimistic UI controls, extracts dominant album art color palettes via Canvas API for ambient glow, and maintains bidirectional state sync via local WebSockets.',
    stack: ['TypeScript', 'Vencord API', 'WebSockets', 'Canvas API', 'Discord Rich Presence'],
    metrics: ['Zero-latency optimistic UI', 'Dynamic album color palette', 'Companion sync'],
    github: 'https://github.com/raghavatgit/vencord-ytm-player',
    status: 'Open Source',
  },
  {
    id: 'zenflow',
    title: 'ZenFlow',
    category: 'creative',
    tagline: 'Minimalist Workspace with Procedural Web Audio Engine',
    problem:
      'Bloated productivity tools cause more cognitive friction than the distractions they try to prevent.',
    solution:
      'Clean, distraction-free focus workspace integrating customizable Pomodoro intervals, guided breathing pacing, and procedural ambient sound synthesis directly via the browser Web Audio API.',
    stack: ['React', 'Web Audio API', 'TypeScript', 'Tailwind CSS', 'Local Storage'],
    metrics: ['Zero telemetry tracking', 'Pure browser audio synthesis', 'Sub-50ms render'],
    github: 'https://github.com/raghavatgit/Zenflow',
    status: 'Released',
  },
]

export function ProjectsSection() {
  const [filter, setFilter] = useState<'all' | 'systems' | 'creative' | 'iot'>('all')

  const filteredProjects = PROJECTS.filter((p) => filter === 'all' || p.category === filter)

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase block mb-2">
            Engineered Systems &amp; Software
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Selected Works &amp; Architecture
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light">
            Real software built to solve concrete technical bottlenecks across systems programming,
            creative tools, and hardware communication.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] self-start md:self-auto">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'systems', label: 'Low-Level Systems' },
            { id: 'creative', label: 'Creative Tools' },
            { id: 'iot', label: 'Embedded & IoT' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id as typeof filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === id
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="group relative flex flex-col justify-between rounded-2xl bg-[#090c18]/80 border border-white/[0.08] hover:border-cyan-500/30 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/70"
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                      {project.category === 'systems' && <Shield className="w-4 h-4 text-cyan-400" />}
                      {project.category === 'creative' && <Sliders className="w-4 h-4 text-indigo-400" />}
                      {project.category === 'iot' && <Radio className="w-4 h-4 text-emerald-400" />}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {project.category === 'systems' ? 'Systems & OS' : project.category === 'creative' ? 'Creative Tech' : 'Hardware & IoT'}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-slate-300">
                    {project.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight mb-1.5">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-cyan-400/90 mb-4 font-normal">
                  {project.tagline}
                </p>

                {/* Simple English Problem & Solution */}
                <div className="space-y-3 mb-6 text-sm text-slate-300 leading-relaxed font-light">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[11px] font-mono font-medium text-slate-400 block mb-1">
                      Problem Context
                    </span>
                    <p className="text-slate-300 text-xs sm:text-sm">{project.problem}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[11px] font-mono font-medium text-slate-400 block mb-1">
                      Architectural Solution
                    </span>
                    <p className="text-slate-300 text-xs sm:text-sm">{project.solution}</p>
                  </div>
                </div>
              </div>

              {/* Bottom: Stack & Actions */}
              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Metrics / Key specs */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.06] mb-5">
                  {project.metrics.map((metric) => (
                    <div key={metric} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                      <span className="truncate">{metric}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/[0.1] transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
