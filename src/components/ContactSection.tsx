import { useState } from 'react'
import { Mail, Copy, Check, ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react'
import { GithubIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from '@/components/icons/SocialIcons'

export function ContactSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header: Minimal & Typographic (No Sloppy Rounded Boxes, No Pulsating Dots) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-slate-200 dark:border-white/[0.08] pb-8 transition-colors">
        <div>
          <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNICATION CONDUITS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-3 flex-wrap">
            <span>Direct</span>
            <span className="font-serif italic font-normal text-flow-chromatic text-[1.08em]">
              Connections
            </span>
            <span className="font-cursive text-cyan-600 dark:text-cyan-300 text-xl font-normal select-none rotate-1">
              say hello
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl font-light leading-relaxed">
            Reach out directly for systems engineering collaborations, technical inquiries, or shared curiosity.
          </p>
        </div>

        {/* Status Indicator (No pulsating dot) */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
          <span>Open to High-Impact Opportunities</span>
        </div>
      </div>

      {/* Borderless Communication Lounge (Zero Card Enclosures) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Instant Copy Conduits */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">
              Direct Inboxes
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              Fastest response via email or Discord ping.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Email Direct Conduit */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] hover:border-cyan-500/40 shadow-xs dark:shadow-none transition-all group">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Email</span>
                  <a
                    href="mailto:goyalraghav1289@gmail.com"
                    className="text-sm font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                  >
                    goyalraghav1289@gmail.com
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('email', 'goyalraghav1289@gmail.com')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 transition-colors"
                title="Copy email to clipboard"
              >
                {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Discord Direct Conduit */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] hover:border-indigo-500/40 shadow-xs dark:shadow-none transition-all group">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Discord</span>
                  <span className="text-sm font-semibold font-mono text-slate-900 dark:text-white">
                    @johnmaybesnow
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('discord', '@johnmaybesnow')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 transition-colors"
                title="Copy Discord handle"
              >
                {copiedKey === 'discord' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Outbound Social & Code Channels (Borderless Grid) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              id: 'github',
              label: 'GitHub',
              handle: '@raghavatgit',
              href: 'https://github.com/raghavatgit',
              desc: 'Open source implementations, Rust desktop tools & systems utilities',
              icon: GithubIcon,
              accent: '#00F0FF',
            },
            {
              id: 'linkedin',
              label: 'LinkedIn',
              handle: 'raghav-goyal',
              href: 'https://linkedin.com/in/raghav-goyal-216a913b4',
              desc: 'Academic timeline, credentials & professional engineering network',
              icon: LinkedinIcon,
              accent: '#38BDF8',
            },
            {
              id: 'youtube',
              label: 'YouTube',
              handle: '@socrates-anxious',
              href: 'https://www.youtube.com/@socrates-anxious',
              desc: 'Technical demonstrations, motion workflows & software walkthroughs',
              icon: YoutubeIcon,
              accent: '#EC4899',
            },
            {
              id: 'instagram',
              label: 'Instagram',
              handle: '@ykraghv',
              href: 'https://instagram.com/ykraghv',
              desc: 'Personal channel, visual compositions & creative photography',
              icon: InstagramIcon,
              accent: '#FFA502',
            },
          ].map(({ id, label, handle, href, desc, icon: Icon, accent }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.18] shadow-xs dark:shadow-none transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    style={{ color: accent }}
                  />
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white block mb-0.5">{label}</span>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 block mb-3 font-semibold">{handle}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
