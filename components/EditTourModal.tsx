"use client";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, X, Upload, Star } from "lucide-react";
import { compressImage } from "@/lib/utils";
import { TourData } from "@/lib/types";

import { Badge } from "@/components/ui/badge";

interface ItineraryDay {
    id?: string;
    day: number;
    title: string;
    description: string;
}

interface EditTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTourUpdated: (tourData: TourData) => void;
    tourData: TourData | null;
}

const EditTourModal = ({ isOpen, onClose, onTourUpdated, tourData }: EditTourModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        about: "",
        price: "",
        duration: "",
        location: "",
        capacity: "",
        tourType: "Cultural",
        guideName: "",
        meetingPoint: "",
        groupSize: "",
    });

    const [highlights, setHighlights] = useState<string[]>([""]);
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([
        { day: 1, title: "", description: "" }
    ]);
    const [inclusions, setInclusions] = useState<string[]>([""]);
    const [exclusions, setExclusions] = useState<string[]>([""]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [externalImageUrls, setExternalImageUrls] = useState<string[]>([]);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (tourData) {
            setFormData({
                title: tourData.title || "",
                subtitle: tourData.subtitle || "",
                about: tourData.about || "",
                price: tourData.price?.toString() || "",
                duration: tourData.duration || "",
                location: tourData.location || "",
                capacity: tourData.capacity || "",
                tourType: tourData.tourType || "Cultural",
                guideName: tourData.guideName || "",
                meetingPoint: tourData.meetingPoint || "",
                groupSize: tourData.groupSize || "",
            });
            setHighlights(tourData.highlights?.length ? tourData.highlights : [""]);
            setItinerary(tourData.itinerary?.length ? tourData.itinerary.map(item => ({ ...item, id: Math.random().toString() })) : [{ day: 1, title: "", description: "" }]);
            setInclusions(tourData.inclusions?.length ? tourData.inclusions : [""]);
            setExclusions(tourData.exclusions?.length ? tourData.exclusions : [""]);
            setExistingImages(tourData.images || []);
            setNewImages([]);
            setExternalImageUrls([]);
            setCurrentImageUrl("");
        }
    }, [tourData]);

    const handleInputChange = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleAddUrl = () => {
        if (currentImageUrl.trim() && !externalImageUrls.includes(currentImageUrl.trim())) {
            setExternalImageUrls(prev => [...prev, currentImageUrl.trim()]);
            setCurrentImageUrl("");
        }
    };

    // Image compression handled in handleSubmit

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.location || !tourData) {
            setSubmitError("Title, price and location are required.");
            return;
        }
        setIsSubmitting(true);
        setSubmitError("");
        try {
            const uploadedImages = [...existingImages];
            
            // Upload new local files
            for (const file of newImages) {
                const base64 = await compressImage(file);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: base64, folder: 'skygo/tours' }),
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    uploadedImages.push({ public_id: uploadData.public_id, url: uploadData.url, alt: formData.title });
                }
            }

            // Add new external URLs
            for (const url of externalImageUrls) {
                uploadedImages.push({ public_id: "external", url, alt: formData.title });
            }

            const payload = {
                ...formData,
                price: Number(formData.price),
                highlights: highlights.filter(h => h.trim() !== ""),
                itinerary: itinerary.filter(i => i.title.trim() !== ""),
                inclusions: inclusions.filter(i => i.trim() !== ""),
                exclusions: exclusions.filter(e => e.trim() !== ""),
                images: uploadedImages,
            };

            const res = await fetch(`/api/tours/${tourData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                onTourUpdated(data.data);
                onClose();
            } else {
                setSubmitError(data.error || "Failed to update tour.");
            }
        } catch (err: any) {
            setSubmitError(err.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 border-none shadow-2xl rounded-[32px] overflow-hidden bg-white text-[#111827]">
                <DialogHeader className="p-8 pb-4 bg-gray-50/50">
                    <DialogTitle className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Edit Tour</DialogTitle>
                    <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Modify tour experience parameters.</DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* Basic Info */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tour Title</label>
                                <Input placeholder="e.g. Table Mountain Walking Tour" value={formData.title} onChange={e => handleInputChange("title", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (ZAR)</label>
                                <Input type="number" placeholder="e.g. 1500" value={formData.price} onChange={e => handleInputChange("price", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle</label>
                                <Input placeholder="e.g. A panoramic journey to the top of Cape Town" value={formData.subtitle} onChange={e => handleInputChange("subtitle", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tour Type</label>
                                <Select value={formData.tourType} onValueChange={val => handleInputChange("tourType", val)}>
                                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {['Walking', 'Bus', 'Boat', 'Air', 'Adventure', 'Cultural', 'Wildlife', 'Luxury'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Duration</label>
                                <Input placeholder="e.g. 4 Hours / 1 Day" value={formData.duration} onChange={e => handleInputChange("duration", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                                <Input placeholder="e.g. Cape Town, South Africa" value={formData.location} onChange={e => handleInputChange("location", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Group Size</label>
                                <Input placeholder="e.g. 12 Persons Max" value={formData.groupSize} onChange={e => handleInputChange("groupSize", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logistics */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Tour Logistics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Guide Name</label>
                                <Input placeholder="e.g. John Doe" value={formData.guideName} onChange={e => handleInputChange("guideName", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Meeting Point</label>
                                <Input placeholder="e.g. V&A Waterfront Clock Tower" value={formData.meetingPoint} onChange={e => handleInputChange("meetingPoint", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">About Tour</label>
                                <Textarea placeholder="Detailed description of the tour..." value={formData.about} onChange={e => handleInputChange("about", e.target.value)} className="min-h-[120px] rounded-xl pt-3" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Itinerary */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Daily Itinerary</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setItinerary([...itinerary, { id: Math.random().toString(), day: itinerary.length + 1, title: "", description: "" }])} className="rounded-xl h-9">
                                <Plus className="h-4 w-4 mr-2" /> Add Day
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {itinerary.map((day, idx) => (
                                <div key={day.id || idx} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 relative group">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="outline" className="bg-white border-gray-200 text-[#6B1F2A] px-3 py-1 rounded-full font-black uppercase tracking-widest text-[9px]">Day {day.day}</Badge>
                                        {itinerary.length > 1 && (
                                            <Button variant="ghost" size="icon" onClick={() => {
                                                const newItinerary = itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
                                                setItinerary(newItinerary);
                                            }} className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Day Title</label>
                                            <Input placeholder="e.g. Arrival & Orientation" value={day.title} onChange={e => {
                                                const newItin = [...itinerary];
                                                newItin[idx].title = e.target.value;
                                                setItinerary(newItin);
                                            }} className="h-10 rounded-xl bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Day Description</label>
                                            <Textarea placeholder="What will happen on this day..." value={day.description} onChange={e => {
                                                const newItin = [...itinerary];
                                                newItin[idx].description = e.target.value;
                                                setItinerary(newItin);
                                            }} className="min-h-[80px] rounded-xl bg-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Dynamic Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Images Management */}
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 block">Tour Images</label>
                            <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-wrap gap-4">
                                            {existingImages.map((img, i) => (
                                                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden group border border-gray-100">
                                                    <img src={img.url} className="w-full h-full object-cover rounded-2xl" alt="" />
                                                    <button onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow-lg">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-[#6B1F2A] hover:bg-gray-50/50 transition-all group" onClick={() => fileInputRef.current?.click()}>
                                                <Upload className="h-6 w-6 text-gray-300 group-hover:text-[#6B1F2A] mb-1" />
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Add More</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input placeholder="OR Paste Image URL here..." value={currentImageUrl} onChange={e => setCurrentImageUrl(e.target.value)} className="h-12 rounded-xl flex-1" />
                                            <Button variant="outline" onClick={handleAddUrl} className="h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 hover:bg-[#6B1F2A] hover:text-white transition-all">Add URL</Button>
                                        </div>
                                        {externalImageUrls.length > 0 && (
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                {externalImageUrls.map((url, i) => (
                                                    <div key={i} className="relative w-16 h-16 rounded-xl border border-gray-100 overflow-hidden group">
                                                        <img src={url} className="w-full h-full object-cover" alt="" />
                                                        <button onClick={() => setExternalImageUrls(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <input type="file" multiple hidden ref={fileInputRef} onChange={e => setNewImages(prev => [...prev, ...Array.from(e.target.files || [])])} accept="image/*" />
                                        {newImages.length > 0 && <p className="text-[10px] font-black text-[#6B1F2A] mt-4 uppercase tracking-[0.2em]">{newImages.length} new images staged for upload</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 block">Highlights</label>
                            {highlights.map((h, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input value={h} onChange={e => {
                                        const newH = [...highlights];
                                        newH[i] = e.target.value;
                                        setHighlights(newH);
                                    }} className="h-10 rounded-xl" />
                                    {highlights.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="h-10 w-10 text-gray-400 hover:text-red-500">
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => setHighlights([...highlights, ""])} className="w-full rounded-xl h-10 border-dashed"><Plus className="h-4 w-4 mr-2" /> Add Highlight</Button>
                        </div>

                        {/* Inclusions */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 block">Inclusions</label>
                            {inclusions.map((inc, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input value={inc} onChange={e => {
                                        const newInc = [...inclusions];
                                        newInc[i] = e.target.value;
                                        setInclusions(newInc);
                                    }} className="h-10 rounded-xl" />
                                    {inclusions.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => setInclusions(inclusions.filter((_, idx) => idx !== i))} className="h-10 w-10 text-gray-400 hover:text-red-500">
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => setInclusions([...inclusions, ""])} className="w-full rounded-xl h-10 border-dashed"><Plus className="h-4 w-4 mr-2" /> Add Inclusion</Button>
                        </div>

                        {/* Exclusions */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 block">Exclusions</label>
                            {exclusions.map((exc, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input value={exc} onChange={e => {
                                        const newExc = [...exclusions];
                                        newExc[i] = e.target.value;
                                        setExclusions(newExc);
                                    }} className="h-10 rounded-xl" />
                                    {exclusions.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))} className="h-10 w-10 text-gray-400 hover:text-red-500">
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => setExclusions([...exclusions, ""])} className="w-full rounded-xl h-10 border-dashed"><Plus className="h-4 w-4 mr-2" /> Add Exclusion</Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
                    {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
                    <div className="flex gap-4 w-full justify-end">
                        <Button variant="ghost" onClick={onClose} className="rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest">Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#111827] hover:bg-[#6B1F2A] rounded-2xl px-12 h-14 font-black uppercase text-xs tracking-widest shadow-xl transition-all">
                            {isSubmitting ? "Updating..." : "Save Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default EditTourModal;
