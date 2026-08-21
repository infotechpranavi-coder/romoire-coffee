'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
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
    <section className="py-24 bg-[#F5EFE6] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-5xl md:text-7xl font-[1000] text-[#3D1218] leading-none tracking-tighter uppercase mb-12">
          CLIENT FEEDBACK
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 relative h-full">
          {/* Main Image Area */}
          <div className="relative w-[160px] h-[160px] md:w-[280px] md:h-[280px] flex-shrink-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-[#ffc107] rounded-full scale-90" />
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
          <div className="hidden lg:block w-[1.5px] h-[220px] bg-[#3D1218]/10 mx-6 flex-shrink-0" />

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
                <Quote className="w-10 h-10 md:w-14 md:h-14 text-[#6B1F2A] mb-4 fill-[#6B1F2A]" />
                <p className="text-lg md:text-[20px] text-gray-700 leading-snug font-medium mb-6 md:mb-8 max-w-3xl tracking-tight">
                  {current.quote}
                </p>
                <div>
                  <h4 className="text-xl md:text-2xl font-black text-[#3D1218] uppercase tracking-tighter">
                    {current.name}
                  </h4>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mt-1 md:mt-2">
                    {current.role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail List - Vertical Capsule */}
          <div className="flex lg:flex-col gap-3 bg-white p-3 rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex-wrap justify-center">
            {displayTestimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => nextTestimonial(idx)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-4 transition-all duration-500 flex-shrink-0 ${safeIndex === idx ? 'border-[#6B1F2A] scale-110 shadow-md' : 'border-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
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
