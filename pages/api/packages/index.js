import { ensureConnected, getDbUnavailableReason } from '../../../lib/mongodb';
import Package from '../../../models/Package';
import Settings from '../../../models/Settings';
import {
  buildCategoryFilterForSlug,
  buildGroupFilterForSlug,
  buildMiniFilterForSlug,
  getCategoryCatalogFromSettings,
} from '../../../lib/categoryCatalog';
import { PACKAGE_CARD_SELECT } from '../../../lib/packageCardFields';

// Demo data for when database is unavailable
const getDemoPackages = () => {
  return [
    {
      _id: 'demo-1',
      title: 'Cape Town coastal adventure',
      subtitle: 'Explore the Mother City and its coast',
      about: 'Experience the best of Cape Town with our comprehensive coastal tour. Visit Table Mountain, enjoy the V&A Waterfront, and drive along the scenic Chapmans Peak for breathtaking ocean views.',
      services: 'Private airport transfers, Guided Table Mountain tour, V&A Waterfront exploration, Scenic coastal drives',
      tourDetails: 'Full-day Cape Town tour including Table Mountain cable car, Bo-Kaap heritage walk, and a sunset cruise from the Waterfront.',
      price: 1299,
      duration: '1 Day',
      location: 'Cape Town, South Africa',
      capacity: '2-8 persons',
      packageType: 'domestic',
      place: 'cape-town',
      packageCategory: 'Deluxe',
      images: [
        {
          public_id: 'demo-ct-1',
          url: '/cape town.webp',
          alt: 'Cape Town Skyline'
        }
      ],
      itinerary: [
        {
          day: 1,
          title: 'The Mother City Highlights',
          description: 'Morning Cable Car ride to Table Mountain, afternoon Bo-Kaap cultural tour, and evening at the V&A Waterfront.'
        }
      ],
      transportation: [],
      accommodation: [],
      inclusions: ['Table Mountain tickets', 'Private vehicle', 'Expert Guide'],
      exclusions: ['Meals', 'Personal expenses'],
      reviews: [],
      bookings: 45,
      rating: 4.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'demo-2',
      title: 'Kruger Safari Experience',
      subtitle: 'The ultimate Big Five wildlife safari',
      about: 'Immerse yourself in the wild heart of South Africa. Witness lions, elephants, and leopards in their natural habitat with our expert trackers and luxurious bush LODGE stays.',
      services: 'Professional game drives, Luxury bush accommodation, Traditional boma dinners',
      tourDetails: 'Multi-day safari at a private concession within Kruger National Park, including sunrise and sunset game drives.',
      price: 8499,
      duration: '3 Days',
      location: 'Kruger Park, Mpumalanga',
      capacity: '2-12 persons',
      packageType: 'domestic',
      place: 'kruger',
      packageCategory: 'Luxury',
      images: [
        {
          public_id: 'demo-kruger-1',
          url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Kruger Wildlife'
        }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Into the Wild',
          description: 'Arrival at the lodge, afternoon game drive, and welcome dinner under the stars.'
        }
      ],
      transportation: [],
      accommodation: [],
      inclusions: ['All meals', 'All game drives', 'Conservation fees'],
      exclusions: ['Flights', 'Premium beverages'],
      reviews: [],
      bookings: 32,
      rating: 4.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'demo-3',
      title: 'Garden Route Scenic Quest',
      subtitle: 'Pristine beaches and magic forests',
      about: 'Journey through the most beautiful coastal stretch of South Africa. Explore Knysna, Plettenberg Bay, and the Tsitsikamma forest on this spectacular road trip.',
      services: 'Boutique hotel stays, Coastal hiking tours, Whale watching (seasonal)',
      tourDetails: 'Panoramic tour of the Garden Route including world-class beaches and indigenous forests.',
      price: 4999,
      duration: '4 Days',
      location: 'Garden Route, Western Cape',
      capacity: '1-10 persons',
      packageType: 'domestic',
      place: 'garden-route',
      packageCategory: 'Premium',
      images: [
        {
          public_id: 'demo-gr-1',
          url: '/coast , south afirca.webp',
          alt: 'Garden Route'
        }
      ],
      itinerary: [
        {
          day: 1,
          title: 'The Forest & The Sea',
          description: 'Hiking in Tsitsikamma, crossing the suspension bridge, and staying in Knysna.'
        }
      ],
      transportation: [],
      accommodation: [],
      inclusions: ['Activity fees', 'Transport', 'Breakfast', 'Accommodation'],
      exclusions: ['Lunch and Dinner', 'Optional activities'],
      reviews: [],
      bookings: 28,
      rating: 4.7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export default async function handler(req, res) {
  // Share one connection attempt across concurrent dashboard requests
  const dbReady = await ensureConnected(2);
  const useDemoData = !dbReady;

  if (req.method === 'GET') {
    try {
      if (useDemoData) {
        console.warn('Database not connected. Returning empty packages list.');
        return res.status(200).json({
          success: true,
          data: [],
          demo: false,
          error: 'Database connection failed',
        });
      }

      const { search, popular, featured, featuredTrip, category, group, mini } = req.query;
      let query = {};

      const settings = await Settings.findOne().lean();
      const catalog = getCategoryCatalogFromSettings(settings);

      if (mini) {
        const miniFilter = buildMiniFilterForSlug(String(mini), catalog);
        if (miniFilter) {
          query = { ...query, ...miniFilter };
        } else {
          return res.status(200).json({ success: true, data: [] });
        }
      } else if (category) {
        const categoryFilter = buildCategoryFilterForSlug(String(category), catalog);
        if (categoryFilter) {
          query = { ...query, ...categoryFilter };
        } else {
          return res.status(200).json({ success: true, data: [] });
        }
      } else if (group) {
        const groupFilter = buildGroupFilterForSlug(String(group), catalog);
        if (groupFilter) {
          query = { ...query, ...groupFilter };
        } else {
          return res.status(200).json({ success: true, data: [] });
        }
      }

      // If search parameter is provided, create a search query
      if (search) {
        const searchFilter = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { subtitle: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { about: { $regex: search, $options: 'i' } },
            { tourDetails: { $regex: search, $options: 'i' } },
          ],
        };
        query = Object.keys(query).length
          ? { $and: [query, searchFilter] }
          : searchFilter;
      }

      // Add popular filter if requested
      if (popular === 'true') {
        query.isPopularPackage = true;
      }

      // Add featured filter if requested
      if (featured === 'true') {
        query.isFeaturedDestination = true;
      }

      // Featured Adventures carousel on homepage
      if (featuredTrip === 'true') {
        query.isFeaturedTrip = true;
      }

      const isCardList =
        popular === 'true' ||
        featured === 'true' ||
        featuredTrip === 'true' ||
        Boolean(search || category || group || mini);

      let findQuery = Package.find(query).sort({ createdAt: -1 }).lean();

      if (isCardList) {
        findQuery = findQuery.select(PACKAGE_CARD_SELECT);
      }

      if (popular === 'true') findQuery = findQuery.limit(8);
      if (featured === 'true') findQuery = findQuery.limit(8);
      if (featuredTrip === 'true') findQuery = findQuery.limit(12);

      const packages = await findQuery;

      res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=300'
      );
      res.status(200).json({ success: true, data: packages });
    } catch (error) {
      console.error('Error fetching packages:', error.message);
      res.status(500).json({ success: false, data: [], error: error.message });
    }
  } else if (req.method === 'POST') {
    if (useDemoData) {
      return res.status(503).json({
        success: false,
        error: `Database not available. Cannot save package. ${getDbUnavailableReason()}`,
      });
    }

    try {
      console.log('Received package data:', JSON.stringify(req.body, null, 2));
      const packageData = {
        ...req.body,
        duration: req.body.duration?.trim() || req.body.subtitle?.trim() || 'Flexible',
        capacity: req.body.capacity?.trim() || '2 Adults',
        subtitle: req.body.subtitle?.trim() || req.body.title?.trim() || 'Package',
      };
      const newPackage = new Package(packageData);
      const savedPackage = await newPackage.save();
      console.log('Package saved successfully:', savedPackage._id);
      res.status(201).json({ success: true, data: savedPackage });
    } catch (error) {
      console.error('Error creating package:', error);
      res.status(500).json({ success: false, error: error.message, details: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
