/**
 * Mumbai harbour yacht charter packages — Yachts & Sailing Cruises / mini: Yacht
 * Upserted via POST /api/packages/seed-yacht-packages
 */

export const YACHT_MINI_CATEGORY = 'Yacht';
export const YACHT_PACKAGE_CATEGORY = 'Yachts & Sailing Cruises';

const LOCATION = 'Gateway of India, Colaba, Mumbai Harbour';
const PLACE = 'gateway-of-india-mumbai';

const YG = 'https://www.yachtgetawaysmumbai.in/wp-content/uploads';

/** One unique primary image per yacht — sourced from yachtgetawaysmumbai.in fleet pages */
export const YACHT_IMAGE_MAP: Record<string, string[]> = {
  'Seabird Boat': [
    `${YG}/2017/04/Seabird-Sailboat-Mumbai.jpg`,
    `${YG}/2017/04/Seabird-Sailboat-Mumbai-1.jpg`,
    `${YG}/2017/04/Seabird-Sailboat-Mumbai-2.jpg`,
  ],
  'XS 63 Sailboat': [
    `${YG}/2017/04/X-372-Sail-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/X-372-Sail-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/X-372-Sail-Yacht-Mumbai-2.jpg`,
  ],
  'Fareast 26': [
    `${YG}/2017/04/Fareast-26-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Fareast-26-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Fareast-26-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Fareast-26-Yacht-Mumbai-3.jpg`,
  ],
  'Macgregor 26S': [
    `${YG}/2017/03/Macgregor-26-Sail-Yacht-Mumbai.jpg`,
    `${YG}/2017/03/Macgregor-26-Sail-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/03/Macgregor-26-Sail-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/03/Macgregor-26-Sail-Yacht-Mumbai-3.jpg`,
  ],
  'Maxi 7.7': [
    `${YG}/2017/04/J24-Sailboat-Mumbai.jpg`,
    `${YG}/2017/04/J24-Sailboat-Mumbai-1.jpg`,
    `${YG}/2017/04/J24-Sailboat-Mumbai-2.jpg`,
  ],
  'Melbac 29': [
    `${YG}/2017/04/Sigma-33-Sail-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Sigma-33-Sail-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Sigma-33-Sail-Yacht-Mumbai-2.jpg`,
  ],
  'XS 26': [
    `${YG}/2017/04/Cabin-Sailboat-JJ-22-Mumbai.jpg`,
    `${YG}/2017/04/Cabin-Sailboat-JJ-22-Mumbai-1.jpg`,
    `${YG}/2017/04/Cabin-Sailboat-JJ-22-Mumbai-2.jpg`,
  ],
  'Feeling Nauti (Mac 30)': [
    `${YG}/2017/03/Wave-Dancer-Catamaran-Yacht-Mumbai.jpg`,
    `${YG}/2017/03/Wave-Dancer-Catamaran-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/03/Wave-Dancer-Catamaran-Yacht-Mumbai-2.jpg`,
  ],
  'Flo (Sun Odyssey 29)': [
    `${YG}/2017/04/Jeanneau-45-Sail-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Jeanneau-45-Sail-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Jeanneau-45-Sail-Yacht-Mumbai-3.jpg`,
  ],
  Fantasea: [
    `${YG}/2017/03/Dubai-Marine-36-Speedboat-Mumbai.jpg`,
    `${YG}/2017/03/Dubai-Marine-36-Speedboat-Mumbai-1.jpg`,
    `${YG}/2017/03/Dubai-Marine-36-Speedboat-Mumbai-2.jpg`,
  ],
  'Blood Vessel': [
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-7.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-6.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-10.jpg`,
  ],
  Nemo: [
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-4.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-5.jpg`,
  ],
  'Cunning Plan': [
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-4.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai-2.jpg`,
  ],
  'Nauti By Nature': [
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai-3.jpg`,
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai-4.jpg`,
  ],
  Tengi: [
    `${YG}/2017/03/Gulf-Craft-31-Speedboat-Mumbai-3.jpg`,
    `${YG}/2017/03/Gulf-Craft-31-Speedboat-Mumbai-4.jpg`,
    `${YG}/2017/03/Gulf-Craft-31-Speedboat-Mumbai-5.jpg`,
  ],
  'Sun Odyssey 45 (Nava)': [
    `${YG}/2017/04/Jeanneau-45-Sail-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Jeanneau-45-Sail-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Jeanneau-45-Sail-Yacht-Mumbai-2.jpg`,
  ],
  'Grand Soleil 45': [
    `${YG}/2017/04/Grand-Soleil-45-Sail-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Grand-Soleil-45-Sail-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Grand-Soleil-45-Sail-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Grand-Soleil-45-Sail-Yacht-Mumbai-3.jpg`,
  ],
  'Sun Odyssey 54': [
    `${YG}/2017/04/Jeanneau-54-Sail-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Jeanneau-54-Sail-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Jeanneau-54-Sail-Yacht-Mumbai-2.jpg`,
  ],
  'Tara (Island Spirit)': [
    `${YG}/2017/03/Island-Spirit-401-Catamaran-Yacht-Mumbai.jpg`,
    `${YG}/2017/03/Island-Spirit-401-Catamaran-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/03/Island-Spirit-401-Catamaran-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/03/Island-Spirit-401-Catamaran-Yacht-Mumbai-3.jpg`,
  ],
  'Lagoon 560': [
    `${YG}/2017/04/Lagoon-560-Catamaran-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Lagoon-560-Catamaran-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Lagoon-560-Catamaran-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Lagoon-560-Catamaran-Yacht-Mumbai-3.jpg`,
  ],
  Princessa: [
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-3.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-4.jpg`,
  ],
  Gulfcraft: [
    `${YG}/2017/03/Gulf-Craft-31-Speedboat-Mumbai.jpg`,
    `${YG}/2017/03/Gulf-Craft-31-Speedboat-Mumbai-1.jpg`,
    `${YG}/2017/03/Gulf-Craft-31-Speedboat-Mumbai-2.jpg`,
  ],
  Genesis: [
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-3.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-5.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-2.jpg`,
  ],
  'Loco Veinto': [
    `${YG}/2017/03/Cap-Camarat-515-Speedboat-Mumbai.jpg`,
    `${YG}/2017/03/Cap-Camarat-515-Speedboat-Mumbai-1.jpg`,
    `${YG}/2017/03/Cap-Camarat-515-Speedboat-Mumbai-2.jpg`,
  ],
  'Majesty 44': [
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-4.jpg`,
  ],
  'Princess 54': [
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-3.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-5.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-2.jpg`,
  ],
  'Princess 61': [
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-3.jpg`,
  ],
  Ferry: [
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai-5.jpg`,
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai-6.jpg`,
    `${YG}/2017/04/MV-Avior-Party-Yacht-Mumbai-7.jpg`,
  ],
  'Ferretti 80': [
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-1.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Ferretti-550-Motor-Yacht-Mumbai-3.jpg`,
  ],
  Tantaloon: [
    `${YG}/2017/04/Sigma-33-Sail-Yacht-Mumbai-3.jpg`,
    `${YG}/2017/04/Sigma-33-Sail-Yacht-Mumbai-2.jpg`,
    `${YG}/2017/04/Sigma-33-Sail-Yacht-Mumbai-1.jpg`,
  ],
  'Royal Lady': [
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-5.jpg`,
    `${YG}/2017/04/Princess-61-Motor-Yacht-Mumbai-4.jpg`,
    `${YG}/2017/04/Lagoon-560-Catamaran-Yacht-Mumbai-5.jpg`,
  ],
};

const SHARED_PACKAGE_NOTES = [
  'Bookings subject to weather and tide conditions. Life jackets are mandatory for all guests.',
  'Alcohol is not permitted onboard. Guests are requested to arrive 20–30 minutes before departure.',
];

const SHARED_CANCELLATION_POLICY = [
  'Full refund if cancelled 48+ hours before departure.',
  '50% refund between 24–48 hours before departure.',
  'No refund within 24 hours of departure.',
];

const SHARED_RESCHEDULING_POLICY = [
  'One free reschedule allowed if requested at least 24 hours before the original slot, subject to availability.',
];

const SHARED_BOOKING_POLICY = [
  'Advance payment required to confirm booking; balance payable before boarding.',
  'Valid photo ID mandatory for all guests.',
];

const SHARED_TRANSPORTATION = [
  {
    type: 'Self Transfer',
    vehicle: 'Not included',
    description:
      'Guests to reach the jetty (Gateway of India, Colaba, Mumbai) on their own. Local pickup can be arranged on request at extra cost.',
  },
];

const SHARED_FIXED_DEPARTURES = [
  {
    month: 'On Request',
    dates: 'Flexible slots through the day, subject to availability and weather clearance',
  },
];

const SHARED_FAQS = (title: string, capacity: string) => [
  {
    question: `How many guests can the ${title} accommodate?`,
    answer: `Up to ${capacity}, as listed under Capacity.`,
  },
  {
    question: 'Is food included?',
    answer:
      'Food & beverages are not included by default but can be added as a paid add-on (see Add-on Packages).',
  },
  {
    question: 'What happens in bad weather?',
    answer:
      'Trips are rescheduled free of cost if cancelled due to weather/tide restrictions by the operator.',
  },
];

type YachtDef = {
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  capacity: string;
  ideaFor: string;
  abstract: string;
  highlights: string[];
  bestTime: string;
  whyChoose: string;
  durationLabel: string;
  inclusions: string[];
  exclusions: string[];
  accommodationNote: string;
  isPopularPackage?: boolean;
  isFeaturedTrip?: boolean;
};

function toImages(urls: string[], title: string) {
  const direct = urls.filter(
    (url) => url && !url.includes('google.com/search') && !url.endsWith('/') && !/-\d+x\d+\./.test(url)
  );
  return direct.slice(0, 5).map((url, index) => ({
    public_id: `yacht-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
    url,
    alt: title,
  }));
}

function buildYachtPackage(def: YachtDef) {
  const imageUrls = YACHT_IMAGE_MAP[def.title] ?? [];
  const itineraryDesc = `Arrival at jetty (Gateway of India / Colaba) → Boarding & safety briefing → ${def.durationLabel} cruise on Mumbai harbour → Return to jetty & disembark.`;

  return {
    title: def.title,
    subtitle: def.subtitle,
    ideaFor: def.ideaFor,
    about: def.abstract,
    services: def.highlights.join(' • '),
    tourDetails: def.whyChoose,
    abstract: def.abstract,
    tourOverview: def.abstract,
    price: def.price,
    duration: def.duration,
    location: LOCATION,
    capacity: def.capacity,
    packageType: 'domestic' as const,
    place: PLACE,
    packageCategory: YACHT_PACKAGE_CATEGORY,
    packageMiniCategory: YACHT_MINI_CATEGORY,
    isFeaturedDestination: false,
    isPopularPackage: def.isPopularPackage ?? false,
    isFeaturedTrip: def.isFeaturedTrip ?? false,
    bookings: 0,
    rating: 4.8,
    images: toImages(imageUrls, def.title),
    keyHighlights: def.highlights,
    bestTimeToVisit: { yearRound: def.bestTime, winter: '', summer: '' },
    whyChooseThisTrip: [def.whyChoose],
    fixedDepartures: SHARED_FIXED_DEPARTURES,
    shortItinerary: [{ day: 1, title: 'Boarding → Harbour Cruise → Return' }],
    itinerary: [
      {
        day: 1,
        title: `Harbour Cruise — ${def.durationLabel}`,
        description: itineraryDesc,
      },
    ],
    transportation: SHARED_TRANSPORTATION,
    accommodation: [],
    inclusions: [{ category: 'Inclusions', items: def.inclusions }],
    exclusions: [{ category: 'Exclusions', items: def.exclusions }],
    packageNotes: [
      ...SHARED_PACKAGE_NOTES,
      def.accommodationNote !== 'Not applicable — this is a day/harbour cruise package with no overnight stay.'
        ? def.accommodationNote
        : '',
    ].filter(Boolean),
    cancellationPolicy: SHARED_CANCELLATION_POLICY,
    reschedulingPolicy: SHARED_RESCHEDULING_POLICY,
    bookingPolicy: SHARED_BOOKING_POLICY,
    faqs: SHARED_FAQS(def.title, def.capacity),
    reviews: [],
  };
}

const yachtDefs: YachtDef[] = [
  {
    title: 'Seabird Boat',
    subtitle: 'Small Boat / Budget Yacht / Harbor Cruise',
    price: 3000,
    duration: '1/2/3 Hours',
    capacity: '4–6 Guests',
    ideaFor: 'Couples, Small Family, Friends, Birthday Celebration',
    abstract:
      'A compact, affordable open sailboat perfect for a first-time harbour cruise experience right from the Gateway of India. Ideal for small groups who want an intimate sea outing without a big budget.',
    highlights: [
      'Captain & Safety Equipment included',
      'Fuel & Music System onboard',
      'Drinking water provided',
      'Best for sunset cruise & couple dates',
    ],
    bestTime: 'Year Round (Evenings ideal for sunset)',
    whyChoose:
      'Choose the Seabird Boat for a genuine small boat / budget yacht / harbor cruise experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for couples, small family, friends, birthday celebration.',
    durationLabel: '1/2/3 Hours',
    inclusions: ['Captain', 'Safety Equipment', 'Fuel', 'Music System', 'Drinking Water'],
    exclusions: ['Decoration', 'Cake', 'Photography', 'Snacks', 'Soft Drinks'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'XS 63 Sailboat',
    subtitle: 'Luxury Sailboat',
    price: 4000,
    duration: '2/3 Hours',
    capacity: '6–8 Guests',
    ideaFor: 'Romantic Sailing, Birthday, Proposal',
    abstract:
      'A pure sailing experience aboard a luxury sailboat with a professional skipper, ideal for a romantic proposal or an intimate birthday sail with beautiful open-sea views.',
    highlights: [
      'Professional Skipper onboard',
      'Bluetooth Music system',
      'Life Jackets for all guests',
      'Beautiful sunset sailing views',
    ],
    bestTime: 'Year Round (Sunset slots recommended)',
    whyChoose:
      'Choose the XS 63 Sailboat for a genuine luxury sailboat experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for romantic sailing, birthday, proposal.',
    durationLabel: '2/3 Hours',
    inclusions: ['Professional Skipper', 'Bluetooth Music', 'Life Jackets', 'Fuel'],
    exclusions: ['Decoration', 'Photography', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isFeaturedTrip: false,
  },
  {
    title: 'Fareast 26',
    subtitle: 'Racing Sailboat',
    price: 8000,
    duration: '2–4 Hours',
    capacity: '8 Guests',
    ideaFor: 'Adventure, Team Outing, Corporate Event',
    abstract:
      'A sporty racing sailboat that brings an adventurous edge to corporate outings and team bonding trips, with a full crew and safety gear onboard.',
    highlights: [
      'Trained Crew onboard',
      'Complete Safety Gear',
      'Onboard Music System',
      'Great for team-building sails',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Fareast 26 for a genuine racing sailboat experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for adventure, team outing, corporate event.',
    durationLabel: '2–4 Hours',
    inclusions: ['Crew', 'Safety Gear', 'Music System', 'Fuel'],
    exclusions: ['Food & Beverages', 'Decoration', 'Photography'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Macgregor 26S',
    subtitle: 'Family Sailboat',
    price: 6500,
    duration: '2–3 Hours',
    capacity: '6 Guests',
    ideaFor: 'Family, Friends, Sunset Cruise',
    abstract:
      'A comfortable family sailboat suited for relaxed sunset cruises with friends and family, complete with captain and safety kit.',
    highlights: [
      'Experienced Captain',
      'Full Safety Kit',
      'Drinking Water onboard',
      'Ideal for family sunset cruises',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Macgregor 26S for a genuine family sailboat experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for family, friends, sunset cruise.',
    durationLabel: '2–3 Hours',
    inclusions: ['Captain', 'Fuel', 'Safety Kit', 'Water'],
    exclusions: ['Decoration', 'Food', 'Photography'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Maxi 7.7',
    subtitle: 'Compact Sail Yacht',
    price: 5000,
    duration: '2 Hours',
    capacity: '6 Guests',
    ideaFor: 'Couple, Photography, Evening Cruise',
    abstract:
      "A compact, photogenic sail yacht that's a favourite for couples wanting a scenic evening cruise with great photo opportunities.",
    highlights: [
      'Compact & comfortable deck',
      'Great photography backdrop',
      'Smooth evening sailing',
      'Perfect for couples',
    ],
    bestTime: 'Year Round (Evening preferred)',
    whyChoose:
      'Choose the Maxi 7.7 for a genuine compact sail yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for couple, photography, evening cruise.',
    durationLabel: '2 Hours',
    inclusions: ['Captain', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'Photography service', 'Food'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Melbac 29',
    subtitle: 'Premium Sailing Yacht',
    price: 10000,
    duration: '2–3 Hours',
    capacity: '8 Guests',
    ideaFor: 'Proposal, Birthday, Anniversary',
    abstract:
      'A premium sailing yacht with cushioned seating and a professional captain, designed for special-occasion sails like proposals and anniversaries.',
    highlights: [
      'Cushioned Seating',
      'Onboard Music',
      'Professional Captain',
      'Ideal for proposals & anniversaries',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Melbac 29 for a genuine premium sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for proposal, birthday, anniversary.',
    durationLabel: '2–3 Hours',
    inclusions: ['Cushioned Seating', 'Music', 'Professional Captain', 'Fuel'],
    exclusions: ['Decoration', 'Cake', 'Photography'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'XS 26',
    subtitle: 'Sailing Yacht',
    price: 8500,
    duration: '2–3 Hours',
    capacity: '8 Guests',
    ideaFor: 'Scenic Cruise, Sunset Experience',
    abstract:
      'A stylish sailing yacht with luxury seating, built for a relaxed scenic cruise and one of the best sunset experiences on the water.',
    highlights: ['Luxury Seating', 'Scenic Harbour Cruise', 'Spectacular Sunset Views'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the XS 26 for a genuine sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for scenic cruise, sunset experience.',
    durationLabel: '2–3 Hours',
    inclusions: ['Captain', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'Food', 'Photography'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Feeling Nauti (Mac 30)',
    subtitle: 'Sailing Yacht',
    price: 9500,
    duration: '2–3 Hours',
    capacity: '8 Guests',
    ideaFor: 'Anniversary, Family Gathering, Couple',
    abstract:
      'A warm, family-friendly sailing yacht well suited for anniversaries and small family gatherings on the water.',
    highlights: ['Spacious open deck', 'Family-friendly layout', 'Comfortable seating'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Feeling Nauti (Mac 30) for a genuine sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for anniversary, family gathering, couple.',
    durationLabel: '2–3 Hours',
    inclusions: ['Captain', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'Cake', 'Food'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Flo (Sun Odyssey 29)',
    subtitle: 'Luxury Sailing Yacht',
    price: 9500,
    duration: '2–3 Hours',
    capacity: '8 Guests',
    ideaFor: 'Scenic Cruise, Sunset Cruise',
    abstract:
      'A luxury sailing yacht from the renowned Sun Odyssey line, offering a spacious deck and gorgeous sunset views over the Mumbai coastline.',
    highlights: ['Spacious Deck', 'Luxury Seating', 'Beautiful Sunset Views'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Flo (Sun Odyssey 29) for a genuine luxury sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for scenic cruise, sunset cruise.',
    durationLabel: '2–3 Hours',
    inclusions: ['Captain', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'Food', 'Photography'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Fantasea',
    subtitle: 'Luxury Yacht',
    price: 13000,
    duration: '2–4 Hours',
    capacity: '10 Guests',
    ideaFor: 'Birthday, Proposal, Corporate',
    abstract:
      'A versatile luxury yacht that comfortably hosts everything from birthday parties to corporate get-togethers with a premium finish.',
    highlights: [
      'Larger 10-guest capacity',
      'Premium finish',
      'Suits both parties & corporate events',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Fantasea for a genuine luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for birthday, proposal, corporate.',
    durationLabel: '2–4 Hours',
    inclusions: ['Captain', 'Crew', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'DJ', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Blood Vessel',
    subtitle: 'Luxury Yacht',
    price: 14500,
    duration: '2–4 Hours',
    capacity: '10 Guests',
    ideaFor: 'Night Cruise, Party',
    abstract:
      'A luxury yacht built for after-dark cruising, featuring a lounge area and a premium sound system for an energetic night-time party on the water.',
    highlights: [
      'Dedicated Lounge Area',
      'Premium Sound System',
      'Purpose-built for night cruises',
    ],
    bestTime: 'Year Round (Night slots)',
    whyChoose:
      'Choose the Blood Vessel for a genuine luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for night cruise, party.',
    durationLabel: '2–4 Hours',
    inclusions: ['Captain', 'Crew', 'Fuel', 'Sound System'],
    exclusions: ['Decoration', 'DJ', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Nemo',
    subtitle: 'Luxury Yacht',
    price: 14499,
    duration: '2–4 Hours',
    capacity: '10 Guests',
    ideaFor: 'Family, Birthday, Romantic Cruise',
    abstract:
      'A well-rounded luxury yacht that suits family outings, birthday celebrations, and romantic cruises alike.',
    highlights: [
      'Comfortable 10-guest capacity',
      'Suits families & couples',
      'Smooth romantic cruising',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Nemo for a genuine luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for family, birthday, romantic cruise.',
    durationLabel: '2–4 Hours',
    inclusions: ['Captain', 'Crew', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'Cake', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Cunning Plan',
    subtitle: 'Luxury Yacht',
    price: 13000,
    duration: '2–4 Hours',
    capacity: '10 Guests',
    ideaFor: 'Group Celebration, Sunset Cruise',
    abstract:
      'A spacious luxury yacht with a professional crew, Bluetooth music and a wide deck ideal for group celebrations.',
    highlights: ['Bluetooth Music', 'Spacious Deck', 'Professional Crew'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Cunning Plan for a genuine luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for group celebration, sunset cruise.',
    durationLabel: '2–4 Hours',
    inclusions: ['Bluetooth Music', 'Spacious Deck', 'Professional Crew', 'Fuel'],
    exclusions: ['Decoration', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Nauti By Nature',
    subtitle: 'Luxury Yacht',
    price: 13000,
    duration: '2–4 Hours',
    capacity: '10 Guests',
    ideaFor: 'Party, Corporate Event',
    abstract:
      'A lively luxury yacht geared toward parties and corporate events, with ample deck space for mingling.',
    highlights: ['Great for parties', 'Suited to corporate events', 'Ample deck space'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Nauti By Nature for a genuine luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for party, corporate event.',
    durationLabel: '2–4 Hours',
    inclusions: ['Captain', 'Crew', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'DJ', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Tengi',
    subtitle: 'Luxury Yacht',
    price: 13000,
    duration: '2–4 Hours',
    capacity: '10 Guests',
    ideaFor: 'Photography, Comfortable Cruise',
    abstract:
      'A luxury yacht with a premium interior, built for a comfortable cruise and standout photography moments.',
    highlights: ['Premium Interior', 'Comfortable Seating', 'Great for photography'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Tengi for a genuine luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for photography, comfortable cruise.',
    durationLabel: '2–4 Hours',
    inclusions: ['Captain', 'Crew', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'Photography service', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Sun Odyssey 45 (Nava)',
    subtitle: 'Luxury Sailing Yacht',
    price: 26000,
    duration: '3–4 Hours',
    capacity: '12 Guests',
    ideaFor: 'Multi-day comfort day-sail, Family, Corporate',
    abstract:
      'A premium luxury sailing yacht with an air-conditioned cabin, bedroom, washroom, full kitchen and sun deck — ideal for guests wanting hotel-like comforts on the water.',
    highlights: [
      'Air-conditioned Cabin',
      'Private Bedroom & Washroom',
      'Onboard Kitchen',
      'Sun Deck & Music System',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Sun Odyssey 45 (Nava) for a genuine luxury sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for multi-day comfort day-sail, family, corporate.',
    durationLabel: '3–4 Hours',
    inclusions: ['AC Cabin', 'Bedroom', 'Washroom', 'Kitchen', 'Music System', 'Sun Deck'],
    exclusions: ['Food & Beverages', 'Decoration', 'Photography'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Grand Soleil 45',
    subtitle: 'Luxury Sailing Yacht',
    price: 25000,
    duration: '3–4 Hours',
    capacity: '12 Guests',
    ideaFor: 'Corporate, Celebration, Scenic Sailing',
    abstract:
      'A spacious luxury sailing yacht with a professional crew and elegant interiors, perfect for larger corporate or celebration groups.',
    highlights: ['Spacious Deck', 'Luxury Interior', 'Professional Crew'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Grand Soleil 45 for a genuine luxury sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for corporate, celebration, scenic sailing.',
    durationLabel: '3–4 Hours',
    inclusions: ['Spacious Deck', 'Luxury Interior', 'Professional Crew', 'Fuel'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isFeaturedTrip: false,
  },
  {
    title: 'Sun Odyssey 54',
    subtitle: 'Premium Luxury Sailing Yacht',
    price: 40000,
    duration: '4 Hours',
    capacity: '15 Guests',
    ideaFor: 'Large Group Celebration, Corporate Retreat',
    abstract:
      'A premium luxury sailing yacht offering an AC cabin, bedroom, washroom, kitchen, lounge, music system and flybridge — a full luxury experience for larger groups.',
    highlights: ['AC Cabin & Bedroom', 'Full Kitchen & Lounge', 'Flybridge with panoramic views'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Sun Odyssey 54 for a genuine premium luxury sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for large group celebration, corporate retreat.',
    durationLabel: '4 Hours',
    inclusions: ['AC Cabin', 'Bedroom', 'Washroom', 'Kitchen', 'Lounge', 'Music', 'Flybridge'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Tara (Island Spirit)',
    subtitle: 'Luxury Catamaran',
    price: 42000,
    duration: '4 Hours',
    capacity: '18 Guests',
    ideaFor: 'Party, Corporate Event, Large Group Cruise',
    abstract:
      'A huge-decked luxury catamaran with a bedroom, kitchen and AC cabin — excellent stability and space, ideal for large parties or corporate events.',
    highlights: ['Huge Open Deck', 'AC Cabin & Bedroom', 'Dedicated Party Space'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Tara (Island Spirit) for a genuine luxury catamaran experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for party, corporate event, large group cruise.',
    durationLabel: '4 Hours',
    inclusions: ['Huge Deck', 'Bedroom', 'Kitchen', 'AC Cabin', 'Party Space'],
    exclusions: ['Food & Beverages', 'Decoration', 'DJ'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Lagoon 560',
    subtitle: 'Ultra Luxury Catamaran',
    price: 89000,
    duration: '4 Hours',
    capacity: '25 Guests',
    ideaFor: 'Wedding, Corporate Party, Luxury Vacation',
    abstract:
      'An ultra-luxury catamaran with 4 luxury bedrooms, multiple washrooms, AC lounge, dining area, flybridge and full kitchen — the top-tier choice for weddings and large corporate parties.',
    highlights: [
      '4 Luxury Bedrooms',
      'Multiple Washrooms',
      'AC Lounge & Dining Area',
      'Flybridge with premium music system',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Lagoon 560 for a genuine ultra luxury catamaran experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for wedding, corporate party, luxury vacation.',
    durationLabel: '4 Hours',
    inclusions: [
      '4 Luxury Bedrooms',
      'Multiple Washrooms',
      'AC Lounge',
      'Dining Area',
      'Flybridge',
      'Kitchen',
      'Premium Music',
    ],
    exclusions: ['Food & Beverages (can be arranged)', 'Decoration', 'DJ Setup'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Princessa',
    subtitle: 'Luxury Motor Yacht',
    price: 27000,
    duration: '3–4 Hours',
    capacity: '12 Guests',
    ideaFor: 'Family, Party, Comfortable Cruise',
    abstract:
      'A luxury motor yacht with an AC cabin, private bedroom, lounge and music system — a well-rounded option for family outings and parties.',
    highlights: ['AC Cabin & Bedroom', 'Lounge with music system', 'Smooth motor-yacht cruising'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Princessa for a genuine luxury motor yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for family, party, comfortable cruise.',
    durationLabel: '3–4 Hours',
    inclusions: ['AC Cabin', 'Bedroom', 'Music', 'Lounge'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Gulfcraft',
    subtitle: 'Luxury Cruiser',
    price: 27000,
    duration: '3–4 Hours',
    capacity: '12 Guests',
    ideaFor: 'Family, Corporate, Party',
    abstract:
      'A versatile luxury cruiser suited equally to family days out, corporate gatherings and party cruises.',
    highlights: [
      'Versatile luxury cruiser',
      'Comfortable for 12 guests',
      'Suits family & corporate groups',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Gulfcraft for a genuine luxury cruiser experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for family, corporate, party.',
    durationLabel: '3–4 Hours',
    inclusions: ['Captain', 'Crew', 'Fuel', 'Safety Equipment'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isFeaturedTrip: false,
  },
  {
    title: 'Genesis',
    subtitle: 'Luxury Yacht',
    price: 34000,
    duration: '3–4 Hours',
    capacity: '15 Guests',
    ideaFor: 'Celebration, Corporate Retreat',
    abstract:
      'A luxury yacht with premium seating, a flybridge, bedroom and kitchen — well suited for larger celebrations and corporate retreats.',
    highlights: ['Premium Seating', 'Flybridge access', 'Onboard Bedroom & Kitchen'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Genesis for a genuine luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for celebration, corporate retreat.',
    durationLabel: '3–4 Hours',
    inclusions: ['Premium Seating', 'Flybridge', 'Bedroom', 'Kitchen'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Loco Veinto',
    subtitle: 'Luxury Cruiser',
    price: 38000,
    duration: '3–4 Hours',
    capacity: '15 Guests',
    ideaFor: 'Corporate, Family, Party',
    abstract:
      'A luxury cruiser with an AC cabin, sun deck, music and lounge — offering a premium, relaxed cruising experience for mid-sized groups.',
    highlights: ['AC Cabin', 'Sun Deck', 'Lounge with music'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Loco Veinto for a genuine luxury cruiser experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for corporate, family, party.',
    durationLabel: '3–4 Hours',
    inclusions: ['AC Cabin', 'Sun Deck', 'Music', 'Lounge'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Majesty 44',
    subtitle: 'Premium Yacht',
    price: 44000,
    duration: '4 Hours',
    capacity: '15 Guests',
    ideaFor: 'Wedding, Corporate, Celebration',
    abstract:
      'A premium motor yacht with 2 bedrooms, AC, kitchen, washroom and flybridge — an elevated option for weddings and premium celebrations.',
    highlights: ['2 Bedrooms', 'Full Kitchen & Washroom', 'Flybridge with panoramic view'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Majesty 44 for a genuine premium yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for wedding, corporate, celebration.',
    durationLabel: '4 Hours',
    inclusions: ['2 Bedrooms', 'AC', 'Kitchen', 'Washroom', 'Flybridge'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Princess 54',
    subtitle: 'Luxury Motor Yacht',
    price: 69000,
    duration: '4 Hours',
    capacity: '18 Guests',
    ideaFor: 'Wedding, Corporate Celebration, Large Party',
    abstract:
      'A luxury motor yacht with 3 bedrooms, a luxury lounge, flybridge, kitchen and premium sound system for large-scale celebrations.',
    highlights: ['3 Bedrooms', 'Luxury Lounge & Flybridge', 'Premium Sound System'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Princess 54 for a genuine luxury motor yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for wedding, corporate celebration, large party.',
    durationLabel: '4 Hours',
    inclusions: ['3 Bedrooms', 'Luxury Lounge', 'Flybridge', 'Kitchen', 'Premium Sound'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Princess 61',
    subtitle: 'Super Luxury Yacht',
    price: 69000,
    duration: '4 Hours',
    capacity: '20 Guests',
    ideaFor: 'Corporate Retreat, Wedding, Large Celebration',
    abstract:
      'A super luxury yacht with 3 luxury cabins, a dedicated dining area, flybridge, kitchen and entertainment system, seating up to 20 guests in comfort.',
    highlights: ['3 Luxury Cabins', 'Dedicated Dining Area', 'Flybridge & Entertainment System'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Princess 61 for a genuine super luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for corporate retreat, wedding, large celebration.',
    durationLabel: '4 Hours',
    inclusions: ['3 Luxury Cabins', 'Dining Area', 'Flybridge', 'Kitchen', 'Entertainment System'],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Ferry',
    subtitle: 'Large Event Boat',
    price: 70000,
    duration: '3–4 Hours',
    capacity: '40–60 Guests',
    ideaFor: 'Corporate Events, Wedding, Large Party',
    abstract:
      'A large-capacity ferry-style event boat suited for weddings, corporate events and big group parties needing 40+ guest capacity.',
    highlights: [
      'Large 40–60 guest capacity',
      'Ideal for weddings & corporate events',
      'Spacious open deck for events',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Ferry for a genuine large event boat experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for corporate events, wedding, large party.',
    durationLabel: '3–4 Hours',
    inclusions: ['Crew', 'Fuel', 'Safety Equipment', 'Sound System'],
    exclusions: ['Food & Beverages', 'Decoration', 'DJ Setup'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isFeaturedTrip: false,
  },
  {
    title: 'Ferretti 80',
    subtitle: 'Super Luxury Yacht',
    price: 140000,
    duration: '4 Hours',
    capacity: '25 Guests',
    ideaFor: 'Celebrity Party, Luxury Vacation, Wedding',
    abstract:
      'The flagship super luxury yacht of the fleet — 4 luxury bedrooms, 4 bathrooms, AC lounge, optional jacuzzi, flybridge, full kitchen, dining area and entertainment system, built for celebrity-level events and luxury weddings.',
    highlights: [
      '4 Luxury Bedrooms, 4 Bathrooms',
      'AC Lounge with Jacuzzi (if available)',
      'Flybridge, Kitchen & Dining Area',
      'Full Entertainment System',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Ferretti 80 for a genuine super luxury yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for celebrity party, luxury vacation, wedding.',
    durationLabel: '4 Hours',
    inclusions: [
      '4 Luxury Bedrooms',
      '4 Bathrooms',
      'AC Lounge',
      'Jacuzzi (if available)',
      'Flybridge',
      'Kitchen',
      'Dining Area',
      'Entertainment System',
    ],
    exclusions: ['Food & Beverages', 'Decoration', 'Photography'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
  {
    title: 'Tantaloon',
    subtitle: 'Sailing Yacht',
    price: 10000,
    duration: '2–3 Hours',
    capacity: '8 Guests',
    ideaFor: 'Couple, Friends, Sunset Cruise',
    abstract:
      'A comfortable mid-range sailing yacht popular with couples and friend groups for relaxed sunset cruising.',
    highlights: [
      'Comfortable 8-guest capacity',
      'Popular sunset-cruise choice',
      'Suits couples & friend groups',
    ],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Tantaloon for a genuine sailing yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for couple, friends, sunset cruise.',
    durationLabel: '2–3 Hours',
    inclusions: ['Captain', 'Fuel', 'Safety Equipment'],
    exclusions: ['Decoration', 'Food & Beverages'],
    accommodationNote: 'Not applicable — this is a day/harbour cruise package with no overnight stay.',
    isPopularPackage: false,
  },
  {
    title: 'Royal Lady',
    subtitle: 'Luxury Motor Yacht',
    price: 55000,
    duration: '4 Hours',
    capacity: '20 Guests',
    ideaFor: 'Corporate, Wedding, Large Celebration',
    abstract:
      'A luxury motor yacht with 3 luxury cabins, flybridge, lounge, music system and full kitchen, backed by a professional crew — built for large-scale celebrations.',
    highlights: ['3 Luxury Cabins', 'Flybridge & Lounge', 'Professional Crew onboard'],
    bestTime: 'Year Round',
    whyChoose:
      'Choose the Royal Lady for a genuine luxury motor yacht experience in Mumbai harbour — professionally crewed, safety-equipped, and tailored for corporate, wedding, large celebration.',
    durationLabel: '4 Hours',
    inclusions: [
      '3 Luxury Cabins',
      'Flybridge',
      'Lounge',
      'Music System',
      'Kitchen',
      'Washroom',
      'Professional Crew',
    ],
    exclusions: ['Food & Beverages', 'Decoration'],
    accommodationNote:
      'Onboard cabin(s) as listed in Key Highlights — this is a day-cruise package, no overnight stay included unless arranged separately.',
    isFeaturedTrip: false,
  },
];

export const yachtPackageSeedData = yachtDefs.map(buildYachtPackage);
