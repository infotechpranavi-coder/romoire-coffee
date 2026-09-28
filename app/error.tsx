'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coffee, RotateCcw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error caught by ErrorBoundary:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] bg-[#FDFBF7] flex items-center justify-center px-4 py-16 text-center font-body text-ink">
      <div className="max-w-md mx-auto flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-cream border border-maroon/20 flex items-center justify-center text-maroon shadow-sm">
          <Coffee className="w-8 h-8 text-maroon stroke-[1.4]" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[2px] text-hazelnut font-semibold">
            Romoire · Notice
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl text-maroon font-medium">
            Something unexpected occurred
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed mt-1">
            We are refreshing your experience with fresh artisan coffee.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="bg-maroon hover:bg-maroon-deep text-cream px-6 py-2.5 text-xs uppercase tracking-[1.6px] font-medium rounded-sm inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
          <Link
            href="/"
            className="px-6 py-2.5 text-xs uppercase tracking-[1.6px] font-medium border border-line hover:border-maroon text-maroon rounded-sm transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
