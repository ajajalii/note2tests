import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackTestimonials = [
  {
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Michael Rodriguez",
    designation: "CTO at InnovateSphere",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: "Emily Watson",
    designation: "Operations Director at CloudScale",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
    name: "James Kim",
    designation: "Engineering Lead at DataPro",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
    name: "Lisa Thompson",
    designation: "VP of Technology at FutureNet",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=1200&auto=format&fit=crop",
  },
];

function normalizeTestimonial(testimonial) {
  return {
    quote: testimonial.quote || testimonial.content,
    name: testimonial.name,
    designation: testimonial.designation || testimonial.role || testimonial.title,
    src: testimonial.src || testimonial.avatar || testimonial.img,
  };
}

function getStackStyle(index, active, total) {
  const offset = (index - active + total) % total;

  if (offset === 0) {
    return {
      opacity: 1,
      transform: "translateX(0) translateY(0) scale(1) rotate(0deg)",
      zIndex: 40,
    };
  }

  const signedOffset = offset > total / 2 ? offset - total : offset;
  const depth = Math.min(Math.abs(signedOffset), 3);
  const side = signedOffset > 0 ? 1 : -1;

  return {
    opacity: 1,
    transform: `translateX(${side * (22 + depth * 10)}px) translateY(${depth * 10}px) scale(${1 - depth * 0.045}) rotate(${side * (7 + depth * 4)}deg)`,
    zIndex: 40 - depth,
  };
}

export default function Testimonials({
  testimonials = fallbackTestimonials,
  autoplay = false,
}) {
  const items = useMemo(
    () => testimonials.map(normalizeTestimonial).filter((item) => item.quote),
    [testimonials],
  );
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoplay || items.length < 2) return undefined;

    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext, items.length]);

  if (!items.length) return null;

  const current = items[active];

  return (
    <section className="mx-auto w-full max-w-sm px-4 py-12 mt-8 md:mt-12 md:ml-8 lg:ml-12 font-sans antialiased md:max-w-4xl md:px-8 lg:px-10">
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative h-80 w-full overflow-visible mt-8 md:mt-14">
          {items.map((testimonial, index) => {
            const stackStyle = getStackStyle(index, active, items.length);

            return (
              <div
                key={`${testimonial.name}-${testimonial.src}`}
                className="absolute inset-0 origin-bottom transition-all duration-500 ease-in-out"
                style={stackStyle}
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-center shadow-[0_24px_70px_rgba(15,23,42,0.2)]"
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-between py-2 md:py-4 md:ml-16 mt-8 md:mt-12">
          <div key={active} className="animate-[fadeIn_0.3s_ease-in-out]">
            <h3 className="text-2xl font-bold text-slate-950">
              {current.name}
            </h3>
            <p className="text-sm text-slate-500">{current.designation}</p>
            <p className="mt-8 text-lg leading-8 text-slate-600">
              {current.quote.split(" ").map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="inline-block animate-[wordReveal_0.35s_ease-in-out_both]"
                  style={{ animationDelay: `${index * 0.02}s` }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </p>
          </div>

          <div className="flex gap-4 pt-10 md:pt-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
            >
              <ChevronLeft className="h-5 w-5 text-slate-950 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
            >
              <ChevronRight className="h-5 w-5 text-slate-950 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
