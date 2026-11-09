import { useState } from 'react'
import { Mail, Copy, Check, ArrowUpRight, MessageSquare } from 'lucide-react'
import { GithubIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from '@/components/icons/SocialIcons'

export function ContactSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      <div className="rounded-3xl bg-[#090c18]/80 border border-white/[0.08] backdrop-blur-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        {/* Subtle accent glow */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/[0.04] blur-[100px] rounded-full"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase block">
              Direct Communication
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Initiate Contact
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Available for systems engineering engagements, software development roles, and research
              collaborations. Direct inquiries and technical discussions are welcome.
            </p>

            <div className="pt-4 flex flex-col gap-2.5">
              {/* Email Direct Card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">Email Address</span>
                    <a
                      href="mailto:goyalraghav1289@gmail.com"
                      className="text-xs sm:text-sm font-medium text-white hover:text-cyan-300 transition-colors"
                    >
                      goyalraghav1289@gmail.com
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('email', 'goyalraghav1289@gmail.com')}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-colors"
                  title="Copy email"
                >
                  {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Discord Card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">Discord Handle</span>
                    <span className="text-xs sm:text-sm font-medium font-mono text-white">
                      @johnmaybesnow
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('discord', '@johnmaybesnow')}
                  className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-colors"
                  title="Copy Discord handle"
                >
                  {copiedKey === 'discord' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Direct Profile Outbound Links */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'github',
                label: 'GitHub',
                handle: '@raghavatgit',
                href: 'https://github.com/raghavatgit',
                desc: 'Open source implementations, systems code & utilities',
                icon: GithubIcon,
              },
              {
                id: 'linkedin',
                label: 'LinkedIn',
                handle: 'raghav-goyal',
                href: 'https://linkedin.com/in/raghav-goyal-216a913b4',
                desc: 'Academic timeline, credentials & professional network',
                icon: LinkedinIcon,
              },
              {
                id: 'youtube',
                label: 'YouTube',
                handle: '@socrates-anxious',
                href: 'https://www.youtube.com/@socrates-anxious',
                desc: 'Technical demonstrations & engineering walkthroughs',
                icon: YoutubeIcon,
              },
              {
                id: 'instagram',
                label: 'Instagram',
                handle: '@ykraghv',
                href: 'https://instagram.com/ykraghv',
                desc: 'Personal communication channel & photography',
                icon: InstagramIcon,
              },
            ].map(({ id, label, handle, href, desc, icon: Icon }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-cyan-500/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <span className="font-semibold text-sm text-white block">{label}</span>
                  <span className="text-[11px] font-mono text-cyan-400/90 block mb-2">{handle}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">{desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
