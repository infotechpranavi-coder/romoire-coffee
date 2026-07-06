import { SITE_NAME } from '@/lib/branding';
import { COFFEE_IMAGES } from '@/lib/coffeeImages';

export interface Destination {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type?: 'package' | 'tour' | 'ticket';
}

export interface Trip {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  link: string;
  type?: 'package' | 'tour' | 'ticket';
}

export interface Package {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  image: string;
  link: string;
  type?: 'package' | 'tour' | 'ticket';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const destinations: Destination[] = [
  {
    id: '1',
    title: 'Ethiopian Yirgacheffe',
    subtitle: 'Floral, bergamot, and bright citrus notes',
    image: COFFEE_IMAGES.beans,
    link: '/packages/category/ethiopian-yirgacheffe',
    type: 'package',
  },
  {
    id: '2',
    title: 'Colombian Supremo',
    subtitle: 'Caramel sweetness with a smooth chocolate body',
    image: COFFEE_IMAGES.beansDark,
    link: '/packages/category/colombian-supremo',
    type: 'package',
  },
  {
    id: '3',
    title: 'Kenyan AA',
    subtitle: 'Bold blackcurrant and wine-like complexity',
    image: COFFEE_IMAGES.cup,
    link: '/packages/category/kenyan-aa',
    type: 'package',
  },
  {
    id: '4',
    title: 'House Blend',
    subtitle: `${SITE_NAME}'s signature everyday roast`,
    image: COFFEE_IMAGES.pour,
    link: '/packages/category/house-blend',
    type: 'package',
  },
];

export const upcomingTrips: Trip[] = [
  {
    id: '1',
    title: 'Limited Edition Microlot',
    location: 'Guatemala',
    price: 'from $18',
    image: COFFEE_IMAGES.beans,
    link: '/packages',
    type: 'package',
  },
  {
    id: '2',
    title: 'Cold Brew Blend',
    location: 'Seasonal Release',
    price: 'from $16',
    image: COFFEE_IMAGES.coldBrew,
    link: '/packages',
    type: 'package',
  },
  {
    id: '3',
    title: 'Espresso Roast',
    location: 'Fresh Weekly',
    price: 'from $15',
    image: COFFEE_IMAGES.espresso,
    link: '/packages',
    type: 'package',
  },
];

export const popularPackages: Package[] = [
  {
    id: '1',
    title: 'Ethiopian Yirgacheffe',
    subtitle: 'Washed process · Light-Medium roast',
    duration: '250g / 500g / 1kg',
    price: '$18',
    image: COFFEE_IMAGES.beans,
    link: '/packages',
    type: 'package',
  },
  {
    id: '2',
    title: 'Colombian Supremo',
    subtitle: 'Medium roast · Whole bean',
    duration: '250g / 500g / 1kg',
    price: '$16',
    image: COFFEE_IMAGES.beansDark,
    link: '/packages',
    type: 'package',
  },
  {
    id: '3',
    title: 'Dark Roast Reserve',
    subtitle: 'Bold chocolate · Full body',
    duration: '250g / 500g / 1kg',
    price: '$15',
    image: COFFEE_IMAGES.latte,
    link: '/packages',
    type: 'package',
  },
  {
    id: '4',
    title: 'Signature Blend',
    subtitle: 'Balanced · Pour-over & drip',
    duration: '250g / 500g / 1kg',
    price: '$17',
    image: COFFEE_IMAGES.brew,
    link: '/packages',
    type: 'package',
  },
  {
    id: '5',
    title: 'Espresso Roast',
    subtitle: 'Dense crema · Moka & espresso',
    duration: '250g / 500g / 1kg',
    price: '$16',
    image: COFFEE_IMAGES.espresso,
    link: '/packages',
    type: 'package',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Olivia Mitchell',
    role: 'Home Barista',
    quote: `The Ethiopian Yirgacheffe from ${SITE_NAME} is incredible — bright, floral, and always roasted fresh. It's become my daily pour-over.`,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'James Wilson',
    role: 'Café Owner',
    quote: 'We switched our house espresso to Romoire\'s Brazilian Santos blend. Our customers notice the difference — richer crema and a cleaner finish.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Sophia Chen',
    role: 'Coffee Enthusiast',
    quote: `The monthly subscription keeps my pantry stocked with rotating single origins. ${SITE_NAME} nails consistency batch after batch.`,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    role: 'Food Writer',
    quote: 'Finally a roaster that lists origin, process, and roast date on every bag. Transparency you can taste in the cup.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    role: 'Marketing Lead',
    quote: 'Ordered gift sets for our team — beautiful packaging and the beans arrived within days of roasting. Will order again.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    name: 'David Park',
    role: 'Software Engineer',
    quote: 'The cold brew blend is my summer staple. Smooth, chocolatey, and never bitter — even after 18 hours in the fridge.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
];

export const exploreInclusions = [
  'Freshly roasted to order',
  'Whole bean or ground options',
  'Free shipping over $50',
  'Roast date on every bag',
  'Ethically sourced beans',
  'Brewing guides included',
  'Flexible subscriptions',
];
