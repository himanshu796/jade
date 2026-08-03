import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { getRoomTypes } from "../services/roomService.js";
import { getBgRoomImage } from "../services/imageService.js";
import { FaChartArea } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";

// Single Room Row
const RoomRow = ({ room, index, isHighlighted }) => {
  const ref = useRef();
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });
  const isEven = index % 2 === 0;
  const navigate = useNavigate();

  return (
    <div
      ref={ref}
      id={`room-${room.category}`}
      className={`w-full min-h-[60vh] flex items-center py-10 sm:py-14 border-b border-gray-100 transition-colors duration-700 ${isHighlighted ? "bg-[#FAEDD3]" : ""}`}
    >
      <div
        className={`max-w-6xl mx-auto w-full flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } items-center gap-8 md:gap-12 px-2 sm:px-4`}
      >
        {/* Text */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, scale: 1.3 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.3 }
          }
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif mb-4">
            {room.category.replace(/_/g, " ")}
            <span className="text-xl sm:text-2xl md:text-3xl ml-2">Room</span>
          </h2>
          <p className="text-[#2F3437] text-sm sm:text-base leading-relaxed mb-4">
            {room.description}
          </p>
          <p className="text-gray-600 text-base mb-4 flex items-center justify-center md:justify-start gap-1">
            <FaChartArea />
            {room.area} sq. ft.
          </p>
          <div className="flex items-center gap-4 mb-6 flex-wrap justify-center md:justify-start">
            <span className="text-base text-gray-600 flex items-center gap-1">
              <BsPeopleFill />
              Max {room.maxGuests} Guests
            </span>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="w-full md:w-1/2 overflow-hidden rounded-lg shadow-xl"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }
          }
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img
            src={room.image}
            alt={room.category}
            className="w-full h-80 sm:h-96 md:h-128 object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState(null);
  const [searchParams] = useSearchParams();
  const targetRoomCategory = searchParams.get("category");
  const hasScrolled = useRef(false);

  useEffect(() => {
    setLoading(true);
    getRoomTypes()
      .then((data) => setRooms(data))
      .catch((error) => console.log("Error fetching rooms", error))
      .finally(() => setLoading(false));

    getBgRoomImage()
      .then((url) => setBgImage(url))
      .catch((error) => console.log("Error fetching background image", error));
  }, []);

  useEffect(() => {
    hasScrolled.current = false;
  }, [targetRoomCategory]);

  // Scroll to targeted room once rooms have loaded
  useEffect(() => {
    if (!loading && targetRoomCategory && !hasScrolled.current) {
      const el = document.getElementById(`room-${targetRoomCategory}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        hasScrolled.current = true;
      }
    }
  }, [loading, targetRoomCategory, rooms]);

  return (
    <div>
      <Header />

      {/* Page Heading */}
      <div className="relative overflow-hidden text-center pt-16 sm:pt-20 pb-8 px-4 bg-[#F6F5F2] min-h-[40vh] sm:min-h-[50vh] flex flex-col items-center justify-center">
        {bgImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url(${bgImage})` }}
            />
          </>
        )}

        <div className="relative z-10">
          <h1 className="text-[#234E3B] text-3xl sm:text-4xl md:text-5xl font-bold font-serif">
            Accommodations
          </h1>
        </div>
      </div>

      {/* Rooms List */}
      {loading ? (
        <div className="w-full py-20 flex items-center justify-center">
          <p className="text-[#1a3c2e] text-xl tracking-widest animate-pulse">
            Loading rooms...
          </p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="w-full py-20 flex items-center justify-center">
          <p className="text-gray-500 text-xl">No rooms available</p>
        </div>
      ) : (
        <div>
          {rooms.map((room, index) => (
            <RoomRow
              key={room.id}
              room={room}
              index={index}
              isHighlighted={room.category === targetRoomCategory}
            />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Rooms;
