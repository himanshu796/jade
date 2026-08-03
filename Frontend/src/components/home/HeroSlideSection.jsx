import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHeroSlides } from "../../services/imageService.js";
import { GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";

const HeroSlideSection = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch slides from imageService
  useEffect(() => {
    getHeroSlides()
      .then((data) => setSlides(data))
      .catch((error) => console.log("Error fetching slides", error))
      .finally(() => setLoading(false));
  }, []);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-[60vh] sm:h-[70vh] md:h-[85vh] bg-[#F6F5F2] flex items-center justify-center">
        <p className="text-[#d4af6e] text-2xl tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // No slides
  if (slides.length === 0) {
    return (
      <div className="w-full h-[60vh] sm:h-[70vh] md:h-[85vh] bg-[#1a3c2e] flex items-center justify-center">
        <p className="text-white text-xl tracking-widest">
          No slides available
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background image*/}
          <img
            src={slide.imageUrl}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0" />

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold font-serif tracking-wide mb-4 drop-shadow-lg">
              Welcome to Jade River Resort
            </h2>
            <p className="text-white text-sm sm:text-lg md:text-xl mb-8 drop-shadow-md">
              Experience luxury in the heart of nature
            </p>
            <button
              onClick={() => navigate("/rooms")}
              className="bg-[#d4af6e] text-[#234E3B] px-6 sm:px-10 py-2 sm:py-3 text-lg tracking-widest rounded-lg hover:bg-[#F6F5F2] cursor-pointer transition-all duration-300 active:bg-gray-200"
            >
              Explore rooms
            </button>
          </div>
        </div>
      ))}

      {/* Prev button */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-black/40 text-[#F6F5F2] text-2xl sm:text-4xl px-3 py-1 rounded-full hover:bg-white/20 transition-all cursor-pointer"
      >
        <GrFormPreviousLink />
      </button>

      {/* Next button */}
      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-black/40 text-[#F6F5F2] text-2xl sm:text-4xl px-3 py-1 rounded-full hover:bg-white/20 transition-all cursor-pointer"
      >
        <GrFormNextLink />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 cursor-pointer">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? "bg-[#C89B3C] w-6" : "bg-[#F6F5F2] w-2.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideSection;
