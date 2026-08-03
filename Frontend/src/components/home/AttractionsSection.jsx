import { useEffect, useRef, useState } from "react";
import { getAttractions } from "../../services/imageService.js";
import { GiPathDistance } from "react-icons/gi";

const AttractionsSection = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef();
  const isPaused = useRef(false);

  useEffect(() => {
    getAttractions()
      .then((data) => setAttractions(data))
      .catch((error) => console.log("Error fetching attractions", error))
      .finally(() => setLoading(false));
  }, []);

  // Auto scroll left to right
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || attractions.length === 0) return;

    let scrollAmount = 0;
    const speed = 1; // px per frame

    const tick = () => {
      if (isPaused.current) return;

      scrollAmount += speed;
      slider.scrollLeft = scrollAmount;

      // Reset to start when reached end
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0;
        slider.scrollLeft = 0;
      }
    };

    //  Pause on mouse enter, resume on mouse leave
    const handleMouseEnter = () => (isPaused.current = true);
    const handleMouseLeave = () => (isPaused.current = false);

    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeave);

    const interval = setInterval(tick, 16);

    return () => {
      clearInterval(interval);
      slider.removeEventListener("mouseenter", handleMouseEnter);
      slider.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [attractions]);

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <p className="text-[#1a3c2e] text-xl tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (attractions.length === 0) {
    return null;
  }
  return (
    <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Section Heading */}
      <div className="mb-10 sm:mb-14">
        <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
          Nearby Attractions
        </h2>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-hidden px-6 cursor-default"
        style={{ scrollBehavior: "auto" }}
      >
        {[...attractions, ...attractions].map((attraction, index) => (
          <div
            key={index}
            className="shrink-0 bg-white rounded-2xl overflow-hidden   flex flex-col"
            style={{ width: "380px" }}
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={attraction.imageUrl}
                alt={attraction.title}
                className="w-full object-cover hover:scale-105 transition-transform duration-500"
                style={{ height: "240px" }}
              />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[#234E3B] text-xl font-bold font-serif mb-3">
                {attraction.title}
              </h3>
              <p className="text-[#2F3437] text-sm leading-relaxed flex-1">
                {attraction.description}
              </p>
              {/* Distance Badge */}
              {attraction.distance && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1.5 bg-[#234E3B] text-[#C89B3C] text-sm font-bold px-4 py-1.5 rounded-full">
                    <GiPathDistance className="shrink-0"/>
                    {attraction.distance}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AttractionsSection;
