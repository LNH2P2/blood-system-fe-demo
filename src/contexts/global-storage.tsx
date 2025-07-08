'use client'

import { useEffect } from 'react'

export function GlobalStorageListener() {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'access_token' && !event.newValue) {
        window.location.href = '/vi/login'
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return null
}
