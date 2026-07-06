'use client'

import { useState, useEffect } from "react";
import { Playfair_Display, Cormorant_Garamond, Poppins } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Users, Star, Calendar, Phone, Mail, ArrowLeft,
  CheckCircle, Plane, Camera, Globe, Heart, Share, Car, Hotel,
  Utensils, Info, X, Car as CarIcon, Building, Bed, Award,
  Package as PackageIcon,
  Calendar as CalendarIcon, ChevronRight, PlayCircle, Sparkles, ShieldCheck, Ticket, ArrowRight, XCircle, MessageCircle, MessageSquare,
  LayoutDashboard,
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME, brandedText } from "@/lib/branding";
import { getCategoryByValue } from "@/lib/packageExperienceCategories";
import { useInquiryForm } from "@/contexts/InquiryFormContext";
import TourPackageSections from "@/components/TourPackageSections";
import type { PackageData } from "@/lib/types";

// Utility function to render text with bold formatting
const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-gray-900">{boldText}</strong>;
    }
    return part;
  });
};

interface Package {
  _id: string;
  title: string;
  subtitle: string;
  ideaFor?: string;
  about: string;
  services: string[] | string;
  tourDetails: string;
  abstract?: string;
  tourOverview?: string;
  keyHighlights?: string[];
  hotelOptions?: string[];
  bestTimeToVisit?: {
    yearRound?: string;
    winter?: string;
    summer?: string;
  };
  whyChooseThisTrip?: string[];
  whyPremiumSkygoTours?: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }> | [];
  transportation: Array<{
    type: string;
    vehicle: string;
    description: string;
  }> | [];
  accommodation: Array<{
    city: string;
    hotel: string;
    rooms: string;
    roomType: string;
    nights: string;
  }> | [];
  inclusions?: string[] | Array<{ category: string; items: string[] }>;
  exclusions?: string[] | Array<{ category: string; items: string[] }>;
  reviews?: Array<{
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  price: number;
  duration: string;
  location: string;
  capacity: string;
  packageType: 'domestic' | 'international';
  place: string;
  packageCategory?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  images: Array<{
    public_id?: string;
    url: string;
    alt: string;
  }>;
  bookings: number;
  rating: number;
}

const PackageDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'policy'>('overview');

  const extractIdFromSlug = (slug: string | string[] | undefined) => {
    if (!slug) return '';
    const slugStr = Array.isArray(slug) ? slug[0] : slug;
    const parts = slugStr.split('-');
    const lastPart = parts[parts.length - 1];
    if (/^[0-9a-fA-F]{24}$/.test(lastPart)) {
      return lastPart;
    }
    return slugStr;
  };

  useEffect(() => {
    const fetchPackage = async () => {
      const actualId = extractIdFromSlug(params?.id);
      if (!actualId) return;

      // Skip API fetch for demo packages (handled by second useEffect)
      // Attraction packages (like burj-khalifa-tickets) should always fetch from API
      const demoPageIds = ['demo-package-id', '1', '2', '3', '4', '5'];
      const isAttractionPackage = actualId.includes('ticket') || actualId.includes('attraction') || actualId === 'burj-khalifa-tickets';

      if (!isAttractionPackage && demoPageIds.includes(actualId)) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Always fetch from API for attraction packages
        const response = await fetch(`/api/packages/${actualId}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Transform images if needed
          const transformedData = {
            ...result.data,
            images: result.data.images?.map((img: any) => ({
              url: img.url || img.public_id,
              alt: img.alt || result.data.title,
              public_id: img.public_id
            })) || []
          };
          setPackageData(transformedData);
        } else {
          // For attraction packages, show error if not found (no fallback)
          if (isAttractionPackage) {
            setError('Attraction package not found. Please check the package ID or contact support.');
          } else {
            setError('Package not found');
          }
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        // For attraction packages, show specific error message
        if (isAttractionPackage) {
          setError('Failed to load attraction package details. Please try again or contact support.');
        } else {
          setError('Failed to load package details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params?.id]);

  // Keep old hardcoded data as fallback for demo (only for specific demo IDs)
  // Attraction packages should NEVER use hardcoded data - only API data
  useEffect(() => {
    const actualId = extractIdFromSlug(params?.id);
    if (!actualId) return;

    // Skip hardcoded data for attraction packages - they must use API data only
    const isAttractionPackage = actualId.includes('ticket') || actualId.includes('attraction') || actualId === 'burj-khalifa-tickets';
    if (isAttractionPackage) {
      return; // Don't set any hardcoded data for attraction packages
    }

    // Only set hardcoded data for specific demo IDs used on the homepage
    const demoPageIds = ['demo-package-id', '1', '2', '3', '4', '5'];
    if (demoPageIds.includes(actualId)) {
      // Set hardcoded demo data
      setPackageData({
        _id: 'demo-package-id',
        title: 'Royal Cape Town Experience',
        subtitle: 'Luxury Wildlife & City Tour',
        about: 'Experience the ultimate luxury in Cape Town with our premium package including 5-star accommodation, private wildlife safari, and VIP access to Table Mountain.',
        services: ['5-Star Hotel', 'Private Transfer', 'Guide', 'All Meals'],
        tourDetails: 'A comprehensive 5-day tour of Cape Town.',
        itinerary: [
          { day: 1, title: 'Arrival in Style', description: 'Private transfer to The Silo Hotel. Welcome dinner at V&A Waterfront.' },
          { day: 2, title: 'Modern Cape Town', description: 'VIP tour of Table Mountain. Shopping at V&A Waterfront Mall. Harbour cruise.' },
          { day: 3, title: 'Wild Safari', description: 'Luxury private safari with dinner under the stars.' },
          { day: 4, title: 'Cultural Heritage', description: 'Visit Bo-Kaap. Scenic drive along Chapman\'s Peak.' },
          { day: 5, title: 'Departure', description: 'Leisure time before private transfer to airport.' }
        ],
        price: 15500,
        duration: '5 Days',
        location: 'Cape Town',
        capacity: '2 - 4 People',
        packageType: 'domestic',
        place: 'Cape Town',
        images: [
          { url: '/domestic-tour-packages-services.jpg', alt: 'Royal Dubai Experience' },
          { url: '/slider-image-2.jpeg', alt: 'Burj Al Arab' },
          { url: '/slider-image-3.jpg', alt: 'Desert Safari' }
        ],
        bookings: 128,
        rating: 4.9,
        inclusions: ['5N Accommodation', 'Breakfast & Dinner', 'Airport Transfers', 'All Entry Tickets'],
        exclusions: ['Flight Tickets', 'Personal Expenses', 'Lunch'],
        transportation: [
          { type: 'Transfers', vehicle: 'Luxury Sedan', description: 'Airport and inter-hotel transfers' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'The Silo Hotel', rooms: '1', roomType: 'Ocean Queen', nights: '5' }
        ],
        reviews: [
          { name: "John Doe", rating: 5, comment: "Absolutely stunning experience! The service was impeccable.", date: "2024-01-15" }
        ]
      } as any); // Cast to any to bypass strict literal type check for 'place' if it mismatches
      setLoading(false);
    } else if (actualId === 'premium-dubai-tours-default') {
      // Set Dubai Signature Private Escape premium package data
      setPackageData({
        _id: 'premium-dubai-tours-default',
        title: 'Cape Town Signature Private Escape',
        subtitle: '3 Nights / 4 Days Premium Private Tour Package',
        about: 'The Cape Town Signature Private Escape is a carefully crafted premium short-stay itinerary designed for travelers who want to experience Cape Town in comfort, privacy, and style.',
        services: [
          'Fully private airport transfers and sightseeing',
          'Exclusive private yacht dinner cruise at V&A Waterfront',
          'Personalized Cape Town city tour (Old & New Cape Town)',
          'Morning private wildlife safari experience',
          'Luxury 1-hour limousine ride',
          'Optional access to Table Mountain, Zeitz MOCAA & Robben Island',
          'Flexible hotel options or no-hotel package available'
        ],
        tourDetails: `Abstract

The Cape Town Signature Private Escape is a carefully crafted premium short-stay itinerary designed for travelers who want to experience Cape Town in comfort, privacy, and style. This tour blends iconic city landmarks, exclusive experiences, and relaxed pacing, making it ideal for families, honeymoon couples, and small groups who prefer private services over crowded group tours.

From a private yacht dinner at V&A Waterfront to a personalized city tour, wildlife safari, and luxury limousine ride, this package focuses on meaningful experiences rather than rushed sightseeing. Every element is customizable, allowing travelers to shape the journey according to their preferences, travel pace, and budget.

Tour Overview

Cape Town is a city best experienced with thoughtful planning, especially for travelers seeking privacy and flexibility. The Cape Town Signature Private Escape has been designed as an entry-level premium package that introduces Cape Town’s highlights while maintaining a relaxed and elegant flow.

Unlike regular group tours, this itinerary operates entirely on a private basis, ensuring personalized attention, flexible timing, and a stress-free experience. Guests travel in a private vehicle with professional drivers and dedicated coordination support throughout the trip.

The itinerary begins with a warm welcome at the airport, followed by a scenic private yacht dinner cruise, setting the tone for a refined Cape Town experience. A full private city tour allows guests to explore both modern and traditional Cape Town at their own pace, while optional attraction tickets are arranged only after confirming the number of travelers, ensuring transparency and fair pricing.

A morning wildlife safari, scheduled to avoid peak heat, offers a serene natural experience ideal for families and first-time visitors. The journey concludes with luxury touches such as a chauffeur-driven limousine ride and optional access to Cape Town’s iconic Robben Island.

This package is perfect for travelers who want quality over quantity, privacy over crowds, and flexibility over fixed schedules.

Key Highlights

• Fully private airport transfers and sightseeing
• Exclusive private yacht dinner cruise at V&A Waterfront
• Personalized Cape Town city tour (Old & New Cape Town)
• Morning private wildlife safari experience
• Luxury 1-hour limousine ride
• Optional access to Table Mountain, Zeitz MOCAA & Robben Island
• Flexible hotel options or no-hotel package available

Best Time to Visit

Cape Town is a year-round destination, and this package is designed accordingly.

• October to April: Pleasant weather, ideal for outdoor sightseeing
• May to September: More affordable pricing; activities are planned indoors or during cooler morning and evening hours

Summer travelers benefit from reduced hotel rates and fewer crowds, making this package especially attractive for budget-conscious premium travelers.

Why Choose This Trip?

• Ideal length for a premium Cape Town introduction
• Designed for travelers who value privacy and comfort
• No forced shopping stops or shared transportation
• Perfect for families, couples, and honeymooners
• Customizable activities and flexible scheduling

Why ${SITE_NAME} for This Trip?

At ${SITE_NAME}, luxury is not about exaggeration; it's about execution, reliability, and transparency.

• Private-first approach: No shared vehicles or rushed group schedules
• Per-vehicle pricing: Better value for families and small groups
• Custom planning: Tours adjusted based on guest preferences
• Local expertise: On-ground coordination and experienced staff
• Honest pricing: Attraction tickets arranged only after confirmation

We focus on delivering smooth, well-managed journeys rather than selling oversized promises.`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Cape Town & Private Yacht Dinner Cruise',
            description: 'Upon arrival at Cape Town International Airport, you will be greeted by our representative and transferred to your hotel in a private vehicle (if accommodation is selected). In the evening, experience a private yacht dinner cruise at V&A Waterfront, sailing through the illuminated skyline while enjoying a relaxed onboard dining experience. Overnight: Cape Town.'
          },
          {
            day: 2,
            title: 'Private Cape Town City Tour',
            description: 'After breakfast, begin a private guided city tour covering Cape Town’s cultural and contemporary highlights. Visit Bo-Kaap heritage areas, Company\'s Garden, Table Mountain (photo stop), V&A Waterfront Mall, and enjoy optional visits to Table Mountain Aerial Cableway and Two Oceans Aquarium. The tour runs at a comfortable pace with time for exploration, photography, and breaks. Overnight: Cape Town.'
          },
          {
            day: 3,
            title: 'Morning Wildlife Safari & Evening Luxury Experience',
            description: 'Start early for a private morning wildlife safari featuring game viewing and scenic natural views in a calm environment, ideal for families and travelers avoiding late-night safaris. In the evening, enjoy a 1-hour private limousine ride, followed by an optional visit to Table Mountain for panoramic city sunset views. Overnight: Cape Town.'
          },
          {
            day: 4,
            title: 'Departure',
            description: 'After breakfast, enjoy a private transfer to Cape Town International Airport for departure.'
          }
        ],
        price: 0,
        duration: '3 Nights / 4 Days',
        location: 'Cape Town, South Africa',
        capacity: 'Up to 6 guests per vehicle',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Skyline' },
          { url: 'https://images.unsplash.com/photo-1576675466200-349f9661136b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Table Mountain' },
          { url: 'https://images.unsplash.com/photo-1547506158-29bb9c50fc06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'V&A Waterfront' },
          { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Wildlife Safari' }
        ],
        bookings: 0,
        rating: 5,
        inclusions: [
          'Private airport and hotel transfers',
          'All sightseeing tours on a private basis',
          'Private yacht dinner cruise',
          'Private wildlife safari experience',
          'Private limousine ride',
          'Daily breakfast (if hotel option selected)',
          'Staff salaries, government taxes, and operational expenses'
        ],
        exclusions: [
          'International airfare (assistance available on request)',
          'South Africa entry visa (assistance available on request)',
          'Attraction tickets (Table Mountain, Two Oceans Aquarium)',
          'Personal expenses (meals, shopping, insurance, etc.)',
          'Tourism levies and staff tips (if applicable)'
        ],
        transportation: [
          { type: 'Private Vehicle', vehicle: 'Luxury Sedan/SUV/Van', description: 'Private vehicle-based tours (up to 6 guests per vehicle). Other vehicles available for larger groups.' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'Without hotel / 4-star / 5-star options', rooms: 'As per requirement', roomType: 'No hotel / 4-star / 5-star', nights: '3 Nights' }
        ],
        reviews: [
          { name: 'Anna Roberts', rating: 5, comment: 'Perfect private escape for our anniversary. The yacht cruise and limousine ride were unforgettable.', date: '2024-02-18' },
          { name: 'Khalid Ahmad', rating: 5, comment: 'Ideal for our family. Fully private, flexible timing, and excellent coordination.', date: '2024-03-02' }
        ],
        packageCategory: 'premium',
        bestTimeToVisit: {
          yearRound: 'Cape Town is a year-round destination, and this package is designed accordingly.',
          winter: 'April to September: Cooler weather, ideal for scenic drives and museums.',
          summer: 'October to March: Pleasant weather with activities planned outdoors or during cooler morning and evening hours. Summer travelers benefit from vibrant city life.'
        },
        whyChooseThisTrip: [
          'Ideal length for a premium Cape Town introduction',
          'Designed for travelers who value privacy and comfort',
          'No forced shopping stops or shared transportation',
          'Perfect for families, couples, and honeymooners',
          'Customizable activities and flexible scheduling'
        ],
        whyPremiumSkygoTours: [
          'Private-first approach with no shared vehicles or rushed group schedules',
          'Per-vehicle pricing that offers better value for families and small groups',
          'Custom planning with tours adjusted based on guest preferences',
          'Local expertise with on-ground coordination and experienced staff',
          'Honest pricing with attraction tickets arranged only after confirmation'
        ],
        faqs: [
          {
            question: 'Is this package suitable for families with children?',
            answer: 'Yes, the itinerary is family-friendly and fully customizable to suit the needs of families traveling with children.'
          },
          {
            question: 'Can I book this tour without a hotel?',
            answer: 'Yes, a no-hotel option is available. You can choose to book only the private tours and services without accommodation.'
          },
          {
            question: 'Are attraction tickets included?',
            answer: 'No, attraction tickets are optional and arranged after confirming the number of travelers to ensure fair and transparent pricing.'
          },
          {
            question: 'Is this a private tour?',
            answer: 'Yes, all services including transfers, tours, yacht cruise, and desert safari are operated on a private basis exclusively for your group.'
          }
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'dubai-grand-signature-journey') {
      // Set Dubai Grand Signature Journey package data
      setPackageData({
        _id: 'dubai-grand-signature-journey',
        title: 'Dubai Grand Signature Journey',
        subtitle: '5 Nights / 6 Days Premium Private Dubai Tour',
        about: 'The Dubai Grand Signature Journey – 5 Nights / 6 Days is a refined private Dubai travel experience designed for travelers who want more time, more depth, and more flexibility while exploring the UAE.',
        services: [
          'Private airport transfers in a dedicated vehicle',
          'Private yacht dinner cruise at Dubai Marina',
          'Guided private Dubai city tour',
          'Visit to Burj Khalifa, Dubai Mall, and Dubai Aquarium (optional tickets)',
          'Dubai Frame, Miracle Garden, and Butterfly Garden visits',
          'Evening leisure at Global Village or Ain Dubai',
          'Private Abu Dhabi city tour with one theme park',
          'Dolphin show experience at Dubai Creek',
          'One-hour private limousine ride',
          'Private desert safari with premium BBQ dinner and entertainment',
          'Fully customizable itinerary with flexible hotel options'
        ],
        tourDetails: `Abstract

The Dubai Grand Signature Journey – 5 Nights / 6 Days is a refined private Dubai travel experience designed for travelers who want more time, more depth, and more flexibility while exploring the UAE. This premium itinerary expands beyond Dubai’s highlights to include Abu Dhabi, creating a well-rounded journey that balances sightseeing, leisure, and exclusive experiences.

Crafted for families with children, honeymooners, and small private groups, this tour prioritizes privacy, personalized pacing, and premium services. All sightseeing and transfers are conducted in private vehicles, ensuring comfort and ease throughout the journey. Experiences such as a private yacht dinner cruise, private desert safari, and one-hour limousine ride elevate the travel experience without overloading the itinerary.

Guests may select from three pricing options: tour-only (without hotel), 4-star hotel accommodation, or 5-star luxury accommodation. Attraction tickets are intentionally excluded at the planning stage to allow complete customization based on traveler interests and group size, with tickets provided later at discounted rates.

Tour Overview

This 5 Nights / 6 Days Premium Dubai Tour Package offers an immersive yet relaxed introduction to Dubai and Abu Dhabi. The itinerary is thoughtfully designed to avoid long travel days and overcrowded schedules while still covering the UAE’s most iconic attractions.

The journey begins with a calm arrival and an evening private yacht dinner cruise at Dubai Marina. Guests then explore Dubai’s modern and cultural landmarks through a private city tour featuring Burj Khalifa, Dubai Mall, and Dubai Aquarium. Midway through the journey, visitors enjoy Dubai’s creative attractions, Dubai Frame, Miracle Garden, and Global Village, before heading to Abu Dhabi for a private city tour with one theme park of choice.

The final days focus on premium leisure, including dolphin shows, limousine rides, and a private desert safari with BBQ dinner at a premium desert camp. With per-vehicle pricing for up to six guests, this package offers exceptional value for families and private groups seeking comfort and exclusivity.

Key Highlights

• Private airport transfers in a dedicated vehicle
• Private yacht dinner cruise at Dubai Marina
• Guided private Dubai city tour
• Visit to Burj Khalifa, Dubai Mall, and Dubai Aquarium (optional tickets)
• Dubai Frame, Miracle Garden, and Butterfly Garden visits
• Evening leisure at Global Village or Ain Dubai
• Private Abu Dhabi city tour with one theme park
• Dolphin show experience at Dubai Creek
• One-hour private limousine ride
• Private desert safari with premium BBQ dinner and entertainment
• Fully customizable itinerary with flexible hotel options

Pricing Options (Per Vehicle – Up to 6 Guests)

• Tour Only (Without Hotel Accommodation)
• Premium 4-Star Hotel Accommodation
• Luxury 5-Star Hotel Accommodation

Best Time to Visit

This tour is available throughout the year.

• October to April: Pleasant weather for outdoor activities
• May to September: Lower costs and fewer crowds, with activities scheduled indoors or in the evening

Why Choose This Trip?

• September to April: Pleasant weather for outdoor activities
• May to August: Lower costs and fewer crowds, with activities scheduled indoors or in the evening

Why Choose This Trip?

• Covers multiple iconic UAEn destinations
• Private tours ensure comfort and flexibility
• Ideal for families, couples, and private groups
• Balanced mix of sightseeing and leisure

Why ${SITE_NAME} UAE for This Journey?

• Dedicated private vehicles and professional drivers
• Custom itinerary adjustments based on preferences
• Discounted attraction tickets arranged on request
• Transparent pricing and local expertise`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Dubai & Private Sunset Cruise',
            description: `Arrive at Dubai International Airport, where you will be greeted by our representative and transferred via private vehicle to your hotel (if accommodation is selected).

In the evening, enjoy a private sunset cruise at Dubai Marina past the coastline while enjoying the view of Burj Khalifa in a calm, exclusive setting, an ideal start to a premium UAEn holiday.

Overnight in Dubai.`
          },
          {
            day: 2,
            title: 'Private Dubai City Tour & Iconic Attractions',
            description: `After breakfast, begin a private Dubai city tour covering the city’s most important landmarks.

Highlights include:
• Burj Khalifa Aerial Cableway (optional ticket)
• Photo stops at Bo-Kaap and Signal Hill
• Visit to V&A Waterfront
• Leisure time at Miracle Garden
• Robben Island visit (optional ticket)

Return to the hotel with time to relax or explore independently.

Overnight in Dubai.`
          },
          {
            day: 3,
            title: 'Cape Point, Boulders Beach & Scenic Drives',
            description: `This day showcases the natural beauty of the Cape Peninsula.

Morning visits include:
• Cape of Good Hope
• Cape Point Lighthouse
• Boulders Beach Penguin Colony

In the evening, enjoy a scenic drive along Chapman's Peak.

Overnight in Dubai.`
          },
          {
            day: 4,
            title: 'Private Winelands Tour with Wine Tasting',
            description: `After breakfast, travel in a private vehicle to the Stellenbosch and Franschhoek Winelands.

The tour includes:
• Wine tasting at premium estates
• Historic town walks and scenic vineyard views

Return to Dubai in the evening.

Overnight in Dubai.`
          },
          {
            day: 5,
            title: 'Desert Safari Connection or Leisure Day',
            description: `Begin the day with a choice of a short flight to a private game reserve or a leisure day in Dubai for shopping and art galleries.

Later, enjoy a premium bush dinner experience with live local music.

Overnight in Dubai / Safari Lodge.`
          },
          {
            day: 6,
            title: 'Departure',
            description: `After breakfast, enjoy a relaxed morning before your private transfer to the airport, concluding your premium UAEn journey.`
          }
        ],
        price: 0,
        duration: '5 Nights / 6 Days',
        location: 'Dubai, UAE',
        capacity: 'Up to 6 guests per vehicle',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Safari' }
        ],
        bookings: 0,
        rating: 5,
        inclusions: [
          {
            category: 'Airport & Hotel Transfers',
            items: ['Private airport and hotel transfers']
          },
          {
            category: 'Tours',
            items: ['All private tours as outlined']
          },
          {
            category: 'Experiences',
            items: [
              'Private yacht dinner cruise',
              'Private desert safari',
              'Private limousine ride'
            ]
          },
          {
            category: 'Meals',
            items: ['Breakfast with hotel accommodation (if selected)']
          },
          {
            category: 'Staff & Taxes',
            items: ['Field staff salaries, government taxes, and office expenses']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['International airfare (assistance available on request)']
          },
          {
            category: 'UAE Entry Visa',
            items: ['UAE entry visa (assistance available on request)']
          },
          {
            category: 'Personal Expenses',
            items: ['Personal expenses']
          },
          {
            category: 'Attraction Tickets',
            items: ['Attraction entry tickets (arranged at discounted rates)']
          },
          {
            category: 'Tourism Dirham Fees',
            items: ['Tourism dirham fees (if applicable)']
          },
          {
            category: 'Tips & Gratuities',
            items: ['Tips and gratuities']
          }
        ],
        transportation: [
          { type: 'Private Vehicle', vehicle: 'Luxury Sedan/SUV/Van', description: 'Private vehicle-based tours (up to 6 guests per vehicle). Other vehicles available for larger groups.' }
        ],
        accommodation: [
          { city: 'Dubai', hotel: 'Tour Only / 4-Star / 5-Star options', rooms: 'As per requirement', roomType: 'Without hotel / 4-star / 5-star', nights: '5 Nights' }
        ],
        reviews: [
          { name: 'Sophia Lee', rating: 5, comment: 'Perfect balance of Dubai and Abu Dhabi with enough free time built in.', date: '2024-02-10' },
          { name: 'Ahmed Khan', rating: 5, comment: 'Our family loved the private services and flexibility throughout the trip.', date: '2024-03-08' }
        ],
        packageCategory: 'premium',
        bestTimeToVisit: {
          yearRound: 'This tour is available throughout the year.',
          octoberToApril: 'Pleasant weather for outdoor activities.',
          mayToSeptember: 'Lower costs and fewer crowds, with activities scheduled indoors or in the evening.'
        },
        whyChooseThisTrip: [
          'Covers both Dubai and Abu Dhabi',
          'Private tours ensure comfort and flexibility',
          'Ideal for families, couples, and private groups',
          'Balanced mix of sightseeing and leisure'
        ],
        whyPremiumSkygoTours: [
          'Dedicated private vehicles and professional drivers',
          'Custom itinerary adjustments based on preferences',
          'Discounted attraction tickets arranged on request',
          'Transparent pricing and local expertise'
        ],
        faqs: [
          {
            question: 'Is this tour suitable for families with children?',
            answer: 'Yes, all experiences are family-friendly and can be tailored to suit the needs of families with children.'
          },
          {
            question: 'Can the Abu Dhabi theme park be changed?',
            answer: 'Yes, guests may select any one park from the available options.'
          },
          {
            question: 'Is pricing per person?',
            answer: 'No, pricing is per vehicle for up to six guests, offering excellent value for private groups.'
          },
          {
            question: 'Can hotels be upgraded or changed?',
            answer: 'Yes, accommodation options are fully flexible and can be upgraded or changed based on your preferences.'
          }
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'dubai-elite-grand-explorer') {
      // Set Dubai Elite Grand Explorer package data
      setPackageData({
        _id: 'dubai-elite-grand-explorer',
        title: 'Dubai Elite Grand Explorer',
        subtitle: '6 Nights / 7 Days Premium Private Dubai & UAE Tour',
        about: 'The Dubai Elite Grand Explorer – 6 Nights / 7 Days Premium Tour is a comprehensive private travel experience designed for travelers who want to explore Dubai beyond the basics, while also discovering neighboring Emirates in comfort and privacy.',
        services: [
          'Private airport transfers in a dedicated premium vehicle',
          'Fully guided private Dubai city tour',
          'Visit to Burj Khalifa, Dubai Mall & Dubai Aquarium (optional tickets)',
          'Dubai Frame, Miracle Garden & Butterfly Garden',
          'Evening entertainment at Global Village or Ain Dubai',
          'Private Abu Dhabi city tour with one theme park experience',
          'Cultural private Sharjah city tour',
          'Private yacht dinner cruise at Dubai Marina',
          'Dolphin show experience at Dubai Creek',
          'One-hour private limousine ride',
          'Private desert safari with premium BBQ dinner & live entertainment',
          'Flexible hotel options and customizable daily schedules'
        ],
        tourDetails: `Abstract

The Dubai Elite Grand Explorer – 6 Nights / 7 Days Premium Tour is a comprehensive private travel experience designed for travelers who want to explore Dubai beyond the basics, while also discovering neighboring Emirates in comfort and privacy.This itinerary offers the perfect balance of sightseeing, leisure, and exclusive experiences, allowing guests to experience Dubai’s modern icons, cultural landmarks, and luxury lifestyle at a relaxed pace.

This premium package is ideal for families with children, honeymoon couples, and small private groups who value privacy, flexibility, and personalized service.All tours and transfers are conducted in private vehicles, and premium experiences such as a private yacht dinner cruise, private desert safari, and private limousine ride are included to elevate the journey.

Guests can choose from three pricing options:
• Tour only(without hotel accommodation)
• 4 - star hotel accommodation
• 5 - star luxury hotel accommodation

Attraction tickets are not pre - included, allowing full customization based on group size and interests, with tickets arranged later at discounted rates.

Tour Overview

This 6 Nights / 7 Days Premium Dubai Tour Package is carefully designed to avoid rushed sightseeing while ensuring comprehensive coverage of Dubai, Abu Dhabi, and Sharjah.The itinerary allows sufficient time for relaxation, shopping, and optional upgrades while maintaining a smooth travel flow.

The journey begins with a relaxed arrival and continues with a private Dubai city tour, iconic attractions such as Burj Khalifa and Dubai Mall, creative landmarks like Dubai Frame and Miracle Garden, and immersive experiences such as Global Village.Guests then enjoy a private Abu Dhabi city tour with one world - renowned theme park before discovering Sharjah’s cultural heritage.

Luxury elements are woven throughout the itinerary, including a private yacht dinner cruise, one-hour limousine ride, and a private desert safari with BBQ dinner at a premium desert camp.With pricing structured per vehicle for up to six guests, this package delivers strong value for private travelers seeking a refined UAE holiday.

Key Highlights

• Private airport transfers in a dedicated premium vehicle
• Fully guided private Dubai city tour
• Visit to Burj Khalifa, Dubai Mall & Dubai Aquarium(optional tickets)
• Dubai Frame, Miracle Garden & Butterfly Garden
• Evening entertainment at Global Village or Ain Dubai
• Private Abu Dhabi city tour with one theme park experience
• Cultural private Sharjah city tour
• Private yacht dinner cruise at Dubai Marina
• Dolphin show experience at Dubai Creek
• One - hour private limousine ride
• Private desert safari with premium BBQ dinner & live entertainment
• Flexible hotel options and customizable daily schedules

Pricing Options(Per Vehicle – Up to 6 Guests)

• Tour Only(Without Hotel Accommodation)
• Premium 4 - Star Hotel Accommodation
• Luxury 5 - Star Hotel Accommodation

Best Time to Visit Dubai

This tour operates year - round.

• October to April: Ideal weather for sightseeing and outdoor attractions
• May to September: More affordable travel with activities scheduled indoors or during evenings

Why Choose This Trip ?

• Covers Dubai, Abu Dhabi, and Sharjah
• Fully private and flexible itinerary
• Ideal for families, honeymooners, and small groups
• Balanced mix of culture, luxury, and leisure

Why ${SITE_NAME} for This Journey ?

• Per - vehicle pricing for better value
• Private vehicles and experienced local staff
• Custom attraction tickets at discounted rates
• Transparent planning and reliable operations`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Dubai & Hotel Transfer',
            description: `Arrive at Dubai International Airport, where you will be welcomed by our representative and transferred in a private air - conditioned vehicle to your selected hotel.

The rest of the day is kept free to recover from travel or enjoy light exploration at your own pace.

Overnight in Dubai.`
          },
          {
            day: 2,
            title: 'Private Dubai City Tour & Iconic Landmarks',
            description: `After breakfast, begin a private Dubai city tour showcasing the city’s evolution from heritage roots to global metropolis.

Highlights include:
• Sheikh Zayed Road skyline drive
• Photo stop at Burj Al Arab
• Jumeirah area landmarks
• Visit to Burj Khalifa(optional ticket)
• Leisure time at Dubai Mall
• Dubai Aquarium & Underwater Zoo(optional ticket)

Return to the hotel with the evening at leisure.

Overnight in Dubai.`
          },
          {
            day: 3,
            title: 'Dubai Frame, Miracle Garden & Evening Experience',
            description: `Explore Dubai’s architectural and creative attractions today.

Morning visits include:
• Dubai Frame
• Miracle Garden
• Butterfly Garden

In the evening, choose between:
• Global Village cultural experience
OR
• Ain Dubai Ferris Wheel experience

Overnight in Dubai.`
          },
          {
            day: 4,
            title: 'Private Abu Dhabi City Tour with One Theme Park',
            description: `Travel to Abu Dhabi in a private vehicle for a full - day guided city tour.

Tour highlights include:
• Sheikh Zayed Grand Mosque(external visit as permitted)
• Corniche drive
• City landmarks and cultural stops

Later, enjoy one theme park experience of your choice:
• Ferrari World
• Warner Bros.World
• SeaWorld Abu Dhabi

Return to Dubai in the evening.

Overnight in Dubai.`
          },
          {
            day: 5,
            title: 'Private Sharjah City Tour & Yacht Dinner Cruise',
            description: `Discover the cultural capital of the UAE with a private Sharjah city tour, exploring museums, heritage areas, and traditional markets.

In the evening, return to Dubai Marina for a private yacht dinner cruise, enjoying skyline views and a relaxed dining experience on the water.

Overnight in Dubai.`
          },
          {
            day: 6,
            title: 'Dolphin Show, Limousine Ride & Private Desert Safari',
            description: `Begin the day with a dolphin show at Dubai Creek, suitable for all ages.

  Later, enjoy a one - hour private limousine ride, offering a unique way to explore Dubai in comfort.

In the afternoon, proceed for a private desert safari, including dune bashing, camel rides, sandboarding, and a premium desert camp experience with BBQ dinner and live entertainment.

Overnight in Dubai.`
          },
          {
            day: 7,
            title: 'Departure',
            description: `After breakfast, enjoy a relaxed morning before your private airport transfer, marking the end of your premium UAE journey.`
          }
        ],
        price: 0,
        duration: '6 Nights / 7 Days',
        location: 'Dubai, UAE',
        capacity: 'Up to 6 guests per vehicle',
        packageType: 'domestic',
        place: 'dubai',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' }
        ],
        bookings: 0,
        rating: 5,
        inclusions: [
          {
            category: 'Airport & Hotel Transfers',
            items: ['Private airport and hotel transfers']
          },
          {
            category: 'Tours',
            items: ['All private tours as outlined']
          },
          {
            category: 'Experiences',
            items: [
              'Private yacht dinner cruise',
              'Private desert safari experience',
              'Private limousine ride'
            ]
          },
          {
            category: 'Meals',
            items: ['Breakfast with hotel accommodation (if selected)']
          },
          {
            category: 'Staff & Taxes',
            items: ['Field staff salaries, government taxes, and office expenses']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['International airfare (assistance available on request)']
          },
          {
            category: 'UAE Entry Visa',
            items: ['UAE entry visa (assistance available on request)']
          },
          {
            category: 'Personal Expenses',
            items: ['Personal expenses']
          },
          {
            category: 'Attraction Tickets',
            items: ['Attraction entry tickets (arranged at discounted rates)']
          },
          {
            category: 'Tourism Dirham Fees',
            items: ['Tourism dirham fees (if applicable)']
          },
          {
            category: 'Tips & Gratuities',
            items: ['Tips and gratuities']
          }
        ],
        transportation: [
          { type: 'Private Vehicle', vehicle: 'Luxury Sedan/SUV/Van', description: 'Private vehicle-based tours (up to 6 guests per vehicle). Other vehicles available for larger groups.' }
        ],
        accommodation: [
          { city: 'Dubai', hotel: 'Tour Only / 4-Star / 5-Star options', rooms: 'As per requirement', roomType: 'Without hotel / 4-star / 5-star', nights: '6 Nights' }
        ],
        reviews: [
          { name: 'Laura Mitchell', rating: 5, comment: 'Perfect mix of Dubai, Abu Dhabi, and Sharjah with complete privacy and comfort.', date: '2024-02-25' },
          { name: 'Rahul Mehta', rating: 5, comment: 'The private tours and flexible pace made this ideal for our multi-generational family.', date: '2024-03-12' }
        ],
        packageCategory: 'premium',
        bestTimeToVisit: {
          yearRound: 'This tour operates year-round.',
          octoberToApril: 'Ideal weather for sightseeing and outdoor attractions.',
          mayToSeptember: 'More affordable travel with activities scheduled indoors or during evenings.'
        },
        whyChooseThisTrip: [
          'Covers Dubai, Abu Dhabi, and Sharjah',
          'Fully private and flexible itinerary',
          'Ideal for families, honeymooners, and small groups',
          'Balanced mix of culture, luxury, and leisure'
        ],
        whyPremiumSkygoTours: [
          'Per-vehicle pricing for better value',
          'Private vehicles and experienced local staff',
          'Custom attraction tickets at discounted rates',
          'Transparent planning and reliable operations'
        ],
        faqs: [
          {
            question: 'Is this tour suitable for children and senior travelers?',
            answer: 'Yes, the itinerary is flexible and paced for comfort, making it suitable for both children and senior travelers.'
          },
          {
            question: 'Can the Sharjah tour be replaced with another activity?',
            answer: 'Yes, the itinerary is fully customizable and the Sharjah tour can be replaced with another activity of your choice.'
          },
          {
            question: 'Is pricing per person or per vehicle?',
            answer: 'Pricing is per vehicle for up to six guests, offering excellent value for families and small groups.'
          },
          {
            question: 'Can hotels be upgraded or changed?',
            answer: 'Yes, hotel options are flexible and can be adjusted or upgraded based on your preferences.'
          }
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'dubai-private-classic-discovery') {
      // Set Dubai Private Classic Discovery package data
      setPackageData({
        _id: 'dubai-private-classic-discovery',
        title: 'Dubai Private Classic Discovery',
        subtitle: '4 Nights / 5 Days Premium Private Tour Package',
        about: 'The Dubai Signature Escape – 4 Nights / 5 Days is a carefully curated premium Dubai tour designed for travelers who value privacy, comfort, flexibility, and refined experiences. This journey blends Dubai\'s iconic landmarks with exclusive private services, allowing guests to experience the city at a relaxed, unhurried pace.',
        services: [
          'Private airport transfers in a dedicated vehicle',
          'Evening private yacht dinner cruise at Dubai Marina',
          'Fully guided private Dubai city tour',
          'Visit to Burj Khalifa, Dubai Mall, and Dubai Aquarium (tickets optional)',
          'Leisure attractions including Dubai Frame, Miracle Garden, and Butterfly Garden',
          'Evening visit to Global Village or Ain Dubai',
          'Dolphin show experience at Dubai Creek',
          'One-hour private limousine ride',
          'Private desert safari with premium camp, BBQ dinner, and live entertainment',
          'Customizable itinerary with flexible hotel and attraction options'
        ],
        tourDetails: `Abstract
The Dubai Signature Escape – 4 Nights / 5 Days is a carefully curated premium Dubai tour designed for travelers who value privacy, comfort, flexibility, and refined experiences.This journey blends Dubai's iconic landmarks with exclusive private services, allowing guests to experience the city at a relaxed, unhurried pace.
Unlike standard group tours, this package is structured around private vehicles, private tours, and customizable schedules, making it ideal for families with children, honeymooners, and small groups seeking a personalized Dubai holiday.From a private yacht dinner at Dubai Marina to a premium desert safari experience, each day is balanced to ensure both discovery and leisure.
Guests can choose between three flexible pricing options, without hotel accommodation, with 4 - star hotels, or with 5 - star luxury hotel, allowing full control over comfort level and budget.Attractions and experience tickets are intentionally excluded so that itineraries can be customized based on the number of travelers, interests, and preferred pacing, with tickets offered at discounted rates once final selections are confirmed.

Tour Overview
This 4 Nights / 5 Days Premium Dubai Tour is designed as a complete introduction to Dubai, combining modern landmarks, cultural attractions, leisure experiences, and signature luxury elements.The itinerary follows a logical flow, avoiding rushed days and overcrowded schedules.
The journey begins with a relaxed arrival and a private yacht dinner cruise, setting the tone for an elegant Dubai experience.The following days explore the city's highlights, including Burj Khalifa, Dubai Mall, Dubai Frame, Miracle Garden, and Global Village, all handled through private transport and guided assistance.
A full day is dedicated to signature premium experiences, including a dolphin show, private limousine ride, and a private desert safari with BBQ dinner at a premium camp.The itinerary ensures that no single day feels overwhelming, preserving the premium nature of the journey.
This package operates on a per - vehicle pricing model, accommodating up to 6 guests per vehicle, which offers excellent value for families and small private groups.`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Dubai & Private Yacht Dinner Cruise',
            description: `Upon arrival at Dubai International Airport, guests are warmly received by our professional representative and escorted to a private vehicle for a smooth transfer to the hotel(if accommodation is selected).

In the evening, enjoy a private yacht dinner cruise at Dubai Marina, offering a relaxed introduction to the city's skyline. Cruise through the illuminated waters of the marina while enjoying a freshly prepared dinner on board. This experience is ideal for couples and families, offering privacy, scenic views, and a calm atmosphere after travel.

Overnight in Dubai`
          },
          {
            day: 2,
            title: 'Private Dubai City Tour & Iconic Landmarks',
            description: `After breakfast, embark on a private Dubai city tour, covering both Old and New Dubai.The tour is paced comfortably, allowing time for photo stops and exploration.

Highlights include:
Drive through Sheikh Zayed Road
Photo stops at Burj Al Arab and Jumeirah landmarks
Visit to Burj Khalifa(optional ticket)
Leisure time at Dubai Mall
Visit to Dubai Aquarium & Underwater Zoo(optional ticket)

The remainder of the day is free for relaxation or shopping.

Overnight in Dubai`
          },
          {
            day: 3,
            title: 'Dubai Frame, Miracle Garden & Evening Entertainment',
            description: `Today focuses on Dubai's creative and cultural attractions.

Morning visits include:
Dubai Frame, offering panoramic views of old and new Dubai
Miracle Garden, home to seasonal floral installations
Butterfly Garden, ideal for families and nature lovers

In the evening, choose between:
Global Village, showcasing international culture, food, and performances
OR
Ain Dubai Ferris Wheel experience for city views

Overnight in Dubai`
          },
          {
            day: 4,
            title: 'Dolphin Show, Limousine Ride & Private Desert Safari',
            description: `Begin the day with a visit to a dolphin show at Dubai Creek, a family - friendly experience enjoyed by all age groups.

  Later, enjoy a one - hour private limousine ride, perfect for special occasions, photography, or simply experiencing Dubai in style.

In the afternoon, proceed for a private desert safari in a 4x4 vehicle.Experience dune bashing, sandboarding, and camel rides, followed by a premium desert camp experience with:
• BBQ dinner
• Live entertainment
• Comfortable seating arrangements
• Return to the hotel in the evening.

Overnight in Dubai`
          },
          {
            day: 5,
            title: 'Departure',
            description: `After breakfast, enjoy a relaxed morning before your private transfer to the airport for departure, concluding a thoughtfully planned premium Dubai journey.`
          }
        ],
        price: 0, // Custom pricing per vehicle
        duration: '4 Nights / 5 Days',
        location: 'Dubai, UAE',
        capacity: 'Up to 6 guests per vehicle',
        packageType: 'domestic',
        place: 'dubai',
        images: [
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' },
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Frame' }
        ],
        bookings: 0,
        rating: 5,
        inclusions: [
          'Private airport and hotel transfers',
          'All private tours as per itinerary',
          'Private yacht dinner cruise',
          'Private desert safari',
          'Private limousine ride',
          'Breakfast with hotel accommodation (if selected)',
          'Field staff salaries, government taxes, and office expenses'
        ],
        exclusions: [
          'International airfare (assistance available on request)',
          'UAE entry visa (assistance available on request)',
          'Personal expenses',
          'Attraction entry tickets (arranged at discounted rates)',
          'Tourism dirham fees (if applicable)',
          'Tips and gratuities'
        ],
        transportation: [
          { type: 'Private Vehicle', vehicle: 'Luxury Sedan/SUV/Van', description: 'Private vehicle-based tours (up to 6 guests per vehicle). Other vehicles available for larger groups.' }
        ],
        accommodation: [
          { city: 'Dubai', hotel: 'Optional - Choose from 3 options', rooms: 'As per requirement', roomType: 'Without hotel / 4-star / 5-star', nights: '4 Nights' }
        ],
        reviews: [
          { name: "David Thompson", rating: 5, comment: "Perfect 4-night itinerary! The yacht dinner and desert safari were highlights. Highly recommend for families.", date: "2024-03-20" },
          { name: "Lisa Anderson", rating: 5, comment: "Excellent balance of sightseeing and relaxation. The private tours made all the difference.", date: "2024-04-05" },
          { name: "Robert Martinez", rating: 5, comment: "The dolphin show and limousine ride were fantastic additions. Great value for a premium experience.", date: "2024-04-15" }
        ],
        packageCategory: 'premium',
        // Additional fields for the specific content sections
        idealFor: 'Families, honeymooners, first-time Dubai visitors, luxury travelers',
        pricingModel: 'Per vehicle (up to 6 guests)',
        hotelOptions: [
          'Without hotel accommodation',
          '4-star premium hotels',
          '5-star luxury hotels'
        ],
        keyHighlights: [
          'Private airport transfers in a dedicated vehicle',
          'Evening private yacht dinner cruise at Dubai Marina',
          'Fully guided private Dubai city tour',
          'Visit to Burj Khalifa, Dubai Mall, and Dubai Aquarium (tickets optional)',
          'Leisure attractions including Dubai Frame, Miracle Garden, and Butterfly Garden',
          'Evening visit to Global Village or Ain Dubai',
          'Dolphin show experience at Dubai Creek',
          'One-hour private limousine ride',
          'Private desert safari with premium camp, BBQ dinner, and live entertainment',
          'Customizable itinerary with flexible hotel and attraction options'
        ],
        whyChooseThisTrip: [
          'Balanced itinerary with no rushed days',
          'Ideal for families, honeymooners, and private groups',
          'Premium experiences without rigid schedules',
          'Flexible pricing and customization options'
        ],
        whyPremiumSkygoTours: [
          'Dedicated private vehicles and professional drivers',
          'Discounted attraction tickets arranged on request',
          'Flexible itineraries tailored to guest preferences',
          'Transparent pricing with no hidden costs',
          'Experienced local team with on-ground support'
        ],
        bestTimeToVisit: {
          octoberToApril: 'Ideal weather for outdoor sightseeing',
          mayToSeptember: 'Lower costs; itineraries focus on indoor attractions and evening experiences'
        },
        pricingOptions: [
          'Tour Only (No Hotel Accommodation)',
          'Premium 4-Star Hotel Accommodation',
          'Luxury 5-Star Hotel Accommodation'
        ],
        faqs: [
          {
            question: 'Is this tour suitable for children?',
            answer: 'Yes, the itinerary is family-friendly and fully customizable.'
          },
          {
            question: 'Can attractions be changed or removed?',
            answer: 'Absolutely. All tours are flexible.'
          },
          {
            question: 'Is pricing per person or per vehicle?',
            answer: 'Pricing is per vehicle (up to 6 guests).'
          },
          {
            question: 'Can hotel category be upgraded?',
            answer: 'Yes, guests may choose between no hotel, 4-star, or 5-star options.'
          }
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'dubai-grand-explorer') {
      // Set Dubai Grand Explorer package data
      setPackageData({
        _id: 'dubai-grand-explorer',
        title: 'Dubai Grand Explorer',
        subtitle: '7 Nights / 8 Days Dubai Tour Package',
        about: 'The Dubai Grand Explorer – 7 Nights / 8 Days tour is designed for travelers who want to experience Dubai at an unhurried pace while covering the city\'s most iconic attractions along with regional highlights. This itinerary balances guided sightseeing with free time, allowing you to explore Dubai comfortably without feeling rushed.',
        services: [
          '7 nights hotel accommodation with daily breakfast',
          'Half-day Dubai city tour (Old & New Dubai)',
          'Desert safari with BBQ dinner and camp activities',
          'Dhow cruise dinner at Dubai Marina',
          'Burj Khalifa & Dubai Mall visit',
          'Abu Dhabi city tour with one theme park option',
          'Dubai Frame, Miracle Garden & Museum of the Future',
          'Global Village evening tour',
          'Shopping and leisure day',
          'Private airport transfers'
        ],
        tourDetails: `Abstract

The Dubai Grand Explorer – 7 Nights / 8 Days tour is designed for travelers who want to experience Dubai at an unhurried pace while covering the city's most iconic attractions along with regional highlights. This itinerary balances guided sightseeing with free time, allowing you to explore Dubai comfortably without feeling rushed.

From modern landmarks and cultural districts to desert landscapes, waterfront dining, and leisure days, this tour delivers a complete Dubai experience.It is ideal for families, senior travelers, and long - stay guests who value organization, comfort, and clear planning.

With carefully scheduled activities, shared city tours, private airport transfers, and multiple accommodation options, this Regular Dubai Tour Package offers excellent value while maintaining service reliability and professional coordination throughout your stay.

Tour Overview

Dubai is a city best enjoyed with time, time to explore, time to relax, and time to absorb the contrast between tradition and modern ambition.The Dubai Grand Explorer package gives you exactly that.

Over eight days, you will explore Dubai's historical neighborhoods, iconic skyscrapers, shopping districts, and entertainment zones, while also venturing beyond the city with a guided Abu Dhabi tour. The itinerary includes Dubai's essential experiences, such as a desert safari with BBQ dinner, a dhow cruise dinner at Dubai Marina, Burj Khalifa visit, Miracle Garden, Dubai Frame, Museum of the Future, Global Village, and cultural sightseeing.

Unlike rushed itineraries, this tour spreads activities across multiple days and includes free time for shopping or rest.All major sightseeing tours are conducted on a sharing(SIC) basis, ensuring affordability, while airport transfers and hotel stays remain private and comfortable.

This package operates year - round.During summer months, activities are scheduled in air - conditioned venues or evenings, making it suitable even in warmer seasons, often at more economical pricing.

Key Highlights`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Dubai & Hotel Transfer',
            description: 'Upon arrival at Dubai International Airport, you will be welcomed and transferred to your hotel in a private, air-conditioned vehicle. After check-in, the rest of the day is free to relax or explore nearby areas at your own pace. Overnight: Dubai'
          },
          {
            day: 2,
            title: 'Half-Day Dubai City Tour, Burj Khalifa & Dubai Mall',
            description: 'After breakfast, proceed on a guided half-day Dubai city tour covering both Old and New Dubai. Highlights include photo stops at Jumeirah Mosque, Burj Al Arab, Palm Jumeirah, Atlantis The Palm, and Dubai Marina, along with visits to heritage areas and traditional souks. Later, visit Dubai Mall and ascend Burj Khalifa (124th/125th floor – optional upgrade) for panoramic city views. Overnight: Dubai'
          },
          {
            day: 3,
            title: 'Abu Dhabi City Tour with One Park',
            description: 'Today, travel to the UAE capital, Abu Dhabi. Visit the Sheikh Zayed Grand Mosque, Corniche, Heritage Village, and key landmarks. The tour includes one theme park or attraction (Ferrari World / Warner Bros / Yas Waterworld – ticket arranged at actual cost). Return to Dubai in the evening. Overnight: Dubai'
          },
          {
            day: 4,
            title: 'Dubai Frame, Miracle Garden, Museum of the Future & Dhow Cruise Dinner',
            description: 'Explore Dubai Frame for a visual journey between old and new Dubai. Visit Miracle Garden (seasonal) and enjoy an external or optional internal visit to the Museum of the Future. In the evening, enjoy a Dhow Cruise Dinner at Dubai Marina, featuring international buffet dining, soft entertainment, and skyline views. Overnight: Dubai'
          },
          {
            day: 5,
            title: 'Dolphin Show & Global Village (Evening)',
            description: 'After breakfast, attend a Dolphin or Seal Show, suitable for families and children. In the evening, visit Global Village, Dubai\'s multicultural entertainment and shopping destination with live performances and international pavilions. Overnight: Dubai'
          },
          {
            day: 6,
            title: 'Dhow Cruise Dinner at Marina',
            description: 'Daytime is free for shopping, optional activities, or rest. In the evening, enjoy another leisure-focused Marina experience, ideal for relaxed sightseeing, dining, and waterfront exploration. Overnight: Dubai'
          },
          {
            day: 7,
            title: 'Free Day for Shopping or Leisure',
            description: 'Enjoy a full free day to shop at malls, visit local markets, or add optional experiences such as theme parks, yacht cruises, or spa sessions. Overnight: Dubai'
          },
          {
            day: 8,
            title: 'Departure',
            description: 'After breakfast, check out from the hotel and transfer to Dubai International Airport for your onward journey.'
          }
        ],
        price: 0,
        duration: '7 Nights / 8 Days',
        location: 'Dubai, UAE',
        capacity: '2-6 Guests',
        packageType: 'domestic',
        place: 'dubai',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
        ],
        bookings: 0,
        rating: 4.8,
        inclusions: [
          {
            category: 'Airport Transfers',
            items: ['Private airport arrival & departure transfers']
          },
          {
            category: 'Hotel Accommodation',
            items: ['7 nights hotel accommodation (twin sharing)']
          },
          {
            category: 'Meals',
            items: [
              'Daily breakfast at hotel',
              'Dinners during desert safari and dhow cruise'
            ]
          },
          {
            category: 'Sightseeing & Tours',
            items: [
              'Half-day Dubai city tour (SIC basis)',
              'Abu Dhabi city tour (SIC basis)',
              'Other tours as per the itinerary'
            ]
          },
          {
            category: 'Experiences',
            items: [
              'Desert safari in 4x4 vehicle with BBQ dinner (sharing)',
              'Dhow cruise dinner at Marina (sharing)'
            ]
          },
          {
            category: 'Guide & Assistance',
            items: ['English-speaking guide during tours']
          },
          {
            category: 'Taxes',
            items: ['All government taxes and service charges']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['International airfare']
          },
          {
            category: 'UAE Entry Visa',
            items: ['UAE entry visa (arranged on request)']
          },
          {
            category: 'Entry Tickets',
            items: ['Entry tickets to parks and attractions (arranged at actual cost)']
          },
          {
            category: 'Personal Expenses',
            items: ['Shopping, drinks, laundry, insurance, tourism dirhams']
          },
          {
            category: 'Tips and Gratuities',
            items: ['Tips and gratuities']
          }
        ],
        transportation: [
          { type: 'Private Transfer', vehicle: 'Air-conditioned vehicle', description: 'Private airport transfers for arrival and departure' },
          { type: 'Shared Vehicle', vehicle: '4x4 / Coach', description: 'Shared transportation for city tours and desert safari' }
        ],
        accommodation: [
          { city: 'Dubai', hotel: 'Choice of 3-Star, 4-Star, or 5-Star', rooms: 'Twin sharing', roomType: 'Deluxe/Gold/Platinum', nights: '7 Nights' }
        ],
        reviews: [
          { name: 'Robert Taylor', rating: 5, comment: 'Perfect extended tour of Dubai! The pace was relaxed and we covered everything we wanted to see.', date: '2024-02-10' },
          { name: 'Maria Garcia', rating: 5, comment: 'Excellent for families with children. The free days were much appreciated!', date: '2024-03-05' },
          { name: 'David Wilson', rating: 4, comment: 'Comprehensive itinerary with great balance of activities and leisure time.', date: '2024-04-12' }
        ],
        packageCategory: 'regular',
        highlights: [
          '7 nights hotel accommodation with daily breakfast',
          'Half-day Dubai city tour (Old & New Dubai)',
          'Desert safari with BBQ dinner and camp activities',
          'Dhow cruise dinner at Dubai Marina',
          'Burj Khalifa & Dubai Mall visit',
          'Abu Dhabi city tour with one theme park option',
          'Dubai Frame, Miracle Garden & Museum of the Future',
          'Global Village evening tour',
          'Shopping and leisure day',
          'Private airport transfers',
          'English-speaking guide'
        ],
        hotelOptions: [
          'Deluxe Package (3★ Hotels)',
          'Gold Package (4★ Hotels)',
          'Platinum Package (5★ Hotels)'
        ],
        bestTimeToVisit: {
          yearRound: 'Dubai can be visited throughout the year.',
          novemberToMarch: 'Pleasant weather, peak season',
          aprilToOctober: 'Hotter months, but tours are mostly indoor or evening-based and offered at more economical prices'
        },
        whyChoosePremiumSkygoTours: [
          'Clear itineraries with no rushed schedules',
          'Professional coordination and transparent inclusions',
          'Comfortable vehicles and experienced guides',
          'Multiple hotel category options under one package',
          'Suitable for families, seniors, and long-stay travelers',
          'Reliable support before and during the tour'
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'capetown-transit-escape') {
      // Set Cape Town Transit Escape package data
      setPackageData({
        _id: 'capetown-transit-escape',
        title: 'Cape Town Transit Escape',
        subtitle: '1 Night / 2 Days Stopover Tour',
        about: 'The Cape Town Transit Escape – 1 Night 2 Days is a thoughtfully curated stopover tour designed for travelers passing through Cape Town with limited time. Whether you are on an overnight airline layover or a short business visit, this package allows you to experience the essence of Cape Town without rushed schedules or complex planning.',
        services: [
          'Ideal for airline stopovers and overnight transit stays',
          'Private airport transfers for stress-free arrival and departure',
          'Choice of Wildlife Safari or Waterfront Harbour Cruise',
          'Guided Cape Town city sightseeing tour',
          'Flexible scheduling aligned with flight timings'
        ],
        tourDetails: `Abstract

The Cape Town Transit Escape – 1 Night 2 Days is a thoughtfully curated stopover tour designed for travelers passing through Cape Town with limited time.Whether you are on an overnight airline layover or a short business visit, this package allows you to experience the essence of Cape Town without rushed schedules or complex planning.

This transit - focused itinerary prioritizes timing efficiency, comfort, and seamless coordination, ensuring you enjoy Cape Town's iconic experiences while maintaining flexibility around flight schedules. With private airport transfers, comfortable hotel accommodation, and a choice of evening experiences, even a short stay becomes a meaningful travel experience.

Overview

Cape Town is one of the world's most scenic aviation hubs, welcoming millions of transit passengers each year. Many travelers pass through the city without realizing that even a single night is enough to experience its contrast, modern skylines, cultural heritage, and coastal landscapes. The Cape Town Transit Escape is designed precisely for this purpose.

This package eliminates the uncertainty that often comes with short stays.From the moment you land at Cape Town International Airport, every aspect of your stopover is professionally managed.A private airport transfer ensures a smooth arrival, followed by check -in at a carefully selected hotel based on your chosen category: Deluxe(3★), Gold(4★), or Platinum(5★).

The highlight of this transit tour is its flexible evening experience, allowing you to choose between two iconic Cape Town activities:

1. Wildlife Safari Game Drive with BBQ Dinner, ideal for travelers wanting a glimpse of the African landscape
2. Harbour Cruise Dinner at V&A Waterfront, perfect for a relaxed evening with mountain and harbor views

Both experiences are scheduled to accommodate late arrivals and jet lag considerations, making them suitable even for travelers arriving in the afternoon or early evening.

The second day focuses on a half - day Cape Town sightseeing tour, covering both historical and modern Cape Town.This guided tour provides a structured introduction to the city, ensuring you return to the airport with a clear sense of Cape Town's identity—natural beauty balanced with cultural roots.

The Cape Town Transit Escape proves that even a brief stay can be enriching when planned with care, timing precision, and professional support.

  Highlights

• Ideal for airline stopovers and overnight transit stays
• Private airport transfers for stress - free arrival and departure
• Choice of Wildlife Safari or Waterfront Harbour Cruise
• Guided Cape Town city sightseeing tour
• Flexible scheduling aligned with flight timings

Hotel Options

• Deluxe Package: 3★ Hotel
• Gold Package: 4★ Hotel
• Platinum Package: 5★ Hotel

Best Time to Visit

This transit tour operates throughout the year.

• October to April: Pleasant weather, higher demand
• May to September: Cooler months, but tours are mostly indoor or evening - focused experiences

Cape Town's infrastructure ensures comfort even during cooler months.

Why ${SITE_NAME} for This Transit Trip ?

• Expertise in short - stay and stopover logistics
• Flight - time - sensitive planning
• Clear inclusions with no hidden surprises
• Professional coordination from airport to departure

Optional Add - Ons

• Table Mountain Aerial Cableway
• Private city tour upgrade
• Late check - out(subject to availability)`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Cape Town & Evening Experience',
            description: `Arrival at Cape Town International Airport

Meet & greet followed by private hotel transfer

Check -in at selected hotel

Evening activity(choose one):
• Wildlife Safari with BBQ Dinner OR
• Harbour Cruise Dinner at V&A Waterfront

Overnight stay in Cape Town`
          },
          {
            day: 2,
            title: 'Cape Town City Tour & Departure',
            description: `Breakfast at the hotel

Half - day guided Cape Town city tour(sharing basis) covering major landmarks
Return to hotel or airport transfer

Departure as per flight schedule`
          }
        ],
        price: 0,
        duration: '1 Night / 2 Days',
        location: 'Cape Town, South Africa',
        capacity: '2-6 Guests',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Skyline' },
          { url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Airport' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Waterfront' },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Wildlife Safari' }
        ],
        bookings: 0,
        rating: 4.5,
        inclusions: [
          {
            category: 'Airport Transfers',
            items: ['Arrival and departure airport transfers in a private, air-conditioned vehicle']
          },
          {
            category: 'Hotel Accommodation',
            items: [
              'Twin-sharing accommodation based on selected category:',
              'Deluxe Package: 3-star hotel',
              'Gold Package: 4-star hotel',
              'Platinum Package: 5-star hotel'
            ]
          },
          {
            category: 'Meals',
            items: [
              'Daily breakfast at the hotel',
              'BBQ Dinner during Wildlife Safari',
              'Dinner during Harbour Cruise'
            ]
          },
          {
            category: 'Sightseeing & Tours',
            items: ['Half-day Cape Town City Tour on a sharing (SIC) basis']
          },
          {
            category: 'Experiences',
            items: [
              '4x4 Wildlife Safari with game drive & camp activities',
              'Harbour Cruise Dinner on a sharing basis'
            ]
          },
          {
            category: 'Guide & Assistance',
            items: [
              'English-speaking guide during city tours',
              'Local assistance and coordination throughout the trip'
            ]
          },
          {
            category: 'Taxes',
            items: ['Government taxes and official service charges']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['Flights to and from Cape Town (can be arranged upon request)']
          },
          {
            category: 'South Africa Entry Visa',
            items: ['Cape Town visa fees (assistance available if required)']
          },
          {
            category: 'Entry Tickets',
            items: ['Theme parks, attractions, and monument tickets (Arranged at actual cost based on traveler preference)']
          },
          {
            category: 'Personal Expenses',
            items: [
              'Lunches, beverages, shopping',
              'Laundry, phone calls, minibar usage'
            ]
          },
          {
            category: 'Insurance',
            items: ['Travel and medical insurance']
          },
          {
            category: 'Early Check-in / Late Check-out',
            items: ['Subject to hotel policy and availability']
          }
        ],
        transportation: [
          { type: 'Private Transfer', vehicle: 'Air-conditioned vehicle', description: 'Private airport transfers for arrival and departure' },
          { type: 'Shared Vehicle', vehicle: '4x4 / Coach', description: 'Shared transportation for city tours and wildlife safari' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'Choice of 3-Star, 4-Star, or 5-Star', rooms: 'Twin sharing', roomType: 'Deluxe/Gold/Platinum', nights: '1 Night' }
        ],
        reviews: [
          { name: 'Michael Johnson', rating: 5, comment: 'Perfect for a layover! Made the most of our transit time in Cape Town. The flexibility with flight schedules was great.', date: '2024-03-15' },
          { name: 'Sarah Williams', rating: 5, comment: 'Excellent stopover package. The wildlife safari was amazing and well-timed for our evening arrival.', date: '2024-04-01' },
          { name: 'David Chen', rating: 4, comment: 'Great value for a short stay. The city tour was comprehensive and the hotel was comfortable.', date: '2024-04-20' }
        ],
        packageCategory: 'regular',
        highlights: [
          'Ideal for airline stopovers and overnight transit stays',
          'Private airport transfers for stress-free arrival and departure',
          'Choice of Wildlife Safari or Waterfront Harbour Cruise',
          'Guided Cape Town city sightseeing tour',
          'Flexible scheduling aligned with flight timings'
        ],
        hotelOptions: [
          'Deluxe Package: 3★ Hotel - Twin sharing, breakfast included',
          'Gold Package: 4★ Hotel - Twin sharing, breakfast included',
          'Platinum Package: 5★ Hotel - Twin sharing, breakfast included'
        ],
        bestTimeToVisit: {
          yearRound: 'This transit tour operates throughout the year',
          octoberToApril: 'Pleasant weather, higher demand',
          mayToSeptember: 'Lower prices, indoor and evening-focused experiences. Cape Town\'s infrastructure ensures comfort even during cooler months'
        },
        whyChoosePremiumSkygoTours: [
          'Expertise in short-stay and stopover logistics',
          'Flight-time-sensitive planning',
          'Clear inclusions with no hidden surprises',
          'Professional coordination from airport to departure'
        ],
        optionalAddOns: [
          'Table Mountain Aerial Cableway',
          'Private city tour upgrade',
          'Late check-out (subject to availability)'
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'capetown-classic-discovery') {
      // Set Cape Town Classic Discovery package data
      setPackageData({
        _id: 'capetown-classic-discovery',
        title: 'Classic Discovery of Cape Town and Winelands',
        subtitle: '4 Nights / 5 Days Cape Town Tour',
        about: 'The Cape Town Classic Discovery – 4 Nights / 5 Days tour is thoughtfully designed for travelers who want to experience Cape Town in a balanced and unhurried way. This itinerary combines the city\'s iconic attractions, cultural experiences, and modern leisure with the added depth of a Winelands visit.',
        services: [
          'Private airport transfers for arrival and departure',
          'Half-day guided Cape Town city tour covering historical districts',
          'Wildlife Safari with BBQ dinner and cultural activities',
          'Evening Waterfront Harbour Cruise Dinner',
          'Winelands tour with optional tasting',
          'Free day for shopping and personal exploration',
          'Choice of 3-Star, 4-Star, or 5-Star hotels'
        ],
        tourDetails: `Abstract
The Cape Town Classic Discovery – 4 Nights / 5 Days tour is thoughtfully designed for travelers who want to experience Cape Town in a balanced and unhurried way.This itinerary combines the city's iconic attractions, cultural experiences, and modern leisure with the added depth of a Winelands visit.
Rather than rushing through highlights, this package focuses on comfort, clarity, and smooth logistics, ensuring that guests enjoy Cape Town at a natural pace.It is especially suitable for families and international travelers who value reliable service, comfortable transportation, and carefully structured sightseeing.
With flexible hotel categories and a mix of guided tours and personal free time, this tour delivers a complete Cape Town holiday without overwhelming the traveler.

Tour Overview 
Cape Town is a destination of contrasts, historic neighborhoods sit beside futuristic skylines, calm coastal landscapes balance vibrant urban life, and traditional hospitality blends seamlessly with modern style.The Cape Town Classic Discovery tour has been crafted to reflect this diversity while maintaining simplicity and ease throughout the journey.
From the moment you arrive, all major travel logistics are handled by ${SITE_NAME}, allowing you to focus entirely on enjoying the destination. Private airport transfers ensure a smooth arrival, while carefully scheduled sightseeing days prevent fatigue.
The tour introduces Cape Town gradually, starting with a relaxed arrival day followed by guided city exploration.Guests experience historical Cape Town, with its heritage areas and traditional markets, and modern districts, known for architectural landmarks.
A wildlife safari offers a cultural contrast to the city experience, providing insight into the region's natural landscape. The evening Harbour Cruise delivers a calm, scenic dining experience, ideal for families and couples alike.
The inclusion of a Winelands tour adds depth to the itinerary, offering a broader understanding of the Western Cape beyond the city.A dedicated free day allows guests to shop, relax, or explore independently, an essential element for a comfortable holiday.
This tour is suitable throughout the year.During cooler months, activities are planned indoors or during comfortable hours, and pricing tends to be more economical, making it an excellent value - oriented option.`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Cape Town & Harbour Cruise Dinner',
            description: `Upon arrival at Cape Town International Airport, you will be greeted by our representative and transferred to your hotel in a private, air - conditioned vehicle.After check -in, the afternoon is kept free to allow you to rest or settle in.

In the evening, you will proceed for a Harbour Cruise Dinner on a sharing basis.Enjoy a relaxed cruise through Cape Town Waterfront, surrounded by illuminated landmarks, while savoring an international buffet dinner.After the cruise, return to your hotel for an overnight stay.`
          },
          {
            day: 2,
            title: 'Cape Town City Tour & Wildlife Safari with BBQ Dinner',
            description: `After breakfast, depart for a half - day guided Cape Town city tour on a shared basis.This tour introduces you to both historic and modern sides of Cape Town, including traditional neighborhoods, cultural landmarks, and modern districts.

Following the city tour, return to the hotel for rest.In the afternoon, you will be picked up for a wildlife safari experience in a shared 4x4 vehicle.Activities include game drive and cultural performances at the camp.The evening concludes with a BBQ dinner before returning to the hotel.`
          },
          {
            day: 3,
            title: 'Cape Winelands Tour',
            description: `After breakfast, proceed for a full - day Cape Winelands tour on a shared basis.This tour provides insight into the beautiful wine regions surrounding Cape Town, known for their historic estates and mountain scenery.

The itinerary includes major highlights and optional tastings (arranged separately).After completing the tour, return to Cape Town in the evening for overnight stay.`
          },
          {
            day: 4,
            title: 'Free Day for Shopping & Leisure',
            description: `This day is kept completely free for personal activities.Guests may explore V&A Waterfront, visit Table Mountain(tickets can be arranged separately), shop at local markets, or simply relax at the hotel.

This flexibility allows travelers to customize their experience based on interests and energy levels.`
          },
          {
            day: 5,
            title: 'Departure',
            description: `After breakfast and hotel check - out, you will be transferred privately to Cape Town International Airport for your onward journey.`
          }
        ],
        price: 0,
        duration: '4 Nights / 5 Days',
        location: 'Cape Town, South Africa',
        capacity: '2-6 Guests',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Skyline' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Table Mountain' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Winelands' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Waterfront' }
        ],
        bookings: 0,
        rating: 4.8,
        inclusions: [
          'Private airport and hotel transfers',
          'Hotel accommodation on twin sharing basis',
          'Daily breakfast',
          'Dinners during wildlife safari and harbour cruise',
          'Cape Town city and Winelands tours on SIC basis',
          'Wildlife safari in shared 4x4 vehicle',
          'Waterfront harbour cruise on sharing basis',
          'English-speaking guide during tours',
          'Government taxes and office expenses'
        ],
        exclusions: [
          'International airfare',
          'South Africa entry visa (can be arranged on request)',
          'Personal expenses (shopping, meals, drinks, laundry, insurance)',
          'Entry tickets to parks and attractions (arranged at actual cost)'
        ],
        transportation: [
          { type: 'Shared Vehicle', vehicle: '4x4 / Coach', description: 'Shared transportation for tours and transfers' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'Choice of 3-Star, 4-Star, or 5-Star', rooms: 'Twin sharing', roomType: 'Standard/Deluxe/Luxury', nights: '4 Nights' }
        ],
        reviews: [
          { name: "Jennifer Smith", rating: 5, comment: "Perfect balance of guided tours and free time. The Winelands tour was a highlight!", date: "2024-03-25" },
          { name: "Mark Johnson", rating: 4, comment: "Great value for money. The wildlife safari and harbour cruise were excellent experiences.", date: "2024-04-10" },
          { name: "Sarah Williams", rating: 5, comment: "Well-organized tour with comfortable accommodations. Highly recommend for families.", date: "2024-04-20" }
        ],
        packageCategory: 'regular',
        highlights: [
          'Private airport transfers for arrival and departure',
          'Half-day guided Cape Town city tour covering historical districts',
          'Wildlife Safari with BBQ dinner and cultural activities',
          'Evening Waterfront Harbour Cruise Dinner',
          'Cape Winelands tour with optional tastings',
          'Free day for shopping and personal exploration',
          'Choice of 3-Star, 4-Star, or 5-Star hotels'
        ],
        bestTimeToVisit: {
          yearRound: 'Available year-round.',
          winter: 'Ideal for outdoor activities',
          summer: 'More economical pricing, with tours scheduled indoors or during comfortable hours'
        },
        whyChoosePremiumSkygoTours: [
          'Carefully paced itinerary to avoid travel fatigue',
          'Transparent inclusions and exclusions',
          'Trusted local operations and licensed services',
          'Flexible hotel categories without changing itinerary quality',
          'Dedicated support before and during the trip'
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'capetown-essential-experience') {
      // Set Cape Town Essential Experience package data
      setPackageData({
        _id: 'capetown-essential-experience',
        title: 'Cape Town Essential Experience',
        subtitle: '3 Nights / 4 Days Cape Town Tour',
        about: 'The Cape Town Essential Experience – 3 Nights 4 Days is a thoughtfully designed short holiday that introduces travelers to Cape Town\'s iconic landmarks, cultural contrasts, and leisure lifestyle. This package balances guided sightseeing with relaxed pacing, making it ideal for travelers who want a meaningful Cape Town experience within a limited timeframe.',
        services: [
          'Half-day guided Cape Town city tour',
          'Wildlife Safari with BBQ dinner and cultural activities',
          'Table Mountain and V&A Waterfront visit',
          'Cape Town Harbour Cruise Dinner',
          'Flexible hotel options (3★, 4★, 5★)',
          'Private airport transfers',
          'Daily breakfast at the hotel'
        ],
        tourDetails: `Abstract
The Cape Town Essential Experience – 3 Nights 4 Days is a thoughtfully designed short holiday that introduces travelers to Cape Town's iconic landmarks, cultural contrasts, and leisure lifestyle. This package balances guided sightseeing with relaxed pacing, making it ideal for travelers who want a meaningful Cape Town experience within a limited timeframe.

Overview
Cape Town is a destination that rewards thoughtful planning.In just a few days, visitors can witness historic neighborhoods, futuristic skylines, golden landscapes, and vibrant waterfronts.The Cape Town Essential Experience is curated for travelers who want to see the highlights without feeling rushed or overwhelmed.

This package begins with a smooth airport arrival and private hotel transfer, ensuring comfort from the very first moment.The sightseeing flow is structured to avoid early fatigue—city tours are scheduled during favorable hours, while experiential activities such as wildlife safaris and harbour cruises are placed in the evenings for maximum comfort.

A half - day Cape Town city tour introduces both historic Cape Town, with its traditional markets and cultural quarters, and modern districts, showcasing architectural icons and modern infrastructure.The wildlife safari adds cultural depth, offering insight into regional heritage through traditional activities and a relaxed BBQ dinner.

A dedicated day for Table Mountain and V&A Waterfront allows guests to explore at their own pace, followed by a scenic Harbour Cruise Dinner, providing a calm and memorable conclusion to the journey.

This tour is suitable year - round, with summer departures focusing on comfortable attractions and evening experiences.Hotel categories allow travelers to choose comfort levels without altering the core itinerary.

  Highlights`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival & Hotel Transfer',
            description: 'Arrival at Cape Town International Airport followed by private transfer to the hotel. Rest of the day at leisure.'
          },
          {
            day: 2,
            title: 'Cape Town City Tour & Wildlife Safari',
            description: 'Morning half-day city tour covering major highlights of historical and modern Cape Town. Afternoon, wildlife safari with game drive, camp activities, and BBQ dinner.'
          },
          {
            day: 3,
            title: 'Table Mountain, Waterfront & Harbour Cruise',
            description: 'Visit V&A Waterfront and Table Mountain (ticket optional). Evening Harbour Cruise with dinner.'
          },
          {
            day: 4,
            title: 'Departure',
            description: 'Private transfer to the airport for departure.'
          }
        ],
        price: 0,
        duration: '3 Nights / 4 Days',
        location: 'Cape Town, South Africa',
        capacity: '2-6 Guests',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Skyline' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Table Mountain' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Waterfront' },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Wildlife Safari' }
        ],
        bookings: 0,
        rating: 4.7,
        inclusions: [
          {
            category: 'Airport Transfers',
            items: ['Arrival and departure airport transfers in a private, air-conditioned vehicle']
          },
          {
            category: 'Hotel Accommodation',
            items: [
              'Twin-sharing accommodation based on selected category:',
              'Deluxe Package: 3-star hotel',
              'Gold Package: 4-star hotel',
              'Platinum Package: 5-star hotel'
            ]
          },
          {
            category: 'Meals',
            items: [
              'Daily breakfast at the hotel',
              'BBQ Dinner during Wildlife Safari',
              'Buffet Dinner during Harbour Cruise'
            ]
          },
          {
            category: 'Sightseeing & Tours',
            items: ['Half-day Cape Town City Tour on a sharing (SIC) basis']
          },
          {
            category: 'Experiences',
            items: [
              '4x4 Wildlife Safari with game drive & camp activities',
              'Harbour Cruise Dinner on a sharing basis'
            ]
          },
          {
            category: 'Guide & Assistance',
            items: [
              'English-speaking guide during city tours',
              'Local assistance and coordination throughout the trip'
            ]
          },
          {
            category: 'Taxes',
            items: ['Government taxes and official service charges']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['Flights to and from Cape Town (can be arranged upon request)']
          },
          {
            category: 'South Africa Entry Visa',
            items: ['Cape Town visa fees (assistance available if required)']
          },
          {
            category: 'Entry Tickets',
            items: ['Theme parks, attractions, and monument tickets (Arranged at actual cost based on traveler preference)']
          },
          {
            category: 'Personal Expenses',
            items: [
              'Lunches, beverages, shopping',
              'Laundry, phone calls, minibar usage'
            ]
          },
          {
            category: 'Insurance',
            items: ['Travel and medical insurance']
          },
          {
            category: 'Early Check-in / Late Check-out',
            items: ['Subject to hotel policy and availability']
          }
        ],
        transportation: [
          { type: 'Private Transfer', vehicle: 'Air-conditioned vehicle', description: 'Private airport transfers for arrival and departure' },
          { type: 'Shared Vehicle', vehicle: '4x4 / Coach', description: 'Shared transportation for city tours and wildlife safari' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'Choice of 3-Star, 4-Star, or 5-Star', rooms: 'Twin sharing', roomType: 'Standard/Deluxe/Luxury', nights: '3 Nights' }
        ],
        reviews: [
          { name: "David Thompson", rating: 5, comment: "Perfect short trip! Covered all the essentials without feeling rushed. The wildlife safari was amazing!", date: "2024-02-15" },
          { name: "Lisa Anderson", rating: 4, comment: "Great value for money. The city tour and harbour cruise were highlights. Highly recommend!", date: "2024-03-10" },
          { name: "Robert Martinez", rating: 5, comment: "Well-organized tour with excellent guides. The Table Mountain visit was unforgettable.", date: "2024-04-05" }
        ],
        packageCategory: 'regular',
        highlights: [
          'Half-day guided Cape Town city tour',
          'Wildlife Safari with BBQ dinner and cultural activities',
          'Table Mountain and V&A Waterfront visit',
          'Cape Town Harbour Cruise Dinner',
          'Flexible hotel options (3★, 4★, 5★)'
        ],
        hotelOptions: [
          'Deluxe Package: 3★ hotels, twin sharing, breakfast included',
          'Gold Package: 4★ hotels, twin sharing, breakfast included',
          'Platinum Package: 5★ hotels, twin sharing, breakfast included'
        ],
        bestTimeToVisit: {
          yearRound: 'Cape Town can be visited throughout the year',
          summer: 'Summer months offer great weather, with activities planned outdoors or during comfortable hours'
        },
        whyChoosePremiumSkygoTours: [
          'Clear itineraries with realistic pacing',
          'Transparent inclusions and exclusions',
          'Reliable ground handling and local expertise',
          'Flexible hotel category options'
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'capetown-grand-experience') {
      // Set Cape Town Grand Experience package data
      setPackageData({
        _id: 'capetown-grand-experience',
        title: 'Cape Town Grand Experience',
        subtitle: '6 Nights / 7 Days Cape Town Tour',
        about: 'The Cape Town Grand Experience – 6 Nights / 7 Days tour is thoughtfully curated for travelers who want to explore Cape Town in depth while maintaining a relaxed and enjoyable pace. This itinerary allows guests to experience the city\'s iconic landmarks, cultural heritage, leisure attractions, and neighboring Winelands without feeling rushed.',
        services: [
          'Private airport transfers on arrival and departure',
          'Half-day Cape Town city tour covering historical districts',
          'Table Mountain Aerial Cableway and V&A Waterfront visit',
          'Wildlife safari with BBQ dinner and cultural activities',
          'Full-day Winelands tour with estate visits',
          'Cape of Good Hope, Boulders Beach, and Kirstenbosch Garden',
          'Aquarium visit and Waterfront evening time',
          'Free day for shopping or optional activities',
          'Choice of 3★, 4★, or 5★ hotel accommodations'
        ],
        tourDetails: `Abstract
The Cape Town Grand Experience – 6 Nights / 7 Days tour is thoughtfully curated for travelers who want to explore Cape Town in depth while maintaining a relaxed and enjoyable pace.This itinerary allows guests to experience the city's iconic landmarks, cultural heritage, leisure attractions, and neighboring Winelands without feeling rushed.
By combining guided sightseeing with free leisure time, this package offers flexibility while ensuring that all major highlights are covered.It is especially suitable for families and travelers who value comfort, structured planning, and dependable local support throughout their journey.

Tour Overview
Cape Town is not a city to be rushed.Its diversity, from ancient trading routes to modern landscapes, requires time to fully appreciate.The Cape Town Grand Experience is designed for travelers who want a more comprehensive understanding of the city and its surroundings.

Over the course of seven days, guests explore Cape Town's old quarters, modern skyline, coastal landscapes, and world-famous attractions. The itinerary includes essential experiences such as a half-day city tour, Table Mountain and V&A Waterfront visit, a traditional wildlife safari, and a relaxing harbour cruise through the Waterfront.

A full - day excursion to the Winelands, the heart of the Western Cape's wine region, adds significant depth to the trip.This visit provides scenic and historical contrast, helping travelers understand the regional identity beyond Cape Town.

Additional experiences such as Cape of Good Hope, Boulders Beach, and Kirstenbosch Garden ensure exposure to both natural beauty and botanical heritage.The tour also includes an aquarium visit and evening leisure time at the Waterfront, offering entertainment suitable for all age groups.

A dedicated free day allows guests to rest, shop, or add optional activities based on personal interests.This balance between planned sightseeing and leisure time makes the tour suitable year - round.

Key Highlights`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Cape Town & Hotel Transfer',
            description: 'Arrive at Cape Town International Airport, where you will be greeted by our representative and transferred privately to your hotel. After check-in, the remainder of the day is free for rest or a short walk around the hotel area. Overnight stay in Cape Town.'
          },
          {
            day: 2,
            title: 'Half-Day Cape Town City Tour & Table Mountain',
            description: 'After breakfast, depart for a half-day Cape Town city tour on a shared basis. The tour introduces major cultural and modern landmarks, offering insight into the city\'s history. In the afternoon, proceed to Table Mountain for the Aerial Cableway experience. Return to the hotel for overnight stay.'
          },
          {
            day: 3,
            title: 'Full-Day Winelands Experience',
            description: 'After breakfast, travel to the Winelands for a full-day tour on a shared basis. The tour includes major estates and historical towns like Stellenbosch and Franschhoek. This day provides a broader understanding of South Africa\'s wine culture and scenic beauty. Return to Cape Town in the evening. Overnight stay at the hotel.'
          },
          {
            day: 4,
            title: 'Cape of Good Hope, Boulders Beach & Waterfront Harbour Cruise Dinner',
            description: 'After breakfast, proceed for a scenic tour including Cape of Good Hope and the penguin colony at Boulders Beach. In the evening, enjoy a Harbour Cruise Dinner on a sharing basis. Experience Cape Town\'s coastline from the water while enjoying a buffet dinner. Return to the hotel for overnight stay.'
          },
          {
            day: 5,
            title: 'Aquarium Visit & Waterfront Leisure',
            description: 'After breakfast, the day begins with a visit to the Two Oceans Aquarium, a popular attraction for families. The rest of the afternoon and evening is free for leisure at the V&A Waterfront. Return to the hotel for overnight stay.'
          },
          {
            day: 6,
            title: 'Shopping & Free Day',
            description: 'After breakfast, enjoy a free day for shopping or independent exploration. Guests may visit local markets, Kirstenbosch Garden, or add optional tours. Overnight stay at the hotel.'
          },
          {
            day: 7,
            title: 'Departure',
            description: 'After breakfast and hotel check-out, you will be transferred privately to Cape Town International Airport for your onward journey.'
          }
        ],
        price: 0,
        duration: '6 Nights / 7 Days',
        location: 'Cape Town, South Africa',
        capacity: '2-6 Guests',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Skyline' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Table Mountain' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Winelands' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Waterfront' },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Wildlife Safari' }
        ],
        bookings: 0,
        rating: 4.8,
        inclusions: [
          {
            category: 'Airport & Hotel Transfers',
            items: ['Private airport and hotel transfers']
          },
          {
            category: 'Hotel Accommodation',
            items: ['Hotel accommodation on twin sharing basis']
          },
          {
            category: 'Meals',
            items: [
              'Daily breakfast',
              'Dinners during wildlife safari and harbour cruise'
            ]
          },
          {
            category: 'Sightseeing & Tours',
            items: [
              'Cape Town city and Winelands tours on SIC basis',
              'All the tours as per the itinerary'
            ]
          },
          {
            category: 'Experiences',
            items: [
              'Wildlife safari in shared 4x4 vehicle with camp activities',
              'Waterfront harbour cruise on sharing basis'
            ]
          },
          {
            category: 'Guide & Assistance',
            items: ['English-speaking guide during tours']
          },
          {
            category: 'Taxes',
            items: ['Government taxes and official service charges']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['International airfare']
          },
          {
            category: 'South Africa Entry Visa',
            items: ['South Africa entry visa (available on request)']
          },
          {
            category: 'Personal Expenses',
            items: ['Personal expenses (shopping, drinks, laundry, insurance)']
          },
          {
            category: 'Entry Tickets',
            items: ['Entry tickets to parks and attractions (arranged at actual cost)']
          }
        ],
        transportation: [
          { type: 'Private Transfer', vehicle: 'Air-conditioned vehicle', description: 'Private airport transfers for arrival and departure' },
          { type: 'Shared Vehicle', vehicle: '4x4 / Coach', description: 'Shared transportation for city tours and wildlife safari' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'Choice of 3-Star, 4-Star, or 5-Star', rooms: 'Twin sharing', roomType: 'Standard/Deluxe/Luxury', nights: '6 Nights' }
        ],
        reviews: [
          { name: "Michael Brown", rating: 5, comment: "Comprehensive tour covering all major attractions. The Winelands visit was a great addition!", date: "2024-01-20" },
          { name: "Emily Davis", rating: 5, comment: "Perfect for families! The aquarium and Waterfront leisure were hits with the kids.", date: "2024-02-28" },
          { name: "James Wilson", rating: 4, comment: "Well-paced itinerary with good balance of guided tours and free time. Highly recommend!", date: "2024-03-15" }
        ],
        packageCategory: 'regular',
        highlights: [
          'Private airport transfers on arrival and departure',
          'Half-day Cape Town city tour covering historical districts',
          'Table Mountain and V&A Waterfront visit',
          'Wildlife safari with BBQ dinner and cultural activities',
          'Full-day Winelands tour with estate visits',
          'Cape of Good Hope, Boulders Beach, and Kirstenbosch Garden',
          'Aquarium visit and Waterfront leisure time',
          'Free day for shopping or optional activities',
          'Choice of 3★, 4★, or 5★ hotel accommodations'
        ],
        bestTimeToVisit: {
          yearRound: 'Cape Town can be visited throughout the year',
          winter: 'Winter offers pleasant conditions for sightseeing',
          summer: 'Summer months provide the best weather for coastal activities'
        },
        whyChoosePremiumSkygoTours: [
          'Well-balanced itinerary without rushed sightseeing',
          'Clear inclusions and transparent pricing',
          'Licensed local operators and experienced guides',
          'Flexible hotel options to suit different budgets',
          'Dedicated customer support before and during travel'
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'capetown-signature-explorer') {
      // Set Cape Town Signature Explorer package data
      setPackageData({
        _id: 'capetown-signature-explorer',
        title: 'Cape Town Signature Explorer',
        subtitle: '5 Nights / 6 Days Cape Town Tour',
        about: 'The Cape Town Signature Explorer – 5 Nights / 6 Days tour is designed for travelers who wish to experience Cape Town in a more immersive and relaxed way, without rushing through major attractions. This itinerary carefully balances guided sightseeing, iconic landmarks, cultural experiences, and personal free time, allowing guests to absorb the city at a comfortable pace.',
        services: [
          'Private airport transfers for arrival and departure',
          'Half-day Cape Town city tour covering historical districts',
          'Table Mountain and V&A Waterfront visit',
          'Wildlife safari with BBQ dinner and cultural activities',
          'Full-day Winelands tour with estate visits',
          'Free day for shopping and independent exploration',
          'Choice of Deluxe, Gold, or Platinum hotel categories'
        ],
        tourDetails: `Abstract
The Cape Town Signature Explorer – 5 Nights / 6 Days tour is designed for travelers who wish to experience Cape Town in a more immersive and relaxed way, without rushing through major attractions.This itinerary carefully balances guided sightseeing, iconic landmarks, cultural experiences, and personal free time, allowing guests to absorb the city at a comfortable pace.
With the inclusion of both Cape Town and Winelands highlights, modern attractions, wild landscapes, and waterfront experiences, this tour offers a well - rounded introduction to the Western Cape.Whether you are traveling with family, as a couple, or independently, this package ensures smooth logistics, dependable service, and transparent planning from arrival to departure.

Tour Overview
Cape Town is a city that rewards time.While shorter trips offer glimpses of its mountains, a 5 - night stay allows travelers to truly settle in, explore beyond surface - level attractions, and enjoy the rhythm of the city.

The Cape Town Signature Explorer tour begins with a relaxed arrival day, followed by guided sightseeing that introduces the city's historical and modern layers.Guests gain cultural context through heritage districts and iconic landmarks while enjoying the convenience of shared city tours led by experienced guides.

A dedicated Table Mountain and V&A Waterfront visit allows time to appreciate the city's natural achievements and waterfront culture. The experience is complemented by a wildlife safari, offering a striking contrast to the urban environment through natural landscapes and traditional entertainment.

The inclusion of a full - day Winelands tour broadens the journey, showcasing the region's historical and scenic depth. This addition provides perspective on the country's heritage beyond the city alone.

Unlike tightly packed itineraries, this package intentionally includes a free shopping and leisure day, recognizing that travelers value flexibility, whether for relaxation, shopping, or optional experiences.

This tour is available year - round.While summer months are ideal for outdoor exploration, winter travel offers cost - effective pricing, with most activities conducted during comfortable hours.

Key Highlights`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Cape Town & Hotel Transfer',
            description: 'Upon arrival at Cape Town International Airport, our representative will welcome you and assist with a private transfer to your hotel. After check-in, the rest of the day is free for relaxation or light exploration nearby. Overnight stay at the hotel.'
          },
          {
            day: 2,
            title: 'Half-Day Cape Town City Tour & Table Mountain',
            description: 'After breakfast, depart for a half-day Cape Town city tour on a shared basis. This guided experience introduces you to the city\'s orientation and history. In the afternoon, proceed to Table Mountain for the Aerial Cableway experience. Return to the hotel for overnight stay.'
          },
          {
            day: 3,
            title: 'Full-Day Winelands Experience',
            description: 'After breakfast, depart for a full-day Winelands tour on a shared basis. The tour includes major estates and historical towns like Stellenbosch and Franschhoek. This day offers a deeper understanding of the region\'s heritage and scenic beauty. Return to Cape Town in the evening. Overnight stay at the hotel.'
          },
          {
            day: 4,
            title: 'Cape of Good Hope, Boulders Beach & Waterfront Harbour Cruise Dinner',
            description: 'After breakfast, proceed for a sightseeing day covering Cape of Good Hope and the penguin colony at Boulders Beach. In the evening, enjoy a Harbour Cruise Dinner on a sharing basis. Relax while cruising through Cape Town Waterfront, accompanied by a buffet dinner and city views at night. Return to the hotel for overnight stay.'
          },
          {
            day: 5,
            title: 'Shopping & Waterfront Leisure',
            description: 'After breakfast, the day is kept free for shopping and leisure. Guests may visit popular markets or the V&A Waterfront. In the evening, enjoy the vibrant atmosphere of the city. Return to the hotel for overnight stay.'
          },
          {
            day: 6,
            title: 'Departure',
            description: 'After breakfast and check-out, you will be transferred privately to Cape Town International Airport for your onward journey.'
          }
        ],
        price: 0,
        duration: '5 Nights / 6 Days',
        location: 'Cape Town, South Africa',
        capacity: '2-6 Guests',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Skyline' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Table Mountain' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Winelands' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Waterfront' },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Wildlife Safari' }
        ],
        bookings: 0,
        rating: 4.8,
        inclusions: [
          {
            category: 'Airport & Hotel Transfers',
            items: ['Private airport and hotel transfers']
          },
          {
            category: 'Hotel Accommodation',
            items: ['Hotel accommodation on twin sharing basis']
          },
          {
            category: 'Meals',
            items: [
              'Daily breakfast',
              'Dinners during wildlife safari and harbour cruise'
            ]
          },
          {
            category: 'Sightseeing & Tours',
            items: [
              'Cape Town city and Winelands tours on SIC basis'
            ]
          },
          {
            category: 'Experiences',
            items: [
              'Wildlife safari in shared 4x4 vehicle with camp activities',
              'Harbour cruise on sharing basis'
            ]
          },
          {
            category: 'Guide & Assistance',
            items: ['English-speaking guide during tours']
          },
          {
            category: 'Taxes',
            items: ['Government taxes and office expenses']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['International airfare']
          },
          {
            category: 'South Africa Entry Visa',
            items: ['South Africa entry visa (available on request)']
          },
          {
            category: 'Personal Expenses',
            items: ['Personal expenses (shopping, drinks, laundry, insurance)']
          },
          {
            category: 'Entry Tickets',
            items: ['Entry tickets to parks and attractions (arranged at actual cost)']
          }
        ],
        transportation: [
          { type: 'Private Transfer', vehicle: 'Air-conditioned vehicle', description: 'Private airport transfers for arrival and departure' },
          { type: 'Shared Vehicle', vehicle: '4x4 / Coach', description: 'Shared transportation for city tours and wildlife safari' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'Choice of 3-Star, 4-Star, or 5-Star', rooms: 'Twin sharing', roomType: 'Standard/Deluxe/Luxury', nights: '5 Nights' }
        ],
        reviews: [
          { name: "Sarah Johnson", rating: 5, comment: "Perfect balance of guided tours and free time. The Winelands tour was exceptional!", date: "2024-02-10" },
          { name: "Michael Chen", rating: 5, comment: "Great itinerary covering all major attractions. The wildlife safari was a highlight!", date: "2024-03-05" },
          { name: "Emma Williams", rating: 4, comment: "Well-organized tour with excellent guides. The free day allowed us to explore at our own pace.", date: "2024-04-12" }
        ],
        packageCategory: 'regular',
        highlights: [
          'Private airport transfers for arrival and departure',
          'Half-day Cape Town city tour covering historical districts',
          'Table Mountain and V&A Waterfront visit',
          'Wildlife safari with BBQ dinner and cultural activities',
          'Full-day Winelands tour with estate visits',
          'Free day for shopping and independent exploration',
          'Choice of Deluxe, Gold, or Platinum hotel categories'
        ],
        bestTimeToVisit: {
          yearRound: 'Cape Town is a year-round destination',
          winter: 'Winter months offer pleasant conditions for sightseeing',
          summer: 'Summer months provide the best weather for coastal activities'
        },
        whyChoosePremiumSkygoTours: [
          'Balanced itinerary with adequate rest and flexibility',
          'Transparent pricing with clearly listed inclusions',
          'Trusted local operators and licensed guides',
          'Multiple hotel categories without compromising service quality',
          'Dedicated assistance before and during travel'
        ]
      } as any);
      setLoading(false);
    } else if (actualId === 'capetown-stopover-signature') {
      // Set Cape Town Stopover Signature package data
      setPackageData({
        _id: 'capetown-stopover-signature',
        title: 'Cape Town Stopover Signature',
        subtitle: '2 Nights / 3 Days Stopover Tour',
        about: 'The Cape Town Stopover Signature – 2 Nights 3 Days is designed for travelers who want to experience Cape Town beyond a single night, without committing to a long holiday. Perfect for airline stopovers and short leisure breaks, this itinerary balances guided sightseeing with signature experiences such as wildlife safaris and harbour cruises.',
        services: [
          'Designed for 2–3 day airline stopovers',
          'Balanced mix of sightseeing and leisure',
          'Waterfront Harbour Cruise & Wildlife Safari included',
          'Flexible departure day schedule',
          'Multiple hotel category options'
        ],
        tourDetails: `Abstract
The Cape Town Stopover Signature – 2 Nights 3 Days is designed for travelers who want to experience Cape Town beyond a single night, without committing to a long holiday.Perfect for airline stopovers and short leisure breaks, this itinerary balances guided sightseeing with signature experiences such as wildlife safaris and harbour cruises.
With structured planning, flexible pacing, and professional coordination, this stopover package allows you to enjoy Cape Town's highlights while maintaining comfort and clarity throughout your stay.

Overview
Cape Town rewards travelers who take even a little extra time to explore.With two nights at your disposal, the city unfolds at a more relaxed pace, allowing you to experience both its cultural depth and natural appeal.The Cape Town Stopover Signature is crafted for travelers who want a complete experience within a short timeframe.

Your journey begins with a smooth airport arrival and private hotel transfer.After settling in, the first evening introduces you to Cape Town Waterfront through a Harbour Cruise Dinner, offering coastal views, calm waters, and a relaxed dining atmosphere.

Day two is dedicated to exploration.A half - day Cape Town city tour provides insight into the city's evolution, from historical neighborhoods and traditional markets to modern landmarks. In the afternoon, the pace shifts as you venture into the wildlife safari, featuring game drives, cultural activities, and a BBQ dinner under the stars.

The final day is intentionally unstructured, allowing time for shopping, leisure, or last - minute exploration before departure.This flexibility makes the package ideal for travelers managing return flights or onward connections.

Key Highlights`,
        itinerary: [
          {
            day: 1,
            title: 'Arrival & Harbour Cruise',
            description: 'Arrival and private airport transfer. Hotel check-in. Evening Harbour Cruise Dinner at V&A Waterfront. Overnight stay.'
          },
          {
            day: 2,
            title: 'City Tour & Wildlife Safari',
            description: 'Breakfast at hotel. Half-day Cape Town city sightseeing tour and back to hotel. Wildlife Safari with other activities and BBQ Dinner. Overnight stay.'
          },
          {
            day: 3,
            title: 'Shopping & Departure',
            description: 'Breakfast. Free time for shopping or leisure. Private airport transfer. Departure.'
          }
        ],
        price: 0,
        duration: '2 Nights / 3 Days',
        location: 'Cape Town, South Africa',
        capacity: '2-6 Guests',
        packageType: 'domestic',
        place: 'cape-town',
        images: [
          { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Skyline' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Cape Town Waterfront' },
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Wildlife Safari' },
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Table Mountain' }
        ],
        bookings: 0,
        rating: 4.6,
        inclusions: [
          {
            category: 'Airport Transfers',
            items: ['Arrival and departure airport transfers in a private, air-conditioned vehicle']
          },
          {
            category: 'Hotel Accommodation',
            items: [
              'Twin-sharing accommodation based on selected category:',
              'Deluxe Package: 3-star hotel',
              'Gold Package: 4-star hotel',
              'Platinum Package: 5-star hotel'
            ]
          },
          {
            category: 'Meals',
            items: [
              'Daily breakfast at the hotel',
              'BBQ Dinner during Wildlife Safari',
              'Buffet Dinner during Harbour Cruise'
            ]
          },
          {
            category: 'Sightseeing & Tours',
            items: ['Half-day Cape Town City Tour on a sharing (SIC) basis']
          },
          {
            category: 'Experiences',
            items: [
              '4x4 Wildlife Safari with game drive & camp activities',
              'Harbour Cruise Dinner on a sharing basis'
            ]
          },
          {
            category: 'Guide & Assistance',
            items: [
              'English-speaking guide during city tours',
              'Local assistance and coordination throughout the trip'
            ]
          },
          {
            category: 'Taxes',
            items: ['Government taxes and official service charges']
          }
        ],
        exclusions: [
          {
            category: 'International Airfare',
            items: ['Flights to and from Cape Town (can be arranged upon request)']
          },
          {
            category: 'South Africa Entry Visa',
            items: ['Cape Town visa fees (assistance available if required)']
          },
          {
            category: 'Entry Tickets',
            items: ['Theme parks, attractions, and monument tickets (Arranged at actual cost based on traveler preference)']
          },
          {
            category: 'Personal Expenses',
            items: [
              'Lunches, beverages, shopping',
              'Laundry, phone calls, minibar usage'
            ]
          },
          {
            category: 'Insurance',
            items: ['Travel and medical insurance']
          },
          {
            category: 'Early Check-in / Late Check-out',
            items: ['Subject to hotel policy and availability']
          }
        ],
        transportation: [
          { type: 'Private Transfer', vehicle: 'Air-conditioned vehicle', description: 'Private airport transfers for arrival and departure' },
          { type: 'Shared Vehicle', vehicle: '4x4 / Coach', description: 'Shared transportation for city tours and wildlife safari' }
        ],
        accommodation: [
          { city: 'Cape Town', hotel: 'Choice of 3-Star, 4-Star, or 5-Star', rooms: 'Twin sharing', roomType: 'Standard/Deluxe/Luxury', nights: '2 Nights' }
        ],
        reviews: [
          { name: "John Smith", rating: 5, comment: "Perfect for a quick stopover! The wildlife safari and harbour cruise were amazing experiences.", date: "2024-01-25" },
          { name: "Maria Garcia", rating: 4, comment: "Great value for a short stay. Well-organized and efficient.", date: "2024-02-18" },
          { name: "David Lee", rating: 5, comment: "Ideal for travelers with limited time. Covered all the essentials!", date: "2024-03-22" }
        ],
        packageCategory: 'regular',
        keyHighlights: [
          'Designed for 2–3 day airline stopovers',
          'Balanced mix of sightseeing and leisure',
          'Waterfront Harbour Cruise & Wildlife Safari included',
          'Flexible departure day schedule',
          'Multiple hotel category options'
        ],
        bestTimeToVisit: {
          yearRound: 'Available year-round',
          summer: 'Summer months offer better pricing, with most activities scheduled during comfortable hours'
        },
        whyChoosePremiumSkygoTours: [
          'Specialized stopover planning expertise',
          'Reliable timing coordination',
          'Transparent inclusions',
          'Comfortable vehicles & professional guides'
        ],
        optionalAddOns: [
          'Table Mountain tickets',
          'Winelands day tour extension',
          'Private sightseeing upgrade'
        ]
      } as any);
      setLoading(false);
      return; // Skip API fetch for demo package
    }
    // For other package IDs, the first useEffect will handle API fetching
  }, [params?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isInternational = packageData && !packageData.location.toLowerCase().includes('nepal');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Curating your experience...</h2>
        </div>
      </div>
    );
  }

  // All packages use the same standard layout regardless of category
  const isAttractionPackage = false;
  const isUpcomingTourPackage = Boolean(
    (packageData as Package & { fixedDepartures?: Array<{ month: string; dates: string }> }).fixedDepartures?.length
  );

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-xl">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <Globe className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h3>
            <p className="text-gray-600 mb-8">{error || 'The package you are looking for does not exist.'}</p>
            <Button onClick={() => router.back()} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPremium = packageData && (
    packageData.packageCategory?.toLowerCase() === 'premium' ||
    packageData.packageCategory?.toLowerCase() === 'luxury'
  );

  const experienceCategory = getCategoryByValue(packageData.packageCategory);

  return (
    <div className={`min-h-screen ${playfair.variable} ${cormorant.variable} ${poppins.variable} font-sans bg-[#faf8f3]`}>
      {/* Immersive Hero Section */}
      <div className={`relative h-[70vh] md:h-[80vh] w-full overflow-hidden ${isPremium ? 'shadow-2xl' : ''}`}>
        <div className="absolute inset-0">
          {Array.isArray(packageData.images) && packageData.images.length > 0 ? (
            <Image
              src={packageData.images[selectedImageIndex].url}
              alt={packageData.images[selectedImageIndex].alt || packageData.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              priority
            />
          ) : (
            <div className="w-full h-full bg-[#1e1f44] flex items-center justify-center">
              <Globe className="h-24 w-24 text-[#bd9245]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1f44] via-[#1e1f44]/40 to-transparent" />
        </div>

        {/* Navigation Bar Overlay */}
        <div className="absolute top-12 left-0 right-0 p-6 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-3">
              <Button size="icon" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  {experienceCategory ? (
                    <Link href={experienceCategory.href}>
                      <Badge className="bg-teal-600 hover:bg-teal-700 text-white border-none px-5 py-2 text-xs font-black uppercase tracking-[0.15em] shadow-xl cursor-pointer">
                        {experienceCategory.label}
                      </Badge>
                    </Link>
                  ) : packageData.packageCategory ? (
                    <Badge className="bg-teal-600 text-white border-none px-5 py-2 text-xs font-black uppercase tracking-[0.15em] shadow-xl">
                      {packageData.packageCategory}
                    </Badge>
                  ) : null}
                  {isPremium ? (
                    <Badge className="bg-[#bd9245] text-white border-none px-6 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                      <Sparkles className="h-3 w-3 mr-2" />
                      Premium Experience
                    </Badge>
                  ) : (
                    <Badge className="bg-[#1e1f44] text-white border-none px-4 py-1.5 text-xs font-black uppercase tracking-[0.1em] shadow-lg">
                      {isAttractionPackage ? "Exclusive Experience" : isInternational ? "International Journey" : "Domestic Tour"}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-sm font-bold text-white shadow-xl">
                    <Star className="h-4 w-4 fill-[#bd9245] text-[#bd9245]" />
                    <span className="font-black">{packageData.rating}</span>
                    <span className="text-white/70 ml-1 text-xs uppercase tracking-tighter">({packageData.reviews?.length || 0} reviews)</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-shadow-lg leading-tight font-playfair">
                  {packageData.title}
                </h1>
                {packageData.subtitle && (
                  <p className={`text-xl md:text-2xl text-white/90 mb-6 ${isPremium ? 'font-poppins font-light' : ''}`}>
                    {packageData.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-white font-black uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-3 bg-[#1e1f44]/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-2xl transition-all hover:border-[#bd9245]/50 group">
                    <div className="p-2 bg-[#bd9245]/20 rounded-lg group-hover:bg-[#bd9245]/40 transition-colors">
                      <MapPin className="h-4 w-4 text-[#bd9245]" />
                    </div>
                    <span>{packageData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1e1f44]/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-2xl transition-all hover:border-[#bd9245]/50 group">
                    <div className="p-2 bg-[#bd9245]/20 rounded-lg group-hover:bg-[#bd9245]/40 transition-colors">
                      <Clock className="h-4 w-4 text-[#bd9245]" />
                    </div>
                    <span>{packageData.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1e1f44]/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-2xl transition-all hover:border-[#bd9245]/50 group">
                    <div className="p-2 bg-[#bd9245]/20 rounded-lg group-hover:bg-[#bd9245]/40 transition-colors">
                      <Users className="h-4 w-4 text-[#bd9245]" />
                    </div>
                    <span>{packageData.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery Preview (Desktop) */}
              <div className="hidden lg:flex gap-3">
                {Array.isArray(packageData.images) && packageData.images.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all shadow-xl ${selectedImageIndex === index ? 'border-primary ring-2 ring-primary/30' : 'border-white/30 hover:border-white'
                      } `}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image src={image.url} alt={image.alt} fill className="object-cover" />
                  </div>
                ))}
                {packageData.images.length > 3 && (
                  <div className="w-24 h-16 rounded-lg bg-black/50 border-2 border-white/30 flex items-center justify-center text-white font-medium cursor-pointer hover:bg-black/70 backdrop-blur-sm">
                    +{packageData.images.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Special View for Attraction Packages - Dynamic Data from Database */}
            {isAttractionPackage && (
              <div className="space-y-12">
                {/* Visual Header Enhancement */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden group">
                  <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden">
                    {packageData.images && packageData.images.length > 0 ? (
                      <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={packageData.images[0].url}
                        alt={packageData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <PackageIcon className="h-20 w-20 text-gray-800" />
                      </div>
                    )}
                    {/* Multi-layered Premium Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-16 left-8 md:left-16 right-8 md:right-16 z-10">
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-4 mb-8"
                      >
                        {experienceCategory ? (
                          <Link href={experienceCategory.href}>
                            <Badge className="bg-teal-600 hover:bg-teal-700 text-white border-none px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-teal-600/30 cursor-pointer">
                              {experienceCategory.label}
                            </Badge>
                          </Link>
                        ) : (
                          <Badge className="bg-[#bd9245] text-white hover:bg-[#bd9245] border-none px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#bd9245]/30">
                            {packageData.packageCategory} Selection
                          </Badge>
                        )}
                        <Badge className="bg-white/10 backdrop-blur-2xl text-white border-white/10 px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                          {packageData.packageType}
                        </Badge>
                      </motion.div>
                      
                      <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-[-0.04em] leading-[0.9] drop-shadow-2xl"
                      >
                        {packageData.title.split(' ').slice(0, -1).join(' ')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bd9245] to-[#f4d06f]">
                          {packageData.title.split(' ').slice(-1)}
                        </span>
                      </motion.h1>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap items-center gap-8 text-white/70 font-black uppercase tracking-[0.2em] text-[10px]"
                      >
                        <span className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xl">
                            <MapPin className="h-4 w-4 text-[#bd9245]" />
                          </div>
                          {packageData.location}
                        </span>
                        <div className="h-1 w-1 bg-white/30 rounded-full" />
                        <span className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xl">
                            <Clock className="h-4 w-4 text-[#bd9245]" />
                          </div>
                          {packageData.duration}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  <CardContent className="p-8 md:p-12">
                    {/* About Romoire Story */}
                    {packageData.about && (
                      <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl mb-12">
                        <div className="p-8 bg-gray-50 border-b border-gray-100">
                           <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-900 rounded-2xl text-white">
                              <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="text-amber-600 font-bold uppercase text-[10px] tracking-[0.4em]">The Collection</h4>
                              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">The {SITE_NAME} Story</h3>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-8">
                          <p className="text-gray-600 text-xl leading-relaxed font-serif italic">
                            {brandedText(packageData.about)}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Elite Summary Grid */}
                    {/* Elite Summary Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                      {packageData.abstract && (
                        <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl group">
                          <div className="p-8 bg-gray-50 border-b border-gray-100">
                             <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.4em]">Concierge Abstract</h4>
                          </div>
                          <CardContent className="p-8">
                             <h3 className="text-2xl font-black mb-6 leading-none uppercase tracking-tighter text-gray-900">Premium Glimpse</h3>
                             <p className="text-gray-600 font-medium leading-relaxed italic border-l-2 border-amber-500/20 pl-6 text-xl">
                               {packageData.abstract}
                             </p>
                          </CardContent>
                        </Card>
                      )}

                      {packageData.bestTimeToVisit && (
                        <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl group">
                          <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                             <h4 className="text-orange-600 font-black uppercase text-[10px] tracking-[0.4em]">Seasonal Wisdom</h4>
                             <Calendar className="h-5 w-5 text-orange-500 opacity-30" />
                          </div>
                          <CardContent className="p-8">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tighter leading-none">Ideal Climates</h3>
                            <div className="space-y-4 font-black tracking-tight text-gray-800">
                              {packageData.bestTimeToVisit.yearRound && (
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                  <div className="h-2 w-2 bg-orange-500 rounded-full" />
                                  <span className="text-base">{packageData.bestTimeToVisit.yearRound}</span>
                                </div>
                              )}
                              {(packageData.bestTimeToVisit.winter || packageData.bestTimeToVisit.summer) && (
                                  <div className="grid grid-cols-2 gap-4">
                                       {packageData.bestTimeToVisit.winter && (
                                          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                                              <p className="text-[10px] uppercase tracking-widest text-blue-500 mb-1 font-bold">Winter</p>
                                              <p className="text-xs font-black">{packageData.bestTimeToVisit.winter}</p>
                                          </div>
                                       )}
                                       {packageData.bestTimeToVisit.summer && (
                                          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/30">
                                              <p className="text-[10px] uppercase tracking-widest text-orange-500 mb-1 font-bold">Summer</p>
                                              <p className="text-xs font-black">{packageData.bestTimeToVisit.summer}</p>
                                          </div>
                                       )}
                                  </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Quick Stats Grid */}
                    <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl mb-12">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pricing</p>
                          <p className="text-xl font-black text-[#bd9245] tracking-tighter uppercase">On Request</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Experience Vibe</p>
                          <p className="text-xl font-black text-[#bd9245] tracking-tighter uppercase">Ultimate</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Guest Capacity</p>
                          <p className="text-xl font-black text-gray-900 tracking-tighter">{packageData.capacity || '1 - 6'} PAX</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Booking Status</p>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-xl font-black text-gray-900 tracking-tighter uppercase">Instant</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Main Sections for Attraction Packages */}
                    <div className="grid lg:grid-cols-1 gap-12">

                      {/* Key Highlights */}
                      {packageData.keyHighlights && packageData.keyHighlights.length > 0 && (
                        <div className="space-y-8">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#bd9245]/10 rounded-2xl">
                              <Star className="h-6 w-6 text-[#bd9245]" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Key Highlights</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {packageData.keyHighlights.map((highlight: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                                <div className="p-2 bg-green-50 rounded-lg">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-bold text-sm uppercase tracking-tight">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Our Services */}
                      {packageData.services && (
                        <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl mb-12">
                          <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <div>
                               <h4 className="text-blue-600 font-bold uppercase text-[10px] tracking-[0.4em]">The Service Deck</h4>
                               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Elite Services</h3>
                            </div>
                            <Award className="h-6 w-6 text-blue-600 opacity-30" />
                          </div>
                          <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {(Array.isArray(packageData.services) ? packageData.services : packageData.services.split(',')).map((service: string, idx: number) => (
                                <div key={idx} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-center group transition-colors hover:bg-white hover:shadow-md">
                                  <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.1em]">{brandedText(service.trim())}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Tour Itinerary */}
                      {packageData.itinerary && packageData.itinerary.length > 0 && (
                        <div className="mt-16 pt-16 border-t border-gray-100">
                          <div className="flex items-center gap-6 mb-12">
                            <div className="p-4 bg-amber-50 rounded-[24px]">
                               <Calendar className="h-8 w-8 text-[#bd9245]" />
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter text-black">Daily Itinerary</h3>
                          </div>

                          <div className="space-y-8">
                            {packageData.itinerary.map((day: any, index: number) => (
                              <div key={index} className="bg-white border border-[#bd9245]/20 rounded-[40px] p-8 md:p-12 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center justify-between mb-10">
                                   <div className="flex items-center gap-8">
                                      <div className="w-20 h-20 bg-[#bd9245] rounded-[28px] flex flex-col items-center justify-center text-white shadow-lg shadow-[#bd9245]/20">
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Day</span>
                                        <span className="text-3xl font-black">{day.day}</span>
                                      </div>
                                      <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{day.title}</h4>
                                   </div>
                                   <div className="h-12 w-12 rounded-full border border-[#bd9245]/20 flex items-center justify-center text-[#bd9245]/60">
                                     <ArrowRight className="h-6 w-6 rotate-90" />
                                   </div>
                                </div>

                                <div className="flex gap-10 ml-4 md:ml-10">
                                   <div className="w-px bg-[#bd9245]/20 h-auto self-stretch mt-2 mb-2" />
                                   <div className="text-gray-600 text-lg leading-relaxed font-medium py-1">
                                     {day.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                                       <p key={i} className="mb-4 last:mb-0">{line}</p>
                                     ))}
                                   </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pricing Information */}
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-amber-50 rounded-2xl">
                            <Ticket className="h-6 w-6 text-amber-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Ticket Options</h3>
                        </div>
                        {packageData.hotelOptions && packageData.hotelOptions.length > 0 && (
                          <div className="grid md:grid-cols-2 gap-6">
                            {packageData.hotelOptions.map((option: string, idx: number) => {
                              const priceMatch = option.match(/(?:AED|ZAR|R)\s*(\d+)/i);
                              const price = priceMatch ? priceMatch[1] : null;
                              const isHighlighted = option.toLowerCase().includes('prime') || option.toLowerCase().includes('adult');

                              return (
                                <div
                                  key={idx}
                                  className={`p-8 rounded-3xl border-2 transition-all duration-500 group ${isHighlighted
                                    ? 'bg-[#1e1f44] border-[#1e1f44] text-white shadow-2xl skew-y-1 hover:skew-y-0'
                                    : 'bg-white border-gray-100 text-[#1e1f44] hover:border-[#bd9245]/30'
                                    }`}
                                >
                                  <div className="flex flex-col h-full">
                                    <div className="mb-4">
                                      <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${isHighlighted ? 'text-[#bd9245]' : 'text-gray-400'}`}>
                                        {isHighlighted ? 'Most Popular' : 'Ticket Category'}
                                      </span>
                                      <h4 className="text-xl font-black uppercase tracking-tighter leading-tight">
                                        {option.split(':')[0]}
                                      </h4>
                                    </div>
                                    {price ? (
                                      <div className="mt-auto pt-6 border-t border-white/10">
                                        <p className={`text-sm font-bold uppercase tracking-widest ${isHighlighted ? 'text-[#bd9245]' : 'text-gray-500'}`}>
                                          Contact us for pricing
                                        </p>
                                      </div>
                                    ) : (
                                      <p className={`text-sm mt-auto italic font-medium pt-4 ${isHighlighted ? 'text-white/70' : 'text-gray-500'}`}>
                                        {option.split(':')[1]?.trim() || option}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Logistics, Accommodation, Services, Inclusions Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                      {/* Transportation */}
                      {packageData.transportation && packageData.transportation.length > 0 && (
                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                              <CarIcon className="h-6 w-6 text-slate-600" />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Logistics</h4>
                          </div>
                          <div className="space-y-4">
                            {packageData.transportation.map((t: any, idx: number) => (
                              <div key={idx} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                <p className="font-bold text-gray-900 text-base uppercase">{t.type}</p>
                                <p className="text-gray-500 text-sm mt-0.5">{t.vehicle}</p>
                                {t.description && <p className="text-gray-600 text-base mt-2 leading-relaxed">{t.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Accommodation */}
                      {packageData.accommodation && packageData.accommodation.length > 0 && (
                        <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                              <Hotel className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Stay Details</h4>
                          </div>
                          <div className="space-y-4">
                            {packageData.accommodation.map((a: any, idx: number) => (
                              <div key={idx} className="pb-4 border-b border-indigo-100 last:border-0 last:pb-0">
                                <p className="font-bold text-gray-900 text-base uppercase">{a.city}: {a.hotel}</p>
                                <p className="text-gray-600 text-sm mt-1 font-medium">{a.roomType} • {a.nights} • {a.rooms} Room(s)</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Inclusions */}
                      {packageData.inclusions && packageData.inclusions.length > 0 && (
                        <div className="bg-green-50 p-8 rounded-[40px] border border-green-100">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">What's Included</h4>
                          </div>
                          <div className="grid gap-6">
                            {packageData.inclusions.map((item: any, idx: number) => {
                              if (typeof item === 'object' && 'category' in item) {
                                return (
                                  <div key={idx} className="group/item">
                                    <h5 className="font-black text-[10px] text-green-700 uppercase tracking-[0.2em] mb-3 opacity-60">
                                      {item.category}
                                    </h5>
                                    <ul className="space-y-2">
                                      {item.items.map((subItem: string, subIdx: number) => (
                                        <li key={subIdx} className="flex items-start gap-3 group-hover/item:translate-x-1 transition-transform">
                                          <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                                          <span className="text-gray-600 text-base font-bold uppercase tracking-tight">{subItem}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              }
                              return (
                                <div key={idx} className="flex items-start gap-3 group/item">
                                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                                  <span className="text-gray-600 text-base font-bold uppercase tracking-tight">{item as string}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Exclusions */}
                      {packageData.exclusions && packageData.exclusions.length > 0 && (
                        <div className="bg-orange-50 p-8 rounded-[40px] border border-orange-100">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                              <XCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">What's Excluded</h4>
                          </div>
                          <div className="grid gap-6">
                            {packageData.exclusions.map((item: any, idx: number) => {
                              if (typeof item === 'object' && 'category' in item) {
                                return (
                                  <div key={idx} className="group/item">
                                    <h5 className="font-black text-[10px] text-orange-700 uppercase tracking-[0.2em] mb-3 opacity-60">
                                      {item.category}
                                    </h5>
                                    <ul className="space-y-2">
                                      {item.items.map((subItem: string, subIdx: number) => (
                                        <li key={subIdx} className="flex items-start gap-3 group-hover/item:translate-x-1 transition-transform">
                                          <div className="h-1.5 w-1.5 bg-orange-300 rounded-full mt-2 shrink-0" />
                                          <span className="text-gray-600 text-sm font-bold uppercase tracking-tight">{subItem}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              }
                              return (
                                <div key={idx} className="flex items-start gap-3 group/item">
                                  <div className="h-1.5 w-1.5 bg-orange-300 rounded-full mt-2 shrink-0" />
                                  <span className="text-gray-600 text-sm font-bold uppercase tracking-tight">{item as string}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Why Choose Us & Premium Reason - For Attractions too */}
                    {((packageData.whyChooseThisTrip && packageData.whyChooseThisTrip.length > 0) || (packageData.whyPremiumSkygoTours && packageData.whyPremiumSkygoTours.length > 0)) && (
                      <div className="grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100">
                        {packageData.whyChooseThisTrip && packageData.whyChooseThisTrip.length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-rose-50 rounded-2xl">
                                <Heart className="h-6 w-6 text-rose-600" />
                              </div>
                              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Why Choose This?</h4>
                            </div>
                            <ul className="space-y-4">
                              {packageData.whyChooseThisTrip.map((w: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-4 p-4 bg-rose-50/30 rounded-2xl border border-rose-50 transition-all hover:bg-rose-50/50">
                                  <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5" />
                                  <span className="text-gray-700 text-sm font-bold uppercase tracking-tight">{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {packageData.whyPremiumSkygoTours && packageData.whyPremiumSkygoTours.length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-amber-50 rounded-2xl">
                                <Sparkles className="h-6 w-6 text-amber-600" />
                              </div>
                              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">The {SITE_NAME} Edge</h4>
                            </div>
                            <ul className="space-y-4">
                              {packageData.whyPremiumSkygoTours.map((w: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-4 p-4 bg-amber-50/30 rounded-2xl border border-amber-50 transition-all hover:bg-amber-50/50">
                                  <Award className="h-4 w-4 text-amber-500 mt-0.5" />
                                  <span className="text-gray-700 text-sm font-bold uppercase tracking-tight">{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* FAQs Section - For Attraction Packages */}
                    {packageData.faqs && packageData.faqs.length > 0 && (
                      <div className="mt-12 pt-12 border-t border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="p-3 bg-indigo-50 rounded-2xl">
                            <MessageSquare className="h-6 w-6 text-indigo-600" />
                          </div>
                          <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Need to Know (FAQs)</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          {packageData.faqs.map((faq: any, idx: number) => (
                            <div key={idx} className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                              <p className="font-black text-gray-900 text-base uppercase tracking-tighter mb-4 flex items-center gap-3">
                                <span className="h-2 w-2 bg-indigo-400 rounded-full" />
                                {faq.question}
                              </p>
                              <p className="text-gray-600 text-base font-medium leading-relaxed italic border-l-2 border-indigo-100 pl-4">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shared Reviews Section at the bottom */}
                    <div className="mt-16 pt-12 border-t border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                          <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Visitor Experiences</h3>
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">What explorers say about this attraction</p>
                        </div>
                        {packageData.rating && (
                          <div className="flex items-center gap-4 bg-amber-50 px-8 py-4 rounded-[32px] border border-amber-100 shadow-sm">
                            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                            <div className="flex flex-col">
                              <span className="font-black text-gray-900 text-xl leading-none">{packageData.rating}</span>
                              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Global Rating</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {packageData.reviews && packageData.reviews.length > 0 ? (
                          packageData.reviews.map((review: any, idx: number) => (
                            <div key={idx} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border-b-4 border-b-[#bd9245]/20">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-gray-900 flex items-center justify-center text-[#bd9245] font-black text-lg shadow-lg">
                                  {review.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{review.name || 'Verified Explorer'}</p>
                                  <div className="flex items-center gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} `} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 text-base font-medium leading-relaxed italic">"{review.comment}"</p>
                            </div>
                          ))
                        ) : (
                          <div className="md:col-span-2 bg-gray-50/50 border border-dashed border-gray-200 rounded-[40px] p-16 text-center">
                            <div className="mb-6 inline-flex p-6 rounded-[32px] bg-white shadow-sm">
                              <MessageSquare className="h-10 w-10 text-gray-200" />
                            </div>
                            <p className="font-black text-gray-900 text-lg uppercase tracking-tight mb-2">No Reviews Found</p>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Experience this first and share your story.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Button */}
                    <div className="mt-16 text-center">
                      <Link href="/contact" className="inline-block w-full md:w-auto">
                        <Button className="w-full md:px-20 h-20 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-[0.3em] rounded-[32px] shadow-2xl group transition-all duration-500">
                          <span className="flex items-center justify-center gap-4">
                            Reserve Your Access
                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-3" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </div>
            )}

            {!isAttractionPackage && isUpcomingTourPackage && (
              <TourPackageSections
                packageData={packageData as unknown as PackageData}
                showHero={false}
                showEnquiry={false}
                embedded
              />
            )}

            {!isAttractionPackage && !isUpcomingTourPackage && (
              <div className="space-y-10">
                {/* Overview Section */}
                <section id="overview" className="space-y-8">
                  {/* Best Time to Visit Card */}
                  <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                    <div className="bg-gray-50 px-8 py-5 flex items-center gap-3 border-b border-gray-100">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Best Time to Visit {packageData.location?.split(',')[0]}</h4>
                    </div>
                    <CardContent className="p-8">
                      <p className="text-gray-600 text-base leading-relaxed">
                        {((packageData as any).bestTimeToVisit?.yearRound) || ''}
                      </p>
                      {((packageData as any).bestTimeToVisit?.winter && (
                        <p className="text-gray-600 text-base leading-relaxed mt-2">
                          <span className="font-semibold text-gray-700">Winter (Oct–Apr):</span> {(packageData as any).bestTimeToVisit.winter}
                        </p>
                      ))}
                      {((packageData as any).bestTimeToVisit?.summer && (
                        <p className="text-gray-600 text-base leading-relaxed mt-2">
                          <span className="font-semibold text-gray-700">Summer (May–Sep):</span> {(packageData as any).bestTimeToVisit.summer}
                        </p>
                      ))}
                    </CardContent>
                  </Card>

                  {/* About Romoire */}
                  <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                    <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
                      <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">About {SITE_NAME}</h4>
                    </div>
                    <CardContent className="p-8">
                      <p className="text-gray-600 text-base leading-relaxed italic border-l-2 border-amber-500/20 pl-6">
                        {packageData.about}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Our Services */}
                  {packageData.services && (
                    <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 flex items-center gap-3 border-b border-gray-100">
                        <Award className="h-5 w-5 text-blue-600" />
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Package Inclusions & Services</h4>
                      </div>
                      <CardContent className="p-8">
                        {Array.isArray(packageData.services) ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            {(packageData.services as string[]).map((service, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                                <span className="text-gray-700 text-base font-medium">{brandedText(service)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600 text-base leading-relaxed">
                            {brandedText(packageData.services as string)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Ideal For */}
                  {packageData.ideaFor && (
                    <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 flex items-center gap-3 border-b border-gray-100">
                        <Users className="h-5 w-5 text-emerald-600" />
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Ideal For</h4>
                      </div>
                      <CardContent className="p-8">
                        <div className="flex flex-wrap gap-2">
                          {packageData.ideaFor.split(',').map((tag, idx) => (
                            <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-wider border border-emerald-100">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Abstract */}
                  {packageData.abstract && (
                    <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Executive Abstract</h4>
                      </div>
                      <CardContent className="p-8">
                        <p className="text-gray-600 text-base italic leading-relaxed border-l-2 border-purple-100 pl-6">
                          {packageData.abstract}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tour Overview & Details */}
                  {(packageData.tourOverview || packageData.tourDetails) && (
                    <div className="space-y-6">
                      {packageData.tourOverview && (
                        <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                          <div className="bg-gray-50 px-8 py-5 flex items-center gap-3 border-b border-gray-100">
                            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                              <LayoutDashboard className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Experience Overview</h4>
                          </div>
                          <CardContent className="p-8">
                            <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line font-medium">
                              {brandedText(packageData.tourOverview)}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* Pricing / Hotel Options */}
                  {packageData.hotelOptions && packageData.hotelOptions.length > 0 && (
                    <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 flex items-center gap-3 border-b border-gray-100">
                        <Hotel className="h-5 w-5 text-amber-600" />
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Package Tier Options</h4>
                      </div>
                      <CardContent className="p-8 grid gap-4 md:grid-cols-2">
                        {packageData.hotelOptions.map((option, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <span className="font-semibold text-gray-700 text-sm">{option.split(':')[0]}</span>
                            {option.split(':')[1] && <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{option.split(':')[1]}</span>}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Key Highlights */}
                  {packageData.keyHighlights && packageData.keyHighlights.length > 0 && (
                    <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Exclusive Glimpses</h4>
                      </div>
                      <CardContent className="p-8">
                        <ul className="space-y-3">
                          {packageData.keyHighlights.map((highlight: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-gray-600 text-base leading-relaxed font-medium">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Feature Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: CheckCircle, label: 'Verified Experience', color: 'text-green-500', bg: 'bg-green-50' },
                      { icon: ShieldCheck, label: 'Best Price Guarantee', color: 'text-blue-500', bg: 'bg-blue-50' },
                      { icon: Users, label: 'Expert Local Guides', color: 'text-purple-500', bg: 'bg-purple-50' },
                      { icon: Heart, label: 'Curated with Love', color: 'text-rose-500', bg: 'bg-rose-50' },
                    ].map((feat, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-2xl ${feat.bg}`}>
                          <feat.icon className={`h-5 w-5 ${feat.color}`} />
                        </div>
                        <span className="text-gray-900 font-black text-[10px] uppercase tracking-widest">{feat.label}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Itinerary Section */}
                <section id="itinerary" className="space-y-10">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="p-4 bg-amber-50 rounded-[24px]">
                       <Calendar className="h-8 w-8 text-[#bd9245]" />
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter text-black">Daily Itinerary</h3>
                  </div>

                  <div className="space-y-8">
                    {Array.isArray(packageData.itinerary) && packageData.itinerary.map((day, index) => (
                      <div key={index} className="bg-white border border-[#bd9245]/20 rounded-[40px] p-8 md:p-12 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-10">
                           <div className="flex items-center gap-8">
                              <div className="w-20 h-20 bg-[#bd9245] rounded-[28px] flex flex-col items-center justify-center text-white shadow-lg shadow-[#bd9245]/20">
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Day</span>
                                <span className="text-3xl font-black">{day.day}</span>
                              </div>
                              <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{day.title}</h4>
                           </div>
                           <div className="h-12 w-12 rounded-full border border-[#bd9245]/20 flex items-center justify-center text-[#bd9245]/60">
                             <ArrowRight className="h-6 w-6 rotate-90" />
                           </div>
                        </div>

                        <div className="flex gap-10 ml-4 md:ml-10">
                           <div className="w-px bg-[#bd9245]/20 h-auto self-stretch mt-2 mb-2" />
                           <div className="text-gray-600 text-lg leading-relaxed font-medium py-1">
                             {day.description.split('\n').filter(Boolean).map((line, i) => (
                               <p key={i} className="mb-4 last:mb-0">{line}</p>
                             ))}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Inclusions & Exclusions */}
                <section id="inclusions">
                   <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight text-center">Inclusions & Exclusions</h4>
                      </div>
                      <CardContent className="p-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                          {/* Inclusions */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 text-green-600 mb-2">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-black text-xs uppercase tracking-widest">Premium Inclusions</span>
                            </div>
                            <div className="space-y-4">
                              {packageData.inclusions?.map((item, idx) => {
                                if (typeof item === 'object' && 'category' in item) {
                                  return (
                                    <div key={idx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                      <p className="font-black text-gray-900 text-[10px] uppercase tracking-widest mb-3 text-green-700">{item.category}</p>
                                      <ul className="space-y-3">
                                        {item.items.map((subItem, subIdx) => (
                                          <li key={subIdx} className="flex items-start gap-3 text-gray-600 text-base font-medium">
                                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
                                            <span>{subItem}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                }
                                return (
                                  <div key={idx} className="flex items-start gap-4 p-4 bg-green-50/30 rounded-xl border border-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-gray-700 text-sm font-black uppercase tracking-tight">{item as string}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Exclusions */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 text-red-600 mb-2">
                              <XCircle className="h-5 w-5" />
                              <span className="font-black text-xs uppercase tracking-widest">Exclusions</span>
                            </div>
                            <div className="space-y-4">
                              {packageData.exclusions?.map((item, idx) => {
                                if (typeof item === 'object' && 'category' in item) {
                                  return (
                                    <div key={idx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                      <p className="font-black text-gray-900 text-[10px] uppercase tracking-widest mb-3 text-red-700">{item.category}</p>
                                      <ul className="space-y-3">
                                        {item.items.map((subItem, subIdx) => (
                                          <li key={subIdx} className="flex items-start gap-3 text-gray-600 text-base font-medium">
                                            <div className="h-1.5 w-1.5 bg-red-400 rounded-full mt-2 shrink-0" />
                                            <span>{subItem}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                }
                                return (
                                  <div key={idx} className="flex items-start gap-4 p-4 bg-red-50/30 rounded-xl border border-red-50">
                                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                                    <span className="text-gray-700 text-sm font-black uppercase tracking-tight">{item as string}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </section>

                {/* Logistics & Accommodation */}
                {(packageData.transportation?.length > 0 || packageData.accommodation?.length > 0) && (
                  <section id="logistics" className="space-y-8">
                    <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100">
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight text-center">Logistics & Stay Details</h4>
                      </div>
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Transportation */}
                          {packageData.transportation?.length > 0 && (
                            <div className="space-y-4">
                               <div className="flex items-center gap-3 text-slate-600 mb-2">
                                  <CarIcon className="h-5 w-5" />
                                  <span className="font-black text-xs uppercase tracking-widest">Fleet & Transfers</span>
                                </div>
                                <div className="space-y-4">
                                  {packageData.transportation.map((t, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                      <p className="font-black text-gray-900 text-[10px] uppercase tracking-widest mb-1">{t.type}</p>
                                      <p className="text-slate-600 text-xl font-black tracking-tighter uppercase">{t.vehicle}</p>
                                      <p className="text-gray-500 text-sm mt-2 font-medium leading-relaxed italic">{t.description}</p>
                                    </div>
                                  ))}
                                </div>
                            </div>
                          )}

                          {/* Accommodation */}
                          {packageData.accommodation?.length > 0 && (
                            <div className="space-y-4">
                               <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                  <Hotel className="h-5 w-5" />
                                  <span className="font-black text-xs uppercase tracking-widest">Elite Stays</span>
                                </div>
                                <div className="space-y-4">
                                  {packageData.accommodation.map((a, idx) => (
                                    <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                      <p className="font-black text-gray-900 text-[10px] uppercase tracking-widest mb-1">{a.city}</p>
                                      <p className="text-indigo-900 text-xl font-black tracking-tighter uppercase">{a.hotel}</p>
                                      <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">{a.roomType} • {a.nights}</p>
                                    </div>
                                  ))}
                                </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Why Choose Us Sections */}
                {((packageData.whyChooseThisTrip && packageData.whyChooseThisTrip.length > 0) || (packageData.whyPremiumSkygoTours && packageData.whyPremiumSkygoTours.length > 0)) && (
                  <section id="why-choose" className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {packageData.whyChooseThisTrip && packageData.whyChooseThisTrip.length > 0 && (
                        <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                          <div className="bg-gray-50 px-8 py-5 flex items-center gap-3 border-b border-gray-100">
                            <Heart className="h-5 w-5 text-rose-600" />
                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Curated Reasons</h4>
                          </div>
                          <CardContent className="p-8">
                             <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Why Choose This Trip?</h3>
                            <ul className="space-y-4">
                              {packageData.whyChooseThisTrip.map((w: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-4 p-4 bg-rose-50/30 rounded-2xl border border-rose-50">
                                  <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5" />
                                  <span className="text-gray-700 text-sm font-black uppercase tracking-tight leading-relaxed">{w}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {packageData.whyPremiumSkygoTours && packageData.whyPremiumSkygoTours.length > 0 && (
                        <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                          <div className="bg-gray-50 px-8 py-5 flex items-center gap-3 border-b border-gray-100">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">The {SITE_NAME} Edge</h4>
                          </div>
                          <CardContent className="p-8">
                             <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Why Premium {SITE_NAME}?</h3>
                            <ul className="space-y-4">
                              {packageData.whyPremiumSkygoTours.map((w: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-4 p-4 bg-amber-50/30 rounded-2xl border border-amber-50">
                                  <Award className="h-4 w-4 text-amber-500 mt-0.5" />
                                  <span className="text-gray-700 text-sm font-black uppercase tracking-tight leading-relaxed">{w}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </section>
                )}

                {/* FAQs Section */}
                {packageData.faqs && packageData.faqs.length > 0 && (
                   <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                         <MessageSquare className="h-5 w-5 text-indigo-600" />
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Expert Inquiries (FAQs)</h4>
                      </div>
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-6">
                          {packageData.faqs.map((faq: any, idx: number) => (
                            <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                              <p className="font-black text-gray-900 text-sm uppercase tracking-tighter mb-3 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full" />
                                {faq.question}
                              </p>
                              <p className="text-gray-500 text-sm font-medium leading-relaxed italic border-l-2 border-indigo-100 pl-4">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                )}

                {/* Reviews Section */}
                <section id="reviews" className="space-y-8">
                   <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <h4 className="text-amber-600 font-black uppercase text-[10px] tracking-[0.4em] mb-1">Elite Testimonials</h4>
                          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Visitor Experiences</h3>
                        </div>
                        {packageData.rating && (
                          <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-gray-100 shadow-sm">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <div className="flex flex-col">
                              <span className="font-black text-gray-900 text-lg leading-none">{packageData.rating}</span>
                              <span className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Global Rating</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-6">
                          {packageData.reviews && packageData.reviews.length > 0 ? (
                            packageData.reviews.map((review: any, idx: number) => (
                              <div key={idx} className="bg-gray-50/30 border border-gray-100 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all border-b-4 border-b-[#bd9245]/10">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-[#bd9245] font-black text-sm">
                                    {review.name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{review.name || 'Verified Explorer'}</p>
                                    <div className="flex items-center gap-0.5 mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} `} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm font-medium leading-relaxed italic">"{review.comment}"</p>
                              </div>
                            ))
                          ) : (
                            <div className="md:col-span-2 py-12 text-center">
                              <div className="mb-4 inline-flex p-4 rounded-2xl bg-gray-50">
                                <MessageSquare className="h-8 w-8 text-gray-200" />
                              </div>
                              <p className="font-black text-gray-900 text-sm uppercase tracking-tight">No testimonials yet</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                </section>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          {isAttractionPackage ? (
            <div className="lg:col-span-1">
              <div className="sticky top-[100px] space-y-6">
                {/* Simplified Booking Card for Attraction Packages */}
                {/* Simplified Booking Card for Attraction Packages */}
                <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                  <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
                    <div className="inline-flex p-4 rounded-2xl bg-gray-100 mb-6 group-hover:scale-105 transition-transform duration-500">
                      <Ticket className="h-10 w-10 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Book Tickets</h3>
                    <p className="text-amber-600 font-bold uppercase tracking-[0.2em] text-[10px]">Instant Confirmation</p>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group transition-all hover:border-gray-200">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Entry Only</p>
                          <p className="font-bold text-gray-900 text-lg">At the Top</p>
                          <p className="text-[10px] text-gray-400 font-medium">Levels 124 & 125</p>
                          <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Contact for pricing</span>
                          </div>
                        </div>
                        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 relative group transition-all shadow-lg">
                          <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-bold uppercase px-2 py-1 rounded-sm tracking-widest">Sky Experience</div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">Premium Access</p>
                          <p className="font-bold text-white text-lg">At the Top SKY</p>
                          <p className="text-[10px] text-white/50 font-medium">Levels 124, 125 & 148</p>
                          <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-sm font-bold text-amber-500 uppercase tracking-wider">Contact for pricing</span>
                          </div>
                        </div>
                      </div>
                      <div className="block">
                        <Button
                          onClick={() => openForm({
                            title: packageData.title,
                            type: isAttractionPackage ? 'Ticket' : 'Package',
                            referenceId: packageData._id,
                            category: experienceCategory?.label || packageData.packageCategory,
                            duration: packageData.duration,
                          })}
                          className="w-full h-14 bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest rounded-2xl transition-all duration-300">
                          Contact Us to Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-1">
              <div className="sticky top-[100px] space-y-6">

                {/* Booking Card */}
                <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl">
                  <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
                    <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-4">Tailored Quote</p>
                    <div className="flex flex-col items-center gap-2">
                      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Enquire for Pricing</h2>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2 border-t border-gray-100 pt-2">We&apos;ll send a custom quote for your group</span>
                    </div>
                    {isPremium && (
                      <div className="mt-6 flex items-center justify-center gap-2 bg-amber-50 py-2 px-4 rounded-full border border-amber-100">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        <span className="text-amber-700 text-[10px] font-bold uppercase tracking-widest">Elite Luxury Fleet Included</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <Button
                        className="w-full h-16 bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest rounded-2xl shadow-lg group transition-all duration-300"
                        onClick={() => openForm({
                          title: packageData.title,
                          type: 'Package',
                          referenceId: packageData._id,
                          category: experienceCategory?.label || packageData.packageCategory,
                          duration: packageData.duration,
                        })}
                      >
                        <span className="flex items-center gap-3">
                          Enquire Now
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-16 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold uppercase tracking-widest rounded-2xl transition-all duration-300"
                        onClick={() => openForm({
                          title: packageData.title,
                          type: 'Package',
                          referenceId: packageData._id,
                          category: experienceCategory?.label || packageData.packageCategory,
                          duration: packageData.duration,
                        })}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Expert Consultation
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Safe & Secure</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Agent Card */}
                <Card className="border border-gray-100 shadow-sm bg-white text-gray-900 rounded-3xl overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-gray-900 flex items-center justify-center transition-transform group-hover:rotate-12">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-1">Assisted Booking</p>
                        <p className="font-bold text-lg leading-tight">+237 6 83 57 76 76</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">24/7 Priority Support</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div >
    </div >
  );
};

export default PackageDetailPage;
