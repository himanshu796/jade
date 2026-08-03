import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axios.js";
import { FaStar, FaRegStar } from "react-icons/fa";
import useAuth from "../../context/useAuth.js";

// Interactive Star Selector
const StarSelector = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-3xl text-[#C89B3C] transition-transform hover:scale-110"
        >
          {(hovered || rating) >= star ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );
};

const ReviewForm = ({ onReviewSubmitted }) => {
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Prefill name and email fields once the auth check resolves
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullname || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const isLoggedIn = Boolean(user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!rating) {
      setSubmitError("Please select a star rating");
      return;
    }
    if (!formData.name || !formData.email || !formData.comment) {
      setSubmitError("Name, email & experience are required");
      return;
    }
    setSubmitting(true);

    try {
      await axiosInstance.post("/reviews/createReview", {
        name: formData.name,
        email: formData.email,
        rating,
        comment: formData.comment,
      });

      // Reset form
      setFormData({
        name: user?.fullname || "",
        email: user?.email || "",
        comment: "",
      });
      setRating(0);
      setSubmitSuccess(true);

      // notify parent to refresh reviews
      onReviewSubmitted();

      // Hide success after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/50 rounded-xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-[#234E3B] text-xl sm:text-2xl font-bold font-serif mb-2">
        Share Your Experience
      </h3>
      <p className="text-gray-500 text-base mb-8">
        We'd love to hear about your stay at Jade River Resort
      </p>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ✅ Thank you! Your review has been submitted.
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ❌ {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Star Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#234E3B] uppercase tracking-wide">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <StarSelector rating={rating} setRating={setRating} />
        </div>

        {/* Name & Email */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-[#234E3B] uppercase tracking-wide">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
              required
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-[#234E3B] uppercase tracking-wide">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
            />
          </div>
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#234E3B] uppercase tracking-wide">
            Share Your Experience <span className="text-red-500">*</span>
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Tell us about your stay..."
            rows={5}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B] resize-none"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="self-center w-56 bg-[#234E3B] text-white font-semibold px-8 py-3 text-lg rounded-lg tracking-wider hover:bg-[#C89B3C] hover:text-[#234E3B] transition-all duration-300 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
