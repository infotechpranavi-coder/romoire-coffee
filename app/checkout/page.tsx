'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Smartphone,
  Truck,
  Wallet,
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { SITE_NAME } from '@/lib/branding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Step = 'details' | 'payment' | 'done'

type DetailsForm = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  landmark: string
  notes: string
}

const INITIAL_DETAILS: DetailsForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'Maharashtra',
  pincode: '',
  landmark: '',
  notes: '',
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, itemCount, subtotal, clearCart, closeCart } = useCart()
  const [step, setStep] = useState<Step>('details')
  const [details, setDetails] = useState<DetailsForm>(INITIAL_DETAILS)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [upiId, setUpiId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<any>(null)

  useEffect(() => {
    closeCart()
  }, [closeCart])

  const shippingFee = useMemo(() => (subtotal >= 999 ? 0 : subtotal > 0 ? 49 : 0), [subtotal])
  const total = subtotal + shippingFee

  const updateDetail = (key: keyof DetailsForm, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }))
  }

  const validateDetails = () => {
    if (!details.name.trim()) return 'Please enter your full name.'
    if (!details.email.trim() || !details.email.includes('@')) return 'Please enter a valid email.'
    if (!details.phone.trim() || details.phone.replace(/\D/g, '').length < 10) {
      return 'Please enter a valid 10-digit phone number.'
    }
    if (!details.address.trim()) return 'Please enter your delivery address.'
    if (!details.city.trim()) return 'Please enter your city.'
    if (!details.state.trim()) return 'Please enter your state.'
    if (!details.pincode.trim() || details.pincode.trim().length < 6) {
      return 'Please enter a valid 6-digit pincode.'
    }
    return null
  }

  const goToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) {
      toast.error('Your cart is empty.')
      router.push('/packages')
      return
    }
    const error = validateDetails()
    if (error) {
      toast.error(error)
      return
    }
    setStep('payment')
  }

  const placeOrder = async () => {
    if (!items.length) {
      toast.error('Your cart is empty.')
      return
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast.error('Please enter your UPI ID.')
      return
    }
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 12) {
        toast.error('Please enter a valid card number.')
        return
      }
      if (!cardExpiry.trim() || cardCvv.trim().length < 3) {
        toast.error('Please enter card expiry and CVV.')
        return
      }
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: details.name,
            email: details.email,
            phone: details.phone,
          },
          shipping: {
            address: details.address,
            city: details.city,
            state: details.state,
            pincode: details.pincode,
            landmark: details.landmark,
            notes: details.notes,
          },
          items: items.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
          })),
          paymentMethod,
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to place order.')
      }

      setPlacedOrder(result.data)
      clearCart()
      setStep('done')
      toast.success('Order placed successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!items.length && step !== 'done') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-16">
        <div className="wrap max-w-xl mx-auto text-center px-4">
          <div className="rounded-full bg-vanilla w-16 h-16 mx-auto flex items-center justify-center mb-5">
            <ShoppingBag className="h-7 w-7 text-mocha" />
          </div>
          <h1 className="font-playfair text-3xl text-maroon mb-3">Your cart is empty</h1>
          <p className="text-ink-soft mb-8">Add premixes to your cart before checking out.</p>
          <Link
            href="/packages"
            className="inline-flex rounded-full bg-maroon text-cream px-6 py-3 text-xs uppercase tracking-[0.16em] font-medium"
          >
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
      <div className="wrap max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-maroon/70 font-medium mb-1">
              {SITE_NAME} Checkout
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl text-maroon">
              {step === 'done' ? 'Order confirmed' : 'Place your order'}
            </h1>
          </div>
          {step !== 'done' && (
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-maroon"
            >
              <ArrowLeft className="h-4 w-4" /> Continue shopping
            </Link>
          )}
        </div>

        {/* Steps */}
        {step !== 'done' && (
          <div className="mb-10 flex items-center gap-2 sm:gap-4 text-[11px] uppercase tracking-[0.14em] font-bold">
            {[
              { id: 'details' as const, label: '1. Details' },
              { id: 'payment' as const, label: '2. Payment' },
              { id: 'done' as const, label: '3. Done' },
            ].map((s, idx) => {
              const stepOrder = { details: 0, payment: 1, done: 2 } as const
              const currentIndex = stepOrder[step]
              const itemIndex = stepOrder[s.id]
              const current = step === s.id
              const active = itemIndex <= currentIndex
              return (
                <div key={s.id} className="flex items-center gap-2 sm:gap-4">
                  <span
                    className={`${
                      current
                        ? 'text-maroon'
                        : active
                          ? 'text-mocha'
                          : 'text-ink-mute'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < 2 && <span className="text-ink-mute">→</span>}
                </div>
              )
            })}
          </div>
        )}

        {step === 'done' && placedOrder ? (
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="rounded-2xl border border-[#EADBCE] bg-white p-8">
              <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-5">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="font-playfair text-3xl text-maroon mb-2">Thank you!</h2>
              <p className="text-ink-soft mb-6">
                Your order <span className="font-semibold text-espresso">{placedOrder.orderNumber}</span>{' '}
                has been placed successfully.
              </p>
              <div className="space-y-3 text-sm text-ink-soft mb-8">
                <p>
                  We&apos;ll send updates to <strong>{placedOrder.customer?.email}</strong>
                </p>
                <p>
                  Payment:{' '}
                  <strong className="uppercase">{placedOrder.payment?.method}</strong> ·{' '}
                  {placedOrder.payment?.status === 'paid' ? 'Paid' : 'Pay on delivery'}
                </p>
                {placedOrder.payment?.transactionId && (
                  <p>
                    Transaction ID: <strong>{placedOrder.payment.transactionId}</strong>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/packages"
                  className="inline-flex rounded-full bg-maroon text-cream px-6 py-3 text-xs uppercase tracking-[0.16em] font-medium"
                >
                  Shop more
                </Link>
                <Link
                  href="/"
                  className="inline-flex rounded-full border border-maroon/30 text-maroon px-6 py-3 text-xs uppercase tracking-[0.16em] font-medium"
                >
                  Back home
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-[#EADBCE] bg-[#F6EFE6] p-6 h-fit">
              <h3 className="font-playfair text-xl text-maroon mb-4">Order summary</h3>
              <ul className="space-y-3 mb-5">
                {placedOrder.items?.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between gap-3 text-sm">
                    <span className="text-ink-soft">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium text-espresso">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#EADBCE] pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{Number(placedOrder.pricing?.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {placedOrder.pricing?.shippingFee
                      ? `₹${placedOrder.pricing.shippingFee}`
                      : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-maroon text-base pt-1">
                  <span>Total</span>
                  <span>₹{Number(placedOrder.pricing?.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <div className="rounded-2xl border border-[#EADBCE] bg-white p-6 md:p-8">
              {step === 'details' && (
                <form onSubmit={goToPayment} className="space-y-6">
                  <div>
                    <h2 className="font-playfair text-2xl text-maroon mb-1 flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> Delivery details
                    </h2>
                    <p className="text-sm text-ink-soft">Where should we send your premixes?</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        Full name *
                      </label>
                      <Input
                        value={details.name}
                        onChange={(e) => updateDetail('name', e.target.value)}
                        placeholder="Your name"
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={details.email}
                        onChange={(e) => updateDetail('email', e.target.value)}
                        placeholder="you@email.com"
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        Phone *
                      </label>
                      <Input
                        value={details.phone}
                        onChange={(e) => updateDetail('phone', e.target.value)}
                        placeholder="10-digit mobile"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        Address *
                      </label>
                      <Textarea
                        value={details.address}
                        onChange={(e) => updateDetail('address', e.target.value)}
                        placeholder="House/flat, street, area"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        City *
                      </label>
                      <Input
                        value={details.city}
                        onChange={(e) => updateDetail('city', e.target.value)}
                        placeholder="Mumbai"
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        State *
                      </label>
                      <Input
                        value={details.state}
                        onChange={(e) => updateDetail('state', e.target.value)}
                        placeholder="Maharashtra"
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        Pincode *
                      </label>
                      <Input
                        value={details.pincode}
                        onChange={(e) => updateDetail('pincode', e.target.value)}
                        placeholder="400053"
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        Landmark
                      </label>
                      <Input
                        value={details.landmark}
                        onChange={(e) => updateDetail('landmark', e.target.value)}
                        placeholder="Near metro / mall"
                        className="h-11"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        Order notes
                      </label>
                      <Textarea
                        value={details.notes}
                        onChange={(e) => updateDetail('notes', e.target.value)}
                        placeholder="Any delivery instructions?"
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-maroon hover:bg-maroon-deep text-cream text-xs uppercase tracking-[0.16em] font-bold"
                  >
                    Continue to payment
                  </Button>
                </form>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-playfair text-2xl text-maroon mb-1 flex items-center gap-2">
                      <Wallet className="h-5 w-5" /> Payment
                    </h2>
                    <p className="text-sm text-ink-soft">Choose how you want to pay.</p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      {
                        id: 'upi' as const,
                        title: 'UPI',
                        desc: 'Pay instantly with GPay / PhonePe / Paytm',
                        icon: Smartphone,
                      },
                      {
                        id: 'card' as const,
                        title: 'Card',
                        desc: 'Credit or debit card',
                        icon: CreditCard,
                      },
                      {
                        id: 'cod' as const,
                        title: 'Cash on delivery',
                        desc: 'Pay when your order arrives',
                        icon: Truck,
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                          paymentMethod === method.id
                            ? 'border-maroon bg-maroon/5 shadow-sm'
                            : 'border-[#EADBCE] hover:border-maroon/40'
                        }`}
                      >
                        <method.icon className="h-5 w-5 text-maroon mt-0.5" />
                        <div>
                          <p className="font-semibold text-espresso">{method.title}</p>
                          <p className="text-xs text-ink-soft mt-0.5">{method.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                        UPI ID
                      </label>
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="name@upi"
                        className="h-11"
                      />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                          Card number
                        </label>
                        <Input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                          Expiry
                        </label>
                        <Input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-mocha mb-1.5 block">
                          CVV
                        </label>
                        <Input
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="***"
                          className="h-11"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('details')}
                      className="h-12 rounded-full border-maroon/30 text-maroon"
                    >
                      Back to details
                    </Button>
                    <Button
                      type="button"
                      disabled={submitting}
                      onClick={placeOrder}
                      className="flex-1 h-12 rounded-full bg-maroon hover:bg-maroon-deep text-cream text-xs uppercase tracking-[0.16em] font-bold"
                    >
                      {submitting
                        ? 'Placing order...'
                        : paymentMethod === 'cod'
                          ? `Place order · ₹${total.toLocaleString('en-IN')}`
                          : `Pay ₹${total.toLocaleString('en-IN')} & place order`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-[#EADBCE] bg-[#F6EFE6] p-6 sticky top-28">
              <h3 className="font-playfair text-xl text-maroon mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" /> Your cart ({itemCount})
              </h3>
              <ul className="space-y-4 mb-5 max-h-[340px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-white border border-[#EADBCE] shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-mocha">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-espresso line-clamp-2">{item.title}</p>
                      <p className="text-xs text-ink-mute mt-0.5">Qty {item.quantity}</p>
                      <p className="text-sm font-medium text-maroon mt-1">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#EADBCE] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
                </div>
                {shippingFee === 0 && subtotal > 0 && (
                  <p className="text-[11px] text-green-700">Free shipping on orders over ₹999</p>
                )}
                <div className="flex justify-between font-bold text-maroon text-base pt-1">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
