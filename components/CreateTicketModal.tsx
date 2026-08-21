"use client";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, X, Upload, Star } from "lucide-react";
import { compressImage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTicketCreated: (ticketData: any) => void;
}

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        carrier: "",
        route: "",
        price: "",
        travelClass: "Economy",
        departureTime: "",
        arrivalTime: "",
        luggageAllowance: "",
        refundPolicy: "",
        validity: "",
        location: "",
        description: "",
    });

    const [images, setImages] = useState<File[]>([]);
    const [externalImageUrls, setExternalImageUrls] = useState<string[]>([]);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [itinerary, setItinerary] = useState<Array<{ id: string; day: number; title: string; description: string }>>([
        { id: "1", day: 1, title: "", description: "" }
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleInputChange = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleAddUrl = () => {
        if (currentImageUrl.trim() && !externalImageUrls.includes(currentImageUrl.trim())) {
            setExternalImageUrls(prev => [...prev, currentImageUrl.trim()]);
            setCurrentImageUrl("");
        }
    };

    // Image compression handled in handleSubmit

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.carrier || !formData.route) {
            setSubmitError("Title, Carrier, Route and Price are required.");
            return;
        }
        setIsSubmitting(true);
        setSubmitError("");
        try {
            const uploadedImages: Array<{ public_id: string; url: string; alt: string }> = [];
            for (const file of images) {
                const base64 = await compressImage(file);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64, folder: 'skygo/tickets' }),
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
                images: uploadedImages,
                itinerary: itinerary.filter(i => i.title.trim() !== "").map(d => ({ day: d.day, title: d.title, description: d.description })),
            };

            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                onTicketCreated(data.data);
                handleClose();
            } else {
                setSubmitError(data.error || "Failed to create ticket.");
            }
        } catch (err: any) {
            setSubmitError(err.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: "",
            carrier: "",
            route: "",
            price: "",
            travelClass: "Economy",
            departureTime: "",
            arrivalTime: "",
            luggageAllowance: "",
            refundPolicy: "",
            validity: "",
            location: "",
            description: "",
        });
        setImages([]);
        setExternalImageUrls([]);
        setCurrentImageUrl("");
        setItinerary([{ id: "1", day: 1, title: "", description: "" }]);
        setSubmitError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl p-0 border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
                <DialogHeader className="p-8 pb-4 bg-gray-50/50">
                    <DialogTitle className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Add Airline Ticket</DialogTitle>
                    <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage flight inventory with dedicated airline parameters.</DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* Flight Info */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Flight Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Entry Title</label>
                                <Input placeholder="e.g. Cape Town to Dubai - Emirates" value={formData.title} onChange={e => handleInputChange("title", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Carrier (Airline)</label>
                                <Input placeholder="e.g. Emirates" value={formData.carrier} onChange={e => handleInputChange("carrier", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (ZAR)</label>
                                <Input type="number" placeholder="e.g. 12000" value={formData.price} onChange={e => handleInputChange("price", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Route</label>
                                <Input placeholder="e.g. CPT - DXB - LHR" value={formData.route} onChange={e => handleInputChange("route", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Travel Class</label>
                                <Select value={formData.travelClass} onValueChange={val => handleInputChange("travelClass", val)}>
                                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {['Economy', 'Premium Economy', 'Business', 'First'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Destination City</label>
                                <Input placeholder="e.g. London" value={formData.location} onChange={e => handleInputChange("location", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Validity</label>
                                <Input placeholder="e.g. 30 Days" value={formData.validity} onChange={e => handleInputChange("validity", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule & Policy */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Schedule & Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Departure Time</label>
                                <Input placeholder="e.g. 10:30 AM" value={formData.departureTime} onChange={e => handleInputChange("departureTime", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Arrival Time</label>
                                <Input placeholder="e.g. 05:45 PM" value={formData.arrivalTime} onChange={e => handleInputChange("arrivalTime", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Luggage Allowance</label>
                                <Input placeholder="e.g. 2 x 23kg" value={formData.luggageAllowance} onChange={e => handleInputChange("luggageAllowance", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Refund Policy</label>
                                <Input placeholder="e.g. Partially Refundable" value={formData.refundPolicy} onChange={e => handleInputChange("refundPolicy", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Additional Description</label>
                                <Textarea placeholder="Any other flight details..." value={formData.description} onChange={e => handleInputChange("description", e.target.value)} className="min-h-[100px] rounded-xl pt-3" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Itinerary */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Entry Itinerary / Schedule</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setItinerary([...itinerary, { id: Date.now().toString(), day: itinerary.length + 1, title: "", description: "" }])} className="rounded-xl h-9">
                                <Plus className="h-4 w-4 mr-2" /> Add Day
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {itinerary.map((day, idx) => (
                                <div key={day.id} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 relative group">
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
                                            <Input placeholder="e.g. Flight & Ground Handling" value={day.title} onChange={e => {
                                                const newItin = [...itinerary];
                                                newItin[idx].title = e.target.value;
                                                setItinerary(newItin);
                                            }} className="h-10 rounded-xl bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Day Description</label>
                                            <Textarea placeholder="Details for this schedule day..." value={day.description} onChange={e => {
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

                    {/* Image Upload */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Promo Images</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex flex-col gap-4">
                                <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-8 text-center cursor-pointer hover:border-[#6B1F2A] transition-all bg-gray-50/30 group" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3 group-hover:text-[#6B1F2A] transition-colors" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Professional Images</p>
                                    <p className="text-[9px] text-gray-300 mt-1 uppercase font-bold tracking-tight">{images.length} images selected</p>
                                    <input type="file" multiple hidden ref={fileInputRef} onChange={e => setImages(Array.from(e.target.files || []))} accept="image/*" />
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
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
                    {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
                    <div className="flex gap-4 w-full justify-end">
                        <Button variant="ghost" onClick={handleClose} className="rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest">Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#111827] hover:bg-[#6B1F2A] rounded-2xl px-12 h-14 font-black uppercase text-xs tracking-widest shadow-xl transition-all">
                            {isSubmitting ? "Publishing..." : "Publish Ticket"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTicketModal;
