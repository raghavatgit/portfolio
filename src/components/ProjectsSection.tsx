import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Shield, Radio, Sparkles, CheckCircle2, Compass, Layers, Music, Eye } from 'lucide-react'
import { GithubIcon } from '@/components/icons/SocialIcons'

interface Project {
  id: string
  title: string
  category: 'systems' | 'creative' | 'iot'
  tagline: string
  image?: string
  problem: string
  solution: string
  stack: string[]
  highlights: string[]
  github?: string
  status: string
  isFeatured?: boolean
}

const PROJECTS: Project[] = [
  {
    id: 'streamshield',
    title: 'StreamShield',
    category: 'systems',
    tagline: 'Keep private apps hidden while screen sharing',
    image: '/assets/projects/streamshield-logo.png',
    problem:
      'When you share your screen on Discord, Zoom, or OBS, your private windows (like banking, passwords, or personal chats) can easily be exposed to everyone watching.',
    solution:
      'StreamShield lets you pick any app with one click and tells Windows to exclude it from screen capture. The app stays 100% visible on your monitor, but becomes completely invisible on your stream.',
    stack: ['Rust', 'Windows API', 'Tauri v2', 'TypeScript'],
    highlights: ['Tiny 3 MB app', 'Zero stream lag', 'No drivers required', 'Instant hotkeys'],
    github: 'https://github.com/raghavatgit/StreamShield',
    status: 'Ready to Use',
    isFeatured: true,
  },
  {
    id: 'sidereal',
    title: 'Sidereal',
    category: 'creative',
    tagline: 'Interactive 3D Solar System & Space Flight Simulation',
    image: '/assets/projects/sidereal.png',
    problem:
      'Most web 3D space models are just static animations on rails. They do not simulate the real gravitational pull and orbital mechanics needed to steer a spacecraft between planets.',
    solution:
      'A full 3D interactive flight simulator where planets orbit with realistic gravity. You can steer a spacecraft, manage thruster fuel, orbit around celestial bodies, and view the solar system from cinematic angles.',
    stack: ['Three.js', 'WebGL', 'Physics Engine', 'TypeScript', 'Tailwind CSS'],
    highlights: ['Real orbital gravity math', 'Steerable spacecraft', 'High-res planetary textures', '60 FPS in browser'],
    status: 'Live Simulation',
    isFeatured: true,
  },
  {
    id: 'navdrishti',
    title: 'NavDrishti',
    category: 'systems',
    tagline: 'Accurate indoor navigation when GPS satellites fail',
    problem:
      'Satellite GPS stops working the moment you walk into a subway station, underground parking, tunnel, or large office building.',
    solution:
      'NavDrishti reads tiny movements from your phone or device sensors (accelerometer & gyroscope) and uses smart math filters to track every step you take in real time, with zero satellites needed.',
    stack: ['Python', 'Motion Sensors (IMU)', 'Kalman Filters', 'Leaflet Maps'],
    highlights: ['Works 100% offline', 'Sub-meter indoor accuracy', 'Fixes sensor drift', 'Live map view'],
    github: 'https://github.com/raghavatgit/NavDrishti',
    status: 'Research & Code',
    isFeatured: true,
  },
  {
    id: 'brandnest',
    title: 'BrandNest',
    category: 'creative',
    tagline: 'Fast digital showcase & showreel platform for agencies',
    image: '/assets/projects/brandnest.png',
    problem:
      'Creative agencies and video editors need portfolio websites that showcase heavy 4K videos and commercials without buffering, slow load times, or layout shifts.',
    solution:
      'A high-performance presentation platform featuring smooth video streaming, instant page transitions, bespoke typography, and responsive media grids designed for high visual impact.',
    stack: ['React', 'Video Optimization', 'Modern CSS', 'Tailwind'],
    highlights: ['Instant video loading', 'Custom typography', 'Zero layout shifts', 'Mobile-first design'],
    status: 'Client Platform',
  },
  {
    id: 'aegis-raksha',
    title: 'Aegis-Raksha',
    category: 'iot',
    tagline: 'Emergency radios that send texts when cell towers go down',
    problem:
      'Floods, earthquakes, and power outages frequently destroy cellular towers, leaving disaster victims and rescue teams completely unable to call for help.',
    solution:
      'A pocket-sized emergency radio device built on small chips. It forms an automatic wireless chain with other nearby devices, relaying SOS alerts and GPS coordinates for miles without internet or cell service.',
    stack: ['ESP32 Hardware', 'LoRa Radio Chips', 'C++', 'Offline Mobile App'],
    highlights: ['Over 10 km rural range', 'Zero internet needed', 'Runs days on a battery', 'End-to-end encrypted'],
    github: 'https://github.com/raghavatgit/Aegis-Raksha',
    status: 'Hardware Prototype',
  },
  {
    id: 'new-atlas',
    title: 'PerpEdit (New-Atlas)',
    category: 'creative',
    tagline: 'One-click bridge between After Effects and DaVinci Resolve',
    problem:
      'Video editors waste hours manually rebuilding animation curves and motion keyframes when switching between Adobe After Effects and DaVinci Resolve.',
    solution:
      'A smart bridge tool that reads motion keyframes, cuts, and text styles in one app and translates them cleanly into the other with a single click, saving hours of manual work.',
    stack: ['TypeScript', 'After Effects Scripts', 'DaVinci Fusion Lua', 'React'],
    highlights: ['Saves 3+ hours per edit', 'Preserves exact Bézier curves', 'Offline license support'],
    status: 'Active Tool',
  },
  {
    id: 'vencord-ytm-player',
    title: 'Discord Music Player',
    category: 'creative',
    tagline: 'Control YouTube Music directly inside your Discord chat',
    problem:
      'Having to alt-tab out of games or code just to pause, skip, or check the title of a song breaks your workflow.',
    solution:
      'A clean mini-player integrated right into Discord. It displays album artwork with dynamic background colors, volume sliders, and keyboard shortcuts without leaving your chat window.',
    stack: ['TypeScript', 'Vencord API', 'Canvas Color API', 'WebSockets'],
    highlights: ['Instant response', 'Adapts colors to album art', 'Zero lag while gaming'],
    github: 'https://github.com/raghavatgit/vencord-ytm-player',
    status: 'Open Source',
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>REAL PROJECTS &amp; TOOLS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-2 flex-wrap">
            <span>Featured</span>
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 text-[1.08em]">
              Works &amp; Systems
            </span>
            <span className="font-cursive text-amber-300 text-xl font-normal select-none -rotate-2">
              ~ built for real use
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
            Every project here was built to solve a real practical problem — making software faster,
            protecting privacy, or keeping people connected offline.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md self-start md:self-auto">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'systems', label: 'Fast Systems & Privacy' },
            { id: 'creative', label: '3D & Creative Apps' },
            { id: 'iot', label: 'Hardware & Radios' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id as typeof filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="group relative flex flex-col justify-between rounded-3xl bg-[#090d18]/85 border border-white/[0.09] hover:border-cyan-400/40 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 overflow-hidden"
            >
              {/* Optional Real Project Image Showcase */}
              {project.image && (
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-[#05070d] border border-white/[0.06] group-hover:border-cyan-500/30 transition-all">
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category Pill Tag Overlay on Image */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090d18]/85 border border-white/[0.15] backdrop-blur-md text-[11px] font-mono text-cyan-300">
                    {project.category === 'systems' && <Shield className="w-3.5 h-3.5 text-cyan-400" />}
                    {project.category === 'creative' && <Layers className="w-3.5 h-3.5 text-purple-400" />}
                    {project.category === 'iot' && <Radio className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{project.title}</span>
                  </div>

                  {/* Status Tag Overlay */}
                  <div className="absolute top-3 right-3 z-10 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/60 border border-white/[0.1] text-emerald-400 backdrop-blur-md">
                    {project.status}
                  </div>
                </div>
              )}

              {/* Top Meta when no image is present */}
              {!project.image && (
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      {project.category === 'systems' && <Compass className="w-4 h-4 text-cyan-400" />}
                      {project.category === 'creative' && <Music className="w-4 h-4 text-indigo-400" />}
                      {project.category === 'iot' && <Radio className="w-4 h-4 text-amber-400" />}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {project.category === 'systems' ? 'Systems & Sensors' : project.category === 'creative' ? 'Creative Tech' : 'Hardware & Radio'}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-slate-300">
                    {project.status}
                  </span>
                </div>
              )}

              {/* Title & Tagline */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight mb-1">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-cyan-400 mb-4 font-normal">
                  {project.tagline}
                </p>

                {/* Plain English Problem & Solution */}
                <div className="space-y-3 mb-6 text-sm text-slate-300 leading-relaxed font-light">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[11px] font-mono font-semibold text-rose-400/90 block mb-1">
                      The Problem
                    </span>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{project.problem}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[11px] font-mono font-semibold text-cyan-400 block mb-1">
                      How It Works
                    </span>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{project.solution}</p>
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
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.06] mb-5">
                  {project.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Source code / actions */}
                <div className="flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white border border-white/[0.1] transition-all"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>View on GitHub</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                  {project.image && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>Live Media Included</span>
                    </span>
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
