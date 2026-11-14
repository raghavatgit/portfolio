// Single source of truth, grounded in github.com/raghavatgit (profile, README, 19 repos, language stats).

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

// Share of code across all public repositories (GitHub languages API).
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
  { id: 'winapi', label: 'Windows API' },
  { id: 'csharp', label: 'C#' },
  { id: 'wpf', label: 'WPF UI' },
  { id: 'powershell', label: 'PowerShell' },
  { id: 'cpp', label: 'C++' },
  { id: 'esp32', label: 'ESP32 Chips' },
  { id: 'lora', label: 'LoRa Radio' },
  { id: 'ble', label: 'Bluetooth LE' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'python', label: 'Python' },
  { id: 'kalman', label: 'Smart Filter' },
  { id: 'tcn', label: 'Motion AI' },
  { id: 'fastapi', label: 'FastAPI' },
  { id: 'websockets', label: 'Live Streams' },
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'css3d', label: 'CSS 3D' },
  { id: 'threejs', label: 'Three.js' },
  { id: 'webaudio', label: 'Web Audio' },
  { id: 'firebase', label: 'Firebase' },
  { id: 'tailwind', label: 'Tailwind CSS' },
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
    kind: 'Screen privacy',
    line: 'Hides private windows when you share your screen on OBS, Discord, or Zoom.',
    facts: [
      'Uses built-in Windows privacy flags so recorders skip chosen windows',
      'Runs in the background using under 25 MB of memory',
      'Fast Rust core connected to a smooth desktop interface',
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
    kind: 'Windows speedup',
    line: 'A tiny 275 KB Windows cleaner that cuts background lag and opens in 50 ms.',
    facts: [
      'Safely tunes settings for both Windows 10 and Windows 11',
      'Creates automatic backups and restore points before every change',
      'Runs natively on Windows with zero extra downloads required',
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
    kind: 'Offline messaging',
    line: 'Long-range radios that pass emergency messages along when cell towers fail.',
    facts: [
      'Smart hop limits stop radio loops and block duplicate messages',
      'Mobile app talks to nearby radios over offline Bluetooth',
      'USB base hubs upload rescue locations once online again',
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
    kind: 'Indoor tracking',
    line: 'Tracks movement inside buildings and tunnels where GPS signals disappear.',
    facts: [
      'Reads 6-axis motion sensors to map direction and footsteps',
      'Smart smoothing corrects sensor drift whenever you stop walking',
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
    kind: 'Smart farming',
    line: 'Streams live soil measurements from field probes straight into a farm dashboard.',
    facts: [
      'Live soil nutrient, moisture, and temperature readings',
      'Fast server predicts crop disease risk early',
      'Real-time React dashboard for quick farm monitoring',
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
    kind: '3D web design',
    line: 'A 3D web card tilted by your mouse speed, made with pure CSS instead of heavy 3D engines.',
    facts: [
      'Smooth 3D depth math running under 1 ms per frame',
      'Entire site compresses to under 15 KB',
      'Loads globally in milliseconds on Firebase hosting',
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
    kind: '3D space sim',
    line: 'Steer a spacecraft across a real-time 3D solar system powered by gravity.',
    facts: [
      'Realistic planet orbits and gravity pulls',
      'Custom 3D sunlight, shadows, and glow effects',
      'Runs at a steady 60 FPS inside your browser',
    ],
    skills: ['threejs', 'typescript', 'javascript'],
    color: '#00F0FF',
    brick: 2,
    image: '/assets/projects/sidereal.png',
  },
  {
    id: 'vencord-ytm-player',
    title: 'YTM Player',
    year: '2026',
    kind: 'Audio plugin',
    line: 'Brings YouTube Music right inside Discord with soft ambient album colors.',
    facts: [
      'Balances volume smoothly between loud and quiet songs',
      'Instant play, pause, and skip controls with zero delay',
      'Updates your Discord live listening status automatically',
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
    kind: 'Video showcase',
    line: 'A visual showcase built to stream sharp 4K brand reels without buffering.',
    facts: [
      'Instant video playback',
      'Zero page jumping while media loads',
      'Clean custom typography',
    ],
    skills: ['react', 'tailwind', 'typescript'],
    color: '#EC4899',
    brick: 6,
    image: '/assets/projects/brandnest.png',
  },
  {
    id: 'orbit-smartcity',
    title: 'Orbit SmartCity',
    year: '2026',
    kind: 'City portal',
    line: 'Brings public transport, city services, and emergency help into one organized site.',
    facts: [
      'Built with React 18 and Vite',
      'Fast responsive design with Tailwind CSS',
      'Clean multi-page service finder',
    ],
    skills: ['react', 'tailwind', 'javascript'],
    color: '#6366F1',
    brick: 1,
    repo: 'https://github.com/raghavatgit/Orbit-SmartCity',
  },
]

export const STATS = [
  { value: 910, suffix: '+', label: 'GitHub updates this year' },
  { value: 210, suffix: '+', label: 'coding challenges solved' },
  { value: 110, suffix: '+', label: 'study notes documented' },
  { value: 19, suffix: '', label: 'public projects built' },
]

export const SERVICES = [
  { n: '01', title: 'Desktop apps', line: 'Fast Windows utilities built in C#, Rust, and Tauri.' },
  { n: '02', title: '3D websites', line: 'Interactive web experiences with real depth and tiny file sizes.' },
  { n: '03', title: 'Fast launches', line: 'Taking ideas from scratch to live apps on Firebase and Google Cloud.' },
]
