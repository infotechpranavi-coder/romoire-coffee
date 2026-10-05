'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Loader2 } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import { BlogData } from '@/lib/types';
import { SITE_NAME } from '@/lib/branding';
import { getReadTime, formatBlogDate } from '@/data/homeBlogsData';
import { useBlogsPageEnabled } from '@/hooks/useBlogsPageEnabled';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
});

function BlogCard({ blog }: { blog: BlogData }) {
  const href = blog._id.startsWith('seed-') ? '/blogs' : `/blogs/${blog.slug}`;

  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden bg-cream">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-vanilla/40">
          <Image
            src={blog.image?.url}
            alt={blog.image?.alt || blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-hazelnut">
            {blog.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-1 pt-5">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-mocha/70">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatBlogDate(blog.createdAt)}
            </span>
            <span>{getReadTime(blog.content)}</span>
          </div>

          <h3
            className={`${playfair.className} mb-3 text-2xl font-normal leading-snug text-hazelnut transition-colors group-hover:text-hazelnut md:text-[1.65rem]`}
          >
            {blog.title}
          </h3>

          <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-mocha/80 md:text-base">
            {blog.excerpt}
          </p>

          <span className="inline-flex items-center gap-1 text-sm font-semibold text-hazelnut">
            Read article
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}

interface HomeBlogsProps {
  initialBlogs?: BlogData[];
}

const HomeBlogs = ({ initialBlogs }: HomeBlogsProps) => {
  const { blogsPageEnabled } = useBlogsPageEnabled();
  const [blogs, setBlogs] = useState<BlogData[]>(
    initialBlogs ? initialBlogs.slice(0, 2) : []
  );
  const [loading, setLoading] = useState(initialBlogs === undefined);

  useEffect(() => {
    let cancelled = false;

    const loadBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?publishedOnly=true&limit=2', { cache: 'no-store' });
        const data = await res.json();

        if (cancelled) return;

        if (data.success && data.data?.length) {
          setBlogs(data.data.slice(0, 2));
          return;
        }

        if (!cancelled) setBlogs([]);
      } catch (error) {
        console.error('Error loading homepage blogs:', error);
        if (!cancelled) setBlogs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (initialBlogs) {
      setLoading(false);
      return;
    }

    loadBlogs();
    return () => {
      cancelled = true;
    };
  }, [initialBlogs]);

  const displayBlogs = blogs.slice(0, 2);

  if (!blogsPageEnabled) return null;

  return (
    <section id="blogs" className="bg-cream py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-hazelnut md:text-base">
            From the roastery
          </p>
          <h2 className="text-4xl font-black tracking-tight text-espresso sm:text-5xl md:text-6xl">
            Blogs
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-mocha/70 md:text-base">
            Brewing guides, roast insights, and coffee culture from the {SITE_NAME} team.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-hazelnut" />
            <p className="text-xs font-semibold uppercase tracking-widest text-mocha/70">
              Loading blogs...
            </p>
          </div>
        ) : displayBlogs.length === 0 ? (
          <p className="py-12 text-center text-sm text-mocha/70">No blog posts yet.</p>
        ) : (
          <>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
              {displayBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            <div className="mt-12 flex justify-center md:mt-14">
              <Link
                href="/blogs"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-hazelnut bg-cream px-10 py-3.5 text-sm font-bold uppercase tracking-wide text-hazelnut transition-all hover:bg-hazelnut hover:text-white hover:shadow-lg hover:shadow-hazelnut/20"
              >
                View all blogs
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HomeBlogs;
