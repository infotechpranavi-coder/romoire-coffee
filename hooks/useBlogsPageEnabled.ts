'use client'

import { useEffect, useState } from 'react'

/**
 * Returns whether the public Blogs page/links should be shown.
 * Defaults to true when settings are missing or still loading.
 */
export function useBlogsPageEnabled() {
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled && data?.success && data?.data) {
          setEnabled(data.data.blogsPageEnabled !== false)
        }
      } catch {
        if (!cancelled) setEnabled(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { blogsPageEnabled: enabled, loading }
}
