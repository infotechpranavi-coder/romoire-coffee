import connectDB from '../../../lib/mongodb';
import Testimonial from '../../../models/Testimonial';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { activeOnly } = req.query;
      let query = {};
      if (activeOnly === 'true') {
        query = { isActive: true };
      }
      const testimonials = await Testimonial.find(query).sort({ createdAt: -1 }).lean();
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=300'
      );
      res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const testimonial = await Testimonial.create(req.body);
      res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
