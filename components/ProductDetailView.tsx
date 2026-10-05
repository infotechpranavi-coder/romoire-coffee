'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { cn } from '@/lib/utils'

export type ProductDetailPackage = {
  _id: string
  title: string
  subtitle?: string
  about?: string
  tourDetails?: string
  price: number
  duration?: string
  capacity?: string
  packageCategory?: string
  isComingSoon?: boolean
  rating?: number
  bookings?: number
  keyHighlights?: string[]
  services?: string[] | string
  reviews?: Array<{ name: string; rating: number; comment: string; date: string }>
  images?: Array<{ url: string; alt?: string }>
}

function formatInr(amount: number) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

function buildSpecItems(pkg: ProductDetailPackage): string[] {
  const items: string[] = []
  if (Array.isArray(pkg.keyHighlights) && pkg.keyHighlights.length) {
    items.push(...pkg.keyHighlights.slice(0, 6))
  } else if (Array.isArray(pkg.services)) {
    items.push(...pkg.services.slice(0, 6))
  } else if (typeof pkg.services === 'string' && pkg.services.trim()) {
    items.push(
      ...pkg.services
        .split(/[\n,•|]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 6)
    )
  }
  if (pkg.duration?.trim()) items.push(pkg.duration.trim())
  if (pkg.capacity?.trim() && !items.some((i) => i.includes(pkg.capacity!))) {
    items.push(pkg.capacity.trim())
  }
  if (items.length === 0) {
    items.push('Plant-based premix', 'Ready in seconds', 'No added refined sugar')
  }
  return items.slice(0, 6)
}

type CatalogProduct = ProductDetailPackage & { packageGroupSlug?: string }

type Props = {
  package: ProductDetailPackage
}

function pickRecommended(all: CatalogProduct[], current: ProductDetailPackage, limit = 4): CatalogProduct[] {
  const others = all.filter((p) => p._id !== current._id)
  const cat = current.packageCategory?.trim().toLowerCase()
  const sameCategory = cat
    ? others.filter((p) => p.packageCategory?.trim().toLowerCase() === cat)
    : []
  const rest = others.filter((p) => !sameCategory.some((s) => s._id === p._id))
  return [...sameCategory, ...rest].slice(0, limit)
}

export default function ProductDetailView({ package: pkg }: Props) {
  const router = useRouter()
  const { addItem, openCart, closeCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [catalog, setCatalog] = useState<CatalogProduct[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setCatalogLoading(true)
        const res = await fetch('/api/packages', { cache: 'no-store' })
        const json = await res.json()
        const list =
          json?.success && Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : []
        if (!cancelled) setCatalog(list)
      } catch {
        if (!cancelled) setCatalog([])
      } finally {
        if (!cancelled) setCatalogLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const recommended = useMemo(() => pickRecommended(catalog, pkg), [catalog, pkg])

  const images = pkg.images?.length ? pkg.images : [{ url: '/images/romoire/coffee_sachets.jpg', alt: pkg.title }]
  const categoryLabel = (pkg.packageCategory || pkg.subtitle || 'Premix').toUpperCase()
  const breadcrumbCategory = pkg.packageCategory || 'Products'
  const isComingSoon = Boolean(pkg.isComingSoon || !pkg.price || Number(pkg.price) === 0)
  const price = Number(pkg.price) || 0
  const rating = typeof pkg.rating === 'number' && pkg.rating > 0 ? pkg.rating : 4.5
  const reviewCount = pkg.reviews?.length ?? pkg.bookings ?? 0
  const specItems = useMemo(() => buildSpecItems(pkg), [pkg])
  const sizeLabel = pkg.capacity?.trim() || 'One size'
  const shortDesc =
    pkg.about?.trim() ||
    pkg.tourDetails?.trim() ||
    pkg.subtitle?.trim() ||
    'Single-origin Arabica premix with coconut milk and monk fruit — smooth, café-style coffee in seconds.'

  const cartPayload = {
    id: pkg._id,
    title: pkg.title,
    price,
    image: images[0]?.url,
    category: pkg.packageCategory || pkg.subtitle,
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: pkg.title, url })
      } else if (url) {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard')
      }
    } catch {
      /* user cancelled */
    }
  }

  const handleAddToCart = () => {
    if (isComingSoon) {
      toast.info(`${pkg.title} is coming soon`)
      return
    }
    addItem(cartPayload, quantity)
    toast.success(`Added ${quantity} × ${pkg.title} to cart`, {
      action: { label: 'View cart', onClick: () => openCart() },
    })
  }

  const handleBuyNow = () => {
    if (isComingSoon) {
      toast.info(`${pkg.title} is coming soon`)
      return
    }
    addItem(cartPayload, quantity)
    closeCart()
    router.push('/checkout')
  }

  const handleRecommendAdd = (item: CatalogProduct) => {
    const itemComingSoon = Boolean(item.isComingSoon || !item.price || Number(item.price) === 0)
    if (itemComingSoon) {
      toast.info(`${item.title} is coming soon`)
      return
    }
    addItem({
      id: item._id,
      title: item.title,
      price: Number(item.price) || 0,
      image: item.images?.[0]?.url,
      category: item.packageCategory || item.subtitle,
    })
    toast.success(`Added ${item.title} to cart`, {
      action: { label: 'View cart', onClick: () => openCart() },
    })
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-ink font-body antialiased pt-24 pb-16 md:pt-28">
      <div className="wrap max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink-mute mb-8">
          <Link href="/" className="hover:text-maroon transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/packages" className="hover:text-maroon transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-ink-soft">{breadcrumbCategory}</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-maroon font-medium truncate max-w-[180px] sm:max-w-none">{pkg.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-line shadow-[0_12px_40px_rgba(102,24,24,0.08)]">
              <Image
                src={images[selectedImage]?.url || images[0].url}
                alt={images[selectedImage]?.alt || pkg.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!isComingSoon && (
                  <span className="inline-flex px-3 py-1 rounded-full bg-maroon-deep text-cream text-[10px] font-semibold tracking-wider uppercase">
                    In stock
                  </span>
                )}
                {isComingSoon && (
                  <span className="inline-flex px-3 py-1 rounded-full bg-gold/90 text-white text-[10px] font-semibold tracking-wider uppercase">
                    Coming soon
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setWishlisted((w) => !w)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 border border-line flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={cn('w-5 h-5', wishlisted ? 'fill-maroon text-maroon' : 'text-ink-mute')}
                />
              </button>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.url + i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === i ? 'border-maroon ring-2 ring-maroon/20' : 'border-line hover:border-maroon/40'
                    )}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-line shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="inline-flex px-3 py-1 rounded-full bg-sand text-[#8A3A3A] text-[10px] font-semibold tracking-[0.15em]">
                {categoryLabel}
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-ink-mute hover:text-maroon transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl text-maroon font-medium leading-tight mb-3">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i <= Math.round(rating) ? 'fill-gold text-gold' : 'text-line fill-line'
                    )}
                  />
                ))}
                <span className="text-sm text-ink-mute ml-1">
                  {rating.toFixed(1)}
                  {reviewCount > 0 && (
                    <span className="hidden sm:inline"> ({reviewCount} reviews)</span>
                  )}
                </span>
              </div>
              {!isComingSoon && (
                <span className="inline-flex items-center gap-1 text-sm text-green-700 font-medium">
                  <Check className="w-4 h-4" />
                  In stock &amp; ready to ship
                </span>
              )}
            </div>

            <div className="mb-5 pb-5 border-b border-line/70">
              {isComingSoon ? (
                <p className="text-xl font-semibold text-ink-mute">Pricing coming soon</p>
              ) : (
                <p className="text-3xl font-semibold text-maroon">{formatInr(price)}</p>
              )}
              <p className="text-xs text-ink-mute mt-2 leading-relaxed">
                Inclusive of applicable taxes. Free express shipping on orders over ₹999 across India.
              </p>
            </div>

            <p className="text-sm text-ink-soft leading-relaxed mb-5">{shortDesc}</p>

            <div className="rounded-xl bg-[#EEF2F7] border border-[#D8E0EA] p-4 mb-6">
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#1e3a5f] mb-3 uppercase">
                Key details &amp; specifications
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-ink-mute mb-2 uppercase">Pack size</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex px-4 py-2 rounded-lg bg-maroon text-cream text-sm font-medium">
                    {sizeLabel}
                  </span>
                  <span className="text-xs text-ink-mute">
                    Selected: <strong className="text-ink">{sizeLabel}</strong>
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-wider text-ink-mute mb-2 uppercase">Quantity</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center rounded-lg border border-line overflow-hidden">
                    <button
                      type="button"
                      className="px-3 py-2 hover:bg-sand/80 disabled:opacity-40"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[2.5rem] text-center font-medium border-x border-line">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-2 hover:bg-sand/80"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {!isComingSoon && (
                    <span className="text-xs text-ink-mute">Ships from Mumbai · 2–5 business days</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                disabled={isComingSoon}
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-xl bg-maroon hover:bg-maroon-deep text-cream text-sm font-semibold gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to cart
              </Button>
              <Button
                type="button"
                disabled={isComingSoon}
                onClick={handleBuyNow}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-[#C9A66B] hover:opacity-95 text-white text-sm font-semibold border-0 shadow-md"
              >
                Buy now (1-click)
              </Button>
            </div>
          </div>
        </div>

        {(catalogLoading || recommended.length > 0) && (
          <section className="mt-16 pt-12 border-t border-line/80" aria-labelledby="recommended-heading">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[2px] text-[#8A3A3A] font-medium mb-2">
                  You may also like
                </p>
                <h2 id="recommended-heading" className="font-playfair text-2xl sm:text-3xl text-maroon font-medium">
                  Recommended products
                </h2>
                <p className="text-sm text-ink-soft mt-2 max-w-lg">
                  Explore more from the Romoire collection — same café-style premix, ready in seconds.
                </p>
              </div>
              <Link
                href="/packages"
                className="text-sm font-medium text-maroon hover:text-maroon-deep underline underline-offset-4 shrink-0"
              >
                View all products
              </Link>
            </div>

            {catalogLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-[420px] rounded-sm border border-line bg-white animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {recommended.map((item) => {
                  const imgUrl = item.images?.[0]?.url || '/images/romoire/coffee_sachets.jpg'
                  const itemComingSoon = Boolean(
                    item.isComingSoon || !item.price || Number(item.price) === 0
                  )
                  const priceText = itemComingSoon ? 'Coming soon' : formatInr(Number(item.price))
                  const sachetInfo = item.duration || item.capacity || '5 Sachets · 20g each'
                  const itemCategory = item.packageCategory || item.subtitle || 'Plant-based Premix'
                  const desc =
                    item.about ||
                    item.tourDetails ||
                    item.subtitle ||
                    'Single origin Arabica coffee premix with coconut milk and monk fruit sweetness.'

                  return (
                    <article
                      key={item._id}
                      className="border border-line rounded-sm p-5 bg-white flex flex-col gap-3 hover:shadow-[0_10px_32px_rgba(102,24,24,0.12)] transition-all duration-300 group"
                    >
                      <Link
                        href={`/packages/${item._id}`}
                        className="relative h-[200px] rounded-sm overflow-hidden border border-line bg-sand/30 block"
                      >
                        <img
                          src={imgUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.packageCategory && (
                          <span className="absolute top-3 right-3 bg-maroon text-cream text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                            {item.packageCategory}
                          </span>
                        )}
                      </Link>

                      <div className="flex flex-col gap-1 flex-grow">
                        <p className="text-[10px] uppercase tracking-[1.6px] text-[#8A3A3A] font-medium line-clamp-1">
                          {itemCategory}
                        </p>
                        <Link href={`/packages/${item._id}`} className="hover:text-maroon-deep transition-colors">
                          <h3 className="font-playfair text-xl text-maroon font-medium line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-ink-mute font-medium">{sachetInfo}</p>
                        <p className="text-sm leading-snug text-ink-soft line-clamp-2">{desc}</p>
                      </div>

                      <div className="flex items-baseline justify-between pt-2 border-t border-line/60">
                        <span className="font-playfair text-xl text-maroon font-medium">{priceText}</span>
                        <Link
                          href={`/packages/${item._id}`}
                          className="text-[11px] uppercase tracking-wider text-ink-mute hover:text-maroon underline underline-offset-4 font-medium"
                        >
                          Details →
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRecommendAdd(item)}
                        className="btn-romoire py-3 text-[11px] text-center w-full uppercase tracking-[1.4px] font-medium flex items-center justify-center gap-2 shadow-sm"
                      >
                        {itemComingSoon ? (
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
          </section>
        )}
      </div>
    </div>
  )
}
