// Single source of truth, learned from github.com/raghavatgit (profile, README, 19 repos, language stats).

export const PROFILE = {
  name: 'Raghav Goyal',
  handle: 'raghavatgit',
  bio: "South Asian University '29",
  location: 'Delhi, India',
  university: 'South Asian University',
  batch: '2029',
  site: 'https://crag.web.app',
  portal: 'https://contactraghav.web.app',
  email: 'goyalraghav1289@gmail.com',
  discord: '@johnmaybesnow',
  github: 'https://github.com/raghavatgit',
  linkedin: 'https://www.linkedin.com/in/raghav-goyal-linkd/',
  youtube: 'https://www.youtube.com/@socrates-anxious',
  instagram: 'https://instagram.com/ykraghv',
  joined: 2026,
}

// Aggregated bytes across all public repos (GitHub languages API).
export const LANGUAGES: { name: string; pct: number; color: string }[] = [
  { name: 'JavaScript', pct: 67.1, color: '#F7DF1E' },
  { name: 'TypeScript', pct: 6.3, color: '#3B82F6' },
  { name: 'C#', pct: 5.9, color: '#A855F7' },
  { name: 'Dart', pct: 3.5, color: '#00E5FF' },
  { name: 'PowerShell', pct: 3.2, color: '#38BDF8' },
  { name: 'Python', pct: 2.6, color: '#22C55E' },
  { name: 'CSS', pct: 2.6, color: '#EC4899' },
  { name: 'HTML', pct: 2.4, color: '#FB923C' },
  { name: 'C++', pct: 1.8, color: '#F43F5E' },
  { name: 'Java', pct: 1.6, color: '#F59E0B' },
  { name: 'C', pct: 1.3, color: '#94A3B8' },
  { name: 'Rust', pct: 1.1, color: '#FF7849' },
]

export interface Skill {
  id: string
  label: string
}

export const SKILLS: Skill[] = [
  { id: 'rust', label: 'Rust' },
  { id: 'tauri', label: 'Tauri' },
  { id: 'winapi', label: 'Win32 API' },
  { id: 'csharp', label: 'C#' },
  { id: 'wpf', label: 'WPF' },
  { id: 'powershell', label: 'PowerShell' },
  { id: 'cpp', label: 'C++' },
  { id: 'esp32', label: 'ESP32' },
  { id: 'lora', label: 'LoRa' },
  { id: 'ble', label: 'BLE' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'python', label: 'Python' },
  { id: 'kalman', label: 'Kalman' },
  { id: 'tcn', label: 'TCN' },
  { id: 'fastapi', label: 'FastAPI' },
  { id: 'websockets', label: 'WebSockets' },
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'css3d', label: 'CSS 3D' },
  { id: 'threejs', label: 'Three.js' },
  { id: 'webaudio', label: 'Web Audio' },
  { id: 'firebase', label: 'Firebase' },
  { id: 'tailwind', label: 'Tailwind' },
]

export type LabId = 'mesh' | 'inertial' | 'cloak'

export interface Work {
  id: string
  title: string
  year: string
  kind: string
  line: string
  facts: string[]
  skills: string[]
  color: string
  brick: number
  repo?: string
  live?: string
  image?: string
  lab?: LabId
}

export const WORKS: Work[] = [
  {
    id: 'streamshield',
    title: 'StreamShield',
    year: '2026',
    kind: 'Desktop security',
    line: 'Hides chosen windows from OBS, Discord and Zoom at the compositor.',
    facts: [
      'SetWindowDisplayAffinity with WDA_EXCLUDEFROMCAPTURE',
      'Under 25 MB resident memory',
      'Async IPC bridge between Rust core and UI',
    ],
    skills: ['rust', 'tauri', 'winapi', 'typescript', 'react'],
    color: '#FF4757',
    brick: 0,
    repo: 'https://github.com/raghavatgit/StreamShield',
    image: '/assets/projects/streamshield-logo.png',
    lab: 'cloak',
  },
  {
    id: 'anxiouslyoptimized',
    title: 'AnxiouslyOptimized',
    year: '2026',
    kind: 'Windows performance',
    line: 'A 275 KB latency tuner and debloater that boots in under 50 ms.',
    facts: [
      'Dual OS registry engine for Windows 10 and 11',
      'Restore points, hive backups, 40 point validation suite',
      'Direct3D accelerated WPF, zero dependencies',
    ],
    skills: ['csharp', 'wpf', 'powershell', 'winapi'],
    color: '#0066FF',
    brick: 1,
    repo: 'https://github.com/raghavatgit/AnxiouslyOptimized',
  },
  {
    id: 'aegis-raksha',
    title: 'Aegis-Raksha',
    year: '2026',
    kind: 'Emergency mesh',
    line: 'LoRa radios that relay distress calls when every cell tower is down.',
    facts: [
      'SX1276 firmware with TTL hop limits and ring buffer dedupe',
      'Offline Flutter client over BLE GATT',
      'USB bridges stream field telemetry to the cloud',
    ],
    skills: ['cpp', 'esp32', 'lora', 'ble', 'flutter', 'python'],
    color: '#FFA502',
    brick: 4,
    repo: 'https://github.com/raghavatgit/Aegis-Raksha',
    lab: 'mesh',
  },
  {
    id: 'navdrishti',
    title: 'NavDrishti',
    year: '2026',
    kind: 'Inertial navigation',
    line: 'Dead reckoning that stays on course where GPS cannot reach.',
    facts: [
      'Temporal convolutional network on 6 axis IMU data',
      'Extended Kalman filter with ZUPT and odometry',
      'Built for Smart India Hackathon 2026',
    ],
    skills: ['python', 'tcn', 'kalman', 'javascript'],
    color: '#00E676',
    brick: 3,
    repo: 'https://github.com/raghavatgit/NavDrishti',
    lab: 'inertial',
  },
  {
    id: 'bitverse-agrostat',
    title: 'Bitverse Agrostat',
    year: '2026',
    kind: 'Industrial IoT',
    line: 'Live soil telemetry from ESP32 probes into a crop risk dashboard.',
    facts: [
      'NPK, moisture and temperature streamed over WebSockets',
      'FastAPI server with predictive disease models',
      'React 18 analytics front end',
    ],
    skills: ['esp32', 'python', 'fastapi', 'websockets', 'react'],
    color: '#10B981',
    brick: 5,
    repo: 'https://github.com/raghavatgit/Bitverse-Agrostat',
  },
  {
    id: 'contactme',
    title: 'ContactMe',
    year: '2026',
    kind: 'Spatial web',
    line: 'A 3D portal driven by cursor velocity, with no WebGL at all.',
    facts: [
      'Pure CSS3 matrix transforms in a sub 1 ms rAF loop',
      'Under 15 KB gzipped',
      'Hosted on the Firebase edge',
    ],
    skills: ['css3d', 'javascript', 'firebase'],
    color: '#8B5CF6',
    brick: 5,
    repo: 'https://github.com/raghavatgit/ContactMe',
    live: 'https://contactraghav.web.app',
  },
  {
    id: 'sidereal',
    title: 'Sidereal',
    year: '2026',
    kind: 'Orbital physics',
    line: 'A steerable spacecraft in a real time gravitational solar system.',
    facts: ['Keplerian orbital mechanics', 'Custom GLSL lighting', 'Holds 60 FPS in the browser'],
    skills: ['threejs', 'typescript', 'javascript'],
    color: '#00F0FF',
    brick: 2,
    image: '/assets/projects/sidereal.png',
  },
  {
    id: 'vencord-ytm-player',
    title: 'YTM Player',
    year: '2026',
    kind: 'Audio and Discord',
    line: 'YouTube Music inside Discord with an ambient album glow.',
    facts: [
      'Logarithmic DSP loudness normalisation',
      'Optimistic zero lag controls',
      'Discord rich presence sync',
    ],
    skills: ['typescript', 'react', 'webaudio'],
    color: '#38BDF8',
    brick: 7,
    repo: 'https://github.com/raghavatgit/vencord-ytm-player',
  },
  {
    id: 'brandnest',
    title: 'BrandNest',
    year: '2026',
    kind: 'Client platform',
    line: 'A showreel platform that streams heavy 4K without a stutter.',
    facts: ['Instant video start', 'Zero layout shift', 'Bespoke typography'],
    skills: ['react', 'tailwind', 'typescript'],
    color: '#EC4899',
    brick: 6,
    image: '/assets/projects/brandnest.png',
  },
  {
    id: 'orbit-smartcity',
    title: 'Orbit SmartCity',
    year: '2026',
    kind: 'Civic web',
    line: 'Transit, services and emergency dispatch in one municipal portal.',
    facts: ['React 18 with Vite', 'Tailwind design system', 'Modular service routing'],
    skills: ['react', 'tailwind', 'javascript'],
    color: '#6366F1',
    brick: 1,
    repo: 'https://github.com/raghavatgit/Orbit-SmartCity',
  },
]

export const STATS = [
  { value: 910, suffix: '+', label: 'contributions this year' },
  { value: 210, suffix: '+', label: 'solutions in dsa-patterns' },
  { value: 110, suffix: '+', label: 'systems notes in til' },
  { value: 19, suffix: '', label: 'public repositories' },
]

export const SERVICES = [
  { n: '01', title: 'Native tools', line: 'Windows desktop utilities in C#, Rust and Tauri.' },
  { n: '02', title: 'Spatial web', line: 'Full stack sites and 3D interfaces with zero bloat.' },
  { n: '03', title: 'MVP delivery', line: 'Idea to deployed prototype on GCP and Firebase.' },
]
