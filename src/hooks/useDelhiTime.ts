import { useState, useEffect } from 'react'

export function useDelhiTime() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date()
        const formatter = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
        setTime(formatter.format(now).toUpperCase())
      } catch {
        setTime('12:00:00 PM')
      }
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return time
}
