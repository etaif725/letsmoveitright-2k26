import { useState, useEffect, useCallback } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TESTIMONIALS } from "@/data/testimonials";

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-8 font-heading text-3xl text-heading">Testimonials</h2>
        <div className="relative">
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-primary"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>

          <div className="px-12">
            <div className="mb-4 flex justify-center gap-1">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <FaStar key={i} className="text-primary" />
              ))}
            </div>
            <blockquote className="text-lg italic leading-relaxed text-body">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <p className="mt-4 font-heading text-base text-heading">{testimonial.author}</p>
          </div>

          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-primary"
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-3 w-3 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-gray-300"}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
