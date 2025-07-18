'use client'

import { useState, useEffect } from 'react'

interface ClientTimeProps {
  className?: string
  locale?: string
  options?: Intl.DateTimeFormatOptions
}

export function ClientTime({ className, locale = 'vi-VN', options }: ClientTimeProps) {
  const [time, setTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      setTime(new Date().toLocaleTimeString(locale, options))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [locale, options])

  if (!mounted) {
    return <div className={className}>--:--:--</div>
  }

  return <div className={className}>{time}</div>
}
