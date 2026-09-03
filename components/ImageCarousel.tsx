import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Best of CAPE TOWN",
      description:
        "Table Mountain → V&A Waterfront → Cape Point → Penguin Colony\n\n4N/5D\nGroup Tour @ R 12,500/person\nPrivate Tour @ R 15,500/person",
      link: "/packages",
    },
    {
      url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Kruger Wildlife Safari",
      description:
        "Big Five Game Drive → Luxury Bush Camp → Sunset Safari → BBQ Dinner\n\n3N/4D Tour Package\n\nR 18,900/person",
      link: "/packages",
    },
    {
      url: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Garden Route Explorer",
      description:
        "Knysna Heads → Cango Caves → Whale Watching → Scenic Coast\n\n5 Nights / 6 Days Tour Package\n\nR 14,500/person",
      link: "/packages",
    },
    {
      url: "https://images.unsplash.com/photo-1545129139-1beb780cf337?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Johannesburg Culture",
      description:
        "Apartheid Museum → Soweto Tour → Constitution Hill\n\n4D/3N Tour Package\n\nR 9,800/person",
      link: "/packages",
    },
    {
      url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Sun City & Pilanesberg",
      description: "Valley of Waves → Game Drive → Luxury Resort\n\n4N/5D Package\n\nR 17,500/person",
      link: "/packages",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-lg"
      style={{ imageRendering: "crisp-edges" }}
    >
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              style={{
                imageRendering: "crisp-edges",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-start p-4 sm:p-6 md:p-8 pt-16 sm:pt-20 text-white">
              <div className="flex flex-col max-w-2xl ml-2 sm:ml-4 md:ml-8">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 text-white">
                  {image.title}
                </h3>

                <div className="space-y-1 mb-3">
                  {image.description.split("\n").map((line, idx) => (
                    <div key={idx} className={line.trim() === "" ? "h-1" : ""}>
                      {line.trim() !== "" && (
                        <div
                          className={`text-xs sm:text-sm md:text-base lg:text-lg ${line.includes("@") || line.includes("₹")
                            ? "font-semibold text-yellow-400"
                            : "text-white"
                            }`}
                        >
                          {line}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Book Now Button */}
                <Link href={image.link}>
                  <Button
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 sm:py-3 sm:px-6 md:py-3 md:px-8 text-sm sm:text-base md:text-lg rounded-lg shadow-lg"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-cream/20 hover:bg-cream/30 text-white border-white/30"
        size="icon"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cream/20 hover:bg-cream/30 text-white border-white/30"
        size="icon"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-cream" : "bg-cream/50"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ImageCarousel;
