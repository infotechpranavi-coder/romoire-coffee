import connectDB, { isConnected, getDbUnavailableReason } from '@/lib/mongodb';
import Order from '@/models/Order';

function makeOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `RM${y}${m}${d}-${rand}`;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    if (!isConnected()) {
      return res.status(200).json({ success: true, data: [] });
    }
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: getDbUnavailableReason(),
      });
    }

    try {
      const body = req.body || {};
      const customer = body.customer || {};
      const shipping = body.shipping || {};
      const items = Array.isArray(body.items) ? body.items : [];
      const paymentMethod = body.paymentMethod || 'cod';

      if (!customer.name?.trim() || !customer.email?.trim() || !customer.phone?.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Name, email and phone are required.',
        });
      }

      if (
        !shipping.address?.trim() ||
        !shipping.city?.trim() ||
        !shipping.state?.trim() ||
        !shipping.pincode?.trim()
      ) {
        return res.status(400).json({
          success: false,
          error: 'Complete shipping address is required.',
        });
      }

      if (!items.length) {
        return res.status(400).json({ success: false, error: 'Cart is empty.' });
      }

      const normalizedItems = items.map((item) => ({
        productId: String(item.productId || item.id || ''),
        title: String(item.title || 'Product').trim(),
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: item.image || '',
        category: item.category || '',
      }));

      const subtotal = normalizedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shippingFee = subtotal >= 999 ? 0 : 49;
      const total = subtotal + shippingFee;

      const method = ['upi', 'card', 'cod'].includes(paymentMethod)
        ? paymentMethod
        : 'cod';

      const isPaidOnline = method === 'upi' || method === 'card';
      const transactionId = isPaidOnline
        ? `TXN${Date.now().toString(36).toUpperCase()}`
        : '';

      const order = await Order.create({
        orderNumber: makeOrderNumber(),
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          phone: customer.phone.trim(),
        },
        shipping: {
          address: shipping.address.trim(),
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          pincode: shipping.pincode.trim(),
          landmark: shipping.landmark?.trim() || '',
          notes: shipping.notes?.trim() || '',
        },
        items: normalizedItems,
        pricing: { subtotal, shippingFee, total },
        payment: {
          method,
          status: isPaidOnline ? 'paid' : 'pending',
          transactionId,
          paidAt: isPaidOnline ? new Date() : null,
        },
        status: 'placed',
      });

      return res.status(201).json({ success: true, data: order });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
