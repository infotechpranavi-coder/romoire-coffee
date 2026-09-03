import { useState } from "react";
import { Download, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const MasonryGallery = () => {
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());

  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Mountain Majesty",
      height: "h-64"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Tropical Paradise",
      height: "h-80"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Ancient Wisdom",
      height: "h-72"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Wildlife Wonder",
      height: "h-96"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Waterfall Magic",
      height: "h-88"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Alpine Serenity",
      height: "h-64"
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Desert Dreams",
      height: "h-80"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Forest Mystique",
      height: "h-72"
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Coastal Charm",
      height: "h-96"
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Mountain Lake",
      height: "h-88"
    },
    {
      id: 11,
      url: "https://images.unsplash.com/photo-1438565434616-3ef039228b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Tea Gardens",
      height: "h-64"
    },
    {
      id: 12,
      url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Misty Mountains",
      height: "h-80"
    }
  ];

  const toggleLike = (imageId: number) => {
    const newLikedImages = new Set(likedImages);
    if (newLikedImages.has(imageId)) {
      newLikedImages.delete(imageId);
    } else {
      newLikedImages.add(imageId);
    }
    setLikedImages(newLikedImages);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-primary">Masonry Gallery</h2>
          <p className="text-lg text-muted-foreground">A beautiful collection of travel photography</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-lg group break-inside-avoid ${image.height}`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-cream/20 hover:bg-cream/30 text-white"
                    onClick={() => toggleLike(image.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${likedImages.has(image.id) ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-cream/20 hover:bg-cream/30 text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-cream/20 hover:bg-cream/30 text-white"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MasonryGallery; 