import mongoose from 'mongoose';

const ItineraryDaySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const ImageSchema = new mongoose.Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
});

const TransportationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

const AccommodationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  hotel: {
    type: String,
    required: true,
  },
  rooms: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  nights: {
    type: String,
    required: true,
  },
});

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const InclusionExclusionItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  items: [{
    type: String,
    required: true,
  }],
}, { _id: false });

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  ideaFor: {
    type: String,
    default: '',
  },
  about: {
    type: String,
    required: true,
  },
  services: {
    type: String,
    default: "Customized travel planning, Guided tours & local experiences, Group & family vacations, Luxury & adventure travel, Honeymoons & romantic getaways, Corporate & incentive travel",
  },
  tourDetails: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    default: '',
  },
  tourOverview: {
    type: String,
    default: '',
  },
  keyHighlights: [{
    type: String,
  }],
  hotelOptions: [{
    type: String,
  }],
  bestTimeToVisit: {
    yearRound: {
      type: String,
      default: '',
    },
    winter: {
      type: String,
      default: '',
    },
    summer: {
      type: String,
      default: '',
    },
  },
  whyChooseThisTrip: [{
    type: String,
  }],
  whyPremiumDubaiTours: [{
    type: String,
  }],
  whyPremiumSkygoTours: [{
    type: String,
  }],
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    default: 'Flexible',
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    default: '2 Adults',
  },
  packageType: {
    type: String,
    required: true,
    enum: ['domestic', 'international'],
  },
  place: {
    type: String,
    required: true,
  },
  packageCategory: {
    type: String,
    default: '',
  },
  packageGroupSlug: {
    type: String,
    default: '',
  },
  packageMiniCategory: {
    type: String,
    default: '',
  },
  images: [ImageSchema],
  itinerary: [ItineraryDaySchema],
  transportation: [TransportationSchema],
  accommodation: [AccommodationSchema],
  inclusions: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  exclusions: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  reviews: [ReviewSchema],
  faqs: [{
    question: String,
    answer: String,
  }],
  fixedDepartures: [{
    month: { type: String, default: '' },
    dates: { type: String, default: '' },
  }],
  shortItinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
  }],
  packageNotes: [{
    type: String,
  }],
  cancellationPolicy: [{
    type: String,
  }],
  reschedulingPolicy: [{
    type: String,
  }],
  bookingPolicy: [{
    type: String,
  }],
  bookings: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  isFeaturedDestination: {
    type: Boolean,
    default: false,
  },
  isPopularPackage: {
    type: Boolean,
    default: false,
  },
  isFeaturedTrip: {
    type: Boolean,
    default: false,
  },
  isComingSoon: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PackageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Drop cached model so packageCategory schema changes apply without a full restart
if (mongoose.models.Package) {
  delete mongoose.models.Package;
}

export default mongoose.model('Package', PackageSchema);
