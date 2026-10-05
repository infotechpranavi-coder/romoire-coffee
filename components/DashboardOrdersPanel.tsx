'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Package, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

type OrderRow = {
  _id: string
  orderNumber: string
  customer: { name: string; email: string; phone: string }
  shipping: {
    address: string
    city: string
    state: string
    pincode: string
    landmark?: string
    notes?: string
  }
  items: Array<{ title: string; price: number; quantity: number; category?: string }>
  pricing: { subtotal: number; shippingFee: number; total: number }
  payment: { method: string; status: string; transactionId?: string }
  status: string
  createdAt: string
}

const STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function DashboardOrdersPanel() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setOrders(data.data || [])
      } else {
        toast.error(data.error || 'Failed to load orders')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const selected = orders.find((o) => o._id === selectedId) || null

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed')
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...data.data } : o)))
      toast.success('Order status updated')
    } catch (error: any) {
      toast.error(error.message || 'Could not update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'shipped':
        return 'bg-blue-100 text-blue-700'
      case 'processing':
      case 'confirmed':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[32px] overflow-hidden bg-cream">
      <CardHeader className="p-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-black text-espresso tracking-tight uppercase flex items-center gap-2">
              <Package className="h-6 w-6 text-hazelnut" />
              Placed Orders
            </CardTitle>
            <CardDescription className="text-sm font-medium text-gray-400 mt-1">
              Orders from website checkout — cart → details → payment → done
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={fetchOrders}
            className="rounded-full border-hazelnut/30 text-hazelnut"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-2">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-3 text-hazelnut" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Package className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-espresso">No orders yet</p>
            <p className="text-sm mt-1">Orders placed on the website will appear here.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
            <div className="overflow-x-auto rounded-[24px] border border-gray-100 bg-gray-50/30">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Order
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Customer
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Total
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Payment
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedId(order._id)}
                      className={`border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${
                        selectedId === order._id ? 'bg-hazelnut/5' : 'hover:bg-cream'
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-sm text-espresso">{order.orderNumber}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                          {new Date(order.createdAt).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-espresso">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                      </td>
                      <td className="p-4 font-black text-sm text-espresso">
                        ₹{Number(order.pricing?.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-bold uppercase text-gray-600">
                          {order.payment?.method}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          {order.payment?.status}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${statusColor(order.status)} border-none uppercase text-[10px]`}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-[24px] border border-gray-100 bg-cream p-6 min-h-[320px]">
              {!selected ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-400 text-center px-6">
                  Select an order to view customer details, items and update status.
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Order detail
                    </p>
                    <h3 className="text-xl font-black text-espresso">{selected.orderNumber}</h3>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="font-bold text-espresso">{selected.customer.name}</p>
                    <p className="text-gray-500">{selected.customer.email}</p>
                    <p className="text-gray-500">{selected.customer.phone}</p>
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="font-bold text-espresso text-xs uppercase tracking-wider mb-1">
                      Shipping
                    </p>
                    <p>
                      {selected.shipping.address}, {selected.shipping.city},{' '}
                      {selected.shipping.state} — {selected.shipping.pincode}
                    </p>
                    {selected.shipping.landmark && (
                      <p className="text-xs text-gray-400 mt-1">Landmark: {selected.shipping.landmark}</p>
                    )}
                    {selected.shipping.notes && (
                      <p className="text-xs text-gray-400 mt-1">Notes: {selected.shipping.notes}</p>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-espresso text-xs uppercase tracking-wider mb-2">
                      Items
                    </p>
                    <ul className="space-y-2">
                      {selected.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between gap-3 text-sm border-b border-gray-100 pb-2"
                        >
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span className="font-bold text-espresso">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between text-sm font-black text-espresso">
                    <span>Total</span>
                    <span>₹{Number(selected.pricing?.total || 0).toLocaleString('en-IN')}</span>
                  </div>

                  <div>
                    <p className="font-bold text-espresso text-xs uppercase tracking-wider mb-2">
                      Update status
                    </p>
                    <Select
                      value={selected.status}
                      onValueChange={(val) => updateStatus(selected._id, val)}
                      disabled={updatingId === selected._id}
                    >
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
