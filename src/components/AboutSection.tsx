import { MapPin, GraduationCap, Laptop, Quote } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase block mb-2">
          Engineering Ethos
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Background &amp; Philosophy
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light">
          Academic foundation, systems engineering mindset, and practical development standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal Narrative */}
        <div className="lg:col-span-7 space-y-6 text-slate-300 font-light leading-relaxed">
          <div className="p-6 rounded-2xl bg-[#090c18]/80 border border-white/[0.08] backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-3">
              Understanding systems from the silicon up.
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              I am a Computer Science student at <strong>South Asian University in New Delhi</strong>.
              I avoid treating systems as black boxes. Whether analyzing how Windows Desktop Window
              Manager composes frame buffers into video feeds, formulating Extended Kalman Filters to
              fuse noisy inertial telemetry, or bridging multi-host timeline runtimes across C++ and Lua —
              I prioritize low-level comprehension and deterministic execution.
            </p>
            <p className="text-sm text-slate-300">
              My engineering standard is strict: produce software that is easily reasoned about,
              respects hardware constraints, and eliminates unnecessary runtime bloat.
            </p>
          </div>

          {/* Quick Context Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <MapPin className="w-4 h-4 text-cyan-400 mb-2" />
              <span className="block text-xs font-semibold text-white">Location</span>
              <span className="block text-xs text-slate-400 font-mono">Delhi, India</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <GraduationCap className="w-4 h-4 text-indigo-400 mb-2" />
              <span className="block text-xs font-semibold text-white">Institution</span>
              <span className="block text-xs text-slate-400 font-mono">South Asian Univ.</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <Laptop className="w-4 h-4 text-emerald-400 mb-2" />
              <span className="block text-xs font-semibold text-white">Specialization</span>
              <span className="block text-xs text-slate-400 font-mono">Systems &amp; Tools</span>
            </div>
          </div>

          {/* Socrates Philosophical Quote Card */}
          <blockquote className="p-5 rounded-xl bg-gradient-to-r from-cyan-500/[0.08] to-transparent border-l-2 border-cyan-400 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-cyan-400/70 shrink-0 mt-0.5" />
              <div>
                <p className="italic text-slate-200 mb-1">
                  &ldquo;The unexamined life is not worth living.&rdquo;
                </p>
                <footer className="text-xs font-mono text-cyan-300/80">
                  — Socrates <span className="text-slate-400 font-sans">(A commitment to continuous inspection and first-principles reasoning)</span>
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

