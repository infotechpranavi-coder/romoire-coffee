import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, X, Upload, Star } from "lucide-react";
import { compressImage } from "@/lib/utils";
import { PACKAGE_EXPERIENCE_CATEGORIES, getNavGroupForCategory } from "@/lib/packageExperienceCategories";
import ExperienceCategoryNameFields from "@/components/ExperienceCategoryNameFields";
import PackageTourExtrasFields, {
  type FixedDepartureRow,
  type ShortItineraryRow,
} from "@/components/PackageTourExtrasFields";
import { useCategoryLabels } from "@/contexts/CategoryLabelsContext";
import { SITE_NAME, LOGO_SRC } from "@/lib/branding";

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
}

interface TransportationItem {
  id: string;
  type: string;
  vehicle: string;
  description: string;
}

interface AccommodationItem {
  id: string;
  city: string;
  hotel: string;
  rooms: string;
  roomType: string;
  nights: string;
}



import { PackageData, Review } from "@/lib/types";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: PackageData | null;
  onPackageUpdated: (updatedPackage: PackageData) => void;
}

const EditPackageModal = ({ isOpen, onClose, packageData, onPackageUpdated }: EditPackageModalProps) => {
  const { navGroups, getCategoryByValue: resolveCategoryByValue } = useCategoryLabels();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    ideaFor: "",
    about: "",
    services: "",
    tourDetails: "",
    abstract: "",
    tourOverview: "",
    price: "",
    duration: "",
    location: "",
    capacity: "",
    packageType: "",
    place: "",
    packageCategory: "Yachts & Sailing Cruises",
    packageMiniCategory: "",
    bestTimeToVisit: {
      yearRound: "",
      winter: "",
      summer: "",
    },
    isFeaturedDestination: false,
    isPopularPackage: false,
    isFeaturedTrip: false,
  });

  const [keyHighlights, setKeyHighlights] = useState<string[]>([]);
  const [hotelOptions, setHotelOptions] = useState<string[]>([]);
  const [whyChooseThisTrip, setWhyChooseThisTrip] = useState<string[]>([]);
  const [whyPremiumSkygoTours, setWhyPremiumSkygoTours] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [transportation, setTransportation] = useState<TransportationItem[]>([]);
  const [accommodation, setAccommodation] = useState<AccommodationItem[]>([]);
  interface InclusionExclusionCategory {
    id: string;
    category: string;
    items: string[];
  }

  const [inclusions, setInclusions] = useState<InclusionExclusionCategory[]>([]);
  const [exclusions, setExclusions] = useState<InclusionExclusionCategory[]>([]);
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>([]);
  const [fixedDepartures, setFixedDepartures] = useState<FixedDepartureRow[]>([
    { id: "fd1", month: "", dates: "" },
  ]);
  const [shortItinerary, setShortItinerary] = useState<ShortItineraryRow[]>([
    { id: "si1", day: 1, title: "" },
  ]);
  const [packageNotes, setPackageNotes] = useState<string[]>([""]);
  const [cancellationPolicy, setCancellationPolicy] = useState<string[]>([""]);
  const [reschedulingPolicy, setReschedulingPolicy] = useState<string[]>([""]);
  const [bookingPolicy, setBookingPolicy] = useState<string[]>([""]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ public_id?: string; url: string; alt: string }>>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [externalImageUrls, setExternalImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [packageGroupSlug, setPackageGroupSlug] = useState(navGroups[0]?.slug ?? "water");

  // Initialize form data when packageData changes
  useEffect(() => {
    if (packageData) {
      // Map category value to ensure it matches SelectItem values
      const mapCategory = (category: string | undefined): string => {
        if (!category) return navGroups[0]?.items[0]?.value ?? "Yachts & Sailing Cruises";
        const resolved = resolveCategoryByValue(category);
        if (resolved) return resolved.value;
        const match = PACKAGE_EXPERIENCE_CATEGORIES.find(
          (item) =>
            item.value.toLowerCase() === category.toLowerCase() ||
            item.legacyValues?.some((legacy) => legacy.toLowerCase() === category.toLowerCase())
        );
        return match?.value || category;
      };

      const mappedCategory = mapCategory(packageData.packageCategory);
      setPackageGroupSlug(getNavGroupForCategory(mappedCategory).slug);

      setFormData({
        title: packageData.title || "",
        subtitle: packageData.subtitle || "",
        ideaFor: packageData.ideaFor || "",
        about: packageData.about || "",
        services: Array.isArray(packageData.services) ? packageData.services.join(', ') : (packageData.services || ""),
        tourDetails: packageData.tourDetails || "",
        abstract: packageData.abstract || "",
        tourOverview: packageData.tourOverview || "",
        price: packageData.price?.toString() || "",
        duration: packageData.duration || "",
        location: packageData.location || "",
        capacity: packageData.capacity || "",
        packageType: packageData.packageType || "",
        place: packageData.place || "",
        packageCategory: mappedCategory,
        packageMiniCategory: packageData.packageMiniCategory || "",
        bestTimeToVisit: {
          yearRound: packageData.bestTimeToVisit?.yearRound || "",
          winter: packageData.bestTimeToVisit?.winter || "",
          summer: packageData.bestTimeToVisit?.summer || "",
        },
        isFeaturedDestination: packageData.isFeaturedDestination || false,
        isPopularPackage: packageData.isPopularPackage || false,
        isFeaturedTrip: packageData.isFeaturedTrip || false,
      });

      setKeyHighlights(packageData.keyHighlights?.length ? packageData.keyHighlights : [""]);
      setHotelOptions(packageData.hotelOptions?.length ? packageData.hotelOptions : [""]);
      setWhyChooseThisTrip(packageData.whyChooseThisTrip?.length ? packageData.whyChooseThisTrip : [""]);
      const premiumPoints = [
        ...(packageData.whyPremiumSkygoTours || []),
        ...(packageData.whyPremiumDubaiTours || []),
      ].filter((value, index, array) => value.trim() && array.indexOf(value) === index);
      setWhyPremiumSkygoTours(premiumPoints.length ? premiumPoints : [""]);

      setItinerary(
        packageData.itinerary?.map((day, index) => ({
          id: `existing_${index}`,
          day: day.day,
          title: day.title,
          description: day.description || "",
        })) || [{ id: "1", day: 1, title: "", description: "" }]
      );

      setTransportation(
        packageData.transportation?.map((item, index) => ({
          id: `transport_${index}`,
          type: item.type || "",
          vehicle: item.vehicle || "",
          description: item.description || "",
        })) || []
      );

      setAccommodation(
        packageData.accommodation?.map((item, index) => ({
          id: `accommodation_${index}`,
          city: item.city || "",
          hotel: item.hotel || "",
          rooms: item.rooms || "",
          roomType: item.roomType || "",
          nights: item.nights || "",
        })) || []
      );

      // Handle both string array and structured inclusions/exclusions
      if (packageData.inclusions && Array.isArray(packageData.inclusions)) {
        if (packageData.inclusions.length > 0 && typeof packageData.inclusions[0] === 'object' && 'category' in packageData.inclusions[0]) {
          setInclusions((packageData.inclusions as Array<{ category: string; items: string[] }>).map((item, index) => ({
            id: `inc_${index}`,
            category: item.category || "",
            items: item.items || [""]
          })));
        } else {
          // Convert string array to structured format
          setInclusions([{ id: "1", category: "General", items: (packageData.inclusions as string[]).filter(i => i.trim() !== "") }]);
        }
      } else {
        setInclusions([{ id: "1", category: "", items: [""] }]);
      }

      if (packageData.exclusions && Array.isArray(packageData.exclusions)) {
        if (packageData.exclusions.length > 0 && typeof packageData.exclusions[0] === 'object' && 'category' in packageData.exclusions[0]) {
          setExclusions((packageData.exclusions as Array<{ category: string; items: string[] }>).map((item, index) => ({
            id: `exc_${index}`,
            category: item.category || "",
            items: item.items || [""]
          })));
        } else {
          // Convert string array to structured format
          setExclusions([{ id: "1", category: "General", items: (packageData.exclusions as string[]).filter(i => i.trim() !== "") }]);
        }
      } else {
        setExclusions([{ id: "1", category: "", items: [""] }]);
      }

      setFaqs(
        packageData.faqs?.map((faq, index) => ({
          id: `faq_${index}`,
          question: faq.question || "",
          answer: faq.answer || "",
        })) || [{ id: "1", question: "", answer: "" }]
      );

      setFixedDepartures(
        packageData.fixedDepartures?.length
          ? packageData.fixedDepartures.map((row, index) => ({
              id: `fd_${index}`,
              month: row.month || "",
              dates: row.dates || "",
            }))
          : [{ id: "fd1", month: "", dates: "" }]
      );

      setShortItinerary(
        packageData.shortItinerary?.length
          ? packageData.shortItinerary.map((row, index) => ({
              id: `si_${index}`,
              day: row.day,
              title: row.title || "",
            }))
          : [{ id: "si1", day: 1, title: "" }]
      );

      setPackageNotes(packageData.packageNotes?.length ? packageData.packageNotes : [""]);
      setCancellationPolicy(packageData.cancellationPolicy?.length ? packageData.cancellationPolicy : [""]);
      setReschedulingPolicy(packageData.reschedulingPolicy?.length ? packageData.reschedulingPolicy : [""]);
      setBookingPolicy(packageData.bookingPolicy?.length ? packageData.bookingPolicy : [""]);

      setReviews(packageData.reviews || []);

      setExistingImages(packageData.images || []);
      setNewImages([]);
      setExternalImageUrls([]);
      setCurrentImageUrl("");
    }
  }, [packageData, navGroups, resolveCategoryByValue]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePackageGroupChange = (groupSlug: string) => {
    setPackageGroupSlug(groupSlug);
  };

  const handlePackageCategoryChange = (categoryValue: string) => {
    handleInputChange("packageCategory", categoryValue);
    handleInputChange("packageMiniCategory", "");
  };

  const handlePackageMiniCategoryChange = (miniValue: string) => {
    handleInputChange("packageMiniCategory", miniValue);
  };

  const handleAddUrl = () => {
    const url = currentImageUrl.trim();
    if (!url) return;
    const total = existingImages.length + newImages.length + externalImageUrls.length;
    if (total >= 5) {
      setSubmitError('Maximum 5 images allowed.');
      return;
    }
    if (!externalImageUrls.includes(url)) {
      setExternalImageUrls(prev => [...prev, url]);
      setCurrentImageUrl("");
      setSubmitError("");
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const addItineraryDay = () => {
    setItinerary(prev => [
      ...prev,
      { id: Date.now().toString(), day: prev.length + 1, title: "", description: "" }
    ]);
  };

  const removeItineraryDay = (id: string) => {
    if (itinerary.length > 1) {
      setItinerary(prev =>
        prev.filter(day => day.id !== id).map((day, index) => ({ ...day, day: index + 1 }))
      );
    }
  };

  const updateItineraryDay = (id: string, field: 'title' | 'description', value: string) => {
    setItinerary(prev => prev.map(day =>
      day.id === id ? { ...day, [field]: value } : day
    ));
  };

  // Transportation functions
  const addTransportation = () => {
    const newId = Date.now().toString();
    setTransportation(prev => [
      ...prev,
      { id: newId, type: "", vehicle: "", description: "" }
    ]);
  };

  const removeTransportation = (id: string) => {
    setTransportation(prev => prev.filter(item => item.id !== id));
  };

  const updateTransportation = (id: string, field: 'type' | 'vehicle' | 'description', value: string) => {
    setTransportation(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Accommodation functions
  const addAccommodation = () => {
    const newId = Date.now().toString();
    setAccommodation(prev => [
      ...prev,
      { id: newId, city: "", hotel: "", rooms: "", roomType: "", nights: "" }
    ]);
  };

  const removeAccommodation = (id: string) => {
    setAccommodation(prev => prev.filter(item => item.id !== id));
  };

  const updateAccommodation = (id: string, field: 'city' | 'hotel' | 'rooms' | 'roomType' | 'nights', value: string) => {
    setAccommodation(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Inclusions functions
  const addInclusionCategory = () => {
    const newId = Date.now().toString();
    setInclusions(prev => [...prev, { id: newId, category: "", items: [""] }]);
  };

  const removeInclusionCategory = (id: string) => {
    if (inclusions.length > 1) {
      setInclusions(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateInclusionCategory = (id: string, value: string) => {
    setInclusions(prev => prev.map(item =>
      item.id === id ? { ...item, category: value } : item
    ));
  };

  const addInclusionItem = (categoryId: string) => {
    setInclusions(prev => prev.map(item =>
      item.id === categoryId ? { ...item, items: [...item.items, ""] } : item
    ));
  };

  const removeInclusionItem = (categoryId: string, itemIndex: number) => {
    setInclusions(prev => prev.map(item =>
      item.id === categoryId
        ? { ...item, items: item.items.filter((_, i) => i !== itemIndex) }
        : item
    ));
  };

  const updateInclusionItem = (categoryId: string, itemIndex: number, value: string) => {
    setInclusions(prev => prev.map(item =>
      item.id === categoryId
        ? { ...item, items: item.items.map((itm, i) => i === itemIndex ? value : itm) }
        : item
    ));
  };

  // Exclusions functions
  const addExclusionCategory = () => {
    const newId = Date.now().toString();
    setExclusions(prev => [...prev, { id: newId, category: "", items: [""] }]);
  };

  const removeExclusionCategory = (id: string) => {
    if (exclusions.length > 1) {
      setExclusions(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateExclusionCategory = (id: string, value: string) => {
    setExclusions(prev => prev.map(item =>
      item.id === id ? { ...item, category: value } : item
    ));
  };

  const addExclusionItem = (categoryId: string) => {
    setExclusions(prev => prev.map(item =>
      item.id === categoryId ? { ...item, items: [...item.items, ""] } : item
    ));
  };

  const removeExclusionItem = (categoryId: string, itemIndex: number) => {
    setExclusions(prev => prev.map(item =>
      item.id === categoryId
        ? { ...item, items: item.items.filter((_, i) => i !== itemIndex) }
        : item
    ));
  };

  const updateExclusionItem = (categoryId: string, itemIndex: number, value: string) => {
    setExclusions(prev => prev.map(item =>
      item.id === categoryId
        ? { ...item, items: item.items.map((itm, i) => i === itemIndex ? value : itm) }
        : item
    ));
  };

  // New fields helper functions
  const addKeyHighlight = () => {
    setKeyHighlights(prev => [...prev, ""]);
  };

  const removeKeyHighlight = (index: number) => {
    setKeyHighlights(prev => prev.filter((_, i) => i !== index));
  };

  const updateKeyHighlight = (index: number, value: string) => {
    setKeyHighlights(prev => prev.map((item, i) => i === index ? value : item));
  };

  const addHotelOption = () => {
    setHotelOptions(prev => [...prev, ""]);
  };

  const removeHotelOption = (index: number) => {
    setHotelOptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateHotelOption = (index: number, value: string) => {
    setHotelOptions(prev => prev.map((item, i) => i === index ? value : item));
  };

  const addWhyChooseThisTrip = () => {
    setWhyChooseThisTrip(prev => [...prev, ""]);
  };

  const removeWhyChooseThisTrip = (index: number) => {
    setWhyChooseThisTrip(prev => prev.filter((_, i) => i !== index));
  };

  const updateWhyChooseThisTrip = (index: number, value: string) => {
    setWhyChooseThisTrip(prev => prev.map((item, i) => i === index ? value : item));
  };

  const addWhyPremiumSkygoTours = () => {
    setWhyPremiumSkygoTours(prev => [...prev, ""]);
  };

  const removeWhyPremiumSkygoTours = (index: number) => {
    setWhyPremiumSkygoTours(prev => prev.filter((_, i) => i !== index));
  };

  const updateWhyPremiumSkygoTours = (index: number, value: string) => {
    setWhyPremiumSkygoTours(prev => prev.map((item, i) => i === index ? value : item));
  };

  // Reviews functions
  const addReview = () => {
    const newReview: Review = {
      name: "",
      rating: 5,
      comment: "",
      date: new Date().toISOString()
    };
    setReviews(prev => [...prev, newReview]);
  };

  const removeReview = (index: number) => {
    setReviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateReview = (index: number, field: keyof Review, value: string | number) => {
    setReviews(prev => prev.map((review, i) =>
      i === index ? { ...review, [field]: value } : review
    ));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remaining = 5 - (existingImages.length + newImages.length + externalImageUrls.length);
      if (remaining <= 0) {
        setSubmitError('Maximum 5 images allowed.');
        return;
      }
      const newFiles = Array.from(files).slice(0, remaining);
      setNewImages(prev => [...prev, ...newFiles]);
      setSubmitError("");
    }
  };

  const totalSelectedImages = existingImages.length + newImages.length + externalImageUrls.length;

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price) {
      setSubmitError("Title and Price are required.");
      return;
    }
    try {
      setUploading(true);
      setSubmitError("");

      // Upload new images first if any
      let uploadedNewImages: Array<{ url: string; alt: string; public_id?: string }> = [];
      if (newImages.length > 0) {
        console.log('Uploading', newImages.length, 'new images to Cloudinary...');
        for (const file of newImages) {
          try {
            const base64 = await compressImage(file);
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                data: base64,
                folder: 'skygo/packages'
              })
            });
            
            const uploadData = await uploadRes.json();
            if (uploadRes.ok && uploadData.success) {
              uploadedNewImages.push({ 
                url: uploadData.url, 
                alt: formData.title,
                public_id: uploadData.public_id 
              });
            } else {
              throw new Error(uploadData.error || 'Upload failed');
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error(`Failed to upload image ${file.name}: ${uploadError.message}`);
          }
        }
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price');
        return;
      }

      // Prepare updated package data
      const updatedPackageData = {
        ...formData,
        packageType: 'international',
        location: formData.place,
        price: price,
        duration: formData.duration?.trim() || formData.subtitle?.trim() || 'Flexible',
        capacity: formData.capacity?.trim() || '2 Adults',
        subtitle: formData.subtitle?.trim() || formData.title?.trim() || 'Package',
        abstract: formData.abstract,
        tourOverview: formData.tourOverview,
        ideaFor: formData.ideaFor,
        keyHighlights: keyHighlights.filter(h => h.trim() !== ""),
        hotelOptions: hotelOptions.filter(h => h.trim() !== ""),
        bestTimeToVisit: formData.bestTimeToVisit,
        whyChooseThisTrip: whyChooseThisTrip.filter(w => w.trim() !== ""),
        whyPremiumDubaiTours: whyPremiumSkygoTours.filter(w => w.trim() !== ""),
        whyPremiumSkygoTours: whyPremiumSkygoTours.filter(w => w.trim() !== ""),
        itinerary: itinerary.map(day => ({
          day: day.day,
          title: day.title,
          description: day.description
        })),
        transportation: transportation.map(item => ({
          type: item.type,
          vehicle: item.vehicle,
          description: item.description
        })),
        accommodation: accommodation.map(item => ({
          city: item.city,
          hotel: item.hotel,
          rooms: item.rooms,
          roomType: item.roomType,
          nights: item.nights
        })),
        inclusions: inclusions
          .filter(item => item.category.trim() !== "" || item.items.some(i => i.trim() !== ""))
          .map(item => ({
            category: item.category,
            items: item.items.filter(i => i.trim() !== "")
          })),
        exclusions: exclusions
          .filter(item => item.category.trim() !== "" || item.items.some(i => i.trim() !== ""))
          .map(item => ({
            category: item.category,
            items: item.items.filter(i => i.trim() !== "")
          })),
        faqs: faqs.filter(f => f.question.trim() !== "").map(f => ({ question: f.question, answer: f.answer })),
        fixedDepartures: fixedDepartures
          .filter((row) => row.month.trim() || row.dates.trim())
          .map(({ month, dates }) => ({ month, dates })),
        shortItinerary: shortItinerary
          .filter((row) => row.title.trim())
          .map(({ day, title }) => ({ day, title })),
        packageNotes: packageNotes.filter((note) => note.trim()),
        cancellationPolicy: cancellationPolicy.filter((note) => note.trim()),
        reschedulingPolicy: reschedulingPolicy.filter((note) => note.trim()),
        bookingPolicy: bookingPolicy.filter((note) => note.trim()),
        reviews: reviews.filter(review => review.name.trim() !== "" && review.comment.trim() !== ""),
        images: [...existingImages, ...uploadedNewImages, ...externalImageUrls.map(url => ({ url, alt: formData.title }))],
        isFeaturedDestination: formData.isFeaturedDestination,
        isPopularPackage: formData.isPopularPackage,
        isFeaturedTrip: formData.isFeaturedTrip,
        bookings: packageData?.bookings || 0,
        rating: packageData?.rating || 0
      };

      // Update package via API
      console.log('Updating package with ID:', packageData?._id);
      console.log('Sending package data:', JSON.stringify(updatedPackageData, null, 2));

      const response = await fetch(`/api/packages/${packageData?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPackageData),
      });

      console.log('Update response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        onPackageUpdated(result.data);
        handleClose();
        alert('Package updated successfully!');
      } else {
        let errorMessage = 'Failed to update package';
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, get the text content
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating package:', error);
      alert(`Error updating package: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      subtitle: "",
      ideaFor: "",
      about: "",
      services: "",
      tourDetails: "",
      abstract: "",
      tourOverview: "",
      price: "",
      duration: "",
      location: "",
      capacity: "",
      packageType: "international",
      place: "bhutan",
      packageCategory: "Yachts & Sailing Cruises",
    packageMiniCategory: "",
      bestTimeToVisit: {
        yearRound: "",
        winter: "",
        summer: "",
      },
      isFeaturedDestination: false,
      isPopularPackage: false,
      isFeaturedTrip: false,
    });
    setKeyHighlights([]);
    setHotelOptions([]);
    setWhyChooseThisTrip([]);
    setWhyPremiumSkygoTours([]);
    setItinerary([{ id: "1", day: 1, title: "", description: "" }]);
    setSubmitError("");
    setPackageGroupSlug(navGroups[0]?.slug ?? "water");
    setTransportation([]);
    setAccommodation([]);
    setInclusions([{ id: "1", category: "", items: [""] }]);
    setExclusions([{ id: "1", category: "", items: [""] }]);
    setReviews([]);
    setExistingImages([]);
    setNewImages([]);
    setExternalImageUrls([]);
    setCurrentImageUrl("");
    onClose();
  };

  if (!packageData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 border-none rounded-[32px] overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Edit Package</DialogTitle>
          <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Update the details for &quot;{packageData.title}&quot;. Fields marked * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input placeholder="e.g. Dubai Grand Experience" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input placeholder="e.g. 6 Nights / 7 Days" value={formData.subtitle} onChange={(e) => handleInputChange('subtitle', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (â‚¹) *</label>
              <Input type="number" placeholder="e.g. 49999" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input placeholder="e.g. 6N/7D" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              <Input placeholder="e.g. 2 Adults + 1 Child" value={formData.capacity} onChange={(e) => handleInputChange('capacity', e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <ExperienceCategoryNameFields
              packageGroupSlug={packageGroupSlug}
              packageCategory={formData.packageCategory || navGroups[0]?.items[0]?.value || "Yachts & Sailing Cruises"}
              packageMiniCategory={formData.packageMiniCategory || ""}
              onGroupChange={handlePackageGroupChange}
              onCategoryChange={handlePackageCategoryChange}
              onMiniCategoryChange={handlePackageMiniCategoryChange}
              selectContentClassName="z-[200]"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Place / Location *</label>
              <Input placeholder="e.g. Cape Town, South Africa or Dubai, UAE" value={formData.place} onChange={(e) => handleInputChange('place', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Checkbox id="isFeaturedDestinationEdit" checked={formData.isFeaturedDestination} onCheckedChange={(checked) => handleCheckboxChange('isFeaturedDestination', !!checked)} />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="isFeaturedDestinationEdit" className="text-sm font-bold uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show in Homepage Destinations Section</label>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">If checked, this package will be featured in the destinations grid on the home page.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2 px-4 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200">
            <Checkbox id="isPopularPackageEdit" checked={formData.isPopularPackage} onCheckedChange={(checked) => handleCheckboxChange('isPopularPackage', !!checked)} />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="isPopularPackageEdit" className="text-sm font-bold uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show in Homepage Popular Packages Section</label>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">If checked, this package will appear in the Popular Packages section on the home page.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2 px-4 bg-teal-50/50 rounded-2xl border border-dashed border-teal-200">
            <Checkbox id="isFeaturedTripEdit" checked={formData.isFeaturedTrip} onCheckedChange={(checked) => handleCheckboxChange('isFeaturedTrip', !!checked)} />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="isFeaturedTripEdit" className="text-sm font-bold uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Show in Homepage Featured Water Trips Section</label>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">If checked, this package appears in the Featured Water Trips carousel on the home page.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Idea For</label>
            <Input placeholder="e.g. Families, Couples, Solo travelers" value={formData.ideaFor} onChange={(e) => handleInputChange('ideaFor', e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Abstract</label>
            <Textarea placeholder="Short executive summary of the package..." value={formData.abstract} onChange={(e) => handleInputChange('abstract', e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tour Overview</label>
            <Textarea placeholder="Detailed overview of the tour experience..." value={formData.tourOverview} onChange={(e) => handleInputChange('tourOverview', e.target.value)} rows={5} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Key Highlights</label>
              <Button type="button" variant="outline" size="sm" onClick={addKeyHighlight}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {keyHighlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Highlight ${i + 1}`} value={h} onChange={(e) => updateKeyHighlight(i, e.target.value)} />
                {keyHighlights.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeKeyHighlight(i)}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Hotel Options</label>
              <Button type="button" variant="outline" size="sm" onClick={addHotelOption}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {hotelOptions.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Hotel tier ${i + 1} (e.g. Deluxe: 3â˜…)`} value={h} onChange={(e) => updateHotelOption(i, e.target.value)} />
                {hotelOptions.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeHotelOption(i)}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Best Time to Visit</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="text-xs text-gray-500">Year Round</label><Textarea rows={2} placeholder="Year-round details..." value={formData.bestTimeToVisit.yearRound} onChange={(e) => setFormData(p => ({ ...p, bestTimeToVisit: { ...p.bestTimeToVisit, yearRound: e.target.value } }))} /></div>
              <div><label className="text-xs text-gray-500">Winter</label><Textarea rows={2} placeholder="Winter season details..." value={formData.bestTimeToVisit.winter} onChange={(e) => setFormData(p => ({ ...p, bestTimeToVisit: { ...p.bestTimeToVisit, winter: e.target.value } }))} /></div>
              <div><label className="text-xs text-gray-500">Summer</label><Textarea rows={2} placeholder="Summer season details..." value={formData.bestTimeToVisit.summer} onChange={(e) => setFormData(p => ({ ...p, bestTimeToVisit: { ...p.bestTimeToVisit, summer: e.target.value } }))} /></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Why Choose This Trip?</label>
              <Button type="button" variant="outline" size="sm" onClick={addWhyChooseThisTrip}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {whyChooseThisTrip.map((w, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Reason ${i + 1}`} value={w} onChange={(e) => updateWhyChooseThisTrip(i, e.target.value)} />
                {whyChooseThisTrip.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeWhyChooseThisTrip(i)}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Why Premium {SITE_NAME}?</label>
              <Button type="button" variant="outline" size="sm" onClick={addWhyPremiumSkygoTours}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {whyPremiumSkygoTours.map((w, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Point ${i + 1}`} value={w} onChange={(e) => updateWhyPremiumSkygoTours(i, e.target.value)} />
                {whyPremiumSkygoTours.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeWhyPremiumSkygoTours(i)}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Day-wise Itinerary</label>
              <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}><Plus className="h-4 w-4 mr-1" /> Add Day</Button>
            </div>
            {itinerary.map((day) => (
              <Card key={day.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base"><Badge variant="secondary">Day {day.day}</Badge></CardTitle>
                    {itinerary.length > 1 && <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeItineraryDay(day.id)}><Minus className="h-4 w-4" /></Button>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder={`Day ${day.day} title`} value={day.title} onChange={(e) => updateItineraryDay(day.id, 'title', e.target.value)} />
                  <Textarea rows={4} placeholder={`Day ${day.day} description...`} value={day.description} onChange={(e) => updateItineraryDay(day.id, 'description', e.target.value)} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-green-700">âœ“ Inclusions</label>
              <Button type="button" variant="outline" size="sm" onClick={addInclusionCategory}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
            </div>
            {inclusions.map((cat) => (
              <Card key={cat.id} className="border-green-100">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Category name (e.g. Transfers, Meals)" value={cat.category} onChange={(e) => updateInclusionCategory(cat.id, e.target.value)} />
                    {inclusions.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeInclusionCategory(cat.id)}><Minus className="h-4 w-4 text-red-500" /></Button>}
                  </div>
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 pl-4">
                      <Input className="h-8 text-sm" placeholder={`Item ${idx + 1}`} value={item} onChange={(e) => updateInclusionItem(cat.id, idx, e.target.value)} />
                      {cat.items.length > 1 && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeInclusionItem(cat.id, idx)}><X className="h-3 w-3 text-red-400" /></Button>}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="ml-4 h-7 text-xs" onClick={() => addInclusionItem(cat.id)}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-red-700">âœ— Exclusions</label>
              <Button type="button" variant="outline" size="sm" onClick={addExclusionCategory}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
            </div>
            {exclusions.map((cat) => (
              <Card key={cat.id} className="border-red-100">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Category name (e.g. Airfare, Visa)" value={cat.category} onChange={(e) => updateExclusionCategory(cat.id, e.target.value)} />
                    {exclusions.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeExclusionCategory(cat.id)}><Minus className="h-4 w-4 text-red-500" /></Button>}
                  </div>
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 pl-4">
                      <Input className="h-8 text-sm" placeholder={`Item ${idx + 1}`} value={item} onChange={(e) => updateExclusionItem(cat.id, idx, e.target.value)} />
                      {cat.items.length > 1 && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExclusionItem(cat.id, idx)}><X className="h-3 w-3 text-red-400" /></Button>}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="ml-4 h-7 text-xs" onClick={() => addExclusionItem(cat.id)}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Transportation</label>
              <Button type="button" variant="outline" size="sm" onClick={addTransportation}><Plus className="h-4 w-4 mr-1" /> Add Transport</Button>
            </div>
            {transportation.map((t) => (
              <Card key={t.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Type (e.g. Private Transfer)" value={t.type} onChange={(e) => updateTransportation(t.id, 'type', e.target.value)} />
                    <Input placeholder="Vehicle (e.g. Luxury SUV)" value={t.vehicle} onChange={(e) => updateTransportation(t.id, 'vehicle', e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Description" value={t.description} onChange={(e) => updateTransportation(t.id, 'description', e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => removeTransportation(t.id)}><X className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Accommodation</label>
              <Button type="button" variant="outline" size="sm" onClick={addAccommodation}><Plus className="h-4 w-4 mr-1" /> Add Hotel</Button>
            </div>
            {accommodation.map((a) => (
              <Card key={a.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="City" value={a.city} onChange={(e) => updateAccommodation(a.id, 'city', e.target.value)} />
                    <Input placeholder="Hotel" value={a.hotel} onChange={(e) => updateAccommodation(a.id, 'hotel', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="Rooms" value={a.rooms} onChange={(e) => updateAccommodation(a.id, 'rooms', e.target.value)} />
                    <Input placeholder="Room Type" value={a.roomType} onChange={(e) => updateAccommodation(a.id, 'roomType', e.target.value)} />
                    <Input placeholder="Nights" value={a.nights} onChange={(e) => updateAccommodation(a.id, 'nights', e.target.value)} />
                  </div>
                  <Button className="w-full text-red-500" variant="ghost" onClick={() => removeAccommodation(a.id)}>Remove Hotel</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <PackageTourExtrasFields
            fixedDepartures={fixedDepartures}
            setFixedDepartures={setFixedDepartures}
            shortItinerary={shortItinerary}
            setShortItinerary={setShortItinerary}
            packageNotes={packageNotes}
            setPackageNotes={setPackageNotes}
            cancellationPolicy={cancellationPolicy}
            setCancellationPolicy={setCancellationPolicy}
            reschedulingPolicy={reschedulingPolicy}
            setReschedulingPolicy={setReschedulingPolicy}
            bookingPolicy={bookingPolicy}
            setBookingPolicy={setBookingPolicy}
          />

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Package Images (Max 5)</label>
              <span className="text-xs text-gray-500">{totalSelectedImages}/5 selected</span>
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />

            {(existingImages.length > 0 || newImages.length > 0 || externalImageUrls.length > 0) && (
              <div className="flex flex-wrap gap-3">
                {existingImages.map((image, index) => (
                  <div key={`existing_${index}`} className="relative w-24 h-24 rounded-xl border border-gray-100 overflow-hidden group shadow-sm">
                    <img src={image.url} className="w-full h-full object-cover" alt={image.alt || `Image ${index + 1}`} onError={(e) => { (e.target as HTMLImageElement).src = LOGO_SRC; }} />
                    <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 text-center">Saved</div>
                  </div>
                ))}
                {newImages.map((file, index) => (
                  <div key={`new_${file.name}-${file.lastModified}-${index}`} className="relative w-24 h-24 rounded-xl border border-amber-200 overflow-hidden group shadow-sm">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt={file.name} />
                    <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                    <div className="absolute bottom-0 left-0 right-0 bg-amber-700/80 text-white text-[9px] px-1 py-0.5 truncate">{file.name}</div>
                  </div>
                ))}
                {externalImageUrls.map((url, index) => (
                  <div key={`url_${url}`} className="relative w-24 h-24 rounded-xl border border-blue-100 overflow-hidden group shadow-sm">
                    <img src={url} className="w-full h-full object-cover" alt={`URL image ${index + 1}`} onError={(e) => { (e.target as HTMLImageElement).src = LOGO_SRC; }} />
                    <button type="button" onClick={() => setExternalImageUrls(prev => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 bg-gray-50/50 cursor-pointer hover:border-[#6B1F2A] transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Select Professional Images</p>
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl" type="button" disabled={totalSelectedImages >= 5}>Choose Files</Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="OR Paste Image URL here..." value={currentImageUrl} onChange={e => setCurrentImageUrl(e.target.value)} className="h-12 rounded-xl flex-1" />
                <Button type="button" variant="outline" onClick={handleAddUrl} disabled={totalSelectedImages >= 5} className="h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 hover:bg-[#6B1F2A] hover:text-white transition-all">Add URL</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Frequently Asked Questions</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFaqs(p => [...p, { id: Date.now().toString(), question: "", answer: "" }])}><Plus className="h-4 w-4 mr-1" /> Add FAQ</Button>
            </div>
            {faqs.map((faq, i) => (
              <Card key={faq.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400">FAQ {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFaqs(p => p.filter(f => f.id !== faq.id))}><X className="h-3 w-3 text-red-500" /></Button>
                  </div>
                  <Input placeholder="Question" value={faq.question} onChange={e => setFaqs(p => p.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f))} />
                  <Textarea placeholder="Answer" value={faq.answer} onChange={e => setFaqs(p => p.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f))} rows={2} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Guest Reviews (Optional)</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setReviews(p => [...p, { name: "", rating: 5, comment: "", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }])}><Plus className="h-4 w-4 mr-1" /> Add Review</Button>
            </div>
            {reviews.map((r, i) => (
              <Card key={i}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400">Reviewer {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeReview(i)}><X className="h-3 w-3 text-red-500" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Guest Name" value={r.name} onChange={e => updateReview(i, 'name', e.target.value)} />
                    <div className="flex items-center gap-2 border rounded-md px-3">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <input type="number" min={1} max={5} className="w-full text-sm font-bold outline-none" value={r.rating} onChange={e => updateReview(i, 'rating', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <Textarea placeholder="Guest review comment..." value={r.comment} onChange={e => updateReview(i, 'comment', e.target.value)} rows={2} />
                  <Input placeholder="Date (e.g. 15 Oct 2024)" value={r.date} onChange={e => updateReview(i, 'date', e.target.value)} />
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

        <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
          {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
          <div className="flex gap-4 w-full justify-end">
            <Button variant="ghost" onClick={handleClose} disabled={uploading} className="rounded-xl px-6 h-12 font-black uppercase text-xs tracking-widest whitespace-nowrap">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={uploading}
              className="bg-[#111827] hover:bg-[#6B1F2A] rounded-xl px-10 h-12 font-black uppercase text-xs tracking-widest shadow-xl transition-all w-full md:w-auto"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Updating...
                </span>
              ) : "Update Package"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPackageModal;
