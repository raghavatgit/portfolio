import { Shield, Layers, Radio, Terminal, Cpu, Database } from 'lucide-react'

interface SkillCategory {
  title: string
  icon: typeof Shield
  description: string
  skills: string[]
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Low-Level Systems & Windows',
    icon: Shield,
    description:
      'Writing native desktop binaries, interacting with the Windows Desktop Window Manager compositor, memory management, and process injection.',
    skills: [
      'Rust (2021 Edition)',
      'C / C++',
      'Win32 APIs',
      'DWM Compositor Affinity',
      'ASLR Remote Thread Injection',
      'Tauri v2 Architecture',
    ],
  },
  {
    title: 'Creative Engines & Host Bridges',
    icon: Terminal,
    description:
      'Automating video post-production pipelines through native host scripting bridges, keyframe easing mathematics, and local AI toolchains.',
    skills: [
      'Adobe ExtendScript (After Effects)',
      'DaVinci Resolve Fusion Lua',
      'Cryptographic Licensing (Ed25519)',
      'Bézier Easing Kinetics',
      'Speech-to-Text Automations',
    ],
  },
  {
    title: 'Signals, Navigation & Embedded Hardware',
    icon: Radio,
    description:
      'Sensor data fusion, dead reckoning algorithms in GPS-deprived environments, and independent long-range radio mesh networks.',
    skills: [
      'Extended Kalman Filter (EKF)',
      'Temporal ConvNets (TCN)',
      'ESP32 Microcontrollers',
      'LoRa SX1276 (868/915 MHz)',
      'Bluetooth Low Energy (BLE)',
      'FreeRTOS Basics',
    ],
  },
  {
    title: 'Modern Web & Full-Stack Architecture',
    icon: Layers,
    description:
      'Designing fast, resilient client applications with strict type safety, zero layout shifts, and micro-interactions.',
    skills: [
      'TypeScript',
      'React 19 & Next.js',
      'Vite & Modern Bundlers',
      'Tailwind CSS v4',
      'Framer Motion / Spring Physics',
      'Web Audio API & Canvas API',
      'WebSockets',
    ],
  },
  {
    title: 'Core Computing Foundations',
    icon: Cpu,
    description:
      'Rigorous academic training at South Asian University spanning algorithms, memory hierarchies, and concurrency.',
    skills: [
      'Data Structures & Algorithms',
      'Operating Systems',
      'Computer Networks',
      'Memory Safety & Concurrency',
      'Linux & PowerShell Scripting',
      'Git Architecture',
    ],
  },
  {
    title: 'Tooling & Deployment Environments',
    icon: Database,
    description:
      'Practical development hygiene, clean builds, and automated hosting delivery.',
    skills: [
      'Git & GitHub Actions',
      'Firebase Hosting & Cloud Functions',
      'Visual Studio & VS Code',
      'Cargo & Rustup Toolchains',
      'Postman & REST Verification',
    ],
  },
]

export function SkillsSection() {
  return (
    <section id="stack" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase block mb-2">
          Technical Competencies
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Engineering Range &amp; Disciplines
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light">
          No fake percentage bars or buzzwords. Here is what I genuinely know, operate, and build with.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map(({ title, icon: Icon, description, skills }) => (
          <div
            key={title}
            className="flex flex-col justify-between p-6 rounded-2xl bg-[#090c18]/80 border border-white/[0.08] hover:border-cyan-500/30 backdrop-blur-xl transition-all duration-200 hover:shadow-xl hover:shadow-black/60"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-cyan-400">
                  <Icon className="w-4 h-4" />
                </span>
                <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-light mb-5">
                {description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.05]">
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

