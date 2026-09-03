'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { testimonials as staticTestimonials } from '@/data/homeData';

const ClientFeedback = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [apiTestimonials, setApiTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials?activeOnly=true');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const formatted = data.data.map((t: any) => ({
             id: t._id,
             name: t.name,
             role: t.role,
             quote: t.content,
             avatar: t.image?.url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
          }));
          setApiTestimonials(formatted);
        }
      } catch (err) {
        console.error('Failed to load testimonials', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const displayTestimonials = apiTestimonials.length > 0 ? apiTestimonials : staticTestimonials;
  const safeIndex =
    displayTestimonials.length > 0
      ? Math.min(activeIndex, displayTestimonials.length - 1)
      : 0;
  const current = displayTestimonials[safeIndex];

  const nextTestimonial = (index: number) => {
    setDirection(1);
    setActiveIndex(index);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [displayTestimonials.length]);

  useEffect(() => {
    if (displayTestimonials.length === 0) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  if (isLoading || !current) return null;

  return (
    <section className="relative overflow-hidden bg-vanilla/30 py-20 md:py-24">
      <div className="container relative z-10 mx-auto px-4">
        <SectionHeading
          eyebrow="Testimonials"
          title="Client Feedback"
          align="left"
        />

        <div className="flex flex-col lg:flex-row items-center gap-12 relative h-full">
          {/* Main Image Area */}
          <div className="relative w-[160px] h-[160px] md:w-[280px] md:h-[280px] flex-shrink-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-hazelnut/30 rounded-full scale-90" />
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.5 },
                }}
                className="absolute inset-0 w-full h-full rounded-full border-[8px] border-white shadow-[0_15px_40px_rgba(0,0,0,0.1)] overflow-hidden z-10"
              >
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Divider Line */}
          <div className="hidden lg:block w-[1.5px] h-[220px] bg-espresso/10 mx-6 flex-shrink-0" />

          {/* Testimonial Content */}
          <div className="flex-grow relative min-h-[300px] md:min-h-[400px] flex flex-col justify-center">
            <AnimatePresence mode="popLayout" custom={direction} initial={true}>
              <motion.div
                key={current.id || safeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.5 },
                }}
                className="relative md:absolute md:inset-x-0 md:top-0 md:bottom-0 flex flex-col justify-center py-8 md:py-0"
              >
                <Quote className="mb-4 h-10 w-10 text-hazelnut md:h-12 md:w-12" />
                <p className="mb-6 max-w-3xl font-editorial text-xl italic leading-relaxed text-espresso md:mb-8 md:text-2xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <div>
                  <h4 className="font-heading text-xl font-semibold text-hazelnut md:text-2xl">
                    {current.name}
                  </h4>
                  <p className="mt-1 font-body text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground md:mt-2">
                    {current.role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail List - Vertical Capsule */}
          <div className="flex flex-wrap justify-center gap-3 rounded-sm border border-espresso/10 bg-cream p-3 shadow-editorial lg:flex-col">
            {displayTestimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => nextTestimonial(idx)}
                className={`h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 transition-all duration-300 md:h-12 md:w-12 ${safeIndex === idx ? 'border-hazelnut shadow-md' : 'border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                  }`}
              >
                <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientFeedback;
