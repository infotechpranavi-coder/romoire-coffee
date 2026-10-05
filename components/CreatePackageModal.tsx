"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Upload, Star } from "lucide-react";
import { compressImage } from "@/lib/utils";
import { SITE_NAME, DEFAULT_ABOUT_TEXT, DEFAULT_SERVICES_TEXT, LOGO_SRC } from "@/lib/branding";
import ExperienceCategoryNameFields from "@/components/ExperienceCategoryNameFields";
import { useCategoryLabels } from "@/contexts/CategoryLabelsContext";

interface InclusionExclusionCategory {
  id: string;
  category: string;
  items: string[];
}

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPackageCreated: (packageData: any) => void;
}

const CreatePackageModal = ({ isOpen, onClose, onPackageCreated }: CreatePackageModalProps) => {
  const { navGroups } = useCategoryLabels();
  const defaultCategory = navGroups[0]?.items[0]?.value ?? "Single Origin";

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    ideaFor: "",
    abstract: "",
    tourOverview: "",
    about: DEFAULT_ABOUT_TEXT,
    services: DEFAULT_SERVICES_TEXT,
    tourDetails: "",
    price: "",
    duration: "250g / 500g / 1kg",
    location: "",
    capacity: "Whole Bean, Ground",
    packageType: "domestic" as "international" | "domestic",
    place: "",
    packageCategory: defaultCategory,
    packageGroupSlug: navGroups[0]?.slug ?? "",
    packageMiniCategory: "",
    isFeaturedDestination: false,
    isPopularPackage: false,
    isFeaturedTrip: false,
    isComingSoon: false,
  });

  const [flavorNotes, setFlavorNotes] = useState<string[]>([""]);
  const [roastOptions, setRoastOptions] = useState<string[]>(["Light", "Medium", "Dark"]);
  const [whyChoose, setWhyChoose] = useState<string[]>([""]);
  const [whyRomoire, setWhyRomoire] = useState<string[]>([
    "Small-batch roasted",
    "Ethically sourced beans",
  ]);
  const [inclusions, setInclusions] = useState<InclusionExclusionCategory[]>([
    { id: "1", category: "In the bag", items: ["Fresh roasted coffee", "Roast date on pack", "Brewing guide"] },
  ]);
  const [exclusions, setExclusions] = useState<InclusionExclusionCategory[]>([
    { id: "1", category: "Not included", items: ["Coffee equipment", "Filters"] },
  ]);
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>([
    {
      id: "1",
      question: "Is this coffee available as whole bean or ground?",
      answer: "Yes. Choose whole bean or ground at checkout / when you enquire.",
    },
  ]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [externalImageUrls, setExternalImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [packageGroupSlug, setPackageGroupSlug] = useState(navGroups[0]?.slug ?? "single-origin");

  const handleInputChange = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handlePackageGroupChange = (groupSlug: string) => {
    setPackageGroupSlug(groupSlug);
    const group = navGroups.find((g) => g.slug === groupSlug);
    const label = group?.label || groupSlug;
    setFormData((prev) => ({
      ...prev,
      packageGroupSlug: groupSlug,
      packageCategory: label,
      packageMiniCategory: '',
    }));
  };

  const handlePackageCategoryChange = (categoryValue: string) => {
    const group = navGroups.find(
      (g) =>
        g.label.toLowerCase() === categoryValue.toLowerCase() ||
        g.slug.toLowerCase() === categoryValue.toLowerCase()
    );
    const slug = group?.slug || packageGroupSlug;
    const label = group?.label || categoryValue;
    setPackageGroupSlug(slug);
    setFormData((prev) => ({
      ...prev,
      packageGroupSlug: slug,
      packageCategory: label,
      packageMiniCategory: '',
    }));
  };

  const handlePackageMiniCategoryChange = (miniValue: string) => {
    handleInputChange("packageMiniCategory", "");
  };

  const handleAddUrl = () => {
    const url = currentImageUrl.trim();
    if (!url) return;
    const total = images.length + externalImageUrls.length;
    if (total >= 5) {
      setSubmitError("Maximum 5 images allowed.");
      return;
    }
    if (!externalImageUrls.includes(url)) {
      setExternalImageUrls((prev) => [...prev, url]);
      setCurrentImageUrl("");
      setSubmitError("");
    }
  };

  const addImageFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const remaining = 5 - images.length - externalImageUrls.length;
    if (remaining <= 0) {
      setSubmitError("Maximum 5 images allowed.");
      return;
    }
    const newFiles = Array.from(fileList).slice(0, remaining);
    setImages((prev) => [...prev, ...newFiles]);
    setSubmitError("");
  };

  const totalSelectedImages = images.length + externalImageUrls.length;

  const resetForm = () => {
    const nextCategory = navGroups[0]?.items[0]?.value ?? "Single Origin";
    setFormData({
      title: "",
      subtitle: "",
      ideaFor: "",
      abstract: "",
      tourOverview: "",
      about: DEFAULT_ABOUT_TEXT,
      services: DEFAULT_SERVICES_TEXT,
      tourDetails: "",
      price: "",
      duration: "250g / 500g / 1kg",
      location: "",
      capacity: "Whole Bean, Ground",
      packageType: "domestic",
      place: "",
      packageCategory: nextCategory,
      packageGroupSlug: navGroups[0]?.slug ?? "",
      packageMiniCategory: "",
      isFeaturedDestination: false,
      isPopularPackage: false,
      isFeaturedTrip: false,
      isComingSoon: false,
    });
    setFlavorNotes([""]);
    setRoastOptions(["Light", "Medium", "Dark"]);
    setWhyChoose([""]);
    setWhyRomoire(["Small-batch roasted", "Ethically sourced beans"]);
    setInclusions([{ id: "1", category: "In the bag", items: ["Fresh roasted coffee", "Roast date on pack", "Brewing guide"] }]);
    setExclusions([{ id: "1", category: "Not included", items: ["Coffee equipment", "Filters"] }]);
    setFaqs([
      {
        id: "1",
        question: "Is this coffee available as whole bean or ground?",
        answer: "Yes. Choose whole bean or ground at checkout / when you enquire.",
      },
    ]);
    setReviews([]);
    setImages([]);
    setExternalImageUrls([]);
    setCurrentImageUrl("");
    setSubmitError("");
    setPackageGroupSlug(navGroups[0]?.slug ?? "single-origin");
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      setSubmitError("Product title is required.");
      return;
    }
    if (!formData.isComingSoon && (formData.price === "" || isNaN(parseFloat(formData.price as string)))) {
      setSubmitError("Please enter a valid price for active products.");
      return;
    }
    if (!formData.place.trim()) {
      setSubmitError("Origin / region is required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const uploadedImages: Array<{ public_id?: string; url: string; alt: string }> = [];
      for (const file of images) {
        const base64 = await compressImage(file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64 }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error(`Image upload failed: ${uploadData.error}`);
        uploadedImages.push({ public_id: uploadData.public_id, url: uploadData.url, alt: formData.title });
      }

      for (const url of externalImageUrls) {
        uploadedImages.push({ url, alt: formData.title });
      }

      const origin = formData.place.trim();
      const tastingNotes =
        formData.tourDetails.trim() ||
        flavorNotes.filter((n) => n.trim()).join(", ") ||
        formData.subtitle.trim() ||
        DEFAULT_ABOUT_TEXT;

      const rawPrice = formData.price !== "" ? parseFloat(formData.price as string) : 0;
      const price = isNaN(rawPrice) ? 0 : rawPrice;

      const payload = {
        ...formData,
        packageType: "domestic",
        location: origin,
        place: origin,
        isComingSoon: Boolean(formData.isComingSoon),
        duration: formData.duration?.trim() || "250g / 500g / 1kg",
        capacity: formData.capacity?.trim() || "Whole Bean, Ground",
        subtitle: formData.subtitle?.trim() || formData.title.trim(),
        about: formData.about?.trim() || DEFAULT_ABOUT_TEXT,
        services: formData.services?.trim() || DEFAULT_SERVICES_TEXT,
        tourDetails: tastingNotes,
        price: price,
        keyHighlights: flavorNotes.filter((h) => h.trim()),
        hotelOptions: roastOptions.filter((h) => h.trim()),
        whyChooseThisTrip: whyChoose.filter((w) => w.trim()),
        whyPremiumSkygoTours: whyRomoire.filter((w) => w.trim()),
        itinerary: [],
        transportation: [],
        accommodation: [],
        inclusions: inclusions.map((inc) => ({
          category: inc.category,
          items: inc.items.filter((i) => i.trim()),
        })),
        exclusions: exclusions.map((exc) => ({
          category: exc.category,
          items: exc.items.filter((i) => i.trim()),
        })),
        faqs: faqs
          .filter((f) => f.question.trim() !== "")
          .map((f) => ({ question: f.question, answer: f.answer })),
        fixedDepartures: [],
        shortItinerary: [],
        packageNotes: [],
        cancellationPolicy: [],
        reschedulingPolicy: [],
        bookingPolicy: [],
        bestTimeToVisit: { yearRound: "", winter: "", summer: "" },
        reviews,
        images: uploadedImages,
        isPopularPackage: formData.isPopularPackage,
        isFeaturedDestination: formData.isFeaturedDestination,
        isFeaturedTrip: formData.isFeaturedTrip,
        bookings: 0,
        rating: 0,
      };

      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to save product");

      onPackageCreated(result.data);
      resetForm();
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 border-none rounded-[32px] overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-cream/80">
          <DialogTitle className="text-3xl font-black text-espresso uppercase tracking-tighter">
            Create New Product
          </DialogTitle>
          <DialogDescription className="text-mocha/70 font-bold uppercase tracking-widest text-[10px] mt-1">
            Add a coffee product to your catalog. Fields marked * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Basic product info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                placeholder="e.g. Ethiopian Yirgacheffe"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Tagline</label>
              <Input
                placeholder="e.g. Bright floral notes with bergamot"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
              />
            </div>
          </div>

          {/* Product Availability Status */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-espresso uppercase tracking-wider block">
                Product Availability Status *
              </label>
              <p className="text-[11px] text-mocha/80">
                Choose whether this product is active with live pricing or marked as Coming Soon.
              </p>
            </div>
            <div className="w-full md:w-64 shrink-0">
              <Select
                value={formData.isComingSoon ? "coming_soon" : "active"}
                onValueChange={(val) => handleInputChange('isComingSoon', val === 'coming_soon')}
              >
                <SelectTrigger className="rounded-xl border-amber-300 bg-white font-medium text-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="z-[200]">
                  <SelectItem value="active" className="font-medium text-sm">
                    🟢 Active (Show Live Price & Cart)
                  </SelectItem>
                  <SelectItem value="coming_soon" className="font-medium text-sm text-amber-900">
                    ⭐ Coming Soon (Hide Price / Badge)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Price (₹) {!formData.isComingSoon && '*'}</label>
                {formData.isComingSoon && (
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              <Input
                type="number"
                placeholder={formData.isComingSoon ? "0 (Optional for Coming Soon)" : "e.g. 499"}
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pack / Flavour Size</label>
              <Input
                placeholder="e.g. 5 Sachets · 20g each"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Details</label>
              <Input
                placeholder="e.g. Pre-measured Single Serving"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <ExperienceCategoryNameFields
              packageGroupSlug={packageGroupSlug}
              packageCategory={formData.packageCategory}
              packageMiniCategory={formData.packageMiniCategory}
              onGroupChange={handlePackageGroupChange}
              onCategoryChange={handlePackageCategoryChange}
              onMiniCategoryChange={handlePackageMiniCategoryChange}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Origin / Region *</label>
              <Input
                placeholder="e.g. Yirgacheffe, Ethiopia"
                value={formData.place}
                onChange={(e) => handleInputChange("place", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Best For</label>
            <Input
              placeholder="e.g. Pour-over, Espresso, French press"
              value={formData.ideaFor}
              onChange={(e) => handleInputChange("ideaFor", e.target.value)}
            />
          </div>

          {/* Homepage placement */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 py-2 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Checkbox
                id="isFeaturedDestination"
                checked={formData.isFeaturedDestination}
                onCheckedChange={(checked) => handleInputChange("isFeaturedDestination", !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="isFeaturedDestination" className="text-sm font-bold uppercase tracking-widest">
                  Show in Homepage Hero
                </label>
                <p className="text-[10px] text-mocha/60 font-bold uppercase tracking-tighter">
                  Appears in the Start here picker on the home page.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2 px-4 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200">
              <Checkbox
                id="isPopularPackage"
                checked={formData.isPopularPackage}
                onCheckedChange={(checked) => handleInputChange("isPopularPackage", !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="isPopularPackage" className="text-sm font-bold uppercase tracking-widest">
                  Show in The Range
                </label>
                <p className="text-[10px] text-mocha/60 font-bold uppercase tracking-tighter">
                  Appears in The Range (Choose your flavour) section on the home page.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2 px-4 bg-teal-50/50 rounded-2xl border border-dashed border-teal-200">
              <Checkbox
                id="isFeaturedTrip"
                checked={formData.isFeaturedTrip}
                onCheckedChange={(checked) => handleInputChange("isFeaturedTrip", !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="isFeaturedTrip" className="text-sm font-bold uppercase tracking-widest">
                  Mark as Featured Product
                </label>
                <p className="text-[10px] text-mocha/60 font-bold uppercase tracking-tighter">
                  Shows a Featured badge in The Range on the home page.
                </p>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Description</label>
            <Textarea
              placeholder="Describe this coffee — origin story, process, and cup character..."
              value={formData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tasting Notes</label>
            <Textarea
              placeholder="e.g. Jasmine, bergamot, citrus acidity with a tea-like finish"
              value={formData.tourDetails}
              onChange={(e) => handleInputChange("tourDetails", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Process / Altitude (optional)</label>
            <Textarea
              placeholder="e.g. Washed process · 1,900–2,100 masl"
              value={formData.abstract}
              onChange={(e) => handleInputChange("abstract", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brewing Tips</label>
            <Textarea
              placeholder="Suggested brew method, ratio, and grind..."
              value={formData.tourOverview}
              onChange={(e) => handleInputChange("tourOverview", e.target.value)}
              rows={3}
            />
          </div>

          {/* Flavor notes list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Flavor Notes</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFlavorNotes((p) => [...p, ""])}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {flavorNotes.map((note, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`e.g. Chocolate, Citrus, Floral`}
                  value={note}
                  onChange={(e) => setFlavorNotes((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {flavorNotes.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => setFlavorNotes((p) => p.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Roast options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Roast Options</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setRoastOptions((p) => [...p, ""])}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {roastOptions.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`e.g. Light, Medium, Dark`}
                  value={opt}
                  onChange={(e) => setRoastOptions((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {roastOptions.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => setRoastOptions((p) => p.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Why choose */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Why You&apos;ll Love This Coffee</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setWhyChoose((p) => [...p, ""])}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {whyChoose.map((w, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`Reason ${i + 1}`}
                  value={w}
                  onChange={(e) => setWhyChoose((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {whyChoose.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => setWhyChoose((p) => p.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Why {SITE_NAME}?</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setWhyRomoire((p) => [...p, ""])}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {whyRomoire.map((w, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder={`Point ${i + 1}`}
                  value={w}
                  onChange={(e) => setWhyRomoire((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {whyRomoire.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => setWhyRomoire((p) => p.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Inclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-green-700">✓ What&apos;s Included</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInclusions((p) => [...p, { id: Date.now().toString(), category: "", items: [""] }])}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Category
              </Button>
            </div>
            {inclusions.map((cat) => (
              <Card key={cat.id} className="border-green-100">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Category (e.g. In the bag)"
                      value={cat.category}
                      onChange={(e) =>
                        setInclusions((p) => p.map((c) => (c.id === cat.id ? { ...c, category: e.target.value } : c)))
                      }
                    />
                    {inclusions.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => setInclusions((p) => p.filter((c) => c.id !== cat.id))}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  {(Array.isArray(cat.items) ? cat.items : [String(cat.items || "")]).map((item, idx) => (
                    <div key={idx} className="flex gap-2 pl-4">
                      <Input
                        className="h-8 text-sm"
                        placeholder={`Item ${idx + 1}`}
                        value={item}
                        onChange={(e) =>
                          setInclusions((p) =>
                            p.map((c) =>
                              c.id === cat.id
                                ? { ...c, items: (Array.isArray(c.items) ? c.items : [String(c.items || "")]).map((x, j) => (j === idx ? e.target.value : x)) }
                                : c
                            )
                          )
                        }
                      />
                      {cat.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setInclusions((p) =>
                              p.map((c) => (c.id === cat.id ? { ...c, items: (Array.isArray(c.items) ? c.items : [String(c.items || "")]).filter((_, j) => j !== idx) } : c))
                            )
                          }
                        >
                          <X className="h-3 w-3 text-red-400" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-4 h-7 text-xs"
                    onClick={() =>
                      setInclusions((p) => p.map((c) => (c.id === cat.id ? { ...c, items: [...(Array.isArray(c.items) ? c.items : [String(c.items || "")]), ""] } : c)))
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Exclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-red-700">✗ Not Included</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExclusions((p) => [...p, { id: Date.now().toString(), category: "", items: [""] }])}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Category
              </Button>
            </div>
            {exclusions.map((cat) => (
              <Card key={cat.id} className="border-red-100">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Category"
                      value={cat.category}
                      onChange={(e) =>
                        setExclusions((p) => p.map((c) => (c.id === cat.id ? { ...c, category: e.target.value } : c)))
                      }
                    />
                    {exclusions.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => setExclusions((p) => p.filter((c) => c.id !== cat.id))}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  {(Array.isArray(cat.items) ? cat.items : [String(cat.items || "")]).map((item, idx) => (
                    <div key={idx} className="flex gap-2 pl-4">
                      <Input
                        className="h-8 text-sm"
                        placeholder={`Item ${idx + 1}`}
                        value={item}
                        onChange={(e) =>
                          setExclusions((p) =>
                            p.map((c) =>
                              c.id === cat.id
                                ? { ...c, items: (Array.isArray(c.items) ? c.items : [String(c.items || "")]).map((x, j) => (j === idx ? e.target.value : x)) }
                                : c
                            )
                          )
                        }
                      />
                      {(Array.isArray(cat.items) ? cat.items : [String(cat.items || "")]).length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setExclusions((p) =>
                              p.map((c) => (c.id === cat.id ? { ...c, items: (Array.isArray(c.items) ? c.items : [String(c.items || "")]).filter((_, j) => j !== idx) } : c))
                            )
                          }
                        >
                          <X className="h-3 w-3 text-red-400" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-4 h-7 text-xs"
                    onClick={() =>
                      setExclusions((p) => p.map((c) => (c.id === cat.id ? { ...c, items: [...c.items, ""] } : c)))
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Product Images (Max 5)</label>
              <span className="text-xs text-mocha/60">{totalSelectedImages}/5 selected</span>
            </div>
            <div className="flex flex-col gap-4">
              <div
                className="border-2 border-dashed border-vanilla rounded-2xl p-8 flex flex-col items-center gap-3 bg-cream/50 cursor-pointer hover:border-hazelnut transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-mocha/50" />
                <p className="text-sm font-bold text-mocha/70 uppercase tracking-widest">Upload Coffee Photos</p>
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl" type="button">
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => addImageFiles(e.target.files)}
                />
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((file, i) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${i}`}
                      className="relative w-24 h-24 rounded-xl border border-vanilla overflow-hidden group shadow-sm"
                    >
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL..."
                  value={currentImageUrl}
                  onChange={(e) => setCurrentImageUrl(e.target.value)}
                  className="h-12 rounded-xl flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddUrl}
                  disabled={totalSelectedImages >= 5}
                  className="h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 hover:bg-hazelnut hover:text-white transition-all"
                >
                  Add URL
                </Button>
              </div>
              {externalImageUrls.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {externalImageUrls.map((url, i) => (
                    <div key={url} className="relative w-24 h-24 rounded-xl border border-vanilla overflow-hidden group shadow-sm">
                      <img
                        src={url}
                        className="w-full h-full object-cover"
                        alt={`Product image ${i + 1}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = LOGO_SRC;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setExternalImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">FAQs</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFaqs((p) => [...p, { id: Date.now().toString(), question: "", answer: "" }])}
              >
                <Plus className="h-4 w-4 mr-1" /> Add FAQ
              </Button>
            </div>
            {faqs.map((faq, i) => (
              <Card key={faq.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-mocha/50">FAQ {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFaqs((p) => p.filter((f) => f.id !== faq.id))}>
                      <X className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => setFaqs((p) => p.map((f) => (f.id === faq.id ? { ...f, question: e.target.value } : f)))}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => setFaqs((p) => p.map((f) => (f.id === faq.id ? { ...f, answer: e.target.value } : f)))}
                    rows={2}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Customer Reviews (Optional)</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setReviews((p) => [
                    ...p,
                    {
                      name: "",
                      rating: 5,
                      comment: "",
                      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                    },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Review
              </Button>
            </div>
            {reviews.map((r, i) => (
              <Card key={i}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-mocha/50">Review {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReviews((p) => p.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Customer name"
                      value={r.name}
                      onChange={(e) => setReviews((p) => p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                    />
                    <div className="flex items-center gap-2 border rounded-md px-3">
                      <Star className="h-3 w-3 text-hazelnut fill-hazelnut" />
                      <input
                        type="number"
                        min={1}
                        max={5}
                        className="w-full text-sm font-bold outline-none bg-transparent"
                        value={r.rating}
                        onChange={(e) =>
                          setReviews((p) => p.map((x, j) => (j === i ? { ...x, rating: parseInt(e.target.value) || 5 } : x)))
                        }
                      />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Review comment..."
                    value={r.comment}
                    onChange={(e) => setReviews((p) => p.map((x, j) => (j === i ? { ...x, comment: e.target.value } : x)))}
                    rows={2}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="p-8 bg-cream/80 flex flex-col items-center gap-4">
          {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
          <div className="flex gap-4 w-full justify-end">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl px-6 h-12 font-black uppercase text-xs tracking-widest whitespace-nowrap"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-espresso hover:bg-hazelnut rounded-xl px-10 h-12 font-black uppercase text-xs tracking-widest shadow-xl transition-all w-full md:w-auto"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Publishing...
                </span>
              ) : (
                "Publish Product"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePackageModal;
