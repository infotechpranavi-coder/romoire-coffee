import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { isConnected } from '../../../lib/mongodb';

export default async function handler(req, res) {
  const dbConnection = await connectDB();
  const useDemoData = !dbConnection || !isConnected();

  if (req.method === 'GET') {
    try {
      const { q, limit = 5 } = req.query;
      
      if (!q || q.trim() === '') {
        return res.status(200).json({ success: true, data: [] });
      }

      if (useDemoData) {
        return res.status(200).json({ success: true, data: [] });
      }

      const searchQuery = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { subtitle: { $regex: q, $options: 'i' } },
          { location: { $regex: q, $options: 'i' } },
          { about: { $regex: q, $options: 'i' } },
          { tourDetails: { $regex: q, $options: 'i' } }
        ]
      };

      const packages = await Package.find(searchQuery)
        .select('title subtitle location price duration images rating')
        .limit(parseInt(limit))
        .sort({ rating: -1, createdAt: -1 });

      res.status(200).json({ success: true, data: packages });
    } catch (error) {
      console.error('Error searching packages:', error.message);
      res.status(200).json({ success: true, data: [] });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
