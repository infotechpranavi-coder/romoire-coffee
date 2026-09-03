"use client";

import { useRef } from "react";
import { Upload, X, Youtube, Film, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BannerMediaType } from "@/lib/bannerMedia";

interface BannerMediaFormProps {
  mediaType: BannerMediaType;
  onMediaTypeChange: (type: BannerMediaType) => void;
  imagePreview: string | null;
  externalImageUrl: string;
  onImageFileChange: (file: File | null) => void;
  onExternalImageUrlChange: (url: string) => void;
  onClearImage: () => void;
  videoPreview: string | null;
  externalVideoUrl: string;
  onVideoFileChange: (file: File | null) => void;
  onExternalVideoUrlChange: (url: string) => void;
  onClearVideo: () => void;
  youtubeUrl: string;
  onYoutubeUrlChange: (url: string) => void;
}

const mediaOptions: { value: BannerMediaType; label: string; icon: typeof ImageIcon }[] = [
  { value: 'image', label: 'Image', icon: ImageIcon },
  { value: 'video', label: 'Video Upload', icon: Film },
  { value: 'youtube', label: 'YouTube Link', icon: Youtube },
];

const BannerMediaForm = ({
  mediaType,
  onMediaTypeChange,
  imagePreview,
  externalImageUrl,
  onImageFileChange,
  onExternalImageUrlChange,
  onClearImage,
  videoPreview,
  externalVideoUrl,
  onVideoFileChange,
  onExternalVideoUrlChange,
  onClearVideo,
  youtubeUrl,
  onYoutubeUrlChange,
}: BannerMediaFormProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageFileChange(file);
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onVideoFileChange(file);
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
        Hero Media Type
      </label>

      <div className="grid grid-cols-3 gap-2">
        {mediaOptions.map((option) => {
          const Icon = option.icon;
          const active = mediaType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onMediaTypeChange(option.value)}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center transition-all ${
                active
                  ? 'border-hazelnut bg-hazelnut/10 text-espresso'
                  : 'border-gray-100 bg-gray-50/60 text-gray-500 hover:border-gray-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-hazelnut' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
            </button>
          );
        })}
      </div>

      {mediaType === 'image' && (
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Banner Image
          </label>
          {(imagePreview || externalImageUrl) ? (
            <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-lg border border-gray-100">
              <img src={imagePreview || externalImageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onClearImage}
                className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div
                className="border-2 border-dashed border-gray-100 rounded-[24px] p-10 text-center cursor-pointer hover:border-hazelnut hover:bg-gray-50/50 transition-all group"
                onClick={() => imageInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-hazelnut/10 transition-colors">
                  <Upload className="h-6 w-6 text-gray-300 group-hover:text-hazelnut transition-colors" />
                </div>
                <p className="text-xs font-black text-espresso uppercase tracking-widest">Upload Image</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">PNG, JPG or WEBP</p>
                <input type="file" hidden ref={imageInputRef} onChange={handleImageInput} accept="image/*" />
              </div>
              <Input
                placeholder="OR paste image URL..."
                value={externalImageUrl}
                onChange={(e) => onExternalImageUrlChange(e.target.value)}
                className="h-14 rounded-2xl border-gray-100 shadow-sm"
              />
            </div>
          )}
        </div>
      )}

      {mediaType === 'video' && (
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Banner Video
          </label>
          {(videoPreview || externalVideoUrl) ? (
            <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-lg border border-gray-100 bg-black">
              <video
                src={videoPreview || externalVideoUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
                controls
              />
              <button
                type="button"
                onClick={onClearVideo}
                className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div
                className="border-2 border-dashed border-gray-100 rounded-[24px] p-10 text-center cursor-pointer hover:border-hazelnut hover:bg-gray-50/50 transition-all group"
                onClick={() => videoInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-hazelnut/10 transition-colors">
                  <Film className="h-6 w-6 text-gray-300 group-hover:text-hazelnut transition-colors" />
                </div>
                <p className="text-xs font-black text-espresso uppercase tracking-widest">Upload Video</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">MP4, WEBM or MOV up to 100MB</p>
                <input type="file" hidden ref={videoInputRef} onChange={handleVideoInput} accept="video/*" />
              </div>
              <Input
                placeholder="OR paste direct video URL..."
                value={externalVideoUrl}
                onChange={(e) => onExternalVideoUrlChange(e.target.value)}
                className="h-14 rounded-2xl border-gray-100 shadow-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Poster Image (Optional)
            </label>
            {(imagePreview || externalImageUrl) ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-lg border border-gray-100">
                <img src={imagePreview || externalImageUrl} alt="Poster preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={onClearImage}
                  className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div
                  className="border border-dashed border-gray-100 rounded-2xl p-6 text-center cursor-pointer hover:border-hazelnut transition-all"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Upload poster image</p>
                  <input type="file" hidden ref={imageInputRef} onChange={handleImageInput} accept="image/*" />
                </div>
                <Input
                  placeholder="OR poster image URL..."
                  value={externalImageUrl}
                  onChange={(e) => onExternalImageUrlChange(e.target.value)}
                  className="h-12 rounded-xl border-gray-100"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {mediaType === 'youtube' && (
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            YouTube Link
          </label>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => onYoutubeUrlChange(e.target.value)}
            className="h-14 rounded-2xl border-gray-100 shadow-sm"
          />
          <p className="text-[9px] text-gray-400 font-bold ml-1 uppercase">
            Supports youtube.com/watch, youtu.be, shorts, and embed links.
          </p>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Fallback Poster Image (Optional)
            </label>
            {(imagePreview || externalImageUrl) ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-lg border border-gray-100">
                <img src={imagePreview || externalImageUrl} alt="Poster preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={onClearImage}
                  className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div
                  className="border border-dashed border-gray-100 rounded-2xl p-6 text-center cursor-pointer hover:border-hazelnut transition-all"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Upload fallback image</p>
                  <input type="file" hidden ref={imageInputRef} onChange={handleImageInput} accept="image/*" />
                </div>
                <Input
                  placeholder="OR fallback image URL..."
                  value={externalImageUrl}
                  onChange={(e) => onExternalImageUrlChange(e.target.value)}
                  className="h-12 rounded-xl border-gray-100"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerMediaForm;
