import { COFFEE_IMAGES } from '@/lib/coffeeImages';
import { BlogData } from '@/lib/types';

export const HOME_BLOG_SEEDS: BlogData[] = [
  {
    _id: 'seed-blog-pour-over',
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
      url: COFFEE_IMAGES.pour,
      alt: 'Pour-over coffee brewing',
    },
    isFeatured: true,
    status: 'published',
    tags: ['Brewing', 'Pour-Over', 'Tips'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'seed-blog-roast-levels',
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
      url: COFFEE_IMAGES.beansDark,
      alt: 'Roasted coffee beans',
    },
    isFeatured: true,
    status: 'published',
    tags: ['Roasting', 'Education', 'Flavor'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function formatBlogDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
