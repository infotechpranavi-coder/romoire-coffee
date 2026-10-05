'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Maximize2, Loader2 } from "lucide-react";
import Link from "next/link";
import { BlogData } from "@/lib/types";
import LiveLinkFrame from "@/components/LiveLinkFrame";
import { useBlogsPageEnabled } from "@/hooks/useBlogsPageEnabled";

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { blogsPageEnabled, loading: settingsLoading } = useBlogsPageEnabled();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!settingsLoading && !blogsPageEnabled) {
      router.replace('/');
    }
  }, [settingsLoading, blogsPageEnabled, router]);

  useEffect(() => {
    const slug = params?.id;
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setBlog(data.data);
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params?.id]);

  const isLinkBlog = Boolean(blog?.sourceType === 'link' && blog?.externalUrl);

  if (settingsLoading || !blogsPageEnabled || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading article...</h2>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h3>
          <p className="text-gray-600 mb-8">The article you are looking for does not exist or is not published yet.</p>
          <Button onClick={() => router.push('/blogs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  if (isLinkBlog && blog.externalUrl) {
    return (
      <div className="min-h-screen bg-[#0b1f2d] pt-20 flex flex-col">
        <div className="sticky top-20 z-30 border-b border-white/10 bg-[#0b1f2d]/95 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                onClick={() => router.push('/blogs')}
                className="text-white/80 hover:text-white hover:bg-white/10 -ml-2 shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <Badge className="bg-primary text-white">{blog.category}</Badge>
                  <Badge className="bg-white/20 text-white">Linked Page</Badge>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[50vw] sm:max-w-xl">
                  {blog.title}
                </h1>
              </div>
            </div>
            <a
              href={blog.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition shrink-0"
            >
              Open Original
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="relative flex-1 w-full bg-white overflow-hidden">
          <LiveLinkFrame
            url={blog.externalUrl}
            title={blog.title}
            variant="full"
          />
        </div>

        <div className="bg-[#0b1f2d] border-t border-white/10 px-4 py-4 text-center">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <Maximize2 className="h-3.5 w-3.5" />
            Scroll inside the frame to browse the live page
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="sm" className="rounded-full bg-[#bd9245] hover:bg-[#a07835] text-white">
                Contact Us
              </Button>
            </Link>
            <Link href="/packages">
              <Button size="sm" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
                View Packages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paragraphs = blog.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  function getReadTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Button variant="ghost" onClick={() => router.push('/blogs')} className="text-gray-700 hover:text-gray-900 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </div>

      <div className="w-full h-[320px] md:h-[420px] relative overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blog.image?.url}
          alt={blog.image?.alt || blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <Badge className="mb-4 bg-primary text-white">{blog.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">{blog.excerpt}</p>
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 text-sm text-gray-600">
            <span className="font-medium text-gray-900">{blog.author}</span>
            <span>{formatDate(blog.createdAt)}</span>
            <span>{getReadTime(blog.content)}</span>
          </div>
        </header>

        <div className="prose prose-lg prose-gray max-w-none space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        {(blog.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
            {(blog.tags || []).map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}

        <div className="mt-16 p-8 bg-cream rounded-3xl text-center">
          <h3 className="text-xl font-bold text-espresso mb-3">Ready to plan your next trip?</h3>
          <p className="text-gray-600 mb-6">Explore curated experiences and packages with us.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
            <Link href="/packages">
              <Button size="lg" variant="outline">View Packages</Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
