import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { InstagramIcon, GithubIcon, LinkedinIcon, YoutubeIcon } from '@/components/icons/SocialIcons'
import { SectionHeader } from '@/components/SectionHeader'
import { PROFILE } from '@/data/profile'

const CHANNELS = [
  { id: 'github', label: 'GitHub', handle: `@${PROFILE.handle}`, href: PROFILE.github, icon: GithubIcon },
  { id: 'linkedin', label: 'LinkedIn', handle: 'raghav-goyal-linkd', href: PROFILE.linkedin, icon: LinkedinIcon },
  { id: 'youtube', label: 'YouTube', handle: '@socrates-anxious', href: PROFILE.youtube, icon: YoutubeIcon },
  { id: 'instagram', label: 'Instagram', handle: '@ykraghv', href: PROFILE.instagram, icon: InstagramIcon },
]

export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (key: string, text: string) => {
    void navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-8">
      <SectionHeader
        eyebrow="Communication"
        lead="Direct"
        accent="Connections"
        note="say hello"
        right={<span className="text-emerald-600 dark:text-emerald-400">Open to freelance and internships</span>}
      />

      {/* Oversized email, the single call to action */}
      <button
        type="button"
        onClick={() => copy('email', PROFILE.email)}
        className="group mb-14 block w-full text-left"
        data-cursor
      >
        <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {copied === 'email' ? 'Copied to clipboard' : 'Click to copy'}
        </span>
        <span className="flex flex-wrap items-center gap-4">
          <span className="font-display text-3xl font-extrabold tracking-tight text-flow-chromatic sm:text-5xl lg:text-6xl">
            {PROFILE.email}
          </span>
          {copied === 'email' ? (
            <Check className="h-6 w-6 text-emerald-500" />
          ) : (
            <Copy className="h-6 w-6 text-slate-400 transition-colors group-hover:text-cyan-500" />
          )}
        </span>
      </button>

      <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/[0.08] dark:border-white/[0.08]">
        {CHANNELS.map(({ id, label, handle, href, icon: Icon }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[2rem_12rem_1fr_auto]"
          >
            <Icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-cyan-500" />
            <span className="font-display text-xl font-bold text-slate-900 transition-transform duration-300 group-hover:translate-x-2 dark:text-white">
              {label}
            </span>
            <span className="hidden font-mono text-xs text-slate-500 dark:text-slate-400 md:block">{handle}</span>
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-500" />
          </a>
        ))}
        <button
          type="button"
          onClick={() => copy('discord', PROFILE.discord)}
          className="group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[2rem_12rem_1fr_auto]"
        >
          <span className="font-mono text-xs text-slate-400">#</span>
          <span className="font-display text-xl font-bold text-slate-900 transition-transform duration-300 group-hover:translate-x-2 dark:text-white">
            Discord
          </span>
          <span className="hidden font-mono text-xs text-slate-500 dark:text-slate-400 md:block">{PROFILE.discord}</span>
          {copied === 'discord' ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4 text-slate-400 group-hover:text-cyan-500" />
          )}
        </button>
      </div>

      <p className="mt-8 font-mono text-[11px] text-slate-500 dark:text-slate-400">
        Also live at{' '}
        <a href={PROFILE.site} target="_blank" rel="noopener noreferrer" className="border-b border-slate-400 text-slate-800 hover:text-cyan-600 dark:border-white/30 dark:text-slate-200 dark:hover:text-cyan-300">
          crag.web.app
        </a>{' '}
        and{' '}
        <a href={PROFILE.portal} target="_blank" rel="noopener noreferrer" className="border-b border-slate-400 text-slate-800 hover:text-cyan-600 dark:border-white/30 dark:text-slate-200 dark:hover:text-cyan-300">
          contactraghav.web.app
        </a>
      </p>
    </section>
  )
}
