import connectDB from '../../../lib/mongodb';
import Banner from '../../../models/Banner';
import { isConnected } from '../../../lib/mongodb';

export default async function handler(req, res) {
  await connectDB();
  const connected = isConnected();

  if (req.method === 'GET') {
    try {
      const { activeOnly } = req.query;
      let query = {};
      if (activeOnly === 'true') {
        query = { isActive: true };
      }
      const banners = await Banner.find(query).sort({ order: 1, createdAt: 1 });
      res.status(200).json({ success: true, data: banners });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    if (!connected) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }
    try {
      const banner = await Banner.create(req.body);
      res.status(201).json({ success: true, data: banner });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
