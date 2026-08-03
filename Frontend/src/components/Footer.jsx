import { Link } from "react-router-dom";
import instagramLogoImg from "../assets/instagram.png";
import { FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";

const Footer = () => {
  return (
    <footer className="bg-[#4C8DAF] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
        {/* Hotel name*/}
        <div className="footer-brand">
          <h2 className="text-[#2F3437] text-xl font-bold tracking-wide mb-2">
            Jade River Resort by DeFoy
          </h2>
          <p className="text-[#F6F5F2] text-xm">Your comfort is our priority</p>
        </div>
        {/* Quick links */}
        <div>
          <h3 className="text-[#2F3437] text-lg font-semibold mb-2 tracking-wide">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-[#F6F5F2] ">
            <li>
              <Link to="/" className="hover:text-white/70 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/rooms"
                className="hover:text-white/70 transition-colors"
              >
                Rooms
              </Link>
            </li>
            <li>
              <Link
                to="/nearby-attractions"
                className="hover:text-white/70 transition-colors"
              >
                Nearby Attractions
              </Link>
            </li>
            <li>
              <Link
                to="/review"
                className="hover:text-white/70 transition-colors"
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="hover:text-white/70 transition-colors"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-white/70 transition-colors"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[#2F3437] text-lg font-semibold mb-2 tracking-wide">
            Contact Us
          </h3>
          <ul className="flex flex-col gap-3 text-base text-[#F6F5F2]">
            <li className="flex items-start gap-2">
              <FaLocationDot className="shrink-0 mt-0.5" />
              Amarzoo, Rafting Point, Pahalgam, Jammu and Kashmir 192126
            </li>
            <li className="flex items-center gap-2">
              <BsFillTelephoneFill className="shrink-0" />
              <a
                href="tel:+917780868926"
                className="hover:text-white/70 transition-colors"
              >
                +91 77808 68926
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoIosMail className="shrink-0" />
              <a
                href="mailto:jaderesort@gmail.com"
                className="hover:text-white/70 transition-colors"
              >
                jaderesort@gmail.com
              </a>
            </li>
            <li>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/jaderiverresortbydefoy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={instagramLogoImg}
                  alt="Instagram Logo"
                  className="w-6 h-6 md:w-7 md:h-7 hover:opacity-70 transition"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/30 text-center py-4 text-white/60 text-xs">
        <p>
          &copy; {new Date().getFullYear()} Jade River Resort. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
