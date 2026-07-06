import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { isConnected } from '../../../lib/mongodb';
import { PACKAGE_EXPERIENCE_CATEGORIES } from '../../../lib/packageExperienceCategories';
import { SITE_NAME } from '../../../lib/branding';

const categoryImage = (value) =>
  PACKAGE_EXPERIENCE_CATEGORIES.find((c) => c.value === value)?.heroImage ?? '';

const packageDefaults = (categoryValue, title, extras = {}) => {
  const category = PACKAGE_EXPERIENCE_CATEGORIES.find((c) => c.value === categoryValue);
  return {
    title,
    subtitle: extras.subtitle ?? category?.heroSubtitle?.slice(0, 90) ?? `Curated ${SITE_NAME} experience`,
    about: extras.about ?? category?.heroSubtitle ?? `A curated adventure with ${SITE_NAME}.`,
    services: extras.services ?? 'Guided experience, safety briefing, expert support',
    tourDetails: extras.tourDetails ?? `Full ${category?.label ?? 'experience'} package with ${SITE_NAME}.`,
    price: extras.price ?? 4999,
    duration: extras.duration ?? '1 Day',
    location: extras.location ?? 'South Africa',
    capacity: extras.capacity ?? '2-8 persons',
    packageType: extras.packageType ?? 'domestic',
    place: extras.place ?? 'south-africa',
    packageCategory: categoryValue,
    images: [
      {
        public_id: `pkg-${category?.slug ?? 'experience'}`,
        url: categoryImage(categoryValue),
        alt: category?.label ?? title,
      },
    ],
    itinerary: [
      {
        day: 1,
        title: extras.itineraryTitle ?? 'Experience Day',
        description: extras.itineraryDesc ?? 'Meet guides, enjoy the activity, and return with memories.',
      },
    ],
    transportation: extras.transportation ?? [],
    accommodation: extras.accommodation ?? [],
    inclusions: extras.inclusions ?? ['Guide', 'Safety equipment'],
    exclusions: extras.exclusions ?? ['Meals', 'Personal expenses'],
    reviews: [],
    bookings: extras.bookings ?? 5,
    rating: extras.rating ?? 4.8,
    isFeaturedDestination: extras.isFeaturedDestination ?? false,
    isPopularPackage: extras.isPopularPackage ?? false,
  };
};

const samplePackages = [
  packageDefaults('Yachts & Sailing Cruises', 'Indian Ocean Sailing Charter', {
    subtitle: 'Private yacht day sail with snorkelling',
    about: 'Sail turquoise waters on a private yacht with crew, lunch onboard, and snorkelling at a reef stop.',
    price: 8900,
    location: 'Mauritius',
    place: 'mauritius',
    packageType: 'international',
    isFeaturedDestination: true,
    isPopularPackage: true,
    bookings: 6,
    rating: 4.9,
  }),
  packageDefaults('Kayaking Boat Rides', 'Coastal Kayak Explorer', {
    subtitle: 'Half-day lagoon and coastline paddle',
    about: 'Guided kayak tour through calm lagoons and scenic coastal inlets with wildlife spotting.',
    price: 1299,
    location: 'Cape Town, South Africa',
    place: 'cape-town',
    bookings: 12,
  }),
  packageDefaults('White water & rapids rafting', 'Zambezi Whitewater Rush', {
    subtitle: 'Grade IV-V rapids adventure',
    about: 'Adrenaline-packed rafting on world-class rapids with expert river guides.',
    price: 3499,
    location: 'Victoria Falls, Zimbabwe',
    place: 'victoria-falls',
    packageType: 'international',
    bookings: 18,
    rating: 4.9,
  }),
  packageDefaults('Sailing School', 'ASA Certified Sailing Course', {
    subtitle: 'Learn to sail in 3 days',
    about: 'Beginner-friendly sailing school with certified instructors on calm coastal waters.',
    price: 12999,
    duration: '3 Days',
    location: 'Cape Town, South Africa',
    place: 'cape-town',
    inclusions: ['Instructor', 'Sailing yacht', 'Course materials', 'Certificate'],
  }),
  packageDefaults('Parasailing (Future)', 'Coastal Parasailing Flight', {
    subtitle: 'Soar above the shoreline',
    about: 'Tandem parasailing experience with panoramic ocean views — launching soon.',
    price: 2499,
    duration: '30 Minutes',
    location: 'Durban, South Africa',
    place: 'durban',
    isPopularPackage: true,
  }),
  packageDefaults('Scuba Diving & Snorkeling (Future)', 'Reef Snorkel & Dive Intro', {
    subtitle: 'Discover underwater marine life',
    about: 'Guided snorkel and introductory scuba session at a protected reef site.',
    price: 3999,
    duration: 'Half Day',
    location: 'Mozambique',
    place: 'mozambique',
    packageType: 'international',
  }),
  packageDefaults('Bike Expeditions By Destination', 'Pan-Africa Bike Expedition', {
    subtitle: 'Multi-destination motorcycle adventure',
    about: 'Epic bike expedition covering iconic routes with mechanic support and backup vehicle.',
    price: 35999,
    duration: '8 Days',
    location: 'Southern Africa',
    place: 'southern-africa',
    capacity: '4-12 riders',
    isPopularPackage: true,
  }),
  packageDefaults('Domestic North — Leh, Ladakh, Spiti & North East', 'Ladakh Himalayan Bike Expedition', {
    subtitle: 'High-altitude ride through Spiti & Ladakh',
    about: 'Epic motorcycle expedition across Leh, Ladakh, Spiti, and Chandrataal with support crew.',
    price: 45999,
    duration: '10 Days',
    location: 'Ladakh, India',
    place: 'ladakh',
    bookings: 9,
    rating: 4.9,
    isPopularPackage: true,
  }),
  packageDefaults('Domestic South — Pondicherry, Kerala & South India', 'Kerala Backwater Bike Tour', {
    subtitle: 'Coastal South India scenic ride',
    about: 'Ride through Kerala, Kolli Hills, and Pondicherry with curated nature stops.',
    price: 28999,
    duration: '7 Days',
    location: 'Kerala, India',
    place: 'kerala',
    bookings: 7,
    rating: 4.7,
  }),
  packageDefaults('International — Nepal, Vietnam, Thailand, Indonesia', 'Vietnam Coastal Bike Expedition', {
    subtitle: 'International ride through Vietnam & Thailand',
    about: 'Cross-border bike expedition covering Vietnam and Thailand highlights with local guides.',
    price: 52999,
    duration: '12 Days',
    location: 'Vietnam & Thailand',
    place: 'vietnam',
    packageType: 'international',
    bookings: 5,
  }),
  packageDefaults('Bungee Jumping', 'Rishikesh Bungee Jump Experience', {
    subtitle: "India's highest bungee jump",
    about: 'Thrilling bungee jump over the Ganges with safety-certified operators and video package.',
    price: 4999,
    duration: 'Half Day',
    location: 'Rishikesh, India',
    place: 'rishikesh',
    bookings: 22,
    rating: 4.9,
  }),
  packageDefaults('Treks (Future)', 'Himalayan Base Camp Trek', {
    subtitle: 'Guided high-altitude trekking',
    about: 'Multi-day guided trek through Himalayan trails with porters and camp stays — coming soon.',
    price: 24999,
    duration: '6 Days',
    location: 'Nepal',
    place: 'nepal',
    packageType: 'international',
  }),
  packageDefaults('Cycling (Future)', 'Garden Route Cycling Tour', {
    subtitle: 'Scenic coastal cycling adventure',
    about: 'Leisure cycling along the Garden Route with support vehicle and boutique stays.',
    price: 8999,
    duration: '4 Days',
    location: 'Garden Route, South Africa',
    place: 'garden-route',
  }),
  packageDefaults('Helicopter Rides', 'Cape Town Helicopter Scenic Flight', {
    subtitle: 'Aerial tour of Table Mountain & coastline',
    about: 'Luxury helicopter ride with panoramic views of Table Mountain, coastline, and city bowl.',
    price: 6999,
    duration: '20 Minutes',
    location: 'Cape Town, South Africa',
    place: 'cape-town',
    bookings: 15,
    rating: 5,
    isFeaturedDestination: true,
  }),
  packageDefaults('Small aircraft / single engine (Future)', 'Winelands Scenic Flight', {
    subtitle: 'Private light aircraft experience',
    about: 'Scenic flight over Cape winelands in a single-engine aircraft with licensed pilot.',
    price: 14999,
    duration: '45 Minutes',
    location: 'Stellenbosch, South Africa',
    place: 'stellenbosch',
  }),
  packageDefaults('Paragliding', 'Bir Billing Paragliding Tandem', {
    subtitle: 'Tandem flight over the Himalayas',
    about: "Soar over valleys with certified tandem pilots at one of Asia's top paragliding sites.",
    price: 3999,
    duration: 'Half Day',
    location: 'Bir Billing, India',
    place: 'bir-billing',
    bookings: 11,
    rating: 4.8,
  }),
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

    const results = { created: [], updated: [], skipped: [], errors: [], syncedByCategory: 0 };

    for (const pkg of samplePackages) {
      try {
        const existing = await Package.findOne({ title: pkg.title });
        if (existing) {
          await Package.findByIdAndUpdate(existing._id, {
            images: pkg.images,
            packageCategory: pkg.packageCategory,
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

    for (const category of PACKAGE_EXPERIENCE_CATEGORIES) {
      const image = {
        public_id: `pkg-${category.slug}`,
        url: category.heroImage,
        alt: category.label,
      };
      const { modifiedCount } = await Package.updateMany(
        { packageCategory: category.value },
        { $set: { images: [image] } }
      );
      results.syncedByCategory += modifiedCount;
    }

    res.status(200).json({
      success: true,
      message: 'Packages seeded successfully',
      results: {
        total: samplePackages.length,
        created: results.created.length,
        updated: results.updated.length,
        skipped: results.skipped.length,
        syncedByCategory: results.syncedByCategory,
        errors: results.errors.length,
      },
      details: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
