import { useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../utils/axios.js";
import useAuth from "../../context/useAuth.js";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile_number: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  // At least 8 chars, one uppercase, one number, one special character
  const PASSWORD_REGEX =
    /^(?=\S+$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_]).{8,}$/;

  // Standard email format
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Indian mobile number: 10 digits, starts with 6-9 (no +91, that's already shown as a prefix)
  const MOBILE_REGEX = /^[6-9]\d{9}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // strip all non-digits
    if (value.startsWith("91") && value.length > 10) {
      value = value.slice(2); // drop leading country code if pasted
    }
    value = value.slice(0, 10); // cap at 10 digits
    setFormData({ ...formData, mobile_number: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_REGEX.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.mobile_number && !MOBILE_REGEX.test(formData.mobile_number)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!PASSWORD_REGEX.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and include one uppercase letter, one number, and one special character",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password do not match");
      return;
    }

    try {
      // Register user
      await axiosInstance.post("/users/register", {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        mobile_number: formData.mobile_number || null,
        address: formData.address || null,
      });

      // Auto login after register
      const response = await axiosInstance.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const { user, accessToken } = response.data.data;
      login(user, accessToken);

      // notify parent to redirect
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full bg-[#FFFFF0] rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-[#1a3c2e] text-2xl sm:text-3xl font-bold font-serif mb-2">
        Create Account
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Join Jade River Resort and start your journey
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e]"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e]"
            required
          />
        </div>

        {/* Password & Confirm Password */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a3c2e] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span className="text-xs text-gray-400">
              Min 8 characters, 1 uppercase,1 lowercase 1 number, 1 special
              character, No spaces
            </span>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e]"
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
            Mobile Number
          </label>
          <div className="flex">
            <div className="flex items-center gap-1 border border-gray-300 border-r-0 rounded-l-lg px-4 py-3 text-sm text-[#1a3c2e]">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="text"
              name="mobile_number"
              maxLength={10}
              value={formData.mobile_number}
              onChange={handleMobileChange}
              placeholder="Enter your mobile number"
              className="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e]"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows={3}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e] resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#1a3c2e] text-white font-semibold px-8 py-3 rounded-lg tracking-widest hover:bg-[#d4af6e] hover:text-[#1a3c2e] transition-all duration-300 w-full mt-2"
        >
          CREATE ACCOUNT
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#1a3c2e] font-semibold hover:text-[#d4af6e] transition-colors"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
