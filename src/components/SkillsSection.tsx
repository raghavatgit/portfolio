import { Shield, Layers, Radio, Terminal, Cpu, Wrench, Sparkles } from 'lucide-react'

interface SkillCategory {
  title: string
  icon: typeof Shield
  accentColor: string
  description: string
  skills: string[]
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Fast Desktop & Systems',
    icon: Shield,
    accentColor: '#FF4757', // Coral
    description:
      'Building native Windows tools that start instantly, use almost no RAM, and interact directly with OS window management.',
    skills: [
      'Rust (Primary language)',
      'C & C++',
      'Windows Native APIs',
      'Desktop Privacy & Security',
      'Tauri v2 Desktop Apps',
      'Memory Efficiency',
    ],
  },
  {
    title: '3D Graphics & Creative Tools',
    icon: Sparkles,
    accentColor: '#00F0FF', // Cyan
    description:
      'Creating interactive 3D simulations, physics engines, and automation scripts that save hours in video editing.',
    skills: [
      'Three.js & WebGL',
      '3D Physics & Orbital Gravity',
      'Adobe After Effects Scripts',
      'DaVinci Resolve Fusion Lua',
      'Smooth Animation Curves',
      'Web Audio & Canvas APIs',
    ],
  },
  {
    title: 'Hardware & Smart Sensors',
    icon: Radio,
    accentColor: '#FFA502', // Amber
    description:
      'Connecting physical microchips, reading motion sensors for indoor navigation, and sending radio packets without internet.',
    skills: [
      'ESP32 Microcontrollers',
      'Emergency Radio (LoRa 868/915 MHz)',
      'Motion Sensors (Gyros & Accelerometers)',
      'Indoor Step Tracking',
      'Bluetooth Low Energy (BLE)',
      'C++ on Hardware',
    ],
  },
  {
    title: 'Modern Web & Interactive UI',
    icon: Layers,
    accentColor: '#00E676', // Emerald
    description:
      'Designing clean, responsive user interfaces with immediate visual feedback, smooth spring animations, and zero bloat.',
    skills: [
      'TypeScript & Modern JavaScript',
      'React 19 & Next.js',
      'Vite & Fast Bundlers',
      'Tailwind CSS v4',
      'Framer Motion Springs',
      'WebSockets & Live Sync',
    ],
  },
  {
    title: 'Computer Science Foundations',
    icon: Cpu,
    accentColor: '#8B5CF6', // Purple
    description:
      'Solid university foundation in algorithms, systems architecture, operating systems, and network communication.',
    skills: [
      'Data Structures & Algorithms',
      'Operating System Internals',
      'Computer Networking',
      'Memory Management & Concurrency',
      'Linux & Terminal Scripting',
      'Clean Code Practices',
    ],
  },
  {
    title: 'Everyday Development Tools',
    icon: Wrench,
    accentColor: '#38BDF8', // Blue
    description:
      'Modern version control, dependable testing, rapid builds, and smooth automated website deployments.',
    skills: [
      'Git & GitHub Workflows',
      'Cargo (Rust toolchain)',
      'Visual Studio & VS Code',
      'Firebase Hosting & Deployments',
      'REST APIs & Local Testing',
      'Performance Profilers',
    ],
  },
]

export function SkillsSection() {
  return (
    <section id="stack" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>TECHNICAL RANGE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Skills &amp; Tools
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
          Technologies I work with daily, organized simply by what they achieve.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <div
              key={cat.title}
              className="group rounded-3xl bg-[#090d18]/85 border border-white/[0.08] hover:border-white/[0.18] p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/70 flex flex-col justify-between"
            >
              <div>
                {/* Category Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2.5 rounded-xl border border-white/[0.1] shadow-md transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${cat.accentColor}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.accentColor }} />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {cat.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light mb-6">
                  {cat.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-slate-300 group-hover:border-white/[0.12] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
