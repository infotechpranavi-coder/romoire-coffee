'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Menu, X, Star, Check, ChevronDown, ArrowRight, Sparkles } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'


const FAQS = [
  {
    q: 'Does it really froth without milk or a frother?',
    a: 'Yes. The coconut milk solids build a thick, stable head with hot water and thirty seconds of stirring. One sachet makes one cup, and nothing else is needed — no dairy, no frother, no machine.',
  },
  {
    q: 'Is this just instant coffee?',
    a: 'No. Most instant is bulked out with chicory, milk powder and sugar. Romoire is single origin Arabica with coconut milk and monk fruit, and nothing else. It dissolves as fast as instant. That is where the resemblance ends.',
  },
  {
    q: 'What does monk fruit taste like?',
    a: 'Clean and rounded, without the metallic finish some sweeteners leave. A monk fruit coffee takes its sweetness from a plant extract rather than sugar, so it sits behind the coffee instead of in front of it. It isn’t sugar and doesn’t pretend to be.',
  },
  {
    q: 'Does it contain any dairy?',
    a: 'None. No milk powder, no milk solids, no lactose. The body and the froth come from coconut milk, which is why this is a dairy free coffee premix rather than an ordinary one with the milk taken out. Crafted on a dedicated dairy-free facility line.',
  },
  {
    q: 'Where does the coffee come from?',
    a: 'One place: Chikmagalur, in the hills of Karnataka. Single origin Arabica, sourced and made in India — the beans, the formulation and the production.',
  },
]

export default function HomePage() {
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [dbPackages, setDbPackages] = useState<any[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  const { addItem, openCart } = useCart()

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        const list = data?.success && Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setDbPackages(list)
      })
      .catch((err) => console.error('Failed to fetch packages:', err))
      .finally(() => setLoadingPackages(false))
  }, [])

  const DEFAULT_PRODUCT = {
    _id: "6aba50bf62e0f8f1f0cfbbab",
    title: "Premix assorted flavours pack",
    price: 499,
    packageCategory: "Assorted Pack",
    duration: "5 Sachets · 20g each",
    capacity: "Box of 5 Sachets",
  }

  // Homepage Hero (Start here) — products flagged isFeaturedDestination
  const heroProducts = useMemo(() => {
    const flagged = dbPackages.filter((p) => p.isFeaturedDestination)
    return flagged.length > 0 ? flagged : dbPackages
  }, [dbPackages])

  // The Range — products flagged isPopularPackage
  const rangeProducts = useMemo(() => {
    const flagged = dbPackages.filter((p) => p.isPopularPackage)
    return flagged.length > 0 ? flagged : dbPackages
  }, [dbPackages])

  useEffect(() => {
    if (heroProducts.length === 0) return
    const stillVisible = heroProducts.some((p) => p._id === selectedProductId)
    if (!selectedProductId || !stillVisible) {
      setSelectedProductId(heroProducts[0]._id)
    }
  }, [heroProducts, selectedProductId])

  const currentProduct =
    (Array.isArray(heroProducts) && heroProducts.length > 0)
      ? (heroProducts.find((p) => p._id === selectedProductId) || heroProducts[0])
      : DEFAULT_PRODUCT

  const handleAddToCart = (pkg: any, isComingSoon: boolean = false) => {
    if (isComingSoon) {
      toast.info(`${pkg.title} is coming soon!`, {
        description: 'Sign up for our newsletter to get notified when orders open.',
      })
      return
    }

    const price = Number(pkg.price) || 0
    addItem({
      id: String(pkg._id || pkg.id || pkg.title),
      title: pkg.title,
      price,
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

  const isHeroComingSoon = Boolean(currentProduct?.isComingSoon || !currentProduct?.price || Number(currentProduct?.price) === 0)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    setSubscribed(true)
    toast.success('Thank you for subscribing!', {
      description: 'You will receive an email when something new lands.',
    })
    setEmailInput('')
  }

  return (
    <div className="bg-white text-ink font-body antialiased selection:bg-maroon selection:text-cream">
      {/* ============ HERO SECTION ============ */}
      <section id="top" className="s-white pt-24 md:pt-28">
        <div className="wrap py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_1fr] gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              <span className="eyebrow">
                Plant-based coffee premix · 5 single-serve sachets
              </span>
              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-[62px] text-maroon leading-[1.08] font-medium">
                Café taste.<br />No dairy. No refined sugar.
              </h1>
              <p className="text-base sm:text-lg text-ink-soft max-w-[490px] leading-[1.7]">
                Single origin Arabica, coconut milk and monk fruit — a plant based cappuccino premix that needs nothing but hot water. One sachet, one cup, about a minute.
              </p>

              {/* Buy Module */}
              <div className="border border-line rounded-sm p-6 bg-white flex flex-col gap-4 max-w-[490px] shadow-[0_6px_24px_rgba(102,24,24,0.06)]">
                <span className="text-[11.5px] uppercase tracking-[2.2px] text-[#8A3A3A] font-medium">
                  Start here
                </span>

                {loadingPackages ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-maroon border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-ink-mute">Loading collection...</span>
                  </div>
                ) : currentProduct ? (
                  <>
                    {/* Dynamic Product Pills */}
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a product">
                      {heroProducts.map((p) => {
                        const isActive = (selectedProductId || heroProducts[0]?._id) === p._id
                        return (
                          <button
                            key={p._id}
                            type="button"
                            onClick={() => setSelectedProductId(p._id)}
                            className={`text-[13px] tracking-wide px-4 py-2 rounded-full border transition-all ${
                              isActive
                                ? 'bg-maroon border-maroon text-cream font-medium shadow-sm'
                                : 'bg-white border-maroon/30 text-ink-soft hover:border-maroon hover:text-maroon'
                            }`}
                          >
                            {p.title}
                          </button>
                        )
                      })}
                    </div>

                    {/* Price and Details */}
                    <div className="flex items-baseline justify-between gap-4 flex-wrap pt-1 border-t border-line/50">
                      <span className="font-playfair text-3xl text-maroon font-medium">
                        {isHeroComingSoon ? 'Coming soon' : `₹${currentProduct.price}`}
                      </span>
                      <span className="text-sm text-ink-mute">
                        {currentProduct.packageCategory || 'Single Origin'} · {currentProduct.duration || currentProduct.capacity || 'Pre-measured 20g'}
                      </span>
                    </div>

                    {/* Add CTA */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(currentProduct, isHeroComingSoon)}
                      className="btn-romoire w-full text-center py-4 text-[13px] tracking-[1.8px] shadow-sm uppercase font-medium flex items-center justify-center gap-2"
                    >
                      {isHeroComingSoon ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Coming soon
                        </>
                      ) : (
                        `Add ${currentProduct.title} to cart`
                      )}
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center text-sm text-ink-mute">
                    No products currently available.
                  </div>
                )}

                <p className="text-xs text-ink-mute text-center">
                  Free shipping over ₹999 across India
                </p>
              </div>

              <Link
                href="/about"
                className="text-maroon text-sm tracking-wide border-b border-maroon/35 pb-1 self-start hover:border-maroon transition-colors inline-flex items-center gap-1.5"
              >
                Why we made it <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="relative group">
              <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[540px] rounded-sm overflow-hidden border border-line bg-sand/40 shadow-[0_8px_32px_rgba(102,24,24,0.08)]">
                <Image
                  src="/images/romoire/hero_cappuccino.jpg"
                  alt="Romoire plant-based cappuccino premix with rich dense café froth"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-transparent" />
                
                {/* Visual Badges */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-line shadow-sm">
                  <span className="text-xs uppercase tracking-wider text-maroon font-medium">
                    100% Arabica · Coconut Milk · Monk Fruit
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-cream">
                  <p className="font-playfair text-xl md:text-2xl font-medium leading-snug">
                    Real café froth from one sachet.
                  </p>
                  <p className="text-xs md:text-sm text-cream/90 mt-1">
                    Hot water and 30 seconds stirring. No frother, no milk, no machine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="bg-maroon text-cream border-y border-maroon-deep">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-5">
          <ul className="flex items-center justify-between gap-4 md:gap-8 flex-wrap text-xs tracking-[2.4px] uppercase font-light">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />
              Dairy free
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />
              Lactose free
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />
              No refined sugar
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />
              100% Arabica
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />
              Monk fruit sweetened
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />
              Vegan friendly
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 inline-block" />
              Made in India
            </li>
          </ul>
        </div>
      </section>

      {/* ============ ABOUT ROMOIRE (WHO WE ARE) ============ */}
      <section id="story" className="s-section bg-maroon-mid text-cream">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
            {/* Left Story Column */}
            <div className="flex flex-col gap-6">
              <span className="eyebrow eyebrow-light">Who we are</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.12]">
                Made because<br />I couldn’t find it.
              </h2>
              <p className="text-base sm:text-[17.5px] leading-[1.78] text-[#F3DFCB]">
                Romoire started on the road — long flights, early mornings, and no dairy free coffee worth drinking. So I built one. 100% Arabica, no chicory. Coconut milk for real café body and a proper froth. Monk fruit instead of sugar. No dairy, no lactose, no compromise on how it tastes.
              </p>
              <p className="font-cormorant italic text-2xl text-[#E9C9A8]">
                Café taste. No dairy. No refined sugar.
              </p>
              <Link
                href="/about"
                className="btn-romoire-ghost-light self-start text-xs uppercase tracking-[1.8px] py-3.5 px-7 border rounded-sm"
              >
                Read our story
              </Link>
            </div>

            {/* Right 4-Tile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              <div className="flex flex-col gap-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E9C9A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 20c0-8.5 6.2-14 15-14 0 8.5-5.5 14.5-14 14.5H4V20Z" />
                  <path d="M4.5 19.5 12.5 11.5" />
                </svg>
                <h3 className="font-playfair text-xl sm:text-2xl text-cream font-medium">
                  Single origin Arabica
                </h3>
                <p className="text-sm leading-[1.7] text-[#EBD4BE]">
                  From the hills of Chikmagalur, Karnataka. One region, one bean. No chicory, no fillers, no blend of whatever was cheapest that month.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E9C9A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 11h14v5.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 4 16.5V11Z" />
                  <path d="M18 12h1.3a2.4 2.4 0 0 1 0 4.8H18" />
                  <path d="M6 8.2c0-1.4 1.6-1.4 1.6-2.8M10.2 8.2c0-1.4 1.6-1.4 1.6-2.8M14.4 8.2c0-1.4 1.6-1.4 1.6-2.8" />
                </svg>
                <h3 className="font-playfair text-xl sm:text-2xl text-cream font-medium">
                  Real café froth
                </h3>
                <p className="text-sm leading-[1.7] text-[#EBD4BE]">
                  A thick, stable head that makes a cappuccino feel like a cappuccino — built from hot water and thirty seconds of stirring. No milk, no frother, no machine.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E9C9A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3c3 3.4 5 6.2 5 8.8a5 5 0 0 1-10 0C7 9.2 9 6.4 12 3Z" />
                  <path d="M9.6 12.4c0 1.5 1.1 2.6 2.4 2.6" />
                </svg>
                <h3 className="font-playfair text-xl sm:text-2xl text-cream font-medium">
                  Sweetened with monk fruit
                </h3>
                <p className="text-sm leading-[1.7] text-[#EBD4BE]">
                  A monk fruit coffee carries its sweetness from a plant extract with no calories of its own. No refined sugar anywhere in the sachet, and the sweetness sits behind the coffee rather than in front of it.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E9C9A8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 6.5h10v13a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5v-13Z" />
                  <path d="M7 6.5 8.7 4l1.7 2.5L12 4l1.6 2.5L15.3 4 17 6.5" />
                </svg>
                <h3 className="font-playfair text-xl sm:text-2xl text-cream font-medium">
                  One sachet, one cup
                </h3>
                <p className="text-sm leading-[1.7] text-[#EBD4BE]">
                  20g, pre-measured, sealed. It fits in a laptop bag, a hotel drawer or a desk. Nothing to weigh, nothing to carry, nothing to plug in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW TO MAKE IT ============ */}
      <section id="how" className="s-section s-white">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Steps */}
            <div className="flex flex-col gap-6">
              <span className="eyebrow">How to make it</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[48px] text-maroon font-medium leading-[1.12]">
                A proper cappuccino.<br />From one sachet.
              </h2>
              <p className="text-base sm:text-lg text-ink-soft leading-[1.72]">
                No frother. No milk. No machine. The froth comes from the sachet, not from equipment — which is the whole reason this works in a hotel room at six in the morning.
              </p>

              <div className="flex flex-col gap-6 mt-2">
                <div className="flex items-start gap-5">
                  <span className="font-playfair text-3xl sm:text-4xl text-gold font-medium leading-none w-10 shrink-0">
                    01
                  </span>
                  <div>
                    <h3 className="font-playfair text-xl text-maroon font-medium mb-1">
                      Tear
                    </h3>
                    <p className="text-sm sm:text-base text-ink-soft leading-[1.65]">
                      One sachet into your cup. 20g, pre-measured — nothing to spoon or weigh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <span className="font-playfair text-3xl sm:text-4xl text-gold font-medium leading-none w-10 shrink-0">
                    02
                  </span>
                  <div>
                    <h3 className="font-playfair text-xl text-maroon font-medium mb-1">
                      Pour
                    </h3>
                    <p className="text-sm sm:text-base text-ink-soft leading-[1.65]">
                      180 ml hot water, just off the boil. Water only — no milk needed, dairy or plant.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <span className="font-playfair text-3xl sm:text-4xl text-gold font-medium leading-none w-10 shrink-0">
                    03
                  </span>
                  <div>
                    <h3 className="font-playfair text-xl text-maroon font-medium mb-1">
                      Stir
                    </h3>
                    <p className="text-sm sm:text-base text-ink-soft leading-[1.65]">
                      The froth builds as you go, then settles into a thick, even head.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Photography / Step Cards */}
            <div className="bg-sand/40 border border-maroon/20 rounded-sm p-6 sm:p-8 flex flex-col gap-6 shadow-[0_6px_24px_rgba(102,24,24,0.05)]">
              <span className="eyebrow text-maroon font-medium">Three simple steps</span>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <div className="relative aspect-square rounded-sm overflow-hidden border border-line">
                    <Image
                      src="/images/romoire/step_tear.jpg"
                      alt="Step 1: Tear sachet"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-ink-soft uppercase tracking-wider">
                    01 · Tear
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="relative aspect-square rounded-sm overflow-hidden border border-line">
                    <Image
                      src="/images/romoire/step_pour.jpg"
                      alt="Step 2: Pour hot water"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-ink-soft uppercase tracking-wider">
                    02 · Pour
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="relative aspect-square rounded-sm overflow-hidden border border-line">
                    <Image
                      src="/images/romoire/step_stir.jpg"
                      alt="Step 3: Stir for thick froth"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-ink-soft uppercase tracking-wider">
                    03 · Froth
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#6B4A3E]">
                Thick, velvety crema in 60 seconds. Pure single-origin Arabica from Karnataka with rich coconut milk solids.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHO IT'S FOR ============ */}
      <section className="s-section bg-maroon text-cream">
        <div className="wrap">
          <div className="flex flex-col gap-3.5 mb-12">
            <span className="eyebrow eyebrow-light">Who it’s for</span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-medium">
              However you take your coffee.
            </h2>
            <p className="text-base sm:text-[17.5px] leading-[1.7] text-[#F0DBC4] max-w-[620px]">
              Romoire isn’t only for people who’ve given something up. It’s for anyone who wants a café cup without the café.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div>
              <div className="w-10 h-0.5 bg-gold mb-5" />
              <h3 className="font-playfair text-2xl mb-3 text-cream font-medium">
                If you buy your coffee out
              </h3>
              <p className="text-base leading-[1.75] text-[#F0DBC4]">
                A café cappuccino costs ₹250 and a walk to get it. This is the same eleven o’clock cup, without either — and it’s waiting in your drawer.
              </p>
            </div>

            <div>
              <div className="w-10 h-0.5 bg-gold mb-5" />
              <h3 className="font-playfair text-2xl mb-3 text-cream font-medium">
                If you already buy premix
              </h3>
              <p className="text-base leading-[1.75] text-[#F0DBC4]">
                The difference is what isn’t in it. No milk powder, no refined sugar, no chicory bulking out the coffee. A lactose free instant coffee that doesn’t taste like one.
              </p>
            </div>

            <div>
              <div className="w-10 h-0.5 bg-gold mb-5" />
              <h3 className="font-playfair text-2xl mb-3 text-cream font-medium">
                If you brew at home
              </h3>
              <p className="text-base leading-[1.75] text-[#F0DBC4]">
                You already know what good coffee tastes like, which is exactly why most instant disappoints you. This is for the mornings when the grinder and the ten minutes aren’t happening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE RANGE ============ */}
      <section id="range" className="s-section s-white">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">The range</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-maroon font-medium">
                Choose your flavour.
              </h2>
            </div>
            <p className="text-base text-ink-soft max-w-[430px] leading-[1.7]">
              Every blend crafted with single-origin Arabica, dairy-free coconut milk, and zero refined sugar. Single-serve, ready in about a minute.
            </p>
          </div>

          {/* Cards Grid: ONLY Dynamic Added Products from Database */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {loadingPackages ? (
              <div className="col-span-full py-16 text-center text-ink-mute font-light text-base">
                Loading products...
              </div>
            ) : rangeProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-ink-mute font-light text-base">
                No products found in the collection.
              </div>
            ) : (
              rangeProducts.map((pkg) => {
                const imgUrl = pkg.images?.[0]?.url || '/images/romoire/coffee_sachets.jpg'
                const categoryText = pkg.packageCategory || pkg.subtitle || 'Specialty Coffee'
                const descText =
                  pkg.about || pkg.tourDetails || pkg.subtitle || 'Single origin Arabica coffee, crafted without refined sugar or dairy.'

                return (
                  <article
                    key={pkg._id}
                    className="border border-line rounded-sm p-6 bg-white flex flex-col gap-3.5 hover:shadow-[0_8px_28px_rgba(102,24,24,0.1)] transition-all group"
                  >
                    <Link
                      href={`/packages/${pkg._id}`}
                      className="relative h-[210px] rounded-sm overflow-hidden border border-line bg-sand/30 block"
                    >
                      <img
                        src={imgUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
                        {pkg.isFeaturedTrip && (
                          <span className="bg-gold text-maroon-deep text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                            Featured
                          </span>
                        )}
                        {pkg.packageCategory && (
                          <span className="bg-maroon text-cream text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                            {pkg.packageCategory}
                          </span>
                        )}
                      </div>
                    </Link>

                    <Link href={`/packages/${pkg._id}`} className="hover:text-maroon-deep transition-colors">
                      <h3 className="font-playfair text-2xl text-maroon font-medium line-clamp-1">
                        {pkg.title}
                      </h3>
                    </Link>
                    <p className="text-[11.5px] uppercase tracking-[1.8px] text-[#8A3A3A] font-medium line-clamp-1">
                      {categoryText}
                    </p>
                    <p className="text-sm leading-[1.65] text-ink-soft flex-grow line-clamp-3">
                      {descText}
                    </p>

                    {(() => {
                      const isCardComingSoon = Boolean(pkg.isComingSoon || !pkg.price || Number(pkg.price) === 0)
                      return (
                        <>
                          <div className="flex items-baseline justify-between pt-1">
                            <p className="font-playfair text-xl text-maroon font-medium">
                              {isCardComingSoon ? 'Coming soon' : `₹${pkg.price}`}
                            </p>
                            <Link
                              href={`/packages/${pkg._id}`}
                              className="text-xs uppercase tracking-wider text-ink-mute hover:text-maroon underline underline-offset-4"
                            >
                              View details →
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(pkg, isCardComingSoon)}
                            className="btn-romoire py-3.5 text-xs text-center w-full flex items-center justify-center gap-2 uppercase tracking-wider font-medium"
                          >
                            {isCardComingSoon ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                Coming soon
                              </>
                            ) : (
                              'Add to cart'
                            )}
                          </button>
                        </>
                      )
                    })()}
                  </article>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* ============ INGREDIENTS (IN / NEVER) ============ */}
      <section id="ingredients" className="s-section bg-cream">
        <div className="wrap">
          <div className="flex flex-col gap-3 max-w-[720px] mb-12">
            <span className="eyebrow">Ingredients</span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-maroon font-medium">
              What goes in. And what stays out.
            </h2>
            <p className="text-base sm:text-[17px] leading-[1.75] text-ink-soft">
              Romoire is a dairy free coffee premix made in India. Three ingredients do the work, and the list of what we leave out is almost as short.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Panel In */}
            <div className="bg-white border border-line rounded-sm p-8 sm:p-10 shadow-sm">
              <h3 className="font-body text-xs font-semibold uppercase tracking-[2.4px] text-maroon mb-6">
                In every sachet
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3.5 text-base text-ink leading-relaxed">
                  <Check className="w-5 h-5 text-maroon shrink-0 mt-0.5" />
                  <span>Single origin Arabica from Chikmagalur — no chicory, no fillers</span>
                </li>
                <li className="flex items-start gap-3.5 text-base text-ink leading-relaxed">
                  <Check className="w-5 h-5 text-maroon shrink-0 mt-0.5" />
                  <span>Coconut milk, for genuine café body and the froth</span>
                </li>
                <li className="flex items-start gap-3.5 text-base text-ink leading-relaxed">
                  <Check className="w-5 h-5 text-maroon shrink-0 mt-0.5" />
                  <span>Monk fruit, a plant-based sweetener with no calories of its own</span>
                </li>
                <li className="flex items-start gap-3.5 text-base text-ink leading-relaxed">
                  <Check className="w-5 h-5 text-maroon shrink-0 mt-0.5" />
                  <span>One sachet, one cup, hot water — that’s the whole method</span>
                </li>
              </ul>
            </div>

            {/* Panel Out */}
            <div className="bg-maroon text-cream rounded-sm p-8 sm:p-10 shadow-sm">
              <h3 className="font-body text-xs font-semibold uppercase tracking-[2.4px] text-[#E9C9A8] mb-6">
                Never
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3.5 text-base text-[#F3DFCB] leading-relaxed">
                  <span className="w-5 h-5 rounded-full border border-[#E9C9A8] flex items-center justify-center text-xs font-bold text-[#E9C9A8] shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>Dairy, milk solids or lactose</span>
                </li>
                <li className="flex items-start gap-3.5 text-base text-[#F3DFCB] leading-relaxed">
                  <span className="w-5 h-5 rounded-full border border-[#E9C9A8] flex items-center justify-center text-xs font-bold text-[#E9C9A8] shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>Refined sugar</span>
                </li>
                <li className="flex items-start gap-3.5 text-base text-[#F3DFCB] leading-relaxed">
                  <span className="w-5 h-5 rounded-full border border-[#E9C9A8] flex items-center justify-center text-xs font-bold text-[#E9C9A8] shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>Preservatives</span>
                </li>
                <li className="flex items-start gap-3.5 text-base text-[#F3DFCB] leading-relaxed">
                  <span className="w-5 h-5 rounded-full border border-[#E9C9A8] flex items-center justify-center text-xs font-bold text-[#E9C9A8] shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>Added artificial colours</span>
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-[#E2BFA6] mt-7 pt-4 border-t border-cream/25">
                Full nutritional panel on box
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHIKMAGALUR ============ */}
      <section className="s-section s-white">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo of Chikmagalur Estate */}
            <div className="relative min-h-[360px] sm:min-h-[440px] rounded-sm overflow-hidden border border-line shadow-sm">
              <Image
                src="/images/romoire/chikmagalur_estate.jpg"
                alt="Chikmagalur coffee estate in Karnataka India"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-line text-xs uppercase tracking-wider text-maroon font-medium">
                Chikmagalur · Karnataka, India
              </div>
            </div>

            {/* Text details */}
            <div className="flex flex-col gap-5">
              <span className="eyebrow">Made in India</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[46px] text-maroon font-medium leading-[1.15]">
                Single origin.<br />Chikmagalur.
              </h2>
              <p className="text-base sm:text-[17px] leading-[1.75] text-ink-soft">
                Our Arabica comes from one place: Chikmagalur, in the hills of Karnataka, where coffee was first planted in India nearly four hundred years ago. Single origin — not a blend of whatever beans were cheapest that month.
              </p>
              <p className="text-base sm:text-[17px] leading-[1.75] text-ink-soft">
                Sourced and made in India, start to finish. The beans, the formulation, the production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOUNDER ============ */}
      <section className="s-section bg-maroon text-cream">
        <div className="wrap flex flex-col items-center text-center gap-6 max-w-[860px]">
          <span className="eyebrow eyebrow-light">The person behind it</span>
          <p className="font-cormorant italic text-2xl sm:text-3xl lg:text-4xl leading-[1.3] text-cream">
            “I set out to find a cup of coffee I could actually drink, and ended up making it myself.”
          </p>
          <p className="text-base leading-[1.75] text-[#F0DBC4] max-w-[720px]">
            It took eight months and more formulations than I care to count before one of them met the standard. That formulation is what’s in the box, and every batch since has been held to it.
          </p>
          <div className="flex flex-col items-center gap-2 mt-3">
            <div className="relative w-44 h-16">
              <Image
                src="/images/romoire/founder_signature.png"
                alt="Sonakshi Raj Signature"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs uppercase tracking-[1.8px] text-[#E2BFA6]">
              Sonakshi Raj · Founder, Romoire
            </p>
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="s-section s-white">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Reviews</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl text-maroon font-medium">
                What people say
              </h2>
            </div>
            <a
              href="#range"
              className="text-maroon text-sm tracking-wide border-b border-maroon/35 pb-1 self-start sm:self-auto hover:border-maroon transition-colors"
            >
              Read all reviews →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <figure className="bg-cream rounded-sm p-8 flex flex-col gap-4 border border-line/40">
              <div className="flex items-center gap-1 text-gold" aria-label="5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="font-cormorant text-xl leading-[1.5] text-ink flex-grow">
                “The froth is unbelievable for a sachet. You pour hot water, stir for 20 seconds, and you get that thick velvety cappuccino foam that usually requires an espresso machine.”
              </blockquote>
              <figcaption className="text-xs uppercase tracking-[1.4px] text-ink-mute pt-2 border-t border-line/30">
                Ananya S. · Mumbai
              </figcaption>
            </figure>

            <figure className="bg-cream rounded-sm p-8 flex flex-col gap-4 border border-line/40">
              <div className="flex items-center gap-1 text-gold" aria-label="5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="font-cormorant text-xl leading-[1.5] text-ink flex-grow">
                “Being lactose intolerant in India made ordering coffee at airports and hotels a nightmare. Romoire changed everything — coconut milk and monk fruit make it taste even better than dairy.”
              </blockquote>
              <figcaption className="text-xs uppercase tracking-[1.4px] text-ink-mute pt-2 border-t border-line/30">
                Vikram M. · Bengaluru
              </figcaption>
            </figure>

            <figure className="bg-cream rounded-sm p-8 flex flex-col gap-4 border border-line/40">
              <div className="flex items-center gap-1 text-gold" aria-label="5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="font-cormorant text-xl leading-[1.5] text-ink flex-grow">
                “I travel weekly for work and keep three sachets in my laptop bag at all times. All I need is a kettle in the hotel room. It’s single origin Arabica and you can taste the quality immediately.”
              </blockquote>
              <figcaption className="text-xs uppercase tracking-[1.4px] text-ink-mute pt-2 border-t border-line/30">
                Pooja K. · New Delhi
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="s-section bg-cream">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 sticky top-28">
              <span className="eyebrow">FAQ</span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[44px] text-maroon font-medium leading-[1.15]">
                What to expect.
              </h2>
              <p className="text-base text-ink-soft leading-[1.7]">
                The froth, the monk fruit, and what’s actually in the sachet.
              </p>
              <a
                href="#footer"
                className="text-maroon text-sm tracking-wide border-b border-maroon/35 pb-1 self-start hover:border-maroon transition-colors"
              >
                Ask a question →
              </a>
            </div>

            <div className="flex flex-col divide-y divide-maroon/15">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div key={index} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left gap-4 group"
                    >
                      <h3 className="font-playfair text-lg sm:text-xl text-maroon font-medium group-hover:text-maroon-deep transition-colors">
                        {faq.q}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-maroon shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-sm sm:text-base leading-[1.7] text-ink-soft animate-in fade-in-50 duration-200">
                        {faq.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section className="bg-maroon-deep text-cream py-24 sm:py-28 text-center">
        <div className="wrap flex flex-col items-center gap-6 max-w-[620px]">
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[54px] font-medium leading-[1.14]">
            Real coffee. Anywhere you are.
          </h2>
          <p className="text-base sm:text-lg leading-[1.7] text-[#F0DBC4]">
            Five sachets. Four flavours. One minute each. Start with the Discovery Box and find the one you’ll keep buying.
          </p>
          <a
            href="#range"
            className="btn-romoire-light btn-romoire text-xs uppercase tracking-[1.8px] py-4 px-9 mt-2"
          >
            Shop the range
          </a>
        </div>
      </section>
    </div>
  )
}
