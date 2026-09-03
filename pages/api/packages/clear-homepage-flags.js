import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { isConnected } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await connectDB();

    if (!isConnected()) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const result = await Package.updateMany(
      {},
      {
        $set: {
          isFeaturedDestination: false,
          isPopularPackage: false,
          isFeaturedTrip: false,
          updatedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: 'All homepage visibility flags cleared',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('clear-homepage-flags error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
