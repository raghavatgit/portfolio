import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GraduationCap, MapPin, Quote } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { PROFILE, SERVICES } from '@/data/profile'

export function AboutSection() {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 22 })
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 22 })

  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8">
      <SectionHeader
        eyebrow="About me"
        lead="How I"
        accent="Build Software"
        note="simple & fast"
        right={
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            {PROFILE.location}
          </span>
        }
      />

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-10 lg:col-span-7">
          <div>
            <h3 className="mb-5 font-serif text-3xl font-normal italic leading-snug text-slate-900 transition-colors dark:text-white sm:text-4xl">
              Tiny file sizes, clean code, and tools you can count on.
            </h3>
            <p className="text-base font-light leading-relaxed text-slate-600 dark:text-slate-300">
              I study computer science at <strong className="font-bold text-slate-900 dark:text-white">South Asian University</strong>,
              class of 2029. Instead of piling on heavy templates, I like understanding how Windows, sensors, and 3D
              graphics work from the ground up so the final app runs quickly anywhere.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-slate-200 py-4 font-mono text-xs text-slate-700 transition-colors dark:border-white/[0.08] dark:text-slate-300">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              {PROFILE.university} '29
            </span>
            <span className="h-3.5 w-px bg-slate-300 dark:bg-white/20" />
            <span>Smart India Hackathon 2026</span>
            <span className="h-3.5 w-px bg-slate-300 dark:bg-white/20" />
            <span>Open for freelance &amp; internships</span>
          </div>

          {/* Services ledger */}
          <div className="divide-y divide-slate-200 dark:divide-white/[0.08]">
            {SERVICES.map((s) => (
              <div key={s.n} className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-4 py-4 md:grid-cols-[2.5rem_11rem_1fr]">
                <span className="font-mono text-xs text-slate-400">{s.n}</span>
                <span className="font-display text-lg font-bold text-slate-900 transition-transform duration-300 group-hover:translate-x-1 dark:text-white">
                  {s.title}
                </span>
                <span className="col-start-2 text-sm font-light text-slate-600 dark:text-slate-400 md:col-start-auto">
                  {s.line}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-4">
            <Quote className="mt-1 h-8 w-8 shrink-0 text-cyan-600/40 dark:text-cyan-400/40" />
            <div>
              <p className="mb-2 font-serif text-2xl font-normal italic leading-snug text-slate-900 transition-colors dark:text-white sm:text-3xl">
                &ldquo;The unexamined life is not worth living.&rdquo;
              </p>
              <footer className="font-mono text-xs text-cyan-600 dark:text-cyan-300">Socrates</footer>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-white/[0.06]">
            <span className="select-none font-brush text-4xl text-flow-chromatic drop-shadow-[0_2px_14px_rgba(0,240,255,0.25)] sm:text-5xl">
              raghavgoyal.
            </span>
            <span className="rotate-1 font-cursive text-lg text-slate-500 dark:text-slate-400">software with soul</span>
          </div>
        </div>

        {/* 3D Pointer-Tilted Workspace Plate */}
        <div className="perspective-stage space-y-6 lg:col-span-5">
          <motion.div
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              px.set((e.clientX - r.left) / r.width - 0.5)
              py.set((e.clientY - r.top) / r.height - 0.5)
            }}
            onMouseLeave={() => {
              px.set(0)
              py.set(0)
            }}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
            className="group relative border border-slate-200 bg-white/40 shadow-2xl shadow-black/15 transition-shadow hover:shadow-cyan-500/15 dark:border-white/[0.1] dark:bg-black/40 dark:shadow-black/60"
          >
            <div className="overflow-hidden">
              <img
                src="/assets/media/setup.jpg"
                alt="Raghav's desk setup"
                className="h-80 w-full object-cover object-center opacity-95 transition-transform duration-700 group-hover:scale-[1.04] dark:opacity-90 sm:h-96"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-100/90 via-transparent to-transparent dark:from-[#06080e]" />
            <div
              className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px]"
              style={{ transform: 'translateZ(26px)' }}
            >
              <span className="text-slate-900 dark:text-white">My desk setup</span>
              <span className="text-cyan-700 dark:text-cyan-300">28.5355 N, 77.2090 E</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
