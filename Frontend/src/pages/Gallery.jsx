import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getAllGalleryImages,
  getWelcomeImage,
} from "../services/imageService";
import { IoClose } from "react-icons/io5";

const categories = ["All", "Outdoor", "Rooms", "Dining"];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState(null);
  const [lightbox, setLightbox] = useState(null); // selected image for fullscreen

  useEffect(() => {
    getWelcomeImage()
      .then((url) => setBgImage(url))
      .catch((err) => console.log(err));

    getAllGalleryImages()
      .then((data) => {
        setImages(data);
        setFiltered(data);
      })
      .catch((err) => console.log("Error fetching gallery", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter by category
  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFiltered(images);
    } else {
      setFiltered(images.filter((img) => img.category === category));
    }
  };

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden">
        {bgImage && (
          <img
            src={bgImage}
            alt="Gallery"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-3">
          <h1 className="text-[#F6F5F2] text-3xl sm:text-4xl md:text-5xl font-bold font-serif drop-shadow-lg">
            Gallery
          </h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="w-full bg-[#F6F5F2] sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-center flex-wrap gap-3 bg-black">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 
                ${
                  activeCategory === category
                    ? "bg-[#234E3B] text-[#F6F5F2]"
                    : "bg-gray-100 text-gray-600 hover:bg-[#C89B3C] hover:text-[#234E3B]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[#234E3B] text-xl tracking-widest animate-pulse">
            Loading gallery...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 text-xl">No images found</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-3 gap-0 bg-black">
          {filtered.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-lg cursor-pointer group relative break-inside-avoid"
              onClick={() => setLightbox(img)}
            >
              <img
                src={img.url}
                alt={img.category}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                <span className="text-[#F6F5F2] text-xs uppercase px-3 py-2 opacity-0 group-hover:opacity-100">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-[#d4af6e] transition-colors"
            onClick={() => setLightbox(null)}
          >
            <IoClose />
          </button>

          {/* Image */}
          <img
            src={lightbox.url}
            alt={lightbox.category}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Category Label */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm tracking-widest uppercase">
            {lightbox.category}
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
