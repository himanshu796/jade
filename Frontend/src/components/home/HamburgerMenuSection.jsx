import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { IoMdCloseCircle } from "react-icons/io";
import { IoHomeSharp } from "react-icons/io5";
import {
  MdBedroomParent,
  MdDashboard,
  MdOutlineLocalDining,
} from "react-icons/md";
import { LuNotebookTabs } from "react-icons/lu";
import { FaCircleInfo } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaUserCircle, FaImages } from "react-icons/fa";
import { MdReviews, MdOutlineTravelExplore } from "react-icons/md";
import instagramLogoImg from "../../assets/instagram.png";
import { getInitials } from "../../utils/getInitials";

const HamburgerMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-998 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#C89B3C] text-[#2F3437] z-999 flex flex-col gap-4 p-5 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="self-end text-[#2F3437] text-3xl hover:text-[#F6F5F2] transition-colors"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </button>

        {/* When logged out*/}
        {!user && (
          <button
            onClick={() => handleNavigate("/login")}
            className="flex items-center justify-center gap-2 w-full bg-[#234E3B] text-[#d4af6e] font-semibold py-1.5 px-3 rounded-full hover:bg-[#F6F5F2] hover:text-[#1a3c2e] transition-colors text-sm cursor-pointer"
          >
            <FaUserCircle size={16} />
            Login / Signup
          </button>
        )}

        {/* User Info */}
        {user && (
          <div className="flex flex-col items-center gap-2 pb-4 border-b border-white/20">
            <div className="w-12 h-12 rounded-full bg-[#e1be83] text-[#1a3c2e] text-xl font-bold flex items-center justify-center">
              {getInitials(user.fullname)}
            </div>
            <p className="font-semibold">{user.fullname}</p>
            <span className="text-sm text-white/90">{user.role}</span>
          </div>
        )}

        {/* Menu Links */}
        <nav className="flex flex-col gap-1">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <IoHomeSharp />
            Home
          </Link>

          <Link
            to="/rooms"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <MdBedroomParent />
            Rooms
          </Link>

          {user && (
            <Link
              to="/my-bookings"
              onClick={onClose}
              className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
            >
              <LuNotebookTabs />
              My Bookings
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
            >
              <MdDashboard />
              Dashboard
            </Link>
          )}

          {user && (
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
            >
              <FaUserCircle />
              My Profile
            </Link>
          )}

          <Link
            to="/dining"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <MdOutlineLocalDining />
            Dining
          </Link>

          <Link
            to="/nearby-attractions"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <MdOutlineTravelExplore />
            Nearby Attractions
          </Link>

          <Link
            to="/review"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <MdReviews />
            Testimonials
          </Link>

          <Link
            to="/gallery"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <FaImages />
            Gallery
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <BsFillTelephoneFill />
            Contact Us
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-white/50 transition-colors cursor-pointer"
          >
            <FaCircleInfo />
            About Us
          </Link>
        </nav>

        <hr className="border-t border-white/20 my-2" />
        <p className="text-sm text-white/90">Follow us</p>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/jaderiverresortbydefoy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={instagramLogoImg}
            alt="Instagram Logo"
            className="w-6 h-6 md:w-7 md:h-7 hover:opacity-50 transition"
          />
        </a>

        {/* Auth Buttons */}
        <div className="mt-auto">
          {user && (
            <button
              className="w-full bg-[#234E3B] text-[#d4af6e] font-semibold py-1.5 rounded hover:bg-[#F6F5F2] hover:text-[#1a3c2e] transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
              onClick={handleLogout}
            >
              <FaUserCircle size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
