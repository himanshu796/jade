import { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { getBgReviewImage } from "../services/imageService.js";
import { axiosInstance } from "../utils/axios.js";
import { FaStar, FaStarHalfAlt, FaRegStar, FaGoogle } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import ReviewForm from "../components/form/ReviewForm.jsx";

// Star rating component
const StarRating = ({ rating, size = "text-lg" }) => {
  return (
    <div className={`flex gap-0.5 text-[#C89B3C] ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
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

const Reviews = () => {
  const [bgImage, setBgImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const reviewFormRef = useRef(null);

  const scrollToForm = () => {
    reviewFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const fetchReviews = () => {
    setLoading(true);
    axiosInstance
      .get("/reviews")
      .then((response) => setReviews(response.data.data))
      .catch((error) => console.log("Error fetching reviews", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getBgReviewImage()
      .then((url) => setBgImage(url))
      .catch((error) => console.log("Error fetching image", error));
    fetchReviews();
  }, []);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div>
      <Header />

      {/* Hero image section*/}
      <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
        {bgImage && (
          <img
            src={bgImage}
            alt="Jade River Resort"
            className="w-full h-full object-cover"
          />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-3">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-serif">
            Discover why travelers love staying at Jade River Resort
          </h1>
          <p className="text-white text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase mt-2">
            Guest Experiences
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start gap-8">
          {/* Left Card - Google Rating */}
          <div className="w-full md:w-1/3 bg-white/50 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center gap-4 border border-gray-100">
            {/* Google Icon */}
            <div className="w-full flex items-center justify-center gap-2 pb-4 border-b border-gray-200">
              <p className="text-[#2F3437] text-lg font-semibold tracking-widest uppercase">
                Overall Rating
              </p>
            </div>

            {/* Rating Number */}
            <p className="text-[#234E3B] text-6xl font-bold font-sans">
              {averageRating}
            </p>

            {/* Stars */}
            <StarRating rating={parseFloat(averageRating)} size="text-2xl" />

            {/* Total Reviews */}
            <p className="text-gray-500 text-sm">
              {" "}
              <span className="font-bold text-[#234E3B]">
                {reviews.length}
              </span>{" "}
              reviews
            </p>

            {/* Rating Breakdown */}
            <div className="w-full flex flex-col gap-2 mt-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4">{star}</span>
                    <FaStar className="text-[#C89B3C] text-xs" />
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-[#C89B3C] h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-4">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Card - Recent Reviews */}
          <div className="w-full md:w-2/3 bg-white/50 rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-[#234E3B] text-xl sm:text-2xl font-bold font-serif">
                Recent Reviews
              </h3>
              <button
                onClick={scrollToForm}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#234E3B] text-[#F6F5F2] text-sm  tracking-wide uppercase hover:bg-[#C89B3C] transition-colors shrink-0 cursor-pointer"
              >
                <MdOutlineRateReview size={16} />
                Write Review
              </button>
            </div>

            {loading ? (
              <p className="text-gray-400 animate-pulse">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet</p>
            ) : (
              <div className="flex flex-col gap-6 pr-2">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex flex-col gap-2 pb-6 border-b border-gray-200 last:border-none last:pb-0"
                  >
                    {/* Name & Rating */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        {/* First letter of Name */}
                        <div className="w-9 h-9 rounded-full bg-[#234E3B] text-[#F6F5F2] flex items-center justify-center font-semibold text-base shrink-0">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-[#234E3B] font-semibold text-xl">
                          {review.name}
                        </p>
                      </div>
                      <StarRating rating={review.rating} size="text-sm" />
                    </div>

                    {/* Comment */}
                    <p className="text-[#2F3437] text-lg leading-relaxed pl-12">
                      "{review.comment}"
                    </p>

                    {/* Date */}
                    <p className="text-gray-500 text-sm pl-12">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div ref={reviewFormRef} className="scroll-mt-24 mt-8">
          <ReviewForm onReviewSubmitted={fetchReviews} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reviews;
