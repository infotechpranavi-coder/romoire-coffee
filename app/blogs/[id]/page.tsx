'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogData } from "@/lib/types";

function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
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

  const paragraphs = blog.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Button variant="ghost" onClick={() => router.push('/blogs')} className="text-gray-700 hover:text-gray-900 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </div>

      <div className="w-full h-[320px] md:h-[420px] relative overflow-hidden bg-gray-100">
        <Image
          src={blog.image?.url}
          alt={blog.image?.alt || blog.title}
          fill
          className="object-cover"
          priority
          unoptimized
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
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium text-gray-900">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{getReadTime(blog.content)}</span>
            </div>
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
