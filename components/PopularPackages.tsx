'use client'

import { useState, useEffect } from "react";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { popularPackages as staticPackages } from "@/data/homeData";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInquiryForm } from "@/contexts/InquiryFormContext";

interface PopularPackagesProps {
  initialPackages?: any[];
}

const PopularPackages = ({ initialPackages }: PopularPackagesProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const [packages, setPackages] = useState<any[]>(initialPackages || []);
  const [isLoading, setIsLoading] = useState(!initialPackages);

  useEffect(() => {
    // Only fetch if initialPackages not provided
    if (initialPackages && initialPackages.length > 0) {
      setIsLoading(false);
      return;
    }

    const fetchPopularPackages = async () => {
      try {
        const response = await fetch('/api/packages?popular=true');
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setPackages(result.data);
        } else {
          // No longer falling back to static data as per user request
          setPackages([]);
        }
      } catch (error) {
        console.error('Error fetching popular packages:', error);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPackages();
  }, [initialPackages]);

  if (isLoading) {
    return (
      <div className="py-24 bg-[#F5EFE6] flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#6B1F2A] animate-spin mb-4" />
        <p className="text-[#3D1218] font-bold uppercase tracking-widest text-sm">Loading coffees...</p>
      </div>
    );
  }

  // Split packages into two columns as per the original design
  // Column 1 gets the first 2, Column 2 gets the next 3
  const col1 = packages.slice(0, 2);
  const col2 = packages.slice(2, 5);

  return (
    <section
      id="packages"
      className="py-24 bg-[#F5EFE6]"
    >
      <div className="container mx-auto px-4">
        {/* Force single column for anything below very large desktop to avoid overlap */}
        <style jsx>{`
          .popular-grid {
            display: grid;
            grid-template-columns: 1fr;
          }
          @media (min-width: 1440px) {
            .popular-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
        `}</style>
        <div className="popular-grid gap-8 items-start">

          {/* Left Column: Title + 2 Cards */}
          <div className="space-y-8 2xl:pr-4">
            <div className="mb-6 md:mb-10 lg:overflow-hidden">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-[1000] text-[#3D1218] leading-[0.9] tracking-tighter uppercase break-words">
                POPULAR<br />COFFEES
              </h2>
            </div>

            {col1.map((pkg, idx) => (
              <PackageCard
                key={pkg._id || pkg.id}
                pkg={pkg}
                index={idx}
                router={router}
                openForm={openForm}
              />
            ))}
          </div>

          {/* Right Column: 3 Cards + View All Button (With Offset) */}
          <div className="space-y-8 2xl:pt-20">
            {col2.map((pkg, idx) => (
              <PackageCard
                key={pkg._id || pkg.id}
                pkg={pkg}
                index={idx + col1.length}
                router={router}
                openForm={openForm}
              />
            ))}

            {/* View All Button - Compact & Professional */}
            <div className="pt-8 pl-4">
              <Button
                variant="ghost"
                className="group flex items-center gap-3 text-[#3D1218] font-black text-xl uppercase tracking-tighter hover:bg-transparent hover:text-[#6B1F2A] transition-all duration-300"
                onClick={() => router.push('/packages')}
              >
                <span>Shop All Coffee</span>
                <div className="w-10 h-10 rounded-full border border-[#6B1F2A]/10 flex items-center justify-center group-hover:bg-[#6B1F2A] group-hover:border-[#6B1F2A] transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper component for cleaner code
const PackageCard = ({ pkg, index, router, openForm }: any) => {
    const packageId = pkg._id || pkg.id;
    const itemType = pkg.type || 'package';
    
    const generateSlug = (title: string, id: string) => {
        return `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
    };
    
    const slug = generateSlug(pkg.title, packageId);
    const route = itemType === 'tour' ? `/tours/${slug}` : itemType === 'ticket' ? `/tickets/${slug}` : `/packages/${slug}`;
    const imageUrl = pkg.images && pkg.images.length > 0 ? pkg.images[0].url : pkg.image;

    return (
      <motion.div
        className="group bg-white rounded-[40px] overflow-hidden p-3 shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer flex flex-col sm:flex-row h-full sm:h-[320px] border border-white"
        onClick={() => router.push(route)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-[260px] h-[200px] sm:h-full flex-shrink-0">
        <Image
          src={imageUrl}
          alt={pkg.title}
          fill
          className="object-cover rounded-[30px] transform group-hover:scale-105 transition-transform duration-1000"
          sizes="(max-width: 640px) 100vw, 260px"
        />
      </div>

      {/* Info Section */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
            {pkg.duration} &nbsp;·&nbsp; SPECIALTY ROAST
          </p>
          <h3 className="text-xl md:text-2xl font-black text-[#3D1218] leading-[1.1] mb-2 uppercase tracking-tighter group-hover:text-[#6B1F2A] transition-colors">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#6B1F2A] text-[#6B1F2A]" />
            ))}
            <span className="text-[10px] font-bold text-gray-300 ml-1">Verified Roast</span>
          </div>
          <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2 font-medium">
            {pkg.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            className="flex-1 bg-[#6B1F2A] hover:bg-[#4A1520] text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(route);
            }}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#3D1218] text-[#3D1218] hover:bg-[#3D1218] hover:text-white font-bold py-4 rounded-xl transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              openForm({
                type: 'Package',
                title: pkg.title,
                referenceId: packageId,
                category: pkg.packageCategory,
                duration: pkg.duration,
              });
            }}
          >
            Order Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};


export default PopularPackages;
