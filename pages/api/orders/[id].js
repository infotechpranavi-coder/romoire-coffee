import connectDB, { isConnected, getDbUnavailableReason } from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req, res) {
  const { id } = req.query;
  await connectDB();

  if (!isConnected()) {
    return res.status(503).json({
      success: false,
      error: getDbUnavailableReason(),
    });
  }

  if (req.method === 'GET') {
    try {
      const order = await Order.findById(id).lean();
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updates = {};
      if (req.body.status) updates.status = req.body.status;
      if (req.body.paymentStatus) {
        updates['payment.status'] = req.body.paymentStatus;
        if (req.body.paymentStatus === 'paid') {
          updates['payment.paidAt'] = new Date();
        }
      }

      const order = await Order.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await Order.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
