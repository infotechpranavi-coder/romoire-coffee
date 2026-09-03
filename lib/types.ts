export interface Review {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

export interface PackageData {
    _id: string;
    title: string;
    subtitle: string;
    ideaFor?: string;
    about: string;
    services: string | string[];
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
    whyPremiumDubaiTours?: string[];
    whyPremiumSkygoTours?: string[];
    price: number;
    duration: string;
    location: string;
    capacity: string;
    packageType: 'domestic' | 'international';
    place: string;
    packageCategory: string;
    packageMiniCategory?: string;
    images: Array<{
        public_id: string;
        url: string;
        alt: string;
    }>;
    itinerary: Array<{
        day: number;
        title: string;
        description: string;
    }>;
    transportation: Array<{
        type: string;
        vehicle: string;
        description: string;
    }>;
    accommodation: Array<{
        city: string;
        hotel: string;
        rooms: string;
        roomType: string;
        nights: string;
    }>;
    inclusions?: string[] | Array<{
        category: string;
        items: string[];
    }>;
    exclusions?: string[] | Array<{
        category: string;
        items: string[];
    }>;
    reviews?: Review[];
    faqs?: Array<{
        question: string;
        answer: string;
    }>;
    fixedDepartures?: Array<{ month: string; dates: string }>;
    shortItinerary?: Array<{ day: number; title: string }>;
    packageNotes?: string[];
    cancellationPolicy?: string[];
    reschedulingPolicy?: string[];
    bookingPolicy?: string[];
    bookings: number;
    rating: number;
    isFeaturedDestination?: boolean;
    isPopularPackage?: boolean;
    isFeaturedTrip?: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface TourData {
    _id: string;
    title: string;
    subtitle: string;
    about: string;
    price: number;
    duration: string;
    location: string;
    capacity: string;
    tourType: string;
    guideName: string;
    meetingPoint: string;
    groupSize: string;
    highlights: string[];
    images: Array<{
        public_id: string;
        url: string;
        alt: string;
    }>;
    itinerary: Array<{
        day: number;
        title: string;
        description: string;
    }>;
    inclusions: string[];
    exclusions: string[];
    bookings: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface TicketData {
    _id: string;
    title: string;
    carrier: string;
    route: string;
    price: number;
    travelClass: string;
    departureTime: string;
    arrivalTime: string;
    luggageAllowance: string;
    refundPolicy: string;
    validity: string;
    location: string;
    images: Array<{
        public_id: string;
        url: string;
        alt: string;
    }>;
    description: string;
    itinerary: Array<{
        day: number;
        title: string;
        description: string;
    }>;
    isAvailable: boolean;
    bookings: number;
    createdAt: string;
    updatedAt: string;
}

export interface BannerData {
    _id: string;
    title: string;
    subtitle: string;
    mediaType?: 'image' | 'video' | 'youtube';
    image?: {
        public_id: string;
        url: string;
        alt: string;
    };
    video?: {
        public_id: string;
        url: string;
        alt: string;
    };
    youtubeUrl?: string;
    link?: string;
    order?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GalleryData {
    _id: string;
    title: string;
    caption?: string;
    image: {
        public_id?: string;
        url: string;
        alt: string;
    };
    order?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BlogData {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    category: 'Travel Tips' | 'Destinations' | 'Lifestyle' | 'News' | 'Experience';
    image: {
        public_id: string;
        url: string;
        alt: string;
    };
    isFeatured: boolean;
    status: 'draft' | 'published';
    tags?: string[];
    sourceType?: 'manual' | 'link';
    externalUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SiteSettings {
    popularSection?: boolean;
    upcomingSection?: boolean;
    destinationsSection?: boolean;
    exploreSection?: boolean;
    testimonialsSection?: boolean;
    facebookUrl?: string;
    facebookEnabled?: boolean;
    instagramUrl?: string;
    instagramEnabled?: boolean;
    twitterUrl?: string;
    twitterEnabled?: boolean;
    linkedinUrl?: string;
    linkedinEnabled?: boolean;
    youtubeUrl?: string;
    youtubeEnabled?: boolean;
    whatsappUrl?: string;
    whatsappEnabled?: boolean;
    offerPopupEnabled?: boolean;
    offerPopupTitle?: string;
    offerPopupSubtitle?: string;
    offerPopupImageUrl?: string;
    offerPopupImagePublicId?: string;
    offerPopupInitialDelaySeconds?: number;
    offerPopupRepeatIntervalSeconds?: number;
    /** 'landscape' = 16:9, 'square' = 1:1 */
    offerPopupAspectRatio?: 'landscape' | 'square';
    exploreEyebrow?: string;
    exploreHeadingLine1?: string;
    exploreHeadingLine2?: string;
    exploreSubtitle?: string;
    exploreInclusions?: string[];
    exploreCtaLabel?: string;
    explorePhone?: string;
    explorePhoneLabel?: string;
}
