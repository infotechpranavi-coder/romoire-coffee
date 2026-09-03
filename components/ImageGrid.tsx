import { useState } from "react";
import { X, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ImageGrid = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());

  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Mountain Peak",
      location: "Nepal Himalayas",
      photographer: "John Doe"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Tropical Beach",
      location: "Bali, Indonesia",
      photographer: "Jane Smith"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Ancient Temple",
      location: "Bhutan",
      photographer: "Mike Johnson"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Wildlife Safari",
      location: "African Savannah",
      photographer: "Sarah Wilson"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Waterfall",
      location: "Meghalaya, India",
      photographer: "David Brown"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Mountain Lake",
      location: "Sikkim, India",
      photographer: "Lisa Chen"
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Desert Landscape",
      location: "Sahara Desert",
      photographer: "Alex Turner"
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Tropical Forest",
      location: "Bali, Indonesia",
      photographer: "Emma Davis"
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
          <h2 className="text-4xl font-bold mb-4 text-primary">Travel Photography</h2>
          <p className="text-lg text-muted-foreground">Stunning images from around the world</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                  <p className="text-sm opacity-90 mb-2">{image.location}</p>
                  <p className="text-xs opacity-75">Photo by {image.photographer}</p>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-cream/20 hover:bg-cream/30 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(image.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${likedImages.has(image.id) ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-cream/20 hover:bg-cream/30 text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            {selectedImage && (
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
                <img
                  src={selectedImage}
                  alt="Full size"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ImageGrid; 