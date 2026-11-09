import { MapPin, GraduationCap, Laptop, Quote } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-mono font-semibold tracking-wider text-amber-400 uppercase block mb-2">
          Ethos &amp; Context
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Behind the Screen
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light">
          A bit about where I study, how I approach engineering problems, and what keeps me building.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal Narrative */}
        <div className="lg:col-span-7 space-y-6 text-slate-300 font-light leading-relaxed">
          <div className="p-6 rounded-2xl bg-[#0e1017]/70 border border-white/[0.07] backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-3">
              Understanding systems from the silicon up.
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              I’m a Computer Science student at <strong>South Asian University in New Delhi</strong>.
              I don’t treat software as black boxes. Whether it’s figuring out how Windows DWM composes
              desktop surfaces into video streams, how an Extended Kalman Filter reconciles noisy IMU
              drift, or how to write ExtendScript bridges that control native timeline keyframes — I
              enjoy understanding how things work under the hood.
            </p>
            <p className="text-sm text-slate-300">
              My engineering philosophy is simple: write code that is straightforward to reason about,
              respects device memory, and solves real friction. I prefer small, portable, standalone
              binaries over bloated micro-frameworks.
            </p>
          </div>

          {/* Quick Context Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <MapPin className="w-4 h-4 text-amber-400 mb-2" />
              <span className="block text-xs font-semibold text-white">Location</span>
              <span className="block text-xs text-slate-400 font-mono">Delhi, India</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <GraduationCap className="w-4 h-4 text-amber-400 mb-2" />
              <span className="block text-xs font-semibold text-white">University</span>
              <span className="block text-xs text-slate-400 font-mono">South Asian Univ.</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <Laptop className="w-4 h-4 text-amber-400 mb-2" />
              <span className="block text-xs font-semibold text-white">Focus</span>
              <span className="block text-xs text-slate-400 font-mono">Systems &amp; Tools</span>
            </div>
          </div>

          {/* Socrates Philosophical Quote Card */}
          <blockquote className="p-5 rounded-xl bg-gradient-to-r from-amber-500/[0.06] to-transparent border-l-2 border-amber-400 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-amber-400/60 shrink-0 mt-0.5" />
              <div>
                <p className="italic text-slate-200 mb-1">
                  &ldquo;The unexamined life is not worth living.&rdquo;
                </p>
                <footer className="text-xs font-mono text-amber-400/80">
                  — Socrates <span className="text-slate-500 font-sans">(A reminder to question defaults and test rigorously)</span>
                </footer>
              </div>
            </div>
          </blockquote>
        </div>

        {/* Right Column: Desk Setup Photo with clean framing */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0e1017] shadow-2xl group">
            <img
              src="/assets/media/setup.jpg"
              alt="Raghav's workspace and setup"
              className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                Rig &amp; Workspace · Delhi, IN
              </span>
              <span className="text-[11px] text-amber-400/90 font-mono">2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
