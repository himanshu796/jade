import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedRoomImages } from "../../services/imageService";
import { useInView, motion } from "framer-motion";

const RoomRow = ({ room, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });
  const isEven = index % 2 === 0;
  const navigate = useNavigate();

  return (
    <div
      ref={ref}
      className="w-full min-h-0 sm:min-h-[70vh] flex items-center py-10 sm:py-16"
    >
      <div
        className={`max-w-6xl lg:max-w-7xl mx-auto w-full flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center justify-center gap-8 md:gap-12 px-4 sm:px-8`}
      >
        {/* Title side - zoom out effect */}
        <motion.div
          className={`w-full md:w-1/2 lg:w-2/5  text-center md:text-left  ${isEven ? "md:text-right" : "md:text-left"}`}
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif mb-4">
            {room.category.replace(/_/g, " ")} Room
          </h2>
          <button
            onClick={() => navigate(`/rooms?category=${room.category}`)}
            className="bg-[#234E3B] text-[#F6F5F2] font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base tracking-widest rounded hover:bg-[#C89B3C] hover:text-[#234E3B] transition-all duration-300 cursor-pointer"
          >
            VIEW DETAILS
          </button>
        </motion.div>

        {/* Image side - zoom in effect */}
        <motion.div
          className="w-full md:w-1/2 lg:w-3/5  overflow-hidden rounded-lg shadow-xl"
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={room.image}
            className="w-full h-70 sm:h-90 md:h-120 object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
};

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedRoomImages(5)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.id - b.id);
        setRooms(sorted);
      })
      .catch((error) => console.log("Error fetching rooms", error))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <p className="text-[#1a3c2e] text-xl tracking-widest animate-pulse">
          Loading rooms...
        </p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <p className="text-gray-800 text-xl">No rooms available</p>
      </div>
    );
  }
  return (
    <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20">
      <div className="mb-2 sm:mb-14">
        <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
          Accommodations
        </h2>
      </div>

      {rooms.map((room, index) => (
        <RoomRow key={room.id} room={room} index={index} />
      ))}
    </section>
  );
};

export default FeaturedRooms;
