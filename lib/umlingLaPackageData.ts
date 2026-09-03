/**
 * Seed content for Upcoming Tours packages.
 * Upserted via POST /api/packages/seed-upcoming-tours
 */

export const UMLING_LA_6N7D_TITLE = '6N/7D Umling La Pass from Leh';
export const UMLING_LA_7N8D_TITLE = '7N/8D Umling La Pass from Leh';
export const DELHI_MANALI_LEH_12D_TITLE = '12 Days - Delhi - Manali-Leh-Srinagar';
export const SPITI_EXPERIENCE_TITLE = 'Experience Spiti with Touring Tours [Adventure Tourism]';
export const VIETNAM_MOTORBIKE_TOUR_TITLE = 'Vietnam Motorbike Tour';
export const RANN_OF_KUTCH_TOUR_TITLE = 'Rann of Kutch Motorbike Tour';
export const BHUTAN_MOTORBIKE_TOUR_TITLE = 'BHUTAN MOTORBIKE TOUR ex Bagdogra';

/** @deprecated use UMLING_LA_6N7D_TITLE */
export const UMLING_LA_PACKAGE_TITLE = UMLING_LA_6N7D_TITLE;

const SHARED_FIXED_DEPARTURES = [
  { month: 'April 2026', dates: '5th, 12th, 19th, 26th' },
  { month: 'May 2026', dates: '3rd, 10th, 17th, 26th' },
  { month: 'June 2026', dates: '2nd, 6th, 13th, 16th, 23rd, 27th' },
  { month: 'July 2026', dates: '4th, 7th, 14th, 18th, 25th, 28th' },
  { month: 'August 2026', dates: '4th, 8th, 15th, 18th, 25th, 29th' },
  { month: 'September 2026', dates: '5th, 8th, 15th, 19th, 26th, 29th' },
];

const SHARED_ACCOMMODATION = [
  { city: 'Leh', hotel: 'Hotel Karakonam / Hotel Horpo Chubi / Shashipa', rooms: 'As per group', roomType: 'Deluxe hotel', nights: 'As per itinerary' },
  { city: 'Nubra', hotel: 'River Valley Camp / Thomas Camps / Hill Queen Camps', rooms: 'As per group', roomType: 'Swiss camp (attached washroom)', nights: '1 Night' },
  { city: 'Pangong Lake', hotel: '100 Sky Camp / P3 Camp / Monalisa Cottage / Panorama Cottage', rooms: 'As per group', roomType: 'Swiss camp (attached washroom)', nights: '1 Night' },
  { city: 'Hanle', hotel: 'Deluxe Homestay', rooms: 'As per group', roomType: 'Homestay', nights: '1 Night' },
  { city: 'Nyoma', hotel: 'Deluxe Homestay', rooms: 'As per group', roomType: 'Homestay', nights: '1 Night' },
];

const SHARED_EXCLUSIONS = [
  {
    category: 'Exclusions',
    items: [
      'Personal expenses such as telephone charges, laundry, tips, and table drinks.',
      'Any type of insurance, including medical, accidental, and theft coverage.',
      'Airfare or rail fare not mentioned in the Inclusions.',
      'Pick-up or drop-off services at the airport, railway station, or bus stop.',
      'Costs for any spare parts needed due to accidental damage while the motorbike is in the rider\'s possession.',
      'Expenses for transferring or towing the motorbike, as well as servicing or maintenance costs if it is dropped on the way.',
      'Any lunches or meals not included in the package.',
      'A security deposit of ₹10,000 per motorbike for accidental damages or if the bike is left behind before the trip\'s end date.',
      'Parking, monastery, and monument entry fees during sightseeing.',
      'Costs incurred due to itinerary changes or extensions caused by natural calamities, roadblocks, vehicle breakdowns, union issues, or other factors beyond our control.',
      'Additional accommodation or food costs resulting from delays.',
      'Applicable GST.',
      'Any other expenses not mentioned in the inclusions.',
    ],
  },
];

const SHARED_PACKAGE_NOTES = [
  'The check-in time is 12 noon/early check-in subject to availability of the room.',
  'We require minimum strength of 6 riders to operate one group. We have the right to cancel the group if we do not get the minimum strength of riders in any group. In such a case, guests are eligible for full refund of the money paid for the package only.',
  'If there are any additional expenses due to bad weather or any other reason beyond the control of the tour operator on account of a hotel stay, transportation, and meals, etc. extra bill will be raised. Neither we nor the participating partners/hotels will be responsible for the additional expenses.',
  'We are not responsible for any change in itinerary due to reasons beyond our control like change in flight and train schedule, cancellation of flights/trains, political disturbances, natural phenomenon, etc...',
  'If any group member wants to leave the group in-between the tour then he/she has to pay the cost for transportation of bike from point of leaving the tour till the tour endpoint.',
  'Group members would have to get their own riding gears. Wearing a helmet, carrying a valid ID proof & Driving license is mandatory.',
  'All guests are responsible for the safety and security of their own luggage. We are not responsible for damaged, missing, or lost luggage. So carry a small daypack bag to carry all the expensive things with you.',
  'Compensation for any damage/accident done by you during the tour to others property/person would be directly payable by you.',
  'We have the right to cancel the departure due to insufficient members in the batches. In such a situation, guests are eligible for a full refund.',
  'Foreign Nationals have to pay separately for the permits for Khardungla and Pangong Tso.',
  'Basic First Aid Kit - It\'s advised that one should bring his/her own medicines which are known and suitable to him.',
  'Road Captain will be responsible to manage the group by taking all safety measures. The group has to follow him to make the tour a success.',
  'We provide a well-experienced and skilled Royal Enfield Mechanic with spare parts and tools. They are well trained to handle large groups.',
  'The spares used on the way will be chargeable. Backing vehicle – Xylo/Innova/tempo for mechanical and medical support.',
  'In case of an emergency, if any rider is feeling uneasy then he can sit in it and the mechanic will ride the bike.',
  'Only one rucksack/backpack of 60 litres will be adjusted in the backup vehicle as it will be having tools and spares too.',
];

const SHARED_CANCELLATION_POLICY = [
  'Cancellation made within 30 to 15 days from the Date of Travel – Credit Voucher worth 100% of Received Amount',
  'Cancellation made within 15 days from the Date of Travel – Credit Voucher worth 50% of Received Amount',
  'The applicable Credit Voucher will be sent to you on your registered email id within 72 hours from the date of Cancellation.',
  'Cancellation will only be accepted on Email at touringtours@yahoo.com',
  'The Credit Voucher shall be valid for one year from the date of Cancellation.',
  'The Credit Voucher can be redeemed against the equivalent or higher amount of the booked package amount.',
  'In case of Lockdown or Covid Positive Report, Credit Voucher worth 100% of Received Amount with a validity of 1 year from the date of travel with be credited.',
];

const SHARED_RESCHEDULING_POLICY = [
  'Before 15 Days from the Date of Travel - One-time Complementary.',
  'Within 15 Days from the Date of Travel - The cost of rescheduling needs to be paid by the guest subject to amendment charges from hotels and transporters.',
  'Rescheduling will only be accepted on Email at touringtours@yahoo.com',
];

const SHARED_BOOKING_POLICY = [
  'Booking Amount: Rs.5,000/-',
  '46 days or more before the Date of Travel: 25% of the Total Cost',
  '31 - 45 Days before date of departure: 50% of Total Cost',
  '15 - 30 Days before date of departure: 100% of Total Cost',
];

const SHARED_TRANSPORTATION = [
  {
    type: 'Motorcycle',
    vehicle: '411CC Royal Enfield Himalayan',
    description: 'Provided from morning of Day 2 until evening of Day 6. Backup vehicle (Xylo/Innova/Tempo) for luggage and emergencies.',
  },
];

export const umlingLa6N7DPackageData = {
  title: UMLING_LA_6N7D_TITLE,
  subtitle: 'Fixed Departure Dates in 2026',
  ideaFor: 'Solo riders, couples, friends, families, adventure seekers',
  about:
    'Conquer the world\'s highest motorable passes on a guided Royal Enfield Himalayan expedition through Ladakh — from Nubra Valley and Pangong Tso to Umling La and Demchok near the Indo-China border.',
  services:
    'Experienced road captains, mechanics, deluxe hotels & Swiss camps, bike permits, Inner Line Permits, backup vehicle support, and fuel as per itinerary.',
  tourDetails:
    'A 6-night / 7-day fixed-departure motorcycle expedition from Leh covering Khardung La, Chang La, Pangong Tso, Hanle, Umling La, Demchok, and Chamuthang with expert crew support throughout.',
  abstract:
    'Ride with experienced road captains through Ladakh\'s most iconic high-altitude routes including Umling La — the highest motorable road in the world.',
  tourOverview: 'Fixed Departures — April to September 2026',
  price: 26500,
  duration: '6 Nights / 7 Days',
  location: 'Leh, Ladakh, India',
  capacity: 'Minimum 6 riders per group',
  packageType: 'domestic' as const,
  place: 'leh-ladakh',
  packageCategory: 'Upcoming Tours',
  packageMiniCategory: '',
  isFeaturedTrip: false,
  isPopularPackage: false,
  isFeaturedDestination: false,
  bookings: 0,
  rating: 4.9,
  images: [
    {
      public_id: 'pkg-umling-la',
      url: '/tea-garden-in-darjeeling-india.webp',
      alt: '6N/7D Umling La Pass from Leh',
    },
  ],
  fixedDepartures: SHARED_FIXED_DEPARTURES,
  hotelOptions: [
    '2 Persons on 1 Bike: INR 26,500/-',
    '1 Person on 1 Bike: INR 31,500/-',
    'SIC (Tempo Traveller): INR 26,500/-',
  ],
  keyHighlights: [
    'Stay in deluxe hotels and Swiss camps with attached bathrooms, perfect for solos, couples, friends, and families.',
    'Ride with the expertise of experienced road captains, mechanics, and support staff, ensuring a safe and smooth journey.',
    'All necessary bike permits and Inner Line Permits will be arranged for you.',
    'Conquer the world\'s highest motorable passes, including Umling La, Khardung La and Chang La, for a thrilling experience.',
    'Discover breathtaking landscapes in Nubra Valley and the stunning Pangong Tso.',
    'Venture to Umling La, the highest motorable road, and visit Demchok village, a peaceful settlement near the Indo-China border, known for its scenic beauty and cultural significance.',
  ],
  shortItinerary: [
    { day: 1, title: 'Arrival in Leh | Rest & Acclimatization Day (11,600 ft)' },
    { day: 2, title: 'Journey from Leh to Nubra Valley (10,000 ft | 160 KM | 5-6 hr)' },
    { day: 3, title: 'Journey from Nubra Valley to Pangong Tso (14,000 ft | 160 KM | 7-8 hr)' },
    { day: 4, title: 'Journey from Pangong to Hanle with Rezang La War Memorial' },
    { day: 5, title: 'Journey from Hanle to Umling La and Demchok' },
    { day: 6, title: 'Journey from Nyoma/Hanle to Leh with Chamuthang' },
    { day: 7, title: 'Departure from Leh' },
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Leh | Rest & Acclimatization Day (11,600 ft)',
      description:
        'On arriving in Leh, transfer to the hotel. Later get briefed on the program and upcoming events of your journey. Enjoy dinner and overnight stay in Leh.',
    },
    {
      day: 2,
      title: 'Journey from Leh to Nubra Valley (10,000 ft | 160 KM | 5-6 hr)',
      description:
        'Wake up to a refreshing morning and enjoy breakfast. Travel to Nubra Valley, a cold desert with stunning landscapes and mountain ranges. Cross the thrilling Khardung La Pass, the world\'s second-highest motorable pass. On arrival in Nubra, opt for a camel ride in the desert mountains of Hunder (at additional cost). Hand over your bike keys to the road captain. Dinner and overnight stay in Nubra Valley.',
    },
    {
      day: 3,
      title: 'Journey from Nubra Valley to Pangong Tso (14,000 ft | 160 KM | 7-8 hr)',
      description:
        'Start your day with a delicious breakfast. Gear up for another thrilling off-road adventure through the rugged mountain paths. Travel towards the stunning Pangong Tso (lake) via the Shyok River or the challenging Wari La Pass, a route often used by the army. Upon arrival, take in the mesmerising views of the blue waters of Pangong Tso. (If the Agam route is closed, we\'ll adjust the itinerary accordingly.) Enjoy the picturesque surroundings of the lake. Hand over your bike keys to the road captain and settle in for the night. Enjoy dinner and overnight stay at Pangong Tso.',
    },
    {
      day: 4,
      title: 'Journey from Pangong to Hanle with Rezang La War Memorial',
      description:
        'Start your bike ride from Pangong Lake after having breakfast at your accommodation. Depart from Pangong, enjoying the stunning views as you ride. Reach Chushul and visit the Rezang La War Memorial, honouring the heroes of the 1962 Indo-China War. Enjoy views of the Black Mountain as you ride. Reach Hanle en route to Loma Bend. Visit the Hanle Observatory (if you arrive in Hanle before 4 PM). Enjoy dinner and an overnight stay while taking in the beauty of the night in Hanle.',
    },
    {
      day: 5,
      title: 'Journey from Hanle to Umling La and Demchok',
      description:
        'Start the day with a hearty breakfast in Hanle, preparing for an exhilarating ride ahead. Set off toward Umling La Top, the highest motorable road in the world, where breathtaking views and adrenaline await. Weather permitting, venture to the enchanting Demchock Village, where you can marvel at the beautiful India-China River, a stunning natural border between the two nations. After soaking in the sights, return via the scenic Loma Bend, with picturesque landscapes accompanying your ride. Arrive back at Nyoma or Hanle for an overnight stay. Enjoy a delicious dinner, reflecting on the day\'s adventures while taking in the mesmerizing night sky.',
    },
    {
      day: 6,
      title: 'Journey from Nyoma/Hanle to Leh with Chumathang',
      description:
        'After breakfast, depart from Nyoma, embarking on a journey filled with unique sights. En route, visit the iconic Mahe Bridge, a marvel of engineering amidst stunning landscapes. Explore the rejuvenating hot springs of Chumathang, perfect for a refreshing dip and relaxation. Pay a visit to the picturesque Thiksey Monastery, known for its stunning architecture and panoramic views. Stop by the famous Rancho School, a charming landmark from the beloved film "3 Idiots." Arrive at your Leh accommodation for an overnight stay. Enjoy a delightful dinner while reminiscing about the day\'s escapades.',
    },
    {
      day: 7,
      title: 'Departure from Leh',
      description:
        'After breakfast, make your way to the airport for your flight home, marking the end of your journey. Trip concludes.',
    },
  ],
  accommodation: SHARED_ACCOMMODATION.map((stay) =>
    stay.city === 'Leh' ? { ...stay, nights: '2 Nights' } : stay
  ),
  transportation: SHARED_TRANSPORTATION,
  inclusions: [
    {
      category: 'Inclusions',
      items: [
        'Stay in pre-booked deluxe hotels on triple sharing (double sharing for couples).',
        'Enjoy a comfy stay in Swiss camps with attached washrooms on triple sharing (double sharing for couples) at Nubra Valley and Pangong Tso.',
        'Savour buffet breakfast from Day 2 to Day 7 and buffet dinner from Day 1 to Day 6.',
        '411CC Royal Enfield Himalayan bikes provided from the morning of Day 2 until the evening of Day 6.',
        'Receive bike permits and Inner Line Permits for all travellers.',
        'All necessary permits for the highest motorable passes in the world, including Khardung La and Chang La.',
        'Fuel will be provided according to the itinerary route.',
        'Benefit from the services of an experienced road captain and motorbike mechanic from Day 2 to Day 6.',
        'For groups of more than 10 motorbikes, backup seating in a vehicle is available for emergencies.',
        'A first aid medical kit and oxygen cylinder will be provided by the road captain.',
        'A separate vehicle will carry luggage, limited to 1 rucksack/duffle bag of up to 60 litres per traveller.',
      ],
    },
  ],
  exclusions: SHARED_EXCLUSIONS,
  packageNotes: SHARED_PACKAGE_NOTES,
  cancellationPolicy: SHARED_CANCELLATION_POLICY,
  reschedulingPolicy: SHARED_RESCHEDULING_POLICY,
  bookingPolicy: SHARED_BOOKING_POLICY,
  faqs: [],
  reviews: [],
};

export const umlingLa7N8DPackageData = {
  title: UMLING_LA_7N8D_TITLE,
  subtitle: 'Fixed Departure Dates in 2026',
  ideaFor: 'Solo riders, couples, friends, families, adventure seekers',
  about:
    'An extended 7-night / 8-day Ladakh motorcycle expedition with Leh local sightseeing — deluxe stays, expert road captains, and the world\'s highest motorable passes including Umling La, Khardung La, and Chang La.',
  services:
    'Experienced road captains, mechanics, deluxe hotels & Swiss camps, bike permits, Inner Line Permits, Leh tempo traveller sightseeing, backup vehicle support, and fuel as per itinerary.',
  tourDetails:
    'A 7-night / 8-day fixed-departure motorcycle expedition from Leh covering Nubra Valley, Pangong Tso, Hanle, Umling La, Demchok, Chamuthang, and a full day of Leh local sightseeing.',
  abstract:
    'The Ladakh bike trip spans 7 nights and 8 days, offering an unforgettable adventure with an extra day for Leh local sightseeing.',
  tourOverview: 'Fixed Departures — April to September 2026',
  price: 28500,
  duration: '7 Nights / 8 Days',
  location: 'Leh, Ladakh, India',
  capacity: 'Minimum 6 riders per group',
  packageType: 'domestic' as const,
  place: 'leh-ladakh',
  packageCategory: 'Upcoming Tours',
  packageMiniCategory: '',
  isFeaturedTrip: false,
  isPopularPackage: false,
  isFeaturedDestination: false,
  bookings: 0,
  rating: 4.9,
  images: [
    {
      public_id: 'pkg-umling-la-7n8d',
      url: '/yaht/photo-1569263979104-865ab7cd8d13.avif',
      alt: '7N/8D Umling La Pass from Leh',
    },
  ],
  fixedDepartures: SHARED_FIXED_DEPARTURES,
  hotelOptions: [
    '2 Persons on 1 Bike: INR 28,500/-',
    '1 Person on 1 Bike: INR 33,500/-',
    'SIC (Tempo Traveller): INR 28,500/-',
  ],
  keyHighlights: [
    'Stay in deluxe hotels and Swiss camps with attached bathrooms, perfect for solos, couples, friends, and families.',
    'The Ladakh bike trip spans 7 nights and 8 days, offering an unforgettable adventure.',
    'Ride with the expertise of experienced road captains, mechanics, and support staff, ensuring a safe and smooth journey.',
    'All necessary bike permits and Inner Line Permits will be arranged for you.',
    'Conquer the world\'s highest motorable passes, including Khardung La and Chang La, for a thrilling experience.',
    'Discover breathtaking landscapes in Nubra Valley and the stunning Pangong Tso.',
    'Venture to Umling La, the highest motorable road, and visit Demchok village, a peaceful settlement near the Indo-China border, known for its scenic beauty and cultural significance.',
    'Enjoy local sightseeing in Leh to immerse yourself in the region\'s culture and beauty.',
  ],
  shortItinerary: [
    { day: 1, title: 'Arrival in Leh | Rest & Acclimatization Day (11,600 ft)' },
    { day: 2, title: 'Journey from Leh to Nubra Valley (10,000 ft | 160 KM | 5-6 hr)' },
    { day: 3, title: 'Journey from Nubra Valley to Pangong Tso (14,000 ft | 160 KM | 7-8 hr)' },
    { day: 4, title: 'Journey from Pangong to Hanle with Rezang La War Memorial' },
    { day: 5, title: 'Journey from Hanle to Umling La and Demchok' },
    { day: 6, title: 'Journey from Nyoma/Hanle to Leh with Chamuthang' },
    { day: 7, title: 'Leh Local Sightseeing' },
    { day: 8, title: 'Departure from Leh' },
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Leh | Rest & Acclimatization Day',
      description:
        'On arriving in Leh, transfer to the hotel. Later get briefed on the program and upcoming events of your journey. Enjoy dinner and overnight stay in Leh.',
    },
    {
      day: 2,
      title: 'Journey from Leh to Nubra Valley',
      description:
        'Wake up to a refreshing morning and enjoy breakfast. Travel to Nubra Valley, a cold desert with stunning landscapes and mountain ranges. Cross the thrilling Khardung La Pass, the world\'s second-highest motorable pass. On arrival in Nubra, opt for a camel ride in the desert mountains of Hunder (at additional cost). Hand over your bike keys to the road captain. Dinner and overnight stay in Nubra Valley.',
    },
    {
      day: 3,
      title: 'Journey from Nubra Valley to Pangong Tso',
      description:
        'Start your day with a delicious breakfast. Gear up for another thrilling off-road adventure through the rugged mountain paths. Travel towards the stunning Pangong Tso (lake) via the Shyok River or the challenging Wari La Pass, a route often used by the army. Upon arrival, take in the mesmerising views of the blue waters of Pangong Tso. (If the Agam route is closed, we\'ll adjust the itinerary accordingly.) Enjoy the picturesque surroundings of the lake. Hand over your bike keys to the road captain and settle in for the night. Enjoy dinner and overnight stay at Pangong Tso.',
    },
    {
      day: 4,
      title: 'Journey from Pangong to Hanle with Rezang La War Memorial',
      description:
        'Start your bike ride from Pangong Lake after having breakfast at your accommodation. Depart from Pangong, enjoying the stunning views as you ride. Reach Chushul and visit the Rezang La War Memorial, honouring the heroes of the 1962 Indo-China War. Enjoy views of the Black Mountain as you ride. Reach Hanle en route to Loma Bend. Visit the Hanle Observatory (if you arrive in Hanle before 4 PM). Enjoy dinner and an overnight stay while taking in the beauty of the night in Hanle.',
    },
    {
      day: 5,
      title: 'Journey from Hanle to Umling La and Demchok',
      description:
        'Start the day with a hearty breakfast in Hanle, preparing for an exhilarating ride ahead. Set off toward Umling La Top, the highest motorable road in the world, where breathtaking views and adrenaline await. Weather permitting, venture to the enchanting Demchock Village, where you can marvel at the beautiful India-China River, a stunning natural border between the two nations. After soaking in the sights, return via the scenic Loma Bend, with picturesque landscapes accompanying your ride. Arrive back at Nyoma or Hanle for an overnight stay. Enjoy a delicious dinner, reflecting on the day\'s adventures while taking in the mesmerising night sky.',
    },
    {
      day: 6,
      title: 'Journey from Nyoma/Hanle to Leh with Chumathang',
      description:
        'After breakfast, depart from Nyoma, embarking on a journey filled with unique sights. En route, visit the iconic Mahe Bridge, a marvel of engineering amidst stunning landscapes. Explore the rejuvenating hot springs of Chumathang, perfect for a refreshing dip and relaxation. Pay a visit to the picturesque Thiksey Monastery, known for its stunning architecture and panoramic views. Stop by the famous Rancho School, a charming landmark from the beloved film "3 Idiots." Arrive at your Leh accommodation for an overnight stay. Enjoy a delightful dinner while reminiscing about the day\'s escapades.',
    },
    {
      day: 7,
      title: 'Leh Local Sightseeing',
      description:
        'Enjoy a hearty breakfast to fuel your adventure. Depart for an exciting sightseeing trip in a comfortable tempo traveler. Visit the serene Pathar Sahib Gurudwara, a peaceful haven for reflection and spirituality. Experience the marvel of Magnetic Hill, where gravity seems to defy itself! Witness the breathtaking confluence of the Indus and Zanskar Rivers, a stunning sight where two powerful rivers meet. Stop at the magnificent Shanti Stupa, an iconic structure that offers panoramic views of Leh and the surrounding mountains. Travel along the NH1 Leh-Srinagar Highway, lined with army checkpoints and camps, providing a unique glimpse into the region\'s defence. Savour a delicious dinner and relax during your overnight stay in Leh.',
    },
    {
      day: 8,
      title: 'Departure from Leh',
      description:
        'After breakfast, make your way to the airport for your flight home, marking the end of your journey. Trip concludes.',
    },
  ],
  accommodation: SHARED_ACCOMMODATION.map((stay) =>
    stay.city === 'Leh' ? { ...stay, nights: '3 Nights' } : stay
  ),
  transportation: [
    ...SHARED_TRANSPORTATION,
    {
      type: 'Sightseeing',
      vehicle: 'Tempo Traveller (SIC)',
      description: 'Leh local sightseeing on Day 7 on seat-in-coach basis.',
    },
  ],
  inclusions: [
    {
      category: 'Inclusions',
      items: [
        'Stay in pre-booked deluxe hotels on triple sharing (double sharing for couples) in Leh. Enjoy a comfy stay in Swiss camps with attached washrooms on triple sharing (double sharing for couples) at Nubra Valley and Pangong Tso.',
        'Savour buffet breakfast from Day 2 to Day 8 and buffet dinner from Day 1 to Day 7.',
        '411CC Royal Enfield Himalayan bikes provided from the morning of Day 2 until the evening of Day 6.',
        'Receive bike permits and Inner Line Permits for all travelers.',
        'All necessary permits for the highest motorable passes in the world, including Khardung La and Chang La.',
        'Fuel will be provided according to the itinerary route.',
        'Enjoy local sightseeing in Leh in a tempo traveler on a seat-in-coach basis.',
        'Benefit from the services of an experienced road captain and motorbike mechanic from Day 2 to Day 6.',
        'For groups of more than 10 motorbikes, backup seating in a vehicle is available for emergencies.',
        'A first aid medical kit and oxygen cylinder will be provided with the road captain.',
        'A separate vehicle will carry luggage, limited to 1 rucksack/duffle bag of up to 60 liters per traveler.',
      ],
    },
  ],
  exclusions: SHARED_EXCLUSIONS,
  packageNotes: SHARED_PACKAGE_NOTES,
  cancellationPolicy: SHARED_CANCELLATION_POLICY,
  reschedulingPolicy: SHARED_RESCHEDULING_POLICY,
  bookingPolicy: SHARED_BOOKING_POLICY,
  faqs: [],
  reviews: [],
};

export const delhiManaliLeh12DPackageData = {
  title: DELHI_MANALI_LEH_12D_TITLE,
  subtitle: 'Fixed Departures in 2026',
  ideaFor: 'Solo riders, couples, friends, families, cross-Himalayan adventure seekers',
  about:
    'A legendary 12-day motorcycle expedition from Delhi through Manali, Ladakh, and Srinagar — covering approximately 2,000 KM with complimentary Royal Enfield Himalayan, expert crew, and the world\'s highest motorable passes.',
  services:
    'Royal Enfield Himalayan with fuel and helmet, Volvo Delhi–Manali transfer, road captains, mechanics, deluxe hotels & Swiss camps, permits, backup vehicle, and luggage support.',
  tourDetails:
    '12-day fixed-departure ride: Delhi → Manali → Jispa → Sarchu → Leh → Nubra → Turtuk → Pangong → Kargil → Srinagar with experienced road captain and mechanic support.',
  abstract:
    'Enjoy 10 nights and 11 days of exploration with experienced road captains, mechanics, and support staff across the ultimate Delhi–Manali–Leh–Srinagar circuit.',
  tourOverview: 'Fixed Departures — May to September 2026',
  price: 36500,
  duration: '11 Nights / 12 Days',
  location: 'Delhi, Manali, Leh, Srinagar, India',
  capacity: 'Minimum 6 riders per group',
  packageType: 'domestic' as const,
  place: 'delhi-manali-leh-srinagar',
  packageCategory: 'Upcoming Tours',
  packageMiniCategory: '',
  isFeaturedTrip: false,
  isPopularPackage: false,
  isFeaturedDestination: false,
  bookings: 0,
  rating: 4.9,
  images: [
    {
      public_id: 'pkg-delhi-manali-leh-12d',
      url: '/domestic-tour-packages-services.jpg',
      alt: '12 Days Delhi Manali Leh Srinagar',
    },
  ],
  fixedDepartures: [
    { month: 'May 2026', dates: '31st' },
    { month: 'June 2026', dates: '7th, 19th, 26th' },
    { month: 'July 2026', dates: '8th, 15th, 27th' },
    { month: 'August 2026', dates: '3rd, 15th, 22nd' },
    { month: 'September 2026', dates: '3rd, 10th, 22nd, 29th' },
  ],
  hotelOptions: [
    '2 Pax on 1 Bike: INR 72,000/-',
    '1 Pax on 1 Bike: INR 48,500/-',
    'SIC (Tempo Traveller): INR 36,500/-',
    'Own Bike: INR 30,500/-',
  ],
  keyHighlights: [
    'Complimentary Royal Enfield Himalayan bike for an exhilarating adventure.',
    'Total distance covered during the tour: approximately 2,000 KM.',
    'Stay in deluxe hotels and Swiss camps with attached bathrooms, perfect for solos, couples, friends, and families.',
    'Enjoy 10 nights and 11 days of exploration with experienced road captains, mechanics, and support staff.',
    'Includes bike permits and inner line permits for a hassle-free journey.',
    'Ride on the highest motorable passes in the world: Khardung La and Chang La.',
    'Explore stunning destinations like Turtuk Village, Nubra Valley, and Pangong Tso.',
  ],
  shortItinerary: [
    { day: 1, title: 'Delhi to Kullu Manali | Overnight Volvo (6,700 ft | 540 KM | 14-15 hr)' },
    { day: 2, title: 'Arrival and Acclimatization in Manali (6,700 ft)' },
    { day: 3, title: 'Journey from Kullu Manali to Jispa/Billing (10,498 ft | 110 KM | 3-4 hr)' },
    { day: 4, title: 'Journey from Jispa to Sarchu (14,100 ft | 90 KM | 3-4 hr)' },
    { day: 5, title: 'Journey from Sarchu to Leh (11,562 ft | 250 KM | 6-7 hr)' },
    { day: 6, title: 'Journey from Leh to Nubra Valley (10,000 ft | 160 KM | 5-6 hr)' },
    { day: 7, title: 'Journey from Nubra Valley to Turtuk Village to Nubra Valley (9,850 ft | 196 KM | 8-9 hr)' },
    { day: 8, title: 'Journey from Nubra Valley to Pangong Tso (14,000 ft | 160 KM | 7-8 hr)' },
    { day: 9, title: 'Journey from Pangong Tso to Leh via Chang La (11,600 ft | 160 KM | 5-6 hr)' },
    { day: 10, title: 'Journey from Leh to Kargil (8,780 ft | 240 KM | 6-7 hr)' },
    { day: 11, title: 'Journey from Kargil to Srinagar (5,200 ft | 220 KM | 6-7 hr)' },
    { day: 12, title: 'Departure Day' },
  ],
  itinerary: [
    {
      day: 1,
      title: 'Delhi to Kullu Manali | Overnight Volvo (6,700 ft | 540 KM | 14-15 hr)',
      description:
        'Today, you will board a Volvo bus from Delhi to Kullu Manali after 5 PM. It\'s an overnight journey, so please ensure you\'re well prepared for the trip.',
    },
    {
      day: 2,
      title: 'Arrival and Acclimatization in Manali (6,700 ft)',
      description:
        'Arrive in Manali and check in at your pre-booked camps/hotel to settle in. Take the day to rest and acclimatize to the beautiful surroundings. Enjoy a leisurely stroll to the enchanting Hadimba Temple, dedicated to Hadimba Devi, the legendary wife of Bhima from the Mahabharata, and marvel at its unique architecture nestled in the forest. Continue your exploration to Manu Temple, situated by the serene Beas River, honouring sage Manu, the creator of the world. Get ready for an informative orientation process and tour briefing, setting the stage for the adventures ahead. Indulge in a delicious dinner before resting for the night in Kullu Manali, rejuvenating for the exciting days to come.',
    },
    {
      day: 3,
      title: 'Journey from Kullu Manali to Jispa/Billing (10,498 ft | 110 KM | 3-4 hr)',
      description:
        'Enjoy breakfast in the morning as your long-awaited journey to Ladakh begins. Pack your bags and prepare for an exhilarating adventure. Travel through the stunning Solang Valley and the Atal Tunnel, soaking in breathtaking views. Upon arrival at Jispa/Billing, hand over your bike keys to the road captain. Settle in for an overnight stay. Dinner will be served, followed by a restful night in Swiss Camps at Jispa/Billing.',
    },
    {
      day: 4,
      title: 'Journey from Jispa to Sarchu (14,100 ft | 90 KM | 3-4 hr)',
      description:
        'Start your day with a hearty breakfast. Gear up for an exciting adventure as you cross the 16,043-ft-high Bara-lacha La Pass in the Zanskar Range. Experience the thrill of riding through the rugged terrains of Darcha and Zingzingbar. Spend time near the Chandrabhaga River (Chenab) and capture mesmerizing photos. Visit the stunning Suraj Taal and Deepak Taal, two breathtaking lakes in the Lahaul and Spiti regions. Upon reaching Sarchu, hand over your bike keys to the road captain. Enjoy dinner and an overnight stay in Swiss Camps at Sarchu.',
    },
    {
      day: 5,
      title: 'Journey from Sarchu to Leh (11,562 ft | 250 KM | 6-7 hr)',
      description:
        'Start your day with a delicious breakfast. Begin your journey towards Leh, the hub of the Ladakh region. Travel through Nakeela Pass, Whisky Nallah, Lachulung La Pass, Pang, More Plains, and Tanglang La Pass. Upon arriving in Leh, hand over your bike keys to the road captain. Check-in at your accommodation for the night. Enjoy dinner, and a comfortable overnight stay in Leh.',
    },
    {
      day: 6,
      title: 'Journey from Leh to Nubra Valley (10,000 ft | 160 KM | 5-6 hr)',
      description:
        'Wake up to a refreshing morning and start your day with a delicious breakfast. Enjoy an exhilarating bike ride as your engines roar through the stunning Nubra Valley, a cold desert filled with vast landscapes and majestic mountain ranges. Experience the thrill of crossing Khardung La, one of the World\'s Highest Motorable Passes. On your way to Nubra, take a moment to appreciate the beautiful Buddha Statue and Diskit Monastery. Upon reaching Nubra, you have the option to enjoy a camel ride in the sand dunes (additional cost applies). Later, hand over your bike keys to the road captain and settle in for an overnight stay in Nubra (Hunder). Enjoy dinner, and a comfortable overnight stay in Nubra Valley.',
    },
    {
      day: 7,
      title: 'Journey from Nubra Valley to Turtuk Village to Nubra Valley (9,850 ft | 196 KM | 8-9 hr)',
      description:
        'After the sun peeks out, enjoy a hearty breakfast before packing your bags for your journey to Turtuk village, which was part of Pakistan before 1971. Nestled in the Nubra tehsil, Turtuk is located on the banks of the Shyok River and is the last village before the Line of Control (Thang Village). Experience stunning beauty throughout the valley, with breathtaking views, including the K2 Mountain range in Pakistan. After exploring Turtuk, travel back towards Nubra. Hand over your bike keys to the road captain and settle in for an overnight stay. Enjoy dinner, and a comfortable overnight stay in Nubra Valley.',
    },
    {
      day: 8,
      title: 'Journey from Nubra Valley to Pangong Tso (14,000 ft | 160 KM | 7-8 hr)',
      description:
        'Start your day with a hearty breakfast to fuel your adventurous spirit. Prepare for another day of daring off-roading as you traverse untamed paths in the high mountains. Your route leads to the stunning Pangong Tso (lake) via the Shyok River or Wari La Pass—an exhilarating journey often used by the army. Upon arrival, feast your eyes on the enchanting blue lake and its breathtaking surroundings. (If Pangong Tso is closed, we\'ll ride back to Leh and do the day excursion to Pangong Tso the next day in an SUV or tempo traveler.) Once you reach Pangong Tso, take your time to enjoy the picturesque lake and the magnificent views all around you. Later, hand over your bike keys to the road captain and settle in for an overnight stay. Enjoy dinner and an overnight stay at Pangong Tso, along with breakfast for the following day.',
    },
    {
      day: 9,
      title: 'Journey from Pangong Tso to Leh via Chang La (11,600 ft | 160 KM | 5-6 hr)',
      description:
        'Start your day with a delicious breakfast to energize you for the exciting journey ahead. Get ready for another exhilarating ride as you head back to Leh via Chang La Pass, one of the world\'s highest mountain passes. En route, stop at the famous Druk White Lotus School, featured in the blockbuster Bollywood movie "3 Idiots." If time permits, consider visiting the stunning Shey and Thiksey Monasteries for a glimpse of their remarkable architecture and serene surroundings. Upon reaching Leh, hand over your bike keys to the road captain. Enjoy dinner and a comfortable overnight stay in Leh.',
    },
    {
      day: 10,
      title: 'Journey from Leh to Kargil (8,780 ft | 240 KM | 6-7 hr)',
      description:
        'As the morning unfolds, start your day with a delicious breakfast. Enjoy a beautiful journey to Kargil, soaking in the breathtaking landscapes along the way. Visit the stunning Buddhist monastery of Lamayuru, perched at an elevation of 3,510 m. Later, explore the scenic Fotu La mountain pass and Tiger Hill, and pay your respects at the Drass War Memorial. Continue your journey towards Kargil. Upon arrival, hand over your bike keys to the road captain. Enjoy dinner and a comfortable overnight stay in Kargil.',
    },
    {
      day: 11,
      title: 'Journey from Kargil to Srinagar (5,200 ft | 220 KM | 6-7 hr)',
      description:
        'Start your day with a delightful breakfast. On your way to Srinagar, enjoy numerous attractions, including the stunning Fotu La Pass and Zojila Pass. En route, soak in the beauty of Sonmarg, often referred to as the "Mini Switzerland of India." In the evening, upon arrival in Srinagar, hand over your bike keys to the road captain. Enjoy dinner and a comfortable overnight stay at your pre-booked accommodation in Srinagar.',
    },
    {
      day: 12,
      title: 'Departure Day',
      description:
        'Complete your incredible Himalayan adventure with a flight from Srinagar. If your flight is scheduled for later in the day, take some time to explore Srinagar at your own pace. Enjoy breakfast before checking out of your accommodation.',
    },
  ],
  accommodation: [
    { city: 'Manali', hotel: 'Grand Krisa Resort and Spa / Hotel Rock Manali / Hotel Moniker / Meridian Adventure Camps', rooms: 'As per group', roomType: 'Deluxe hotel / camp', nights: '1 Night' },
    { city: 'Jispa', hotel: 'Garjha Hills / Jispa Journey Camps', rooms: 'As per group', roomType: 'Swiss camp (attached washroom)', nights: '1 Night' },
    { city: 'Sarchu', hotel: 'Garjha Hills Camps / Gold Drop Camps', rooms: 'As per group', roomType: 'Swiss camp (attached washroom)', nights: '1 Night' },
    { city: 'Leh', hotel: 'Hotel Karakoram / Hotel Horpo Chubi / Shashipa', rooms: 'As per group', roomType: 'Deluxe hotel', nights: '2 Nights' },
    { city: 'Nubra', hotel: 'River Valley Camps / Thomas Camps / Hill Queen Camps', rooms: 'As per group', roomType: 'Swiss camp (attached washroom)', nights: '2 Nights' },
    { city: 'Pangong', hotel: '100 Sky Camps / P3 Camps / Monalisa Cottage / Panorama Cottage', rooms: 'As per group', roomType: 'Swiss camp (attached washroom)', nights: '1 Night' },
    { city: 'Kargil', hotel: 'Hotel White Castle / Hotel The Indian Kargil', rooms: 'As per group', roomType: 'Deluxe hotel', nights: '1 Night' },
    { city: 'Srinagar', hotel: 'Hotel Nouvella Residency / The Triden Kashmir', rooms: 'As per group', roomType: 'Deluxe hotel', nights: '1 Night' },
  ],
  transportation: [
    {
      type: 'Overnight Volvo',
      vehicle: 'Luxury Semi-sleeper',
      description: 'Pre-booked Delhi to Manali Volvo seats on Day 0 (departure after 5 PM from Delhi).',
    },
    {
      type: 'Motorcycle',
      vehicle: '411CC Royal Enfield Himalayan',
      description: 'Complimentary bike with fuel and helmet from Day 2 morning until Day 10 evening. Backup Xylo/Innova/Tempo for luggage and emergencies.',
    },
  ],
  inclusions: [
    {
      category: 'Inclusions',
      items: [
        'Complimentary Himalayan Bike with Fuel and Helmet.',
        'Stay in pre-booked Deluxe hotels on triple sharing (double sharing for couples) at Leh, Kullu Manali, Kargil, and Srinagar.',
        'Comfy stay in Swiss Camps with attached washrooms on triple sharing (double sharing for couples) at Nubra Valley, Pangong Tso, Jispa, and Sarchu.',
        'Buffet Breakfast will be available from Day 2 till Day 11 and Buffet Dinner will be available from Day 1 till Day 10.',
        'The Bikes will be provided from Day 2 in the morning till Day 10 in the evening.',
        'Bike permits and Inner Line Permits for all travelers.',
        'All Permits for the highest motorable passes in the world - Khardung La and Chang La.',
        'Fuel will be provided as per the route mentioned in the itinerary.',
        'Services of an Experienced Road Captain and Motorbike Mechanic from Day 2 in the morning till Day 10 in the evening.',
        'Services of the backup seat in a vehicle for a group of more than 10 motorbikes are restricted for exigencies.',
        'First Aid Medical Kit and Oxygen Cylinder at dispersal with the Road Captain.',
        'Facility to carry luggage in a separate vehicle restricted to 1 Rucksack/Duffle Bag of 60 Litres per Traveller.',
        'Pre-booked Luxury Semi-sleeper Volvo Seats for travellers from Delhi to Manali on Day 0 (Zero).',
      ],
    },
  ],
  exclusions: [
    {
      category: 'Exclusions',
      items: [
        'Personal expenses like Telephone, Laundry, Tips, and Table Drinks, etc.',
        'Any type of Insurance - Medical, Accidental, and Theft.',
        'Any Airfare / Rail fare other than what is mentioned in Inclusions.',
        'Pick-up or Drop - Airport, Railway station, or Bus Stop.',
        'Cost of any spare part which will be used due to the accidental damage incurred when the motorbike is in rider\'s possession.',
        'In case Motorbike is dropped on the way - The cost incurred to transfer/tow, vehicle servicing or maintenance cost.',
        'Any lunch and other meals not mentioned in package inclusions.',
        'Security deposit per motorbike of Rs. 10,000/- for accidental damages or dropping back the bike, if in case you leave the bike in between the route before the end date of the trip.',
        'Parking, Monastery, and Monument entry fees during sightseeing.',
        'Any cost incurred due to extension, change of itinerary due to natural calamities, road blocks, vehicle breakdown, union issues, and factors beyond our control.',
        'Additional accommodation/food cost incurred due to any delay.',
        'Applicable GST.',
        'Anything that is not mentioned in the Inclusion sections.',
      ],
    },
  ],
  packageNotes: SHARED_PACKAGE_NOTES,
  cancellationPolicy: SHARED_CANCELLATION_POLICY,
  reschedulingPolicy: SHARED_RESCHEDULING_POLICY,
  bookingPolicy: SHARED_BOOKING_POLICY,
  faqs: [],
  reviews: [],
};

const SPITI_PACKAGE_NOTES = [
  'The check-in time is noon/early check-in is subject to availability of the room.',
  'We require a minimum of 6 riders to operate one group. We have the right to cancel the group if we do not get the minimum number of riders in any group. In such a case, guests are eligible for a full refund of the money paid for the package only.',
  'If there are any additional expenses due to bad weather or any other reason beyond the control of the tour operator on account of a hotel stay, transportation, and meals, etc. extra bill will be raised. Neither we nor the participating partners/hotels will be responsible for the additional expenses.',
  'We are not responsible for any change in itinerary due to reasons beyond our control like changes in flight and train schedule, cancellation of flights/trains, political disturbances, natural phenomena, etc...',
  'If any group member wants to leave the group in between the tour, then he/she has to pay the cost for transportation of the bike from the point of leaving the tour till the tour endpoint.',
  'Group members would have to get their riding gear. Wearing a helmet, carrying a valid ID proof & Driving license is mandatory.',
  'All guests are responsible for the safety and security of their luggage. We are not responsible for damaged, missing, or lost luggage. So, carry a small daypack to carry all the expensive things with you.',
  'Compensation for any damage/accident done by you during the tour to others\' property/person would be directly payable by you.',
  'We have the right to cancel the departure due to insufficient members in the batches. In such a situation, guests are eligible for a full refund.',
  'Foreign Nationals have to pay separately for the permits for Khardungla and Pangong Tso.',
  'Basic First Aid Kit - It\'s advised that one should bring his/her own medicines, which are known and suitable to them.',
  'Road Captain will be responsible for managing the group by taking all safety measures. The group has to follow him to make the tour a success.',
  'We provide a well-experienced and skilled Royal Enfield Mechanic with spare parts and tools. They are well-trained to handle large groups.',
  'The spares used on the way will be chargeable. Backing vehicle – Xylo/Innova/Tempo for mechanical and medical support.',
  'In case of an emergency, if any rider is feeling uneasy, then he can sit in it, and the mechanic will ride the bike.',
  'Only one rucksack/backpack of 60 litres will be adjusted in the backup vehicle, as it will be having tools and spares too.',
];

const SPITI_CANCELLATION_POLICY = [
  'Cancellation made within 30 to 15 days from the Date of Travel – Credit Voucher worth 100% of the Received Amount',
  'Cancellation made within 15 days from the Date of Travel – Credit Voucher worth 50% of the Received Amount',
  'The applicable Credit Voucher will be sent to you on your registered email id within 72 hours from the date of Cancellation.',
  'Cancellation will only be accepted via Email at touringtours@yahoo.com',
  'The Credit Voucher shall be valid for one year from the date of Cancellation.',
  'The Credit Voucher can be redeemed against the equivalent or higher amount of the booked package amount.',
  'In case of Lockdown or Covid Positive Report, Credit Voucher worth 100% of the Received Amount with a validity of 1 year from the date of travel will be credited.',
];

const SPITI_RESCHEDULING_POLICY = [
  'Before 15 Days from the Date of Travel - One-time complimentary.',
  'Within 15 Days from the Date of Travel - The cost of rescheduling needs to be paid by the guest subject to amendment charges from hotels and transporters.',
  'Rescheduling will only be accepted on Email at touringtours@yahoo.com',
];

const SPITI_BOOKING_POLICY = [
  'Booking Amount: Rs. 5,000/-',
  '46 days or more before the Date of Travel: 25% of the Total Cost',
  '31 - 45 Days before date of departure: 50% of Total Cost',
  '15 - 30 Days before date of departure: 100% of Total Cost',
];

export const spitiExperiencePackageData = {
  title: SPITI_EXPERIENCE_TITLE,
  subtitle: 'Fixed departure dates in 2026',
  ideaFor: 'Adventure riders, solo travellers, couples, friends, Spiti Valley explorers',
  about:
    'Experience the raw beauty of Spiti Valley on a guided motorcycle adventure — from Jalori Pass and Chitkul to Kaza, Chandratal, and back through the Atal Tunnel with expert road captains and deluxe stays.',
  services:
    'Royal Enfield Himalayan with fuel, Volvo Delhi–Kullu and Manali–Delhi transfers, road captains, mechanics, deluxe hotels & Swiss camps, bike permits, and Inner Line Permits.',
  tourDetails:
    '10-day Spiti adventure: Delhi → Kullu → Sarahan → Sangla → Kaza → Chandratal → Manali → Delhi with bikes from Day 3 to Day 8.',
  abstract:
    'A fixed-departure Spiti motorcycle expedition covering Himachal\'s most iconic villages, monasteries, high passes, and Chandratal Lake.',
  tourOverview: 'Fixed Departures — May to September 2026',
  price: 28900,
  duration: '9 Nights / 10 Days',
  location: 'Spiti Valley, Himachal Pradesh, India',
  capacity: 'Minimum 6 riders per group',
  packageType: 'domestic' as const,
  place: 'spiti-valley',
  packageCategory: 'Upcoming Tours',
  packageMiniCategory: '',
  isFeaturedTrip: false,
  isPopularPackage: false,
  isFeaturedDestination: false,
  bookings: 0,
  rating: 4.9,
  images: [
    {
      public_id: 'pkg-spiti-experience',
      url: '/Cherrapunji-2.webp',
      alt: 'Experience Spiti with Touring Tours',
    },
  ],
  fixedDepartures: [
    { month: 'May 2026', dates: '31st' },
    { month: 'June 2026', dates: '6th, 13th, 20th, 27th' },
    { month: 'July 2026', dates: '4th, 11th, 18th, 25th' },
    { month: 'August 2026', dates: '1st, 8th, 15th, 22nd, 29th' },
    { month: 'September 2026', dates: '5th, 12th, 19th, 26th' },
  ],
  hotelOptions: [
    '1 Person on 1 Bike: Rs. 37,900 Per Person',
    '2 Persons on 1 Bike: Rs. 28,900 Per Person',
    'Bring Your Own Bike (BYOB): Rs. 22,900 per person (Fuel not included)',
  ],
  keyHighlights: [
    'Explore Spiti Valley — one of India\'s most dramatic high-altitude desert landscapes.',
    'Ride through Jalori Pass, Chitkul (last Indian village), Tabo, Nako, Gue, and Dhankar.',
    'Visit Ki Monastery, Hikkim (world\'s highest post office), and Komik village.',
    'Cross Kunzum Pass and visit Chandratal Lake, Chicham Bridge, Kibber & Langza.',
    'Return via Atal Tunnel with deluxe hotels and Swiss camps with attached bathrooms.',
    'Experienced road captains, mechanics, and support staff throughout the ride.',
    'Complimentary Himalayan bike with fuel, permits, and Volvo transfers included.',
  ],
  shortItinerary: [
    { day: 1, title: 'Delhi to Kullu | Overnight Volvo Kullu' },
    { day: 2, title: 'Leisure Day' },
    { day: 3, title: 'Kullu to Sarahan Via Jalori Pass | Visit Bhimakali Temple (Bikes allotted today)' },
    { day: 4, title: 'Sarahan to Sangla | Explore Chitkul Village' },
    { day: 5, title: 'Sangla to Kaza | Via Tabo, Nako, Gue and Dhankar Village' },
    { day: 6, title: 'Kaza Local Sightseeing | Visit Ki, Hikkim, Komik' },
    { day: 7, title: 'Kaza to Chandratal Via Kunzum Pass | Visit Chicham Bridge, Kibber & Langza Village' },
    { day: 8, title: 'Chandratal to Manali | Via Atal Tunnel' },
    { day: 9, title: 'Manali to Delhi | Overnight Volvo' },
    { day: 10, title: 'Arrival in Delhi (Tour concludes after drop from the Volvo bus)' },
  ],
  itinerary: [
    {
      day: 1,
      title: 'Delhi to Kullu | Overnight Volvo Kullu',
      description: 'Board the overnight Volvo from Delhi to Kullu. Rest and prepare for the Spiti adventure ahead.',
    },
    {
      day: 2,
      title: 'Leisure Day',
      description: 'Arrive in Kullu and enjoy a leisure day to acclimatize and explore the surroundings at your own pace.',
    },
    {
      day: 3,
      title: 'Kullu to Sarahan Via Jalori Pass | Visit Bhimakali Temple',
      description: 'Bikes are allotted today. Ride from Kullu to Sarahan via the scenic Jalori Pass and visit the historic Bhimakali Temple. Overnight in Sarahan.',
    },
    {
      day: 4,
      title: 'Sarahan to Sangla | Explore Chitkul Village',
      description: 'Travel from Sarahan to Sangla and explore Chitkul — the last inhabited village near the Indo-Tibet border.',
    },
    {
      day: 5,
      title: 'Sangla to Kaza | Via Tabo, Nako, Gue and Dhankar Village',
      description: 'Ride through Tabo, Nako, Gue (mummy village), and Dhankar on the way to Kaza — the heart of Spiti Valley.',
    },
    {
      day: 6,
      title: 'Kaza Local Sightseeing | Visit Ki, Hikkim, Komik',
      description: 'Full day exploring Kaza and nearby villages — Ki Monastery, Hikkim (highest post office), and Komik (one of the highest villages in the world).',
    },
    {
      day: 7,
      title: 'Kaza to Chandratal Via Kunzum Pass',
      description: 'Ride to Chandratal Lake via Kunzum Pass. En route visit Chicham Bridge, Kibber, and Langza village with its iconic Buddha statue.',
    },
    {
      day: 8,
      title: 'Chandratal to Manali | Via Atal Tunnel',
      description: 'Descend from Chandratal to Manali through the world\'s longest highway tunnel — Atal Tunnel. Hand over bikes and overnight in Manali.',
    },
    {
      day: 9,
      title: 'Manali to Delhi | Overnight Volvo',
      description: 'Board the overnight Volvo from Manali to Delhi after a memorable Spiti expedition.',
    },
    {
      day: 10,
      title: 'Arrival in Delhi',
      description: 'Tour concludes after drop from the Volvo bus in Delhi.',
    },
  ],
  accommodation: [
    { city: 'Kullu', hotel: 'Meridian Camp', rooms: 'As per group', roomType: 'Camp / hotel', nights: '2 Nights' },
    { city: 'Sarahan', hotel: 'Vasu Mension / Negi Cottage', rooms: 'As per group', roomType: 'Deluxe hotel', nights: '1 Night' },
    { city: 'Sangla', hotel: 'MC Cottage / Parkash Regency / Baspa Camp', rooms: 'As per group', roomType: 'Deluxe hotel / camp', nights: '1 Night' },
    { city: 'Kaza', hotel: 'Zomsa Inn / Spiti Sarai / Spiti Monk', rooms: 'As per group', roomType: 'Deluxe hotel', nights: '2 Nights' },
    { city: 'Chandratal', hotel: 'Sakya Camp / Moonlake Lake', rooms: 'As per group', roomType: 'Swiss camp (attached washroom)', nights: '1 Night' },
    { city: 'Manali', hotel: 'Bodh International / Hill River View / River View Resort', rooms: 'As per group', roomType: 'Deluxe hotel', nights: '1 Night' },
  ],
  transportation: [
    {
      type: 'Overnight Volvo',
      vehicle: 'Luxury Semi-sleeper',
      description: 'Pre-booked Delhi to Kullu and Manali to Delhi Volvo seats.',
    },
    {
      type: 'Motorcycle',
      vehicle: 'Royal Enfield Himalayan',
      description: 'Himalayan bike with fuel from morning of Day 3 until Day 8. Backup vehicle for luggage and emergencies.',
    },
  ],
  inclusions: [
    {
      category: 'Inclusions',
      items: [
        'Stay on triple occupancy for 7 nights (Double occupancy for couples only).',
        'Buffet breakfast from Day 3 to Day 9 and buffet dinner served from Day 2 to Day 8.',
        'Bikes are provided from the morning of Day 3 until Day 8.',
        'Himalayan Bike with fuel as per the itinerary.',
        'Experienced Road Captains, Mechanics and Support Staff.',
        'Deluxe Hotels and Swiss Camps with attached bathrooms.',
        'Pre-booked Luxury Semi-sleeper Volvo seats for travellers from Delhi to Kullu and Manali to Delhi.',
        'Bike Permits and Inner Line Permits.',
      ],
    },
  ],
  exclusions: SHARED_EXCLUSIONS,
  packageNotes: SPITI_PACKAGE_NOTES,
  cancellationPolicy: SPITI_CANCELLATION_POLICY,
  reschedulingPolicy: SPITI_RESCHEDULING_POLICY,
  bookingPolicy: SPITI_BOOKING_POLICY,
  faqs: [],
  reviews: [],
};

const VIETNAM_PACKAGE_NOTES = [
  'You must have a valid International Two Wheeler Driving Licence for Motorcycle with Gear in Vietnam.',
  'Passport should have a minimum validity of 6 months from the date of arrival to Vietnam.',
  'Per motorbike Security deposit (refundable) of USD 250/- over and above the package cost.',
  'Provision to upgrade the motorbike upto 250 cc with extra cost (160 USD).',
  'No refund for unclaimed services.',
  'Indicative itinerary — may change due to any unforeseen circumstances.',
];

const VIETNAM_CANCELLATION_POLICY = [
  '45 days or earlier - full refund of the package cost only.',
  '44 to 30 days - INR 10,000/- will be deducted and balance will be refunded.',
  '29 to 15 days - 50% of the package cost only will be refunded.',
  '14 days or less - no refund.',
  'Full refund of the package cost only if the tour is cancelled by us.',
];

const VIETNAM_BOOKING_POLICY = [
  'Booking Amount: INR 10,000/-',
  'Balance to be paid 45 days prior to departure date (conversion rate to be considered at the time of payment).',
  'Bank Name: State Bank of India',
  'Current AC Number: 362 920 74 324',
  'Current AC Name: Touring Tours',
  'Branch Code: 08075',
  'Branch: Evershine Nagar, Malad West, Mumbai 400064, Maharashtra, India',
  'IFSC: SBIN0008075 (SBIN Zero Zero Zero Eight Zero Seven Five)',
  'Gpay/Phone Pay: 8988288221',
  'UPI: 8988288221@sbi',
  'Payment through credit card will attract 3% service fee.',
];

export const vietnamMotorbikeTourPackageData = {
  title: VIETNAM_MOTORBIKE_TOUR_TITLE,
  subtitle: '23rd December to 3rd January',
  ideaFor: 'International riders, adventure seekers, cultural explorers, couples and friends',
  about:
    'A 12-day all-inclusive Vietnam motorbike expedition through Hanoi, Mai Chau, Ta Xua, Mu Cang Chai, Sa Pa, Ha Giang, Dong Van, Ba Be Lake, and a 2D/1N Halong Bay cruise — with road marshal, mechanic, backup vehicle, and ethnic homestays.',
  services:
    '150cc rental motorbikes with fuel, road marshal, mechanic, backup vehicle, double-occupancy stays with breakfast, airport transfers, Halong Bay cruise, and packaged drinking water on riding days.',
  tourDetails:
    'Northern Vietnam motorbike tour from Hanoi through the country\'s most scenic highlands and border regions, ending with a luxury Halong Bay cruise before departure.',
  abstract:
    'Explore the stunning Northern and Eastern regions of Vietnam on the road less traveled — ethnic homestays, gourmet cuisine, and a memorable cruise finale.',
  tourOverview: 'Fixed Departure: 23 December – 3 January',
  price: 1250,
  duration: '11 Nights / 12 Days',
  location: 'Northern Vietnam',
  capacity: 'Group departure',
  packageType: 'international' as const,
  place: 'vietnam',
  packageCategory: 'Upcoming Tours',
  packageMiniCategory: '',
  isFeaturedTrip: false,
  isPopularPackage: false,
  isFeaturedDestination: false,
  bookings: 0,
  rating: 5,
  images: [
    {
      public_id: 'pkg-vietnam-motorbike',
      url: '/Nepal.webp',
      alt: 'Vietnam Motorbike Tour',
    },
  ],
  fixedDepartures: [
    { month: 'December – January', dates: '23rd December to 3rd January' },
  ],
  hotelOptions: [
    '1 Person on 1 Bike (Double Occupancy): $1,250',
    '1 Person on 1 Bike (Single Occupancy): $1,550',
    '2 People on 1 Bike (Double Occupancy): $2,050',
    'Per Person in Backup Vehicle (Double Occupancy): $950',
    'Per Person in Backup Vehicle (Single Occupancy): $1,250',
    'Self-Drive: Customizable on request',
  ],
  keyHighlights: [
    'Explore the stunning Northern and Eastern regions of Vietnam, taking the road less traveled.',
    'Visit border areas and engage with local ethnic communities for an authentic cultural experience.',
    'Experience the warmth of ethnic homestays combined with the comfort of well-appointed hotels.',
    'Enjoy an all-inclusive package that covers biking, fuel, accommodation, and sightseeing.',
    'Enjoy the company of a dedicated support team, including a mechanic, road marshal, and backup car.',
    'Savour gourmet traditional and ethnic cuisine, showcasing the rich culinary heritage of Vietnam.',
    'Tackle an easy-to-moderate itinerary, surrounded by breathtaking scenic beauty.',
    'Take advantage of incredible shopping opportunities in Hanoi and Sa Pa.',
    'Conclude your adventure in style with a 1-night, 2-day Halong Bay cruise.',
    'Experience a budget-friendly tour that creates unforgettable memories!',
  ],
  shortItinerary: [
    { day: 1, title: 'Home Country to Hanoi' },
    { day: 2, title: 'Hanoi to Mai Chau' },
    { day: 3, title: 'Mai Chau to Ta Xua' },
    { day: 4, title: 'Ta Xua to Mu Cang Chai' },
    { day: 5, title: 'Mu Cang Chai to Sa Pa' },
    { day: 6, title: 'Sa Pa to Ha Giang' },
    { day: 7, title: 'Ha Giang to Dong Van' },
    { day: 8, title: 'Dong Van to Ba Be Lake' },
    { day: 9, title: 'Ba Be Lake to Hanoi' },
    { day: 10, title: 'Hanoi to Halong Bay (2D/1N Cruise)' },
    { day: 11, title: 'Halong Bay to Hanoi (2D/1N Cruise)' },
    { day: 12, title: 'Hanoi to Home Country' },
  ],
  itinerary: [
    {
      day: 1,
      title: 'Hanoi International Airport to Hotel Transfer (29 kms, 50 mins)',
      description:
        'Arrival at Hanoi International Airport, pick up and transfer to the hotel. After check-in, meet fellow riders. Leisure time to explore the local market. In the evening, bikes are allotted with orientation from the guide and mechanic. Dinner at the hotel. Night stay in Hanoi.',
    },
    {
      day: 2,
      title: 'Hanoi to Mai Chau (140 kms, 5 hrs 30 mins)',
      description:
        'Breakfast at the hotel, then ride via Hoa Binh to Pu Luong (Bá Thước, Thanh Hoá). Lunch at a local restaurant. Ride through villages, paddy fields and rice terraces to Mai Chau. Dinner and overnight at Little Mai Chau Homestay.',
    },
    {
      day: 3,
      title: 'Mai Chau to Ta Xua (170 kms, 6 hrs)',
      description:
        'Visit Hang Kia and Pa Co village, ride to Moc Chau tea plantations. Lunch in Moc Chau. Ferry crossing at Van Yên and continue to Ta Xua Ecolodge for dinner and overnight.',
    },
    {
      day: 4,
      title: 'Ta Xua to Mu Cang Chai (165 kms, 6 hrs)',
      description:
        'Ride through scenic mountains to Tram Tau and Nghia Lo. Lunch and photos, then proceed to Mu Cang Chai. Overnight at Hello Mu Cang Chai with local music and dinner.',
    },
    {
      day: 5,
      title: 'Mu Cang Chai to Sa Pa (160 kms, 5 hrs 30 mins)',
      description:
        'Ride through Than Uyen, lunch at an ethnic dhaba, then up to Sa Pa heaven gate and Silver Waterfalls. Arrive in Sa Pa — famous for nightlife and cafés. Dinner and overnight in Sa Pa Hotel.',
    },
    {
      day: 6,
      title: 'Sa Pa to Ha Giang (240 kms, 6 hrs 30 mins)',
      description:
        'Ride down to Pho Rang and on to Ha Giang via Nghia Do, Quang Binh, and Viet Quang. Ha Giang is known for breathtaking mountains and ethnic villages. Dinner and overnight at Wings Bungalow, Ha Giang.',
    },
    {
      day: 7,
      title: 'Ha Giang to Dong Van (150 kms, 5 hrs)',
      description:
        'Ride to Quan Ba heaven\'s gate, Lung Tam village, Yen Minh, Sung La, Vương Palace, and Lung Cu flag pillar. Cross Ma Pi Leng Pass to Đồng Van near the China border. Dinner and overnight in Dong Van.',
    },
    {
      day: 8,
      title: 'Dong Van to Ba Be Lake (215 kms, 7 hrs)',
      description:
        'Last ride before Hanoi — through Mau Due, Du Gia, Bac Me with lunch. Continue to Ba Be Lakeside Bungalow overlooking the lake. Dinner and overnight.',
    },
    {
      day: 9,
      title: 'Ba Be to Hanoi (165 kms, 4 hrs 30 mins)',
      description:
        'Boat visit on Ba Be Lake, return to village and ride to Hanoi. Return motorbikes for inspection. Leisure evening to explore Hanoi nightlife. Overnight in Hanoi.',
    },
    {
      day: 10,
      title: 'Hanoi to Halong Bay Cruise Terminal (160 kms, 5 hrs 30 mins)',
      description:
        '2D/1N Halong Bay cruise begins. Stop at Pearl Museum, board cruise. Meals and activities included — hiking, cave walking, boating and kayaking. Night stay on cruise.',
    },
    {
      day: 11,
      title: 'Halong Bay Cruise Terminal to Hanoi Hotel (160 kms, 4 hrs)',
      description:
        'Cruise docks around 11:00 AM. Transfer to Hanoi hotel. Free day for souvenirs and exploration. Dinner and overnight in Hanoi.',
    },
    {
      day: 12,
      title: 'Hanoi Hotel to Hanoi Airport Transfer',
      description:
        'After breakfast, transfer to Hanoi International Airport for your return flight. Tour concludes. Packed breakfast provided for odd flight timings.',
    },
  ],
  accommodation: [
    { city: 'Hanoi', hotel: 'Hoi An Hotel', rooms: 'Double occupancy', roomType: 'Deluxe hotel', nights: '3 Nights' },
    { city: 'Mai Chau', hotel: 'Little Mai Chau Homestay', rooms: 'Double occupancy', roomType: 'Homestay', nights: '1 Night' },
    { city: 'Ta Xua', hotel: 'Ta Xua Ecolodge', rooms: 'Double occupancy', roomType: 'Ecolodge', nights: '1 Night' },
    { city: 'Mu Cang Chai', hotel: 'Hello Mu Cang Chai Homestay', rooms: 'Double occupancy', roomType: 'Homestay', nights: '1 Night' },
    { city: 'Sa Pa', hotel: 'Hotel Cha Pa Dew', rooms: 'Double occupancy', roomType: 'Deluxe hotel', nights: '1 Night' },
    { city: 'Ha Giang', hotel: 'Wings Bungalow', rooms: 'Double occupancy', roomType: 'Bungalow', nights: '1 Night' },
    { city: 'Dong Van', hotel: 'Hotel Dong Van', rooms: 'Double occupancy', roomType: 'Deluxe hotel', nights: '1 Night' },
    { city: 'Ba Be Lake', hotel: 'Ba Be Lakeside Bungalow', rooms: 'Double occupancy', roomType: 'Bungalow', nights: '1 Night' },
    { city: 'Halong Bay', hotel: 'Arcady Cruise', rooms: 'Double occupancy', roomType: '2D/1N Cruise', nights: '1 Night' },
  ],
  transportation: [
    {
      type: 'Motorcycle',
      vehicle: '150cc Rental Motorbike (upgrade to 250cc available)',
      description: 'Bikes with fuel for riding days. USD 250 refundable security deposit per bike.',
    },
    {
      type: 'Support',
      vehicle: 'Backup Vehicle + Road Marshal + Mechanic',
      description: 'Dedicated support team throughout the tour for safety and convenience.',
    },
    {
      type: 'Transfers',
      vehicle: 'Airport–Hotel + Cruise transfers',
      description: 'Airport pick-up and drop, Halong Bay cruise terminal transfers included.',
    },
  ],
  inclusions: [
    {
      category: 'Package Inclusions',
      items: [
        '150cc Rental motorbikes with fuel',
        'Road Marshal',
        'Mechanic for on-tour support',
        'Backup vehicle',
        'Stay on double occupancy with breakfast',
        'Packaged drinking water during riding days',
        'Airport - Hotel transfers',
        '1 Night 2 Days on Cruise and the transfers',
      ],
    },
  ],
  exclusions: [
    {
      category: 'Package Exclusions',
      items: [
        'Airfare',
        'Visa fees',
        'Lunch and Dinner',
        'Personal expenses like laundry, tips etc.',
        'Entry fees to monuments, museums, joy rides, and camera/videography equipment.',
        'Travel Insurance',
        'Any expenses arising out of unforeseen circumstances.',
        'Medical emergencies.',
        'Bike damage or spare parts',
      ],
    },
  ],
  packageNotes: VIETNAM_PACKAGE_NOTES,
  cancellationPolicy: VIETNAM_CANCELLATION_POLICY,
  reschedulingPolicy: [
    'Contact touringtours@yahoo.com for rescheduling requests.',
  ],
  bookingPolicy: VIETNAM_BOOKING_POLICY,
  faqs: [],
  reviews: [],
};

const RANN_KUTCH_TERMS = [
  'Riders must have a valid motorcycle license.',
  'The company is not liable for personal injuries or loss.',
  'Booking confirmation is subject to advance payment.',
  'All participants must sign a liability waiver before the ride.',
];

export const rannOfKutchMotorbikeTourPackageData = {
  title: RANN_OF_KUTCH_TOUR_TITLE,
  subtitle: '8 Days / 7 Nights',
  ideaFor: 'Adventure riders, heritage explorers, couples, friends, and motorcycle enthusiasts',
  about:
    'Embark on an epic motorbike adventure across the vast and mystical landscapes of Gujarat. From the bustling city of Ahmedabad to the ancient ruins of Dholavira and the surreal white sands of the Rann of Kutch, this journey blends heritage, adventure, and scenic riding routes. Experience the famous \'Road to Heaven,\' the cultural vibrance of Kutch villages, and the calm beaches of Mandvi before looping back to Ahmedabad.',
  services:
    '350cc Royal Enfield Classic with fuel, support vehicle, mechanic, guide, triple-sharing accommodation with breakfast and dinner, and Dhordo permits.',
  tourDetails:
    'Ahmedabad → Dholavira → Dhordo (White Rann) → Mandvi → Dhangadhra → Ahmedabad — blending heritage, adventure, and scenic riding routes across desert plains, salt flats, and coastal roads.',
  abstract:
    'Experience the famous Road to Heaven, UNESCO heritage Dholavira, the surreal White Rann, Kalo Dungar, Mandvi Beach, and authentic Kutchi culture on this 8-day Gujarat motorcycle expedition.',
  tourOverview:
    'Ahmedabad → Dholavira → Dhordo → Mandvi → Dhangadhra → Ahmedabad',
  price: 49999,
  duration: '7 Nights / 8 Days',
  location: 'Gujarat, India',
  capacity: 'Group departure',
  packageType: 'domestic' as const,
  place: 'rann-of-kutch',
  packageCategory: 'Upcoming Tours',
  packageMiniCategory: '',
  isFeaturedTrip: false,
  isPopularPackage: false,
  isFeaturedDestination: false,
  bookings: 0,
  rating: 4.9,
  images: [
    {
      public_id: 'pkg-rann-of-kutch',
      url: '/domestic-tour-packages-services.jpg',
      alt: 'Man sitting on a motorcycle on an empty coastal road under clear blue sky.',
    },
  ],
  fixedDepartures: [],
  hotelOptions: [
    '1 person on 1 bike on sharing room = Contact us',
    '2 persons on 1 bike on sharing room = Contact us',
    '1 person on 1 bike on single occupancy = Contact us',
    'SIC = Contact us',
  ],
  keyHighlights: [
    'Ride through the \'Road to Heaven\' – one of India\'s most scenic motorcycle routes.',
    'Explore the UNESCO World Heritage site of Dholavira.',
    'Witness the White Rann of Kutch in Dhordo – a breathtaking salt desert.',
    'Enjoy panoramic views from Kalo Dungar (Black Hill).',
    'Relax on Mandvi Beach and visit Vijay Vilas Palace.',
    'Experience authentic Kutchi culture, handicrafts, and cuisine.',
    'Ride across desert plains, salt flats, and coastal roads.',
  ],
  shortItinerary: [
    { day: 1, title: 'Arrival in Ahmedabad (Bike Allotment & Briefing)' },
    { day: 2, title: 'Ahmedabad → Dholavira via \'Road to Heaven\' (350 km / 7–8 hrs)' },
    { day: 3, title: 'Dholavira → Dhordo (250 km / 6 hrs)' },
    { day: 4, title: 'Dhordo (Local Ride to Kalo Dungar – Black Hill)' },
    { day: 5, title: 'Dhordo → Mandvi (280 km / 7 hrs)' },
    { day: 6, title: 'Mandvi → Dhangadhra (320 km / 7–8 hrs)' },
    { day: 7, title: 'Dhangadhra → Ahmedabad (150 km / 4 hrs)' },
    { day: 8, title: 'Ahmedabad – Tour Concludes After Breakfast' },
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Ahmedabad (Bike Allotment & Briefing)',
      description:
        'Arrive in Ahmedabad and check in at your hotel. After some rest, meet the Touring Tours team for motorcycle allotment, documentation, and a detailed ride briefing. Activities: Bike handover, safety session, local sightseeing optional (Sabarmati Ashram or Manek Chowk). Overnight: Ahmedabad.',
    },
    {
      day: 2,
      title: 'Ahmedabad → Dholavira via Road to Heaven (~350 km / 7–8 hrs)',
      description:
        'Begin your adventure early and ride northwest through the barren yet beautiful landscapes of the Little Rann of Kutch. The highlight is the famous "Road to Heaven", an endless straight road cutting through the salt desert. Activities: Scenic ride, photography stops. Overnight: Dholavira.',
    },
    {
      day: 3,
      title: 'Dholavira → Gorewali / White Rann of Kutch (~100 km / 3 hrs)',
      description:
        'Visit Dholavira archaeological site and fossil park in the morning. Ride across desert plains and salt marshes toward Dhordo. Arrive by late afternoon to witness the surreal sunset over the salt desert. Activities: Rann entry, sunset view, evening cultural program (seasonal). Overnight: Gorewali.',
    },
    {
      day: 4,
      title: 'Gorewali to Dhordo Local Ride (Kalo Dungar & Artisan Villages)',
      description:
        'Ride to Kalo Dungar (Black Hill), the highest point in Kutch, for panoramic views of the vast Rann. Visit Dattatreya Temple and artisan villages like Hodka or Nirona. Activities: Local sightseeing, shopping for handicrafts. Overnight: Gorewali.',
    },
    {
      day: 5,
      title: 'Gorewali → Mandvi (~280 km / 7 hrs)',
      description:
        'Leave the desert and head toward the Kutch coast. Reach Mandvi, famous for wooden shipbuilding yards and golden beaches. Activities: Visit Vijay Vilas Palace, Mandvi Beach, and shipbuilding yard. Overnight: Mandvi.',
    },
    {
      day: 6,
      title: 'Mandvi → Dhangadhra (~320 km / 7–8 hrs)',
      description:
        'Start early for a long scenic ride through the interiors of Gujarat. Experience village life, salt pans, and open highways. Activities: En-route photography, rural landscapes, relaxed evening. Overnight: Dhangadhra.',
    },
    {
      day: 7,
      title: 'Dhangadhra → Ahmedabad (~150 km / 4 hrs)',
      description:
        'Easy final leg back to Ahmedabad. Return bikes, share memories, and enjoy a farewell dinner with fellow riders. Activities: Ride debrief, group photo session, evening at leisure. Overnight: Ahmedabad.',
    },
    {
      day: 8,
      title: 'Departure from Ahmedabad',
      description:
        'Enjoy breakfast at the hotel before your departure. Tour concludes. Carry unforgettable memories of Gujarat\'s desert, coast, and culture.',
    },
  ],
  accommodation: [
    { city: 'Ahmedabad', hotel: 'Hotel Avelon or similar', rooms: 'Triple sharing', roomType: 'Deluxe hotel', nights: '2 Nights' },
    { city: 'Dholavira', hotel: 'Dholavira Tourism Resort or similar', rooms: 'Triple sharing', roomType: 'Resort', nights: '1 Night' },
    { city: 'Gorewali', hotel: 'Rannkandi Resort or similar', rooms: 'Triple sharing', roomType: 'Resort', nights: '2 Nights' },
    { city: 'Mandvi', hotel: 'HV Beach Resort or similar', rooms: 'Triple sharing', roomType: 'Beach resort', nights: '1 Night' },
    { city: 'Dhangadhra', hotel: 'Hotel Blue Star or similar', rooms: 'Triple sharing', roomType: 'Deluxe hotel', nights: '1 Night' },
  ],
  transportation: [
    {
      type: 'Motorcycle',
      vehicle: '350cc Royal Enfield Classic',
      description: 'Provided with fuel for the tour. Valid motorcycle license required.',
    },
    {
      type: 'Support',
      vehicle: 'Support Vehicle + Mechanic + Guide',
      description: 'Dedicated backup and on-tour mechanical support throughout the ride.',
    },
  ],
  inclusions: [
    {
      category: 'Inclusions',
      items: [
        'Accommodation on triple sharing',
        'Daily breakfast and dinner',
        'Support vehicle, mechanic, and guide',
        '350 cc Royal Enfield Classic with fuel',
        'Permit at Dhordo',
      ],
    },
  ],
  exclusions: [
    {
      category: 'Exclusions',
      items: [
        'Personal expenses like laundry, tips etc.',
        'Lunch',
        'Travel and medical insurance',
        'Any expenses arising out of de touring / medical emergency / weather',
        'Air fare / Train',
        'Airport Transfers',
      ],
    },
  ],
  packageNotes: RANN_KUTCH_TERMS,
  cancellationPolicy: [
    'Booking confirmation is subject to advance payment.',
    'Contact touringtours@yahoo.com for cancellation terms.',
  ],
  reschedulingPolicy: [
    'Contact touringtours@yahoo.com for rescheduling requests.',
  ],
  bookingPolicy: [
    'Booking confirmation is subject to advance payment.',
    'All participants must sign a liability waiver before the ride.',
    'Contact us for package pricing.',
  ],
  faqs: [],
  reviews: [],
};

export const bhutanMotorbikeTourPackageData = {
  title: BHUTAN_MOTORBIKE_TOUR_TITLE,
  subtitle: 'Fixed Departure Dates — 6 Nights / 7 Days',
  ideaFor: 'Intermediate riders, adventure seekers, cultural explorers, couples, and friends',
  about:
    'Embark on an unforgettable motorbike journey through the mystical Kingdom of Bhutan — the Land of the Thunder Dragon. "Bhutan: Discover Happiness, one mile at a time" takes you across lush valleys, high mountain passes, and centuries-old monasteries, offering a perfect mix of adventure, culture, and tranquillity. Ride through serene Himalayan landscapes, experience the warmth of Bhutanese hospitality, and visit iconic landmarks like the Dochula Pass, Punakha Dzong, and the sacred Tiger\'s Nest Monastery. This week-long adventure begins at Bagdogra and weaves through Bhutan\'s most scenic and spiritual destinations before returning via Siliguri — leaving you with memories of open roads, breathtaking views, and the true essence of happiness.',
  services:
    'Royal Enfield Himalayan / Classic with fuel, twin/triple-sharing accommodation with breakfast and dinner, support vehicle, road captain, mechanic, Bhutan permits & road tax (SDF for Indian nationals), licensed local guide, first aid kit, and airport transfers.',
  tourDetails:
    'Bagdogra → Phuentsholing → Thimphu → Punakha → Paro → Siliguri — a guided cross-border Bhutan motorcycle expedition with Tiger\'s Nest visit and seamless border formalities.',
  abstract:
    'Ride across the Land of Happiness through Dochula Pass, Punakha Dzong, and Tiger\'s Nest — a balanced week-long adventure ideal for intermediate riders.',
  tourOverview: 'Bagdogra → Phuentsholing → Thimphu → Punakha → Paro → Siliguri',
  price: 69000,
  duration: '6 Nights / 7 Days',
  location: 'Bhutan (ex Bagdogra / Siliguri)',
  capacity: 'Group departure',
  packageType: 'international' as const,
  place: 'bhutan',
  packageCategory: 'Upcoming Tours',
  packageMiniCategory: '',
  isFeaturedTrip: false,
  isPopularPackage: false,
  isFeaturedDestination: false,
  bookings: 0,
  rating: 4.9,
  images: [
    {
      public_id: 'pkg-bhutan-motorbike',
      url: '/bhutan-travel-guide.webp',
      alt: 'Bhutan Motorbike Tour ex Bagdogra',
    },
  ],
  fixedDepartures: [
    { month: 'November 2025', dates: '24th (Monday)' },
    { month: 'March 2026', dates: '9th (Monday)' },
    { month: 'April 2026', dates: '6th (Monday)' },
    { month: 'May 2026', dates: '4th (Monday)' },
  ],
  hotelOptions: [
    '1 Person on 1 Bike in Triple Sharing Room = ₹69,000/- per person',
    '1 Person on 1 Bike in Single Occupancy = ₹80,000/- per person',
    '2 Persons on 1 Bike in Sharing Room = ₹1,15,500/- for 2 people',
    'SIC Per person in sharing room = ₹53,500/-',
    'SIC Per Person in Single Room = ₹62,500/-',
  ],
  keyHighlights: [
    'Ride Across the Land of Happiness: Experience Bhutan\'s serene beauty and rich Buddhist heritage on two wheels.',
    'Conquer Scenic Mountain Passes: Cruise through lush valleys and the breathtaking Dochula Pass (3,100 m) with panoramic Himalayan views.',
    'Visit Bhutan\'s Iconic Monuments: Explore Punakha Dzong, Thimphu\'s Buddha Point, and the legendary Tiger\'s Nest Monastery perched on a cliff.',
    'Cultural Immersion: Interact with locals, visit traditional markets, and experience the slow-paced, peaceful Bhutanese lifestyle.',
    'Unforgettable Roads: Smooth tarmac, winding curves, and low traffic make Bhutan a rider\'s paradise.',
    'Balanced Adventure: Perfect mix of riding, exploration, and relaxation — ideal for intermediate riders.',
    'Seamless Cross-Border Experience: Start and end your journey conveniently from Bagdogra / Siliguri, with guided border formalities.',
  ],
  shortItinerary: [
    { day: 1, title: 'Arrival at Bagdogra → Drive to Phuentsholing' },
    { day: 2, title: 'Phuentsholing → Thimphu' },
    { day: 3, title: 'Thimphu → Punakha via Dochula Pass' },
    { day: 4, title: 'Punakha → Paro' },
    { day: 5, title: 'Paro → Tiger\'s Nest → Paro' },
    { day: 6, title: 'Paro → Siliguri' },
    { day: 7, title: 'Departure from Siliguri' },
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival to Bagdogra → Phuentsholing (by car)',
      description:
        'Arrive at Bagdogra Airport and drive to the Bhutan border town of Phuentsholing. Complete immigration formalities and relax before the adventure begins. In the evening, you will be allotted bikes and briefed about the itinerary. Overnight: Phuentsholing.',
    },
    {
      day: 2,
      title: 'Phuentsholing → Thimphu',
      description:
        'Your ride begins! Climb from the foothills into the serene valleys of Bhutan. Winding mountain roads, lush forests, and cool air mark your entry into the Land of Happiness. We stop for a brief visit to the regional road tax office and do some formalities. Overnight in Thimphu.',
    },
    {
      day: 3,
      title: 'Thimphu → Punakha via Dochula Pass',
      description:
        'Ride across the stunning Dochula Pass (3,100 m), with panoramic views of the snow-capped Himalayas. Descend into the warm Punakha Valley, visit Punakha Dzong — one of Bhutan\'s most beautiful fortresses. Overnight in Punakha.',
    },
    {
      day: 4,
      title: 'Punakha → Paro',
      description:
        'A scenic return ride through rural villages and valleys, reaching Paro by evening. Enjoy Bhutan\'s laid-back charm and traditional architecture. Overnight in Paro.',
    },
    {
      day: 5,
      title: 'Paro → Tiger\'s Nest → Paro',
      description:
        'Transfer in a car to the base of the Taktsang Monastery (Tiger\'s Nest) — Bhutan\'s iconic cliffside temple. A day of reflection, culture, and stunning vistas. We hike the entire stretch and spend a worthy whole day. Overnight in Paro.',
    },
    {
      day: 6,
      title: 'Paro → Siliguri',
      description:
        'Begin your descent back toward India. Ride through winding roads, crossing the border at Phuentsholing, returning your bikes today and continue to Siliguri in a car. Celebrate the end of your adventure.',
    },
    {
      day: 7,
      title: 'Siliguri → Hometown',
      description:
        'Depart for your hometown with memories of breathtaking landscapes and the peaceful spirit of Bhutan. Tour concludes.',
    },
  ],
  accommodation: [
    { city: 'Phuentsholing', hotel: 'Carefully selected hotel or guesthouse', rooms: 'Twin/Triple sharing', roomType: 'Hotel / Guesthouse', nights: '1 Night' },
    { city: 'Thimphu', hotel: 'Carefully selected hotel or guesthouse', rooms: 'Twin/Triple sharing', roomType: 'Hotel / Guesthouse', nights: '1 Night' },
    { city: 'Punakha', hotel: 'Carefully selected hotel or guesthouse', rooms: 'Twin/Triple sharing', roomType: 'Hotel / Guesthouse', nights: '1 Night' },
    { city: 'Paro', hotel: 'Carefully selected hotel or guesthouse', rooms: 'Twin/Triple sharing', roomType: 'Hotel / Guesthouse', nights: '2 Nights' },
    { city: 'Siliguri', hotel: 'Carefully selected hotel or guesthouse', rooms: 'Twin/Triple sharing', roomType: 'Hotel / Guesthouse', nights: '1 Night' },
  ],
  transportation: [
    {
      type: 'Motorcycle',
      vehicle: 'Royal Enfield Himalayan / Classic',
      description: 'Well-maintained bikes with fuel for the riding days as per itinerary. Security deposit applicable (refundable).',
    },
    {
      type: 'Support',
      vehicle: 'Support Vehicle + Road Captain + Mechanic',
      description: 'Backup vehicle for luggage, spares, and non-riders throughout the journey.',
    },
    {
      type: 'Transfer',
      vehicle: 'Car transfers',
      description: 'Bagdogra Airport to Phuentsholing on Day 1; Phuentsholing border to Siliguri on Day 6; Tiger\'s Nest base transfer on Day 5.',
    },
  ],
  inclusions: [
    {
      category: 'Inclusions',
      items: [
        'Accommodation: Twin/Triple-sharing rooms in carefully selected hotels and guesthouses',
        'Meals: Daily breakfast and dinner (as per itinerary)',
        'Motorcycles: Well-maintained Royal Enfield Himalayan / Classic (as per availability)',
        'Fuel: For the entire duration of the tour (for the itinerary mentioned)',
        'Support Vehicle: Backup vehicle for luggage, spares, and non-riders',
        'Experienced Road Captain & Mechanic: Throughout the journey',
        'Bhutan Permits & Road Tax: Including SDF as per the itinerary (for Indian nationals)',
        'Local Guide: Licensed Bhutanese guide for sightseeing and coordination',
        'First Aid Kit: With basic medical assistance during the ride',
        'Airport Transfers: Pickup from Bagdogra Airport and drop at Siliguri',
      ],
    },
  ],
  exclusions: [
    {
      category: 'Exclusions',
      items: [
        'Airfare or train tickets to and from Bagdogra / Siliguri',
        'Lunches and beverages during the ride',
        'Personal expenses: laundry, telephone, room service, tips, etc.',
        'Motorbike security deposit (refundable)',
        'Riding gear (helmet, jacket, gloves, knee guards, etc.)',
        'Travel insurance / medical insurance',
        'Any costs arising from unforeseen circumstances such as landslides, roadblocks, or flight delays',
        'Anything not mentioned under Inclusions',
      ],
    },
  ],
  packageNotes: [
    'Riders must have a valid motorcycle license.',
    'Bhutan permits and SDF included for Indian nationals as per itinerary.',
    'Motorbike security deposit is refundable on completion of the tour.',
    'Riding gear is not included — guests should carry their own helmet, jacket, gloves, and knee guards.',
  ],
  cancellationPolicy: [
    'Contact touringtours@yahoo.com for cancellation terms.',
  ],
  reschedulingPolicy: [
    'Contact touringtours@yahoo.com for rescheduling requests.',
  ],
  bookingPolicy: [
    'Booking confirmation is subject to advance payment.',
    'Contact us for detailed payment schedule and booking terms.',
  ],
  faqs: [],
  reviews: [],
};

/** @deprecated use umlingLa6N7DPackageData */
export const umlingLaPackageData = umlingLa6N7DPackageData;

export const upcomingToursPackageSeedData = [
  umlingLa6N7DPackageData,
  umlingLa7N8DPackageData,
  delhiManaliLeh12DPackageData,
  spitiExperiencePackageData,
  vietnamMotorbikeTourPackageData,
  rannOfKutchMotorbikeTourPackageData,
  bhutanMotorbikeTourPackageData,
];
