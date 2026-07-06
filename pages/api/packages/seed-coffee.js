import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { isConnected } from '../../../lib/mongodb';
import { NEW_ARRIVALS_SEED_PRODUCTS } from '../../../data/newArrivalsData';

const coffeePackages = NEW_ARRIVALS_SEED_PRODUCTS.map((product) => ({
  title: product.title,
  subtitle: product.subtitle,
  about: product.subtitle,
  services: 'Whole bean or ground, roast date included, brewing guide',
  tourDetails: product.subtitle,
  price: product.price,
  duration: '250g / 500g / 1kg',
  location: 'Romoire Roastery',
  capacity: '1 bag+',
  packageType: 'domestic',
  place: 'roastery',
  packageCategory: product.packageCategory ?? product.title,
  images: [
    {
      public_id: `coffee-${product.id}`,
      url: product.image,
      alt: product.title,
    },
  ],
  itinerary: [],
  transportation: [],
  accommodation: [],
  inclusions: ['Fresh roast', 'Brewing guide'],
  exclusions: [],
  reviews: [],
  bookings: 0,
  rating: 4.9,
  isFeaturedTrip: true,
  isPopularPackage: true,
}));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await connectDB();

    if (!isConnected()) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const results = { created: [], updated: [], errors: [] };

    for (const pkg of coffeePackages) {
      try {
        const existing = await Package.findOne({ title: pkg.title });
        if (existing) {
          await Package.findByIdAndUpdate(existing._id, {
            ...pkg,
            isFeaturedTrip: true,
          });
          results.updated.push(pkg.title);
          continue;
        }
        await Package.create(pkg);
        results.created.push(pkg.title);
      } catch (error) {
        results.errors.push({ title: pkg.title, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Coffee packages seeded for new arrivals',
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
