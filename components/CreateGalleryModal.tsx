"use client";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { GalleryData } from "@/lib/types";
import { compressImage } from "@/lib/utils";

interface CreateGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGalleryCreated: (item: GalleryData) => void;
}

const CreateGalleryModal = ({ isOpen, onClose, onGalleryCreated }: CreateGalleryModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        caption: "",
        order: "0",
        isActive: true,
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleInputChange = (field: string, value: string | boolean) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setExternalImageUrl("");
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || (!image && !externalImageUrl)) {
            setSubmitError("Title and image are required.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            let uploadedImage = { public_id: "", url: "", alt: "" };

            if (image) {
                const base64 = await compressImage(image);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: base64, folder: 'skygo/gallery' }),
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    uploadedImage = {
                        public_id: uploadData.public_id,
                        url: uploadData.url,
                        alt: formData.title,
                    };
                } else {
                    throw new Error(uploadData.error || "Failed to upload image.");
                }
            } else if (externalImageUrl) {
                uploadedImage = {
                    public_id: "",
                    url: externalImageUrl,
                    alt: formData.title,
                };
            }

            const payload = {
                ...formData,
                order: Number(formData.order) || 0,
                image: uploadedImage,
            };

            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                onGalleryCreated(data.data);
                handleClose();
            } else {
                setSubmitError(data.error || "Failed to add gallery image.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An error occurred.";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ title: "", caption: "", order: "0", isActive: true });
        setImage(null);
        setImagePreview(null);
        setExternalImageUrl("");
        setSubmitError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-[400px] w-[calc(100%-2rem)] gap-0 rounded-2xl border-none p-0 shadow-2xl overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 space-y-1">
                    <DialogTitle className="text-base font-black uppercase tracking-tight text-[#111827]">
                        Add Gallery Image
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-gray-400">
                        Upload a photo for the gallery page.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-5 pb-4 space-y-3 max-h-[55vh] overflow-y-auto">
                    <div className="grid grid-cols-[1fr_72px] gap-2">
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Title *</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Desert Safari"
                                className="rounded-lg h-9 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Order</label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => handleInputChange("order", e.target.value)}
                                className="rounded-lg h-9 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Caption</label>
                        <Textarea
                            value={formData.caption}
                            onChange={(e) => handleInputChange("caption", e.target.value)}
                            placeholder="Optional short description"
                            className="rounded-lg min-h-[52px] text-sm resize-none py-2"
                            rows={2}
                        />
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Image *</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden h-28">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => { setImage(null); setImagePreview(null); }}
                                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border border-dashed border-gray-200 rounded-xl py-4 flex flex-col items-center gap-1.5 hover:border-[#6B1F2A] transition-colors"
                            >
                                <Upload className="h-5 w-5 text-gray-300" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload image</span>
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Or image URL</label>
                        <Input
                            value={externalImageUrl}
                            onChange={(e) => { setExternalImageUrl(e.target.value); setImage(null); setImagePreview(null); }}
                            placeholder="https://..."
                            className="rounded-lg h-9 text-sm"
                            disabled={!!image}
                        />
                    </div>

                    {submitError && (
                        <p className="text-xs text-red-500 font-medium">{submitError}</p>
                    )}
                </div>

                <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 gap-2 sm:space-x-0">
                    <Button variant="outline" onClick={handleClose} className="rounded-lg h-9 text-xs px-4">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#111827] hover:bg-[#6B1F2A] text-white rounded-lg h-9 text-xs px-5"
                    >
                        {isSubmitting ? "Uploading..." : "Add to Gallery"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGalleryModal;
