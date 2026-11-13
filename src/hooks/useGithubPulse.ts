import { useEffect, useState } from 'react'

export interface GithubPulse {
  repos: number
  latest?: { name: string; at: string }
}

const KEY = 'rg_gh_pulse_v1'

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  const steps: [number, string][] = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ]
  for (const [sec, u] of steps) if (s >= sec) return `${Math.floor(s / sec)}${u} ago`
  return `${s}s ago`
}

/** Live public GitHub pulse with session cache and silent failure (rate limits, offline). */
export function useGithubPulse(user: string) {
  const [data, setData] = useState<GithubPulse | null>(null)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(KEY)
      if (cached) {
        setData(JSON.parse(cached) as GithubPulse)
        return
      }
    } catch {
      /* ignore */
    }
    const ctrl = new AbortController()
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('gh'))))
      .then((list: { name: string; pushed_at: string }[]) => {
        if (!Array.isArray(list) || !list.length) return
        const top = list.reduce((a, b) => (new Date(a.pushed_at) > new Date(b.pushed_at) ? a : b))
        const next: GithubPulse = { repos: list.length, latest: { name: top.name, at: top.pushed_at } }
        setData(next)
        try {
          sessionStorage.setItem(KEY, JSON.stringify(next))
        } catch {
          /* ignore */
        }
      })
      .catch(() => undefined)
    return () => ctrl.abort()
  }, [user])

  return data
}
