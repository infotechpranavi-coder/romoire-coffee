import connectDB from '../../../lib/mongodb';
import Blog from '../../../models/Blog';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { publishedOnly, limit, featured } = req.query;
      const query = {};
      if (publishedOnly === 'true') query.status = 'published';
      if (featured === 'true') query.isFeatured = true;

      let blogsQuery = Blog.find(query).sort({ createdAt: -1 });
      if (limit) {
        const limitNum = parseInt(limit, 10);
        if (!Number.isNaN(limitNum) && limitNum > 0) {
          blogsQuery = blogsQuery.limit(limitNum);
        }
      }
      const blogs = await blogsQuery;
      res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const blog = await Blog.create(req.body);
      res.status(201).json({ success: true, data: blog });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, error: 'Slug must be unique' });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
