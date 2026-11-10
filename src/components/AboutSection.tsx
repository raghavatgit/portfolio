import { MapPin, GraduationCap, Laptop, Quote, Sparkles } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header: Minimal & Architectural (No Sloppy Rounded Boxes, No Pulsating Dots) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-slate-200 dark:border-white/[0.08] pb-8 transition-colors">
        <div>
          <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ORIGIN &amp; PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-3 flex-wrap">
            <span>Engineering</span>
            <span className="font-serif italic font-normal text-flow-chromatic text-[1.08em]">
              Perspective
            </span>
            <span className="font-cursive text-amber-600 dark:text-amber-300 text-xl font-normal select-none -rotate-1">
              from the ground up
            </span>
          </h2>
        </div>

        {/* Origin Coordinates */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>New Delhi, India / South Asian University</span>
        </div>
      </div>

      {/* Open Editorial Spatial Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Personal Manifesto & Philosophy */}
        <div className="lg:col-span-7 space-y-8 text-slate-600 dark:text-slate-300 font-light leading-relaxed transition-colors">
          {/* Typographic Manifesto Statement (No em-dashes) */}
          <div>
            <h3 className="font-serif italic text-3xl sm:text-4xl text-slate-900 dark:text-white font-normal leading-snug mb-4 transition-colors">
              Understanding software from the silicon up, stripping away runtime bloat to craft fast, dependable tools.
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              I am a Computer Science student at <strong className="font-bold text-slate-900 dark:text-white">South Asian University in New Delhi</strong>.
              I avoid treating software like a black box. Whether writing native desktop tools in Rust,
              guiding motion indoors when GPS satellites cannot reach, or simulating gravitational orbits in 3D,
              I build systems that respect hardware resources and execute without friction.
            </p>
          </div>

          {/* Borderless Typographic Context Line */}
          <div className="py-4 border-y border-slate-200 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-700 dark:text-slate-300 transition-colors">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>New Delhi, IN</span>
            </div>
            <span className="w-px h-3.5 bg-slate-300 dark:bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>South Asian University</span>
            </div>
            <span className="w-px h-3.5 bg-slate-300 dark:bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Systems &amp; Spatial Computing</span>
            </div>
          </div>

          {/* Socrates Philosophical Quote (No em-dashes) */}
          <div className="relative pt-2">
            <div className="flex items-start gap-4">
              <Quote className="w-8 h-8 text-cyan-600/40 dark:text-cyan-400/40 shrink-0 mt-1" />
              <div>
                <p className="font-serif italic text-2xl sm:text-3xl text-slate-900 dark:text-white font-normal leading-snug mb-2 transition-colors">
                  &ldquo;The unexamined life is not worth living.&rdquo;
                </p>
                <footer className="text-xs font-mono text-cyan-600 dark:text-cyan-300">
                  Socrates <span className="text-slate-500 dark:text-slate-400 font-sans">(A commitment to questioning assumptions and continuous learning)</span>
                </footer>
              </div>
            </div>
          </div>

          {/* Signature Line with Alex Brush Font and Flowing Chromatic Text */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-white/[0.06] transition-colors">
            <span className="font-brush text-4xl sm:text-5xl text-flow-chromatic select-none drop-shadow-[0_2px_14px_rgba(0,240,255,0.25)]">
              raghavgoyal.
            </span>
            <span className="font-cursive text-slate-500 dark:text-slate-400 text-lg rotate-1">
              software with soul
            </span>
          </div>
        </div>

        {/* Right Column: Visual Vignettes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Desk Setup Photo */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl group border border-slate-200 dark:border-white/[0.08] transition-colors">
            <img
              src="/assets/media/setup.jpg"
              alt="Raghav's workspace and studio desk"
              className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-103 transition-transform duration-700 opacity-95 dark:opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-100/90 via-transparent to-transparent dark:from-[#06080e] pointer-events-none transition-colors" />

            <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="bg-white/90 dark:bg-[#06080e]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-900 dark:text-white shadow-sm">
                Work Rig &amp; Studio Desk
              </span>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-300 font-mono font-bold">28.5355° N</span>
            </div>
          </div>

          {/* Showreel Preview Frame */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg dark:shadow-xl group border border-slate-200 dark:border-white/[0.06] transition-colors">
            <img
              src="/assets/projects/showreel.png"
              alt="Creative showcase and showreel"
              className="w-full h-48 object-cover object-center group-hover:scale-103 transition-transform duration-700 opacity-90 dark:opacity-80 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-100/90 via-transparent to-transparent dark:from-[#06080e] pointer-events-none transition-colors" />

            <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="bg-white/90 dark:bg-[#06080e]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-900 dark:text-white shadow-sm">
                Visual Bridges &amp; Motion
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-300 font-mono font-bold">Live Showreel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
