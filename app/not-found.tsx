import Link from 'next/link'
import { Coffee } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-20 text-center font-body text-ink">
      <div className="max-w-md mx-auto flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-cream border border-maroon/20 flex items-center justify-center text-maroon shadow-sm">
          <Coffee className="w-8 h-8 text-maroon stroke-[1.4]" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[2px] text-hazelnut font-semibold">
            404 · Page Not Found
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl text-maroon font-medium">
            This cup is empty.
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed mt-2">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn-romoire px-7 py-3.5 text-xs uppercase tracking-[1.6px] font-medium rounded-sm shadow-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className="px-7 py-3.5 text-xs uppercase tracking-[1.6px] font-medium border border-line hover:border-maroon text-maroon rounded-sm transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
