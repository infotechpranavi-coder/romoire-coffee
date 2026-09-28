'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 text-center font-sans text-gray-900">
        <div className="max-w-md mx-auto flex flex-col items-center gap-5 p-8 bg-white rounded-2xl border border-[#EADBCE] shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#EADBCE] flex items-center justify-center text-[#4A1515] font-serif font-bold text-xl">
            R
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#4A1515]">
            Romoire Coffee
          </h2>
          <p className="text-sm text-gray-600">
            A temporary client exception occurred. Please click below to reload the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#4A1515] text-white rounded-full hover:bg-[#2E0B0B] transition-colors"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  )
}
