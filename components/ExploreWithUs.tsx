'use client'

import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exploreInclusions } from "@/data/homeData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { COFFEE_IMAGES } from "@/lib/coffeeImages";

const ExploreWithUs = () => {
  const router = useRouter();
  const { openForm } = useInquiryForm();

  // Split inclusions into two columns evenly
  const midPoint = Math.ceil(exploreInclusions.length / 2);
  const leftColumn = exploreInclusions.slice(0, midPoint);
  const rightColumn = exploreInclusions.slice(midPoint);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      id="explore"
      ref={ref}
      className="py-12 bg-white relative overflow-hidden"
    >
      {/* Subtle dot pattern background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-[#bd9245] font-bold text-sm uppercase tracking-wider mb-2">
              FRESH FROM THE ROASTERY
            </p>

            <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
              BREW<br />WITH US
            </h2>

            <p className="text-gray-500 text-lg md:text-xl font-medium tracking-wide mb-6">
              Every bag includes what matters most.
            </p>

            {/* Two Column Inclusions List */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10">
              {/* Left Column */}
              <ul className="space-y-4">
                {leftColumn.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#bd9245] flex items-center justify-center">
                      <Check className="h-3 w-3 text-gray-900" strokeWidth={3} />
                    </div>
                    <span className="text-gray-900 text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Right Column */}
              <ul className="space-y-4">
                {rightColumn.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#bd9245] flex items-center justify-center">
                      <Check className="h-3 w-3 text-gray-900" strokeWidth={3} />
                    </div>
                    <span className="text-gray-900 text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button and Phone */}
            <div className="flex items-center gap-6">
              <Button
                onClick={() => router.push('/packages')}
                className="bg-[#bd9245] hover:bg-[#a07835] text-gray-900 font-bold px-8 py-6 rounded-lg text-base"
              >
                Shop Now
              </Button>

              {/* Phone Number */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-[#bd9245]" />
                  <a href="tel:+237683577676" className="text-gray-900 text-lg font-semibold hover:text-[#bd9245] transition-colors">
                    +237 6 83 57 76 76
                  </a>
                </div>
                <span className="text-xs text-gray-500 mt-1">CALL NOW</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Polaroid Images with Badge */}
          <motion.div
            className="relative h-[500px]"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Polaroid Images */}
            <div className="relative h-full">
              {/* Image 1 - Back */}
              <div className="absolute top-0 left-0 w-64 h-80 bg-white p-4 shadow-2xl transform rotate-[-8deg] z-10">
                <div className="relative w-full h-full">
                  <Image
                    src={COFFEE_IMAGES.beans}
                    alt="Coffee beans"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Image 2 - Middle */}
              <div className="absolute top-20 left-32 w-64 h-80 bg-white p-4 shadow-2xl transform rotate-[5deg] z-20">
                <div className="relative w-full h-full">
                  <Image
                    src={COFFEE_IMAGES.beansDark}
                    alt="Pouring coffee"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Image 3 - Front */}
              <div className="absolute top-40 left-64 w-64 h-80 bg-white p-4 shadow-2xl transform rotate-[-3deg] z-30">
                <div className="relative w-full h-full">
                  <Image
                    src={COFFEE_IMAGES.latte}
                    alt="Latte art"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Discount Badge - Professional Circular Seal - Positioned slightly towards the left from previous setup */}
            <div className="absolute top-[18%] right-2 lg:right-0 z-40 w-36 h-36 bg-[#bd9245] rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white transition-all duration-500 hover:scale-110 hover:-rotate-12 cursor-pointer"
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
              }}>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Up to</span>
                <span className="text-5xl font-black text-white leading-none my-1 drop-shadow-sm">50%</span>
                <span className="text-sm font-black text-white uppercase tracking-tighter leading-none mt-1">Discount</span>
              </div>
              
              {/* Optional inner dashed ring for extra detail */}
              <div className="absolute inset-2 border border-dashed border-white/30 rounded-full pointer-events-none"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreWithUs;
