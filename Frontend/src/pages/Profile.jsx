import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { axiosInstance } from "../utils/axios.js";
import useAuth from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast.jsx";

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile_number: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const initial = {
      fullname: user.fullname || "",
      email: user.email || "",
      mobile_number: user.mobile_number || "",
      address: user.address || "",
    };
    setFormData((prev) => ({
      ...prev,
      ...initial,
    }));
    setOriginalData(initial);
  }, [user, loading, navigate]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const isChangingPassword = formData.newPassword || formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password section up front if the user touched it at all
    if (isChangingPassword) {
      if (
        !formData.oldPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        setToast({
          message: "Fill in all three password fields to change your password",
          type: "error",
        });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setToast({
          message: "New password and confirm password do not match",
          type: "error",
        });
        return;
      }
    }

    // Only include fields that actually differ from what was originally loaded
    const changedFields = {};
    if (originalData) {
      ["fullname", "email", "mobile_number", "address"].forEach((field) => {
        if (formData[field] !== originalData[field]) {
          changedFields[field] = formData[field];
        }
      });
    }

    const hasProfileChanges = Object.keys(changedFields).length > 0;

    // Nothing changed anywhere don't hit the API, just tell the user
    if (!hasProfileChanges && !isChangingPassword) {
      setToast({ message: "No changes to save", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      // Only call update-profile if something actually changed and only send the changed fields instead of all four every time
      if (hasProfileChanges) {
        await axiosInstance.patch("/users/update-profile", changedFields);
        setOriginalData((prev) => ({ ...prev, ...changedFields })); // NEW: keep baseline in sync for next diff
      }

      // Password — only sent if the user actually filled it in
      if (isChangingPassword) {
        await axiosInstance.post("/users/change-password", {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });
      }

      setToast({ message: "Profile updated", type: "success" });
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="w-full flex items-center justify-center py-32">
          <p className="text-[#234E3B]">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Heading */}
      <div className="w-full bg-[#C89B3C] px-4 py-16 text-center">
        <p className="text-[#234E3B] text-lg tracking-widest font-semibold mb-2 uppercase">
          Account
        </p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold font-serif">
          My Profile
        </h1>
      </div>

      {/* Content */}
      <div className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="text-[#234E3B] text-lg font-bold font-serif mb-2">
                Account Details
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={handleChange("fullname")}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.mobile_number}
                  onChange={handleChange("mobile_number")}
                  placeholder="Enter mobile number"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={handleChange("address")}
                  placeholder="Enter address"
                  rows={3}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B] resize-none"
                />
              </div>

              <hr className="border-gray-100 my-2" />

              <h3 className="text-[#1a3c2e] text-lg font-bold font-serif -mb-1">
                Change Password
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#234E3B] uppercase tracking-wide">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleChange("oldPassword")}
                  placeholder="Current password"
                  autoComplete="current-password"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange("newPassword")}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C89B3C] text-[#234E3B]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#234E3B] text-white font-semibold px-8 py-3 rounded-lg tracking-widest hover:bg-[#C89B3C] hover:text-[#234E3B] transition-all duration-300 w-full sm:w-auto disabled:opacity-60 cursor-pointer"
              >
                {submitting ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
