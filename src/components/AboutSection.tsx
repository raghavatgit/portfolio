import { MapPin, GraduationCap, Laptop, Quote, Sparkles } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ABOUT ME</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Background &amp; Philosophy
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
          Who I am, what drives my work, and how I approach writing software.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal Narrative */}
        <div className="lg:col-span-7 space-y-6 text-slate-300 font-light leading-relaxed">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#090d18]/85 border border-white/[0.09] backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-3">
              Understanding software from the ground up.
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              I am a Computer Science student at <strong>South Asian University in New Delhi</strong>.
              I have always preferred knowing how things truly work under the hood rather than treating
              tools like black boxes. Whether it is writing fast desktop tools in Rust, tracking motion
              indoors when satellites cannot reach, or building interactive 3D simulations in the browser —
              I build things that are fast, clean, and respectful of your computer&apos;s resources.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              My rule of thumb is simple: eliminate unnecessary bloat, design for offline dependability,
              and build software that people can rely on without frustration.
            </p>
          </div>

          {/* Quick Context Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <MapPin className="w-4 h-4 text-cyan-400 mb-2" />
              <span className="block text-xs font-bold text-white">Location</span>
              <span className="block text-xs text-slate-400 font-mono">New Delhi, India</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-indigo-400 mb-2" />
              <span className="block text-xs font-bold text-white">University</span>
              <span className="block text-xs text-slate-400 font-mono">South Asian Univ.</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <Laptop className="w-4 h-4 text-emerald-400 mb-2" />
              <span className="block text-xs font-bold text-white">Focus</span>
              <span className="block text-xs text-slate-400 font-mono">Fast Tools &amp; Hardware</span>
            </div>
          </div>

          {/* Socrates Philosophical Quote Card with Luxury Italic Serif */}
          <blockquote className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/[0.08] to-transparent border-l-3 border-cyan-400 text-slate-200">
            <div className="flex items-start gap-3.5">
              <Quote className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
              <div>
                <p className="font-serif italic text-2xl sm:text-3xl text-white font-normal leading-snug mb-2">
                  &ldquo;The unexamined life is not worth living.&rdquo;
                </p>
                <footer className="text-xs font-mono text-cyan-300">
                  — Socrates <span className="text-slate-400 font-sans">(A commitment to questioning assumptions and continuous learning)</span>
                </footer>
              </div>
            </div>
          </blockquote>

          {/* Raghav's Handwritten Signature */}
          <div className="pt-2 flex items-center justify-between">
            <div className="font-cursive text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 -rotate-2 select-none tracking-wide">
              Raghav Goyal
            </div>
            <span className="font-cursive text-slate-400 text-base rotate-1">
              ~ software with soul
            </span>
          </div>
        </div>

        {/* Right Column: Pictures & Visual Collage */}
        <div className="lg:col-span-5 space-y-4">
          {/* Desk Setup Photo with clean framing */}
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0e1017] shadow-2xl group">
            <img
              src="/assets/media/setup.jpg"
              alt="Raghav's workspace and setup"
              className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-103 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px]">
                Work Rig &amp; Studio Desk
              </span>
              <span className="text-[11px] text-cyan-300 font-mono">Delhi, IN</span>
            </div>
          </div>

          {/* Second Picture Card: Creative Showreel & Media preview */}
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0e1017] shadow-xl group">
            <img
              src="/assets/projects/showreel.png"
              alt="Creative showcase and showreel"
              className="w-full h-44 object-cover object-center group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-4 right-4 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px]">
                Visual Projects &amp; Media Work
              </span>
              <span className="text-[10px] text-amber-300 font-mono">Creative Bridges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
