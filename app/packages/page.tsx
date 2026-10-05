'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Search, ShoppingBag, ArrowRight, Sparkles, Check, Coffee } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'

interface PackageProduct {
  _id: string
  title: string
  subtitle?: string
  about?: string
  tourDetails?: string
  price: number | string
  isComingSoon?: boolean
  duration?: string
  capacity?: string
  packageCategory?: string
  packageGroupSlug?: string
  packageMiniCategory?: string
  images?: Array<{ url: string; alt?: string }>
  rating?: number
  bookings?: number
}

export default function PackagesPage() {
  const [products, setProducts] = useState<PackageProduct[]>([])
  const { addItem, openCart } = useCart()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Fetch dynamic products directly from database API
  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        const res = await fetch('/api/packages', { cache: 'no-store' })
        const json = await res.json()
        if (!cancelled) {
          const list = json?.success && Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
          setProducts(list)
        }
      } catch (err) {
        console.error('Failed to load products:', err)
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()

    // Sync search query from URL if present
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('search')
      if (q) setSearchTerm(q)
    }

    return () => {
      cancelled = true
    }
  }, [])

  // Dynamic categories computed from the active products
  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      const cat = p.packageCategory?.trim() || p.packageGroupSlug?.trim()
      if (cat) {
        set.add(cat)
      }
    })
    return ['All', ...Array.from(set)]
  }, [products])

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    const targetCat = selectedCategory.trim().toLowerCase()

    return products.filter((p) => {
      const pCat = (p.packageCategory || '').trim().toLowerCase()
      const pGroup = (p.packageGroupSlug || '').trim().toLowerCase()

      const matchesSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.about && p.about.toLowerCase().includes(q)) ||
        pCat.includes(q) ||
        pGroup.includes(q)

      const matchesCategory =
        selectedCategory === 'All' ||
        pCat === targetCat ||
        pGroup === targetCat

      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  const handleProductAction = (pkg: PackageProduct, isComingSoon: boolean) => {
    if (isComingSoon) {
      toast.info(`${pkg.title} is coming soon!`, {
        description: 'Sign up for our newsletter to get notified when orders open.',
      })
      return
    }

    addItem({
      id: pkg._id,
      title: pkg.title,
      price: Number(pkg.price) || 0,
      image: pkg.images?.[0]?.url,
      category: pkg.packageCategory || pkg.subtitle,
    })
    toast.success(`Added ${pkg.title} to cart`, {
      description: 'Open the bag icon in the navbar to view your selected products.',
      action: {
        label: 'View cart',
        onClick: () => openCart(),
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-ink font-body antialiased selection:bg-maroon selection:text-cream">
      {/* ============ HEADER HERO ============ */}
      <section className="bg-maroon-deep text-cream pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden border-b border-maroon">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="wrap relative z-10 text-center max-w-[820px] mx-auto flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md border border-cream/25 rounded-full px-4 py-1.5 text-cream text-[11px] uppercase tracking-[2px] font-medium">
            <Coffee className="w-3.5 h-3.5 text-gold" />
            <span>The Romoire Collection</span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-cream font-medium leading-[1.12]">
            find your cup
          </h1>

          <p className="text-base sm:text-lg text-[#F0DBC4] max-w-[620px] leading-[1.7]">
            Single origin Chikmagalur Arabica coffee and coconut milk, sweetened with monk fruit. No dairy, no refined sugar. Just add hot water.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 pt-2 text-xs uppercase tracking-[2px] text-[#E2BFA6] font-light">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> 100% arabica.
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Dairy free.
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Ready in 60 seconds.
            </span>
          </div>
        </div>
      </section>

      {/* ============ CONTROLS: SEARCH & CATEGORY FILTER ============ */}
      <section className="py-8 border-b border-line/60 bg-white sticky top-24 z-30 shadow-[0_2px_12px_rgba(74,21,21,0.04)]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none" role="tablist">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs uppercase tracking-[1.4px] px-4 py-2 rounded-full border transition-all whitespace-nowrap font-medium ${
                      isActive
                        ? 'bg-maroon border-maroon text-cream shadow-sm'
                        : 'bg-cream/40 border-line text-ink-soft hover:border-maroon/50 hover:text-maroon'
                    }`}
                  >
                    {cat === 'All' ? 'All Products' : cat}
                  </button>
                )
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute w-4 h-4" />
              <Input
                type="text"
                placeholder="Search premix, flavours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 h-10 rounded-full border-line bg-cream/30 focus-visible:ring-maroon text-xs tracking-wide"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT GRID ============ */}
      <section className="py-14 md:py-20">
        <div className="wrap">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-maroon border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-ink-mute uppercase tracking-widest">
                Loading products...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto flex flex-col items-center gap-4 bg-white border border-line rounded-sm p-8 shadow-sm">
              <Coffee className="w-10 h-10 text-gold stroke-[1.2]" />
              <h3 className="font-playfair text-2xl text-maroon font-medium">No Products Found</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                {searchTerm
                  ? `No premix products matched "${searchTerm}". Try a different keyword.`
                  : 'No products are currently listed in this category.'}
              </p>
              {(searchTerm || selectedCategory !== 'All') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }}
                  className="rounded-full border-maroon text-maroon hover:bg-maroon hover:text-cream text-xs uppercase tracking-wider font-medium px-6 mt-2"
                >
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((pkg) => {
                const imgUrl = pkg.images?.[0]?.url || '/images/romoire/coffee_sachets.jpg'
                const isComingSoon = Boolean(pkg.isComingSoon || !pkg.price || Number(pkg.price) === 0)
                const priceText = isComingSoon ? 'Coming soon' : `₹${pkg.price}`
                const sachetInfo = pkg.duration || pkg.capacity || '5 Sachets · 20g each'
                const categoryLabel = pkg.packageCategory || pkg.subtitle || 'Plant-based Premix'
                const desc =
                  pkg.about ||
                  pkg.tourDetails ||
                  pkg.subtitle ||
                  'Single origin Arabica coffee premix with coconut milk and monk fruit sweetness.'

                return (
                  <article
                    key={pkg._id}
                    className="border border-line rounded-sm p-6 bg-white flex flex-col gap-4 hover:shadow-[0_10px_32px_rgba(102,24,24,0.12)] transition-all duration-300 group"
                  >
                    {/* Visual Container */}
                    <Link
                      href={`/packages/${pkg._id}`}
                      className="relative h-[230px] rounded-sm overflow-hidden border border-line bg-sand/30 block"
                    >
                      <img
                        src={imgUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {pkg.packageCategory && (
                        <span className="absolute top-3 right-3 bg-maroon text-cream text-[10.5px] uppercase tracking-wider px-3 py-0.5 rounded-full font-medium shadow-sm">
                          {pkg.packageCategory}
                        </span>
                      )}
                    </Link>

                    {/* Meta info */}
                    <div className="flex flex-col gap-1.5 flex-grow">
                      <p className="text-[11px] uppercase tracking-[1.8px] text-[#8A3A3A] font-medium">
                        {categoryLabel}
                      </p>
                      
                      <Link href={`/packages/${pkg._id}`} className="hover:text-maroon-deep transition-colors">
                        <h3 className="font-playfair text-2xl text-maroon font-medium line-clamp-1">
                          {pkg.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-ink-mute font-medium">
                        {sachetInfo}
                      </p>

                      <p className="text-sm leading-[1.65] text-ink-soft line-clamp-2 mt-1">
                        {desc}
                      </p>
                    </div>

                    {/* Price and Details */}
                    <div className="flex items-baseline justify-between pt-2 border-t border-line/60">
                      <div>
                        <span className="font-playfair text-2xl text-maroon font-medium">
                          {priceText}
                        </span>
                        {!isComingSoon && (
                          <span className="text-[11px] text-ink-mute ml-1">incl. taxes</span>
                        )}
                      </div>
                      <Link
                        href={`/packages/${pkg._id}`}
                        className="text-xs uppercase tracking-wider text-ink-mute hover:text-maroon underline underline-offset-4 font-medium"
                      >
                        Details →
                      </Link>
                    </div>

                    {/* Action CTA */}
                    <button
                      type="button"
                      onClick={() => handleProductAction(pkg, isComingSoon)}
                      className="btn-romoire py-3.5 text-xs text-center w-full uppercase tracking-[1.6px] font-medium flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isComingSoon ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Coming soon
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to cart
                        </>
                      )}
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ WHY ROMOIRE STRIP ============ */}
      <section className="bg-sand/30 py-16 border-t border-line">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2.5">
              <span className="w-10 h-10 rounded-full bg-cream border border-maroon/20 flex items-center justify-center text-maroon font-playfair font-medium text-lg shadow-sm">
                01
              </span>
              <h4 className="font-playfair text-xl text-maroon font-medium">100% Arabica</h4>
              <p className="text-xs text-ink-soft leading-relaxed max-w-xs">
                Single-origin beans directly from Karnataka’s Chikmagalur hills. No chicory, no artificial essence.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2.5">
              <span className="w-10 h-10 rounded-full bg-cream border border-maroon/20 flex items-center justify-center text-maroon font-playfair font-medium text-lg shadow-sm">
                02
              </span>
              <h4 className="font-playfair text-xl text-maroon font-medium">Zero Dairy & Lactose</h4>
              <p className="text-xs text-ink-soft leading-relaxed max-w-xs">
                Pure spray-dried coconut milk gives a rich, velvety café froth with just hot water and 30 seconds stirring.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2.5">
              <span className="w-10 h-10 rounded-full bg-cream border border-maroon/20 flex items-center justify-center text-maroon font-playfair font-medium text-lg shadow-sm">
                03
              </span>
              <h4 className="font-playfair text-xl text-maroon font-medium">Monk Fruit Sweetness</h4>
              <p className="text-xs text-ink-soft leading-relaxed max-w-xs">
                Subtle natural plant extract with zero refined sugar and zero calories. Clean taste that lets coffee lead.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
