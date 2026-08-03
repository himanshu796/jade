import { useState, useEffect, useRef, useCallback } from "react";
import { getDiningImages } from "../../services/imageService";

const Slideshow = ({ images, heightClass = "h-72 sm:h-96 md:h-[450px]" }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images; // CHANGED: sync ref whenever images prop changes
  }, [images]);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imagesRef.current.length);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!images.length) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imagesRef.current.length); // use ref for consistency with goTo
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [images]);

  // Reset current index if it's out of bounds after images shrink (e.g. 5 -> 2 images)
  useEffect(() => {
    if (current >= images.length && images.length > 0) {
      setCurrent(0);
    }
  }, [images, current]);

  if (!images.length) return null;

  return (
    <div className={`relative overflow-hidden ${heightClass}`}>
      {/* Fade slideshow instead of vertical translate */}
      {images.map((item, index) => (
        <img
          key={item.id}
          src={item.imageUrl}
          alt={item.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Vertical Dots */}
      {images.length > 1 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`} // Added accessible label for icon-only button
              className={`w-2 h-2 rounded-full border border-white/80 ${
                i === current ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Extracted a shared skeleton so loading state visually matches the final layout (reduces layout shift)
const CardSkeleton = () => (
  <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="w-full h-72 sm:h-96 md:h-112.5 bg-gray-200 animate-pulse" />
    <div className="p-6 sm:p-8">
      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-3" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

const DiningSection = () => {
  const [diningItems, setDiningItems] = useState([]);
  const [barItems, setBarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null); // Reset error on refetch
    Promise.all([getDiningImages("DINING"), getDiningImages("BAR")])
      .then(([dining, bar]) => {
        setDiningItems(dining);
        setBarItems(bar);
      })
      .catch((error) => {
        console.log("Error fetching dining items", error);
        setError("Unable to load dining & bar content right now."); // Surface error to user
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20">
        <div className="mb-10 sm:mb-14">
          <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
            Dining & Bar
          </h2>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    );
  }

  // Added visible error state instead of rendering empty cards silently
  if (error) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <p className="text-red-600 text-base sm:text-lg">{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20">
      {/* Section Heading */}
      <div className="mb-10 sm:mb-14">
        <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
          Dining & Bar
        </h2>
      </div>

      {/* Side by Side Cards */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Dining Card */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
          <Slideshow images={diningItems} />

          {/* Text Content */}
          <div className="p-6 sm:p-8">
            <h3 className="text-[#234E3B] text-xl sm:text-2xl font-bold font-serif mb-3">
              Fine Dining
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
              Savor exquisite cuisine crafted by our world-class chefs. From
              traditional Kashmiri delicacies to international favorites, our
              restaurant offers an unforgettable dining experience.
            </p>
          </div>
        </div>

        {/* Bar Card */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
          <Slideshow images={barItems} />

          {/* Text Content */}
          <div className="p-6 sm:p-8">
            <h3 className="text-[#234E3B] text-xl sm:text-2xl font-bold font-serif mb-3">
              Bar
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
              Experience enchanting evenings by the bonfire with signature
              cocktails, refreshing mocktails, and carefully curated beverages.
              Surrounded by warmth and stunning views, it's the perfect setting
              to relax, socialize, and create unforgettable memories.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiningSection;
