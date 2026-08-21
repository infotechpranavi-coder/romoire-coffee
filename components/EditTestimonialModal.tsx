'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { X, Upload, Star } from 'lucide-react';

interface EditTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: any;
  onTestimonialUpdated: (testimonial: any) => void;
}

export default function EditTestimonialModal({ isOpen, onClose, testimonial, onTestimonialUpdated }: EditTestimonialModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    imageUrl: '',
    imageFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        role: testimonial.role || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        imageUrl: testimonial.image?.url || '',
        imageFile: null,
      });
    }
  }, [testimonial]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageFile: e.target.files[0], imageUrl: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrlStr = formData.imageUrl;

      if (formData.imageFile) {
        // Convert file to base64 Data URL
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.imageFile!);
        });
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
             data: base64Data,
             folder: 'skygo/testimonials'
          }),
        });
        
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || 'Image upload failed');
        }
        
        const uploadData = await uploadRes.json();
        imageUrlStr = uploadData.url;
      }

      const res = await fetch(`/api/testimonials/${testimonial._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          content: formData.content,
          rating: formData.rating,
          image: { url: imageUrlStr }
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update testimonial');
      }

      onTestimonialUpdated(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 pb-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Edit Testimonial</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Update Client Feedback</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0 rounded-2xl hover:bg-red-50 hover:text-red-500">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-100 uppercase tracking-wide">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Client Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6B1F2A]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Role</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Traveler"
                  className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6B1F2A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Feedback Content</label>
              <Textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share the client's experience..."
                className="min-h-[120px] rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6B1F2A] resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Rating</label>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="h-12 w-24 rounded-xl border-transparent focus:border-[#6B1F2A]"
                />
                <div className="flex text-orange-400">
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
            </div>

            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-4">Client Image</h3>
            
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Image URL</label>
                  <Input
                     value={formData.imageUrl}
                     onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, imageFile: null })}
                     placeholder="https://example.com/image.jpg"
                     className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6B1F2A]"
                     disabled={!!formData.imageFile}
                  />
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-100"></div>
                  <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Or Upload</span>
                  <div className="flex-1 h-px bg-gray-100"></div>
               </div>
               <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:border-[#6B1F2A] hover:bg-[#F5EFE6] transition-all group overflow-hidden">
                  <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     disabled={!!formData.imageUrl}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                     <Upload className="h-6 w-6 text-gray-400 group-hover:text-[#6B1F2A]" />
                     </div>
                     <div>
                     <p className="font-bold text-sm text-[#111827]">
                        {formData.imageFile ? formData.imageFile.name : formData.imageUrl ? 'Image URL Provided' : 'Click to select image file'}
                     </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[#111827] border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-16 rounded-2xl bg-[#111827] hover:bg-[#6B1F2A] text-white font-black uppercase tracking-widest shadow-xl shadow-[#111827]/10"
            >
              {loading ? 'Updating...' : 'Update Feedback'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
