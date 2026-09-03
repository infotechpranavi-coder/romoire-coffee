import HeroExplore from "../components/HeroExplore";
export const dynamic = 'force-dynamic';
import AboutHomeSection from "../components/AboutHomeSection";
import ExploreWithUs from "../components/ExploreWithUs";
import UpcomingTrips from "../components/UpcomingTrips";
import PopularPackages from "../components/PopularPackages";
import HomeBlogs from "../components/HomeBlogs";
import ClientFeedback from "../components/ClientFeedback";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import Package from "@/models/Package";
import Blog from "@/models/Blog";
import Settings from "@/models/Settings";
import { getHeroBannerUrl } from "@/lib/utils";
import { mapPackageToProduct } from "@/data/newArrivalsData";
import { BannerData, PackageData, BlogData } from "@/lib/types";

export default async function Home() {
  // Use try/catch for database operations
  let initialBanners: BannerData[] = [];
  let initialPackages: PackageData[] = [];
  let initialNewArrivals: PackageData[] = [];
  let initialBlogs: BlogData[] = [];
  let settings = { 
    popularSection: true, 
    upcomingSection: true,
    exploreSection: true,
    testimonialsSection: true
  };

  try {
    await connectDB();
    
    // Fetch banners with a timeout or limited fields to keep it fast
    const bannerDocs = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    // Fetch popular packages limited to top 5
    const packageDocs = await Package.find({ isPopularPackage: true })
      .limit(5)
      .lean();

    const newArrivalDocs = await Package.find({ isFeaturedTrip: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const blogDocs = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    // Fetch site settings
    const settingsDoc = await Settings.findOne().lean();
    if (settingsDoc) {
      settings = JSON.parse(JSON.stringify(settingsDoc));
    }
    
    // Stringify/Parse to handle MongoDB ObjectIds for client components
    initialBanners = JSON.parse(JSON.stringify(bannerDocs));
    initialPackages = JSON.parse(JSON.stringify(packageDocs));
    initialNewArrivals = JSON.parse(JSON.stringify(newArrivalDocs));
    initialBlogs = JSON.parse(JSON.stringify(blogDocs));
  } catch (error) {
    console.warn("Database fetching failed on home page, using fallback client-side fetching or static data.", error);
  }

  return (
    <div className="min-h-screen">
      {initialBanners[0]?.mediaType !== 'video' &&
        initialBanners[0]?.mediaType !== 'youtube' &&
        initialBanners[0]?.image?.url && (
        <link
          rel="preload"
          as="image"
          href={getHeroBannerUrl(
            initialBanners[0].image.url,
            initialBanners[0].image.public_id,
            3840
          )}
        />
      )}
      <HeroExplore initialBanners={initialBanners} />
      <AboutHomeSection />
      {settings.exploreSection !== false && <ExploreWithUs />}
      {settings.upcomingSection !== false && (
        <UpcomingTrips
          initialProducts={initialNewArrivals.map((pkg) => mapPackageToProduct(pkg))}
        />
      )}
      {settings.popularSection !== false && <PopularPackages initialPackages={initialPackages} />}
      <HomeBlogs initialBlogs={initialBlogs} />
      {settings.testimonialsSection !== false && <ClientFeedback />}
    </div>
  );
}

