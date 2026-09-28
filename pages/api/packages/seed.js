import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { isConnected } from '../../../lib/mongodb';

export const ROMOIRE_SEED_PACKAGES = [
  {
    title: 'Premix assorted flavours pack',
    subtitle: 'All signature flavours in one discovery pack',
    about: 'The complete Romoire experience. Includes Vanilla, Mocha, Hazelnut, and Plain classic premix. Built on single origin Arabica from Chikmagalur, coconut milk, and monk fruit sweetness. Dairy free, lactose free, zero refined sugar. One sachet, hot water, one minute.',
    services: 'Single-serve sachets, 100% plant-based coconut milk, monk fruit sweetened, dairy-free',
    tourDetails: 'Includes 5 assorted single-serve 20g sachets. Made with 100% single origin Arabica from Chikmagalur, premium spray-dried coconut milk, and monk fruit extract. Dissolves in hot water in 30 seconds into a rich, frothy café-style cappuccino.',
    price: 499,
    duration: '5 Sachets · 20g each',
    location: 'Chikmagalur, Karnataka, India',
    capacity: 'Assorted Pack (5 Sachets)',
    packageType: 'domestic',
    place: 'india',
    packageCategory: 'Assorted Pack',
    packageMiniCategory: 'Discovery Box',
    images: [
      {
        public_id: 'romoire-premix-assorted-flavours',
        url: '/images/romoire/discovery_box.jpg',
        alt: 'Premix assorted flavours pack',
      },
      {
        public_id: 'romoire-coffee-sachets-collection',
        url: '/images/romoire/coffee_sachets.jpg',
        alt: 'Romoire sachets collection',
      },
    ],
    inclusions: [
      {
        category: 'In the box',
        items: '5 single-serve sachets (20g each) · Assorted flavours (Plain, Vanilla, Mocha, Hazelnut)',
      },
      {
        category: 'Quality standard',
        items: '100% single origin Chikmagalur Arabica · Pure coconut milk · Zero cane sugar · Dairy free',
      },
    ],
    exclusions: [
      {
        category: 'What stays out',
        items: 'No milk powder · No lactose · No refined sugar · No chicory or bulking fillers',
      },
    ],
    itinerary: [],
    transportation: [],
    accommodation: [],
    reviews: [],
    faqs: [
      {
        question: 'What flavours are included in this assorted pack?',
        answer: 'You get our four signature Romoire premixes: Vanilla, Mocha, Hazelnut, and Plain classic espresso cappuccino.',
      },
      {
        question: 'How do I prepare it?',
        answer: 'Tear one sachet into your favourite mug, pour 150ml of hot water, and stir briskly for 30 seconds. A rich, creamy micro-froth forms naturally without any machine or frother.',
      },
    ],
    bookings: 42,
    rating: 4.9,
    isPopularPackage: true,
    isFeaturedTrip: true,
    isFeaturedDestination: true,
  },
  {
    title: 'Plain premix',
    subtitle: 'Pure single-origin Arabica with lush coconut milk froth',
    about: 'The purest expression of Chikmagalur Arabica. Bold, direct café taste with a rich, stable micro-froth from coconut milk and gentle sweetness from monk fruit. No artificial flavours, no milk powder, and no refined sugar.',
    services: 'Single-serve sachets, 100% plant-based coconut milk, monk fruit sweetened, dairy-free',
    tourDetails: 'Our flagship straight cappuccino premix for coffee purists who want the taste of real coffee in front, not behind. Single origin Arabica with rich crema and velvety body from pure coconut milk.',
    price: 449,
    duration: '5 Sachets · 20g each',
    location: 'Chikmagalur, Karnataka, India',
    capacity: 'Box of 5 Sachets',
    packageType: 'domestic',
    place: 'india',
    packageCategory: 'Classic Premix',
    packageMiniCategory: 'Plain Espresso',
    images: [
      {
        public_id: 'romoire-plain-premix',
        url: '/images/romoire/flavor_espresso.jpg',
        alt: 'Plain premix',
      },
      {
        public_id: 'romoire-hero-cappuccino',
        url: '/images/romoire/hero_cappuccino.jpg',
        alt: 'Plain premix cappuccino froth',
      },
    ],
    inclusions: [
      {
        category: 'In the box',
        items: '5 single-serve sachets (20g each) · Pure Chikmagalur Arabica & coconut milk premix',
      },
    ],
    exclusions: [
      {
        category: 'What stays out',
        items: 'Zero dairy · Zero milk solids · Zero refined sugar · No artificial preservatives',
      },
    ],
    itinerary: [],
    transportation: [],
    accommodation: [],
    reviews: [],
    faqs: [
      {
        question: 'Does the plain premix taste sweet?',
        answer: 'It has a gentle, subtle sweetness from plant-derived monk fruit that sits comfortably behind the espresso notes, never overpowering the coffee.',
      },
    ],
    bookings: 38,
    rating: 4.9,
    isPopularPackage: true,
    isFeaturedTrip: true,
    isFeaturedDestination: true,
  },
  {
    title: 'Mocha premix',
    subtitle: 'Rich velvety cocoa layered over single-origin cappuccino',
    about: 'Rich and indulgent, with pure cocoa laid smoothly over the coffee rather than sitting on top of it. Full-bodied cappuccino body without dairy or cane sugar. Enough for an afternoon indulgence without turning into a heavy dessert.',
    services: 'Single-serve sachets, 100% plant-based coconut milk, monk fruit sweetened, dairy-free',
    tourDetails: 'Premium dark cocoa harmoniously blended with Chikmagalur Arabica and spray-dried coconut milk. Delivers decadent café mocha depth with zero dairy and zero cane sugar.',
    price: 449,
    duration: '5 Sachets · 20g each',
    location: 'Chikmagalur, Karnataka, India',
    capacity: 'Box of 5 Sachets',
    packageType: 'domestic',
    place: 'india',
    packageCategory: 'Flavoured Premix',
    packageMiniCategory: 'Mocha',
    images: [
      {
        public_id: 'romoire-mocha-premix',
        url: '/images/romoire/flavor_mocha.jpg',
        alt: 'Mocha premix',
      },
    ],
    inclusions: [
      {
        category: 'In the box',
        items: '5 single-serve sachets (20g each) · Real cocoa & single origin Arabica premix',
      },
    ],
    exclusions: [
      {
        category: 'What stays out',
        items: 'No refined sugar · No dairy · No corn syrups · No artificial sweeteners',
      },
    ],
    itinerary: [],
    transportation: [],
    accommodation: [],
    reviews: [],
    faqs: [],
    bookings: 29,
    rating: 4.8,
    isPopularPackage: true,
    isFeaturedTrip: true,
    isFeaturedDestination: true,
  },
  {
    title: 'Vanilla premix',
    subtitle: 'Delicate Madagascar vanilla blended with creamy micro-froth',
    about: 'Soft, rounded, and aromatic. Natural vanilla sits delicately under the single origin Arabica coffee rather than masking it. Ideal if a classic creamy cappuccino is your daily ritual.',
    services: 'Single-serve sachets, 100% plant-based coconut milk, monk fruit sweetened, dairy-free',
    tourDetails: 'Made with natural vanilla extract, single-origin Karnataka Arabica, and rich coconut milk. Smooth and rounded flavour profile that dissolves instantly in hot water.',
    price: 449,
    duration: '5 Sachets · 20g each',
    location: 'Chikmagalur, Karnataka, India',
    capacity: 'Box of 5 Sachets',
    packageType: 'domestic',
    place: 'india',
    packageCategory: 'Flavoured Premix',
    packageMiniCategory: 'Vanilla',
    images: [
      {
        public_id: 'romoire-vanilla-premix',
        url: '/images/romoire/flavor_vanilla.jpg',
        alt: 'Vanilla premix',
      },
    ],
    inclusions: [
      {
        category: 'In the box',
        items: '5 single-serve sachets (20g each) · Natural vanilla bean extract & Arabica premix',
      },
    ],
    exclusions: [
      {
        category: 'What stays out',
        items: 'No refined sugar · No milk solids · No artificial colours or thickeners',
      },
    ],
    itinerary: [],
    transportation: [],
    accommodation: [],
    reviews: [],
    faqs: [],
    bookings: 35,
    rating: 4.9,
    isPopularPackage: true,
    isFeaturedTrip: true,
    isFeaturedDestination: true,
  },
  {
    title: 'Hazelnut premix',
    subtitle: 'Warm roasted hazelnut with rich café body',
    about: 'Roasted hazelnut aroma carried right through the finish. Warm, comforting, and deeply aromatic cappuccino premix crafted with coconut milk and zero refined sugar.',
    services: 'Single-serve sachets, 100% plant-based coconut milk, monk fruit sweetened, dairy-free',
    tourDetails: 'Warm toasted hazelnut notes paired with single-origin Arabica. Produces a thick, velvety micro-froth layer when stirred with hot water for thirty seconds.',
    price: 449,
    duration: '5 Sachets · 20g each',
    location: 'Chikmagalur, Karnataka, India',
    capacity: 'Box of 5 Sachets',
    packageType: 'domestic',
    place: 'india',
    packageCategory: 'Flavoured Premix',
    packageMiniCategory: 'Hazelnut',
    images: [
      {
        public_id: 'romoire-hazelnut-premix',
        url: '/images/romoire/flavor_hazelnut.jpg',
        alt: 'Hazelnut premix',
      },
    ],
    inclusions: [
      {
        category: 'In the box',
        items: '5 single-serve sachets (20g each) · Toasted hazelnut extract & Chikmagalur Arabica premix',
      },
    ],
    exclusions: [
      {
        category: 'What stays out',
        items: 'No cane sugar · No milk powder · No artificial preservatives',
      },
    ],
    itinerary: [],
    transportation: [],
    accommodation: [],
    reviews: [],
    faqs: [],
    bookings: 31,
    rating: 4.8,
    isPopularPackage: true,
    isFeaturedTrip: true,
    isFeaturedDestination: true,
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

    // Clean up temporary dummy products like 'Coffee 1'
    await Package.deleteMany({ title: 'Coffee 1' });

    const results = { created: [], updated: [], errors: [] };

    for (const pkg of ROMOIRE_SEED_PACKAGES) {
      try {
        const existing = await Package.findOne({ title: pkg.title });
        if (existing) {
          await Package.findByIdAndUpdate(existing._id, {
            ...pkg,
            updatedAt: new Date(),
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
      message: 'Romoire premix products seeded successfully',
      results: {
        total: ROMOIRE_SEED_PACKAGES.length,
        created: results.created.length,
        updated: results.updated.length,
        errors: results.errors.length,
      },
      details: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
