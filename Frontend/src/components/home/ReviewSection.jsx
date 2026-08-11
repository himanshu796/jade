import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaGoogle } from "react-icons/fa";

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5 text-[#C89B3C]">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-sm">
          {rating >= star ? (
            <FaStar />
          ) : rating >= star - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}
    </div>
  );
};

// Single Review card
const ReviewCard = ({ review }) => {
  return (
    <div className="w-[80vw] max-w-70 sm:w-80 md:w-96 sm:max-w-none bg-white rounded-xl shadow-lg p-6 shrink-0 flex flex-col gap-4 border border-gray-100">
      {/* Top - Name & Source */}
      <div className="flex items-center justify-between">
        {/* Avatar with initials */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#234E3B] text-[#F6F5F2] flex items-center justify-center font-bold text-sm shrink-0">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[#234E3B] font-semibold text-sm">
              {review.name}
            </p>
            <StarRating rating={review.rating} />
          </div>
        </div>

        {/* Source icon*/}
        {review.source === "google" && (
          <FaGoogle className="text-blue-500 text-lg" />
        )}
      </div>

      {/* Comment */}
      <p className="text-[#2F3437] text-sm leading-relaxed line-clamp-4">
        {review.comment}
      </p>
    </div>
  );
};

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/reviews")
      .then((response) => {
        // Add source field to DB reviews
        const dbReviews = response.data.data.map((r) => ({
          ...r,
          source: "db",
        }));
        setReviews(dbReviews);
      })
      .catch((error) => console.log("Error fetching reviews", error))
      .finally(() => setLoading(false));
  }, []);

  // Auto Scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || reviews.length === 0) return;

    let scrollAmount = 0;
    const speed = 0.8;

    const scroll = () => {
      scrollAmount += speed;
      slider.scrollLeft = scrollAmount;

      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        scrollAmount = 0;
        slider.scrollLeft = 0;
      }
    };

    const interval = setInterval(scroll, 16);
    return () => clearInterval(interval);
  }, [reviews]);

  const handleViewMore = () => {
    navigate("/review");
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <p className="text-[#1a3c2e] text-xl tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="w-full bg-[#F6F5F2] py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Section Heading */}
      <div className="text-center mb-10 sm:mb-14 px-4">
        <p className="text-[#C89B3C] text-lg tracking-widest font-semibold mb-2 uppercase">
          Testimonials
        </p>
        <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
          What Our Guests Say
        </h2>
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="w-full overflow-hidden">
        <div className="flex gap-4 sm:gap-6 px-4 sm:px-6" style={{ width: "max-content" }}>
          {/* Duplicate for seamless loop */}
          {[...reviews, ...reviews].map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>

      {/* View More Button - bottom right */}
      <div className="w-full flex justify-end px-6 sm:px-10 mt-8">
        <button
          onClick={handleViewMore}
          className="bg-[#234E3B] text-[#F6F5F2] text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#C89B3C] hover:text-[#234E3B] transition-colors duration-300 shadow-md cursor-pointer"
        >
          View More
        </button>
      </div>
    </section>
  );
};

export default ReviewSection;
