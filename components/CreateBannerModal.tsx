"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BannerData } from "@/lib/types";
import { BannerMediaType } from "@/lib/bannerMedia";
import { buildBannerMediaPayload } from "@/lib/bannerUpload";
import BannerMediaForm from "@/components/BannerMediaForm";

interface CreateBannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBannerCreated: (bannerData: BannerData) => void;
}

const CreateBannerModal = ({ isOpen, onClose, onBannerCreated }: CreateBannerModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        link: "",
        order: "0",
        isActive: true,
    });

    const [mediaType, setMediaType] = useState<BannerMediaType>('image');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState("");
    const [video, setVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [externalVideoUrl, setExternalVideoUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleInputChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleImageFileChange = (file: File | null) => {
        setImage(file);
        if (file) {
            setExternalImageUrl("");
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            return;
        }
        setImagePreview(null);
    };

    const handleVideoFileChange = (file: File | null) => {
        setVideo(file);
        if (file) {
            setExternalVideoUrl("");
            const reader = new FileReader();
            reader.onloadend = () => setVideoPreview(reader.result as string);
            reader.readAsDataURL(file);
            return;
        }
        setVideoPreview(null);
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.subtitle) {
            setSubmitError("Title and subtitle are required.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const media = await buildBannerMediaPayload({
                mediaType,
                title: formData.title,
                imageFile: image,
                externalImageUrl,
                videoFile: video,
                externalVideoUrl,
                youtubeUrl,
            });

            const payload = {
                ...formData,
                order: Number(formData.order) || 0,
                mediaType: media.mediaType,
                image: media.image,
                video: media.video,
                youtubeUrl: media.youtubeUrl,
            };

            const res = await fetch('/api/banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                onBannerCreated(data.data);
                handleClose();
            } else {
                setSubmitError(data.error || "Failed to create banner.");
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
            subtitle: "",
            link: "",
            order: "0",
            isActive: true,
        });
        setMediaType('image');
        setImage(null);
        setImagePreview(null);
        setExternalImageUrl("");
        setVideo(null);
        setVideoPreview(null);
        setExternalVideoUrl("");
        setYoutubeUrl("");
        setSubmitError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl rounded-[32px] border-none shadow-2xl p-0 bg-white overflow-hidden">
                <DialogHeader className="p-8 pb-4 bg-gray-50/50">
                    <DialogTitle className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Add Home Banner</DialogTitle>
                    <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Create a hero banner with image, uploaded video, or YouTube background.</DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Banner Title</label>
                            <Textarea 
                                placeholder="e.g. ADVENTURES BEGIN WITH&#10;ROMOIRE" 
                                value={formData.title} 
                                onChange={e => handleInputChange("title", e.target.value)} 
                                className="min-h-[100px] rounded-xl resize-none" 
                            />
                            <p className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Press Enter for a second headline line.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle / Tagline</label>
                            <Textarea 
                                placeholder="e.g. Start your exciting travel adventure..." 
                                value={formData.subtitle} 
                                onChange={e => handleInputChange("subtitle", e.target.value)} 
                                className="min-h-[100px] rounded-xl resize-none" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Redirect Link (Optional)</label>
                            <Input placeholder="e.g. /tours or /packages" value={formData.link} onChange={e => handleInputChange("link", e.target.value)} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Display Order</label>
                            <Input type="number" placeholder="0" value={formData.order} onChange={e => handleInputChange("order", e.target.value)} className="h-12 rounded-xl" />
                        </div>
                    </div>

                    <BannerMediaForm
                        mediaType={mediaType}
                        onMediaTypeChange={setMediaType}
                        imagePreview={imagePreview}
                        externalImageUrl={externalImageUrl}
                        onImageFileChange={handleImageFileChange}
                        onExternalImageUrlChange={(url) => {
                            setExternalImageUrl(url);
                            setImage(null);
                            setImagePreview(null);
                        }}
                        onClearImage={() => {
                            setImage(null);
                            setImagePreview(null);
                            setExternalImageUrl("");
                        }}
                        videoPreview={videoPreview}
                        externalVideoUrl={externalVideoUrl}
                        onVideoFileChange={handleVideoFileChange}
                        onExternalVideoUrlChange={(url) => {
                            setExternalVideoUrl(url);
                            setVideo(null);
                            setVideoPreview(null);
                        }}
                        onClearVideo={() => {
                            setVideo(null);
                            setVideoPreview(null);
                            setExternalVideoUrl("");
                        }}
                        youtubeUrl={youtubeUrl}
                        onYoutubeUrlChange={setYoutubeUrl}
                    />

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => handleInputChange("isActive", e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#6B1F2A] focus:ring-[#6B1F2A]"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold text-gray-700 uppercase tracking-widest">Active Banner</label>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
                    {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
                    <div className="flex gap-4 w-full justify-end">
                        <Button variant="ghost" onClick={handleClose} className="rounded-xl px-6 h-12 font-black uppercase text-xs tracking-widest">Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-[#111827] hover:bg-[#6B1F2A] rounded-xl px-10 h-12 font-black uppercase text-xs tracking-widest shadow-xl transition-all"
                        >
                            {isSubmitting ? "Creating..." : "Create Banner"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateBannerModal;
