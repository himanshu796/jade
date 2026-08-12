import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import HamburgerMenu from "./home/HamburgerMenuSection";
import jadeLogoImg from "../assets/jade_logo.png";
import useAuth from "../context/useAuth";
import { RxHamburgerMenu } from "react-icons/rx";
import { getInitials } from "../utils/getInitials";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userMenuRef = useRef();

  const handleBookClick = () => {
    if (loading) return;

    if (!user) {
      navigate("/login", { state: { from: "/rooms" } });
    } else {
      navigate("/booking");
    }
  };

  const initials = getInitials(user?.fullname);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="w-full flex items-center justify-between bg-[#4C8DAF] px-4 sm:px-8 py-3 sm:py-4 shadow-md">
        {/* Left - Menu Icon */}
        <div className="header-left">
          <button
            className="text-white text-2xl sm:text-3xl bg-transparent border-none hover:text-[#2F3437] transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <RxHamburgerMenu />
          </button>
        </div>

        {/* Center - Logo & Hotel Name  */}
        <div className="flex items-center justify-center flex-1 mx-2 min-w-0">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={jadeLogoImg}
              alt="Jade logo"
              className="w-12 h-12 rounded-full shrink-0"
            />
          </Link>
          <h1 className="text-[#F6F5F2] text-xl sm:text-2xl md:text-4xl tracking-widest hahmlet-heading text-center">
            Jade River Resort
          </h1>
        </div>

        {/* Right - User presence & Book button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!loading && user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1a3c2e] text-[#d4af6e] font-bold text-xs sm:text-sm border-2 border-[#d4af6e] cursor-pointer hover:opacity-60 transition-opacity"
                title={user.fullname || "Account"}
                aria-label="Account menu"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                {initials}
                {/* Online presence dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-300 border-2 border-[#b38f6f]" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-[#d4af6e]/40"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-[#234E3B] truncate">
                      {user.fullname || "Guest"}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[#2F3437] hover:bg-gray-100"
                    role="menuitem"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[#2F3437] hover:bg-gray-100"
                    role="menuitem"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-sm text-[#4C8DAF] hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                    role="menuitem"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            className="bg-[#2F3437] text-[#F6F5F2] font-semibold text-[11px] sm:text-sm tracking-wide px-2.5 sm:px-6 py-1.5 sm:py-2 rounded-xl cursor-pointer whitespace-nowrap border-2 border-transparent hover:border-[#4C8DAF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleBookClick}
            disabled={loading}
            aria-label="Book a room"
          >
            BOOK
          </button>
        </div>
      </header>

      {/* Hamburger Menu*/}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
