"use client";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Save, Eye } from "lucide-react";
import { SITE_NAME } from "@/lib/branding";

const DEFAULT_AUTHOR = `${SITE_NAME} Travel Expert`;

interface EditBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBlogUpdated: (blogData: any) => void;
    blog: any | null;
}

const EditBlogModal = ({ isOpen, onClose, onBlogUpdated, blog }: EditBlogModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: DEFAULT_AUTHOR,
        category: "Experience",
        status: "published",
        isFeatured: false,
    });

    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [externalUrl, setExternalUrl] = useState("");
    const [sourceType, setSourceType] = useState<'manual' | 'link'>('manual');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                slug: blog.slug || "",
                excerpt: blog.excerpt || "",
                content: blog.content || "",
                author: blog.author || DEFAULT_AUTHOR,
                category: blog.category || "Experience",
                status: blog.status || "published",
                isFeatured: blog.isFeatured || false,
            });
            setTags(blog.tags || []);
            setCurrentImageUrl(blog.image?.url || "");
            setExternalImageUrl(blog.image?.url || "");
            setExternalUrl(blog.externalUrl || "");
            setSourceType(blog.sourceType === 'link' ? 'link' : 'manual');
        }
    }, [blog]);

    const handleInputChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: generateSlug(title)
        }));
    };

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags(prev => [...prev, currentTag.trim()]);
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(t => t !== tagToRemove));
    };

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = e => reject(e);
        });

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            setSubmitError("Title and content are required.");
            return;
        }
        setIsSubmitting(true);
        setSubmitError("");
        try {
            let uploadedImage: { public_id?: string; url: string; alt: string } | null = blog.image || null;
            
            if (image) {
                const base64 = await fileToBase64(image);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: base64, folder: 'skygo/blogs' }),
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    uploadedImage = { public_id: uploadData.public_id, url: uploadData.url, alt: formData.title };
                }
            } else if (externalImageUrl && externalImageUrl !== currentImageUrl) {
                uploadedImage = { public_id: "external", url: externalImageUrl, alt: formData.title };
            }

            const payload = {
                ...formData,
                image: uploadedImage,
                tags: tags,
                sourceType,
                externalUrl: sourceType === 'link' ? externalUrl.trim() : '',
            };

            const res = await fetch(`/api/blogs/${blog._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                onBlogUpdated(data.data);
                onClose();
            } else {
                setSubmitError(data.error || "Failed to update blog.");
            }
        } catch (err: any) {
            setSubmitError(err.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!blog) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 border-none shadow-2xl rounded-[32px] overflow-hidden bg-cream text-espresso">
                <DialogHeader className="p-8 pb-4 bg-gray-50/50">
                    <DialogTitle className="text-3xl font-black text-espresso uppercase tracking-tighter">Refine Narrative</DialogTitle>
                    <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Enhance and edit your luxury travel stories for your audience.</DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {sourceType === 'link' && (
                        <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">
                                    External Link
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Link URL</label>
                                <Input
                                    value={externalUrl}
                                    onChange={(e) => setExternalUrl(e.target.value)}
                                    className="h-12 rounded-xl"
                                    placeholder="https://example.com/..."
                                />
                            </CardContent>
                        </Card>
                    )}
                    {/* Basic Info */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-espresso">Narrative Basics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                                <Input 
                                    placeholder="e.g. My Journey Through the Kalahari" 
                                    value={formData.title} 
                                    onChange={e => handleTitleChange(e.target.value)} 
                                    className="h-12 rounded-xl text-lg font-bold" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">URL Slug</label>
                                <Input 
                                    placeholder="slug-will-be-auto-generated" 
                                    value={formData.slug} 
                                    onChange={e => handleInputChange("slug", e.target.value)} 
                                    className="h-12 rounded-xl bg-gray-50" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                <Select value={formData.category} onValueChange={val => handleInputChange("category", val)}>
                                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {['Travel Tips', 'Destinations', 'Lifestyle', 'News', 'Experience'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Author</label>
                                <Input value={formData.author} onChange={e => handleInputChange("author", e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Featured</label>
                                <div className="flex items-center space-x-2 h-12">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isFeatured} 
                                        onChange={e => handleInputChange("isFeatured", e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-hazelnut focus:ring-[#5A0D0D]"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-tight text-gray-600">Featured Post</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Area */}
                    <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-espresso">Content Studio</CardTitle>
                            <Button variant="ghost" className="text-hazelnut h-8 text-[10px] font-black uppercase tracking-widest flex gap-2">
                                <Eye className="h-4 w-4" /> Preview Narrative
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Short Excerpt (Cards)</label>
                                <Textarea 
                                    placeholder="A brief summary for the blog card..." 
                                    value={formData.excerpt} 
                                    onChange={e => handleInputChange("excerpt", e.target.value)} 
                                    className="max-h-[80px] rounded-xl pt-3 text-sm font-medium" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Main Article (Markdown Supported)</label>
                                <Textarea 
                                    placeholder="Tell your story here..." 
                                    value={formData.content} 
                                    onChange={e => handleInputChange("content", e.target.value)} 
                                    className="min-h-[300px] rounded-xl pt-3 text-sm leading-relaxed" 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media & Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-espresso">Cover Image</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {currentImageUrl && !image && (
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 border border-gray-100">
                                        <img src={currentImageUrl} className="w-full h-full object-cover" alt="Current cover" />
                                    </div>
                                )}
                                <div className="border-2 border-dashed border-gray-100 rounded-[24px] p-6 text-center cursor-pointer hover:border-hazelnut transition-all bg-gray-50/30 group" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2 group-hover:text-hazelnut transition-colors" />
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{image ? image.name : "Replace Cover Image"}</p>
                                    <input type="file" hidden ref={fileInputRef} onChange={e => setImage(e.target.files?.[0] || null)} accept="image/*" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">OR Image URL</label>
                                    <Input placeholder="https://..." value={externalImageUrl} onChange={e => setExternalImageUrl(e.target.value)} className="h-10 rounded-xl text-xs" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-espresso">Tags & Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Add tag..." 
                                        value={currentTag} 
                                        onChange={e => setCurrentTag(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                                        className="h-10 rounded-xl"
                                    />
                                    <Button variant="outline" onClick={handleAddTag} className="rounded-xl h-10 px-4">Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <Badge key={tag} className="bg-gray-100 text-espresso hover:bg-gray-200 border-none px-3 py-1 rounded-full flex items-center gap-2">
                                            {tag}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
                    {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
                    <div className="flex gap-4 w-full justify-end">
                        <Button variant="ghost" onClick={onClose} className="rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest">Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-espresso hover:bg-hazelnut rounded-2xl px-12 h-14 font-black uppercase text-xs tracking-widest shadow-xl transition-all flex gap-3">
                            <Save className="h-5 w-5" />
                            {isSubmitting ? "Updating Narrative..." : "Save Narrative Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditBlogModal;
