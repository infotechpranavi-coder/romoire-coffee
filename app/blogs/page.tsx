'use client'

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogData } from "@/lib/types";
import { SITE_NAME } from "@/lib/branding";

const BLOG_CATEGORIES = ['Travel Tips', 'Destinations', 'Lifestyle', 'News', 'Experience'] as const;

function getReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?publishedOnly=true', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setBlogs(data.data);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const items = [
      { name: "All", value: "all", count: blogs.length },
      ...BLOG_CATEGORIES.map((cat) => ({
        name: cat,
        value: cat,
        count: blogs.filter((b) => b.category === cat).length,
      })).filter((c) => c.count > 0),
    ];
    return items;
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        const matchesSearch =
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (blog.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "featured") {
          return Number(b.isFeatured) - Number(a.isFeatured);
        }
        return 0;
      });
  }, [blogs, searchTerm, categoryFilter, sortBy]);

  const featuredBlog = filteredBlogs.find((b) => b.isFeatured) || filteredBlogs[0];
  const remainingBlogs = featuredBlog
    ? filteredBlogs.filter((b) => b._id !== featuredBlog._id)
    : filteredBlogs;

  const BlogCard = ({ blog, large = false }: { blog: BlogData; large?: boolean }) => (
    <Link href={`/blogs/${blog.slug}`} className="block">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary/30 h-full">
        <div className={large ? "md:flex" : "flex flex-col"}>
          <div className={large ? "md:w-1/2" : "w-full"}>
            <div className={`relative ${large ? "aspect-video md:aspect-square" : "aspect-video"}`}>
              <Image
                src={blog.image?.url}
                alt={blog.image?.alt || blog.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
          <div className={`${large ? "md:w-1/2 p-8" : "p-5"} flex flex-col flex-1`}>
            <div className="flex items-center flex-wrap gap-3 mb-3">
              <Badge className="bg-primary text-white">{blog.category}</Badge>
              <span className="text-sm text-gray-600">{getReadTime(blog.content)}</span>
            </div>
            <h3 className={`font-bold text-espresso mb-3 ${large ? "text-2xl" : "text-lg line-clamp-2"}`}>
              {blog.title}
            </h3>
            <p className={`text-gray-600 mb-4 leading-relaxed ${large ? "" : "text-sm line-clamp-3"}`}>
              {blog.excerpt}
            </p>
            {(blog.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(blog.tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-espresso">{blog.author}</p>
                  <p className="text-xs text-gray-600">{formatDate(blog.createdAt)}</p>
                </div>
              </div>
            </div>
            <Button className={`w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors ${large ? "" : "h-10 text-sm"}`}>
              Read Full Article
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative text-white py-28 md:py-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-hazelnut font-bold uppercase tracking-[0.3em] text-sm mb-6">Travel Insights</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] mb-6 leading-none tracking-tighter uppercase">
              Travel Blog
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Discover brewing tips, origin stories, and coffee culture from {SITE_NAME}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{blogs.length} Articles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-gray-500 font-medium">Loading articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-espresso mb-2">No Articles Yet</h2>
          <p className="text-gray-500">Published blog posts from the dashboard will appear here.</p>
        </div>
      ) : (
        <>
          {featuredBlog && (
            <section className="py-12 bg-cream">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-center text-espresso mb-8">
                    {featuredBlog.isFeatured ? "Featured Article" : "Latest Article"}
                  </h2>
                  <BlogCard blog={featuredBlog} large />
                </div>
              </div>
            </section>
          )}

          {remainingBlogs.length > 0 && (
            <section className="py-12 bg-cream">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-2xl font-bold text-espresso mb-8">More Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {remainingBlogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Inspired on Your Journey</h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to our newsletter for exclusive travel tips and destination guides
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-cream text-espresso placeholder-gray-500"
              />
              <Button size="lg" variant="secondary" className="bg-cream text-primary hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
