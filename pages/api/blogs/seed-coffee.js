import connectDB from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import { isConnected } from '../../../lib/mongodb';

const coffeeBlogs = [
  {
    title: 'How to Brew the Perfect Pour-Over at Home',
    slug: 'how-to-brew-perfect-pour-over',
    excerpt:
      'Master water temperature, grind size, and pour technique for a clean, flavorful cup every morning.',
    content:
      'Pour-over is one of the most rewarding ways to taste single-origin coffee. Start with freshly roasted beans, use water between 92–96°C, and aim for a medium-fine grind. Bloom with twice the coffee weight in water, then pour in slow circles. At Romoire, we recommend a 1:16 ratio for bright African lots and 1:15 for chocolate-forward South American beans.',
    author: 'Romoire Roasting Team',
    category: 'Experience',
    image: {
      public_id: 'blog_pour_over',
      url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      alt: 'Pour-over coffee brewing',
    },
    isFeatured: true,
    tags: ['Brewing', 'Pour-Over', 'Tips'],
    status: 'published',
  },
  {
    title: 'Understanding Coffee Roast Levels',
    slug: 'understanding-coffee-roast-levels',
    excerpt:
      'Light, medium, or dark — learn how roast affects flavor, acidity, and the best brew methods for each.',
    content:
      'Light roasts preserve origin character — floral, fruity, and tea-like notes shine through. Medium roasts balance sweetness and body, ideal for drip and French press. Dark roasts develop bold, smoky flavors with lower acidity, perfect for espresso. Choosing the right roast depends on your brew method and taste preference. Our roasters cup every batch to ensure each level hits its sweet spot.',
    author: 'Romoire Roasting Team',
    category: 'Lifestyle',
    image: {
      public_id: 'blog_roast_levels',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      alt: 'Roasted coffee beans',
    },
    isFeatured: true,
    tags: ['Roasting', 'Education', 'Flavor'],
    status: 'published',
  },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await connectDB();

    if (!isConnected()) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const results = { created: [], updated: [], skipped: [] };

    for (const blog of coffeeBlogs) {
      try {
        const existing = await Blog.findOne({ slug: blog.slug });
        if (existing) {
          await Blog.findByIdAndUpdate(existing._id, blog);
          results.updated.push(blog.slug);
          continue;
        }
        await Blog.create(blog);
        results.created.push(blog.slug);
      } catch (error) {
        results.skipped.push({ slug: blog.slug, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Coffee blogs seeded for homepage',
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
