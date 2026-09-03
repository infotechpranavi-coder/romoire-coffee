'use client'

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { SITE_NAME } from "@/lib/branding";

const TourPackagesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Best of CAPE TOWN",
      description: "Table Mountain → V&A Waterfront → Cape Point → Wine Tasting → Penguin Colony",
      price: "R12,500/person",
      duration: "4N/5D",
      redirectUrl: "/packages"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Kruger Safari Adventure",
      description: "Big Five Spotting → Morning & Evening Drives → Bush Dinner → Luxury Lodge",
      price: "R18,900/person",
      duration: "3N/4D",
      redirectUrl: "/packages"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Garden Route Explorer",
      description: "Knysna Lagoon → Cango Caves → Whale Watching → Scenic Coastal Drives",
      price: "R15,400/person",
      duration: "5N/6D",
      redirectUrl: "/packages"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1576085834041-419b62bc3e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Cape Town Essentials",
      description: "Cableway → Boulders Beach → Cape of Good Hope → Castle of Good Hope",
      price: "R6,500/person",
      duration: "1 Day",
      redirectUrl: "/packages"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1590429175961-9c600f72390f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Luxury Winelands Retreat",
      description: "Exclusive Wine Tasting → Gourmet Dining → Spa Treatments → Helicopter Tour",
      price: "R25,000/person",
      duration: "3N/4D",
      redirectUrl: "/packages"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {SITE_NAME} offers carefully curated tour experiences designed for comfort and luxury.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our services are accessible to travelers worldwide, with seamless arrangements from arrival to return.
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {slides.map((slide) => (
                  <div key={slide.id} className="w-full flex-shrink-0">
                    <div className="relative h-[350px] md:h-[450px]">
                      {/* Background Image */}
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={slide.id === 1}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40"></div>

                      {/* Content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white max-w-2xl px-8">
                          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            {slide.title}
                          </h3>
                          <p className="text-lg md:text-xl mb-6 opacity-90">
                            {slide.description}
                          </p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <div className="bg-cream/20 backdrop-blur-sm rounded-lg px-4 py-2">
                              <span className="text-yellow-300 font-semibold text-lg">
                                {slide.price}
                              </span>
                            </div>
                            <div className="bg-cream/20 backdrop-blur-sm rounded-lg px-4 py-2">
                              <span className="text-white font-medium">
                                {slide.duration}
                              </span>
                            </div>
                          </div>
                          <Link href={slide.redirectUrl}>
                            <Button
                              size="lg"
                              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 text-lg"
                            >
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-cream/20 hover:bg-cream/30 text-white border-white/30 backdrop-blur-sm"
              size="icon"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cream/20 hover:bg-cream/30 text-white border-white/30 backdrop-blur-sm"
              size="icon"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-yellow-400 scale-125"
                    : "bg-cream/50 hover:bg-cream/70"
                    }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TourPackagesSlider;
