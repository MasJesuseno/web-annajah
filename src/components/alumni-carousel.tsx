"use client";

import { useState, useCallback } from "react";

type Alumni = {
  id: number;
  name: string;
  photo: string | null;
  testimonial: string;
  graduationYear: string | null;
};

type AlumniCarouselProps = {
  items: Alumni[];
};

export function AlumniCarousel({ items }: AlumniCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Responsive items per view: 1 on mobile, 2 on md, 4 on lg+
  const itemsPerView = 3;
  const totalSlides = Math.ceil(items.length / itemsPerView);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  if (items.length === 0) return null;

  // Generate slides array
  const slides = Array.from({ length: totalSlides }, (_, slideIndex) =>
    items.slice(slideIndex * itemsPerView, slideIndex * itemsPerView + itemsPerView)
  );

  return (
    <div className="relative">
      {/* Carousel Viewport */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideItems, slideIndex) => (
            <div
              key={slideIndex}
              className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {slideItems.map((alum) => (
                <div
                  key={alum.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-primary-100 flex-shrink-0 ring-2 ring-primary-200">
                      {alum.photo ? (
                        <img
                          src={alum.photo}
                          alt={alum.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-500 font-bold text-xl">
                          {alum.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {alum.name}
                      </h3>
                      {alum.graduationYear && (
                        <p className="text-xs text-gray-500">
                          Lulusan {alum.graduationYear}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="relative">
                    <svg
                      className="absolute -top-1 -left-1 w-6 h-6 text-primary-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-sm text-gray-600 leading-relaxed italic pl-8 line-clamp-10">
                      &quot;{alum.testimonial}&quot;
                    </p>
                  </div>

                  {/* Stars */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty slots placeholder — fill remaining grid cells if slide has < 4 items */}
              {slideItems.length < itemsPerView &&
                Array.from({ length: itemsPerView - slideItems.length }).map(
                  (_, i) => <div key={`empty-${i}`} className="hidden lg:block" />
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {totalSlides > 1 && (
        <>
          {/* Left Button */}
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className={`absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200 z-10 ${
              currentSlide === 0
                ? "bg-white/50 text-gray-300 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 hover:text-primary-600 hover:shadow-xl border-gray-200 hover:border-primary-200"
            }`}
            aria-label="Sebelumnya"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Button */}
          <button
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className={`absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200 z-10 ${
              currentSlide === totalSlides - 1
                ? "bg-white/50 text-gray-300 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 hover:text-primary-600 hover:shadow-xl border-gray-200 hover:border-primary-200"
            }`}
            aria-label="Selanjutnya"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "bg-primary-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
