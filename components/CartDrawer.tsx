'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { SITE_NAME } from '@/lib/branding'

export default function CartDrawer() {
  const router = useRouter()
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart()

  if (!isOpen) return null

  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 49
  const total = subtotal + shippingFee

  const handleCheckout = () => {
    if (!items.length) return
    closeCart()
    router.push('/checkout')
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-espresso/40 backdrop-blur-[2px]"
        onClick={closeCart}
      />

      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl border-l border-mocha/15"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-mocha/15 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mocha">Your cart</p>
            <h2 className="font-heading text-xl text-espresso">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 text-mocha hover:bg-vanilla hover:text-espresso transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-6">
              <div className="rounded-full bg-vanilla p-4 text-mocha">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <p className="font-heading text-lg text-espresso">Your cart is empty</p>
                <p className="mt-1 text-sm text-muted">
                  Add products from the home page or Products to get started.
                </p>
              </div>
              <Link
                href="/packages"
                onClick={closeCart}
                className="mt-2 inline-flex rounded-full bg-hazelnut px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cream hover:bg-espresso transition-colors"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-mocha/10 bg-white/70 p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-vanilla">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-mocha">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-espresso">{item.title}</p>
                        {item.category && (
                          <p className="text-[10px] uppercase tracking-wider text-mocha">{item.category}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full p-1.5 text-mocha hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-mocha/20 bg-cream">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-mocha hover:text-espresso"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.75rem] text-center text-sm font-bold text-espresso">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-mocha hover:text-espresso"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-heading text-base text-hazelnut">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-mocha/15 bg-white/80 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-mocha">Subtotal</span>
              <span className="font-heading text-base text-espresso">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-mocha">Shipping</span>
              <span className="font-medium text-espresso">
                {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-mocha font-semibold">Total</span>
              <span className="font-heading text-lg text-espresso">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-muted">
              Next: delivery details → payment → order confirmed. Free shipping over ₹999 with {SITE_NAME}.
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-full bg-hazelnut py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cream hover:bg-espresso transition-colors"
            >
              Proceed to checkout
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-full border border-mocha/20 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-mocha hover:bg-vanilla transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
