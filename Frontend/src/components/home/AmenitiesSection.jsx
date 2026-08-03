import { useEffect, useState } from "react";
import iconAmenity from "../../utils/iconAmenity";
import { axiosInstance } from "../../utils/axios";

const hotelInfoKeys = ["Check-in", "Check-out", "Minimum-age"];

const AmenitiesSection = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/amenities")
      .then((response) => setAmenities(response.data.data))
      .catch((error) => console.log("Error fetching amenities", error))
      .finally(() => setLoading(false));
  }, []);

  const gridAmenities = amenities.filter(
    (a) => !hotelInfoKeys.includes(a.title),
  );

  const checkIn = amenities.find((a) => a.title === "Check-in");
  const checkOut = amenities.find((a) => a.title === "Check-out");
  const minAge = amenities.find((a) => a.title === "Minimum-age");

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <p className="text-[#1a3c2e] text-xl tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20">
      {/* Section Heading */}
      <div className="mb-10 sm:mb-14">
        <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
          Featured Amenities
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-6 sm:gap-8">
        {gridAmenities.map((amenity) => (
          <div
            key={amenity.id}
            className="flex flex-col items-center gap-3 group cursor-default"
          >
            {/* Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F6F5F2] flex items-center justify-center text-2xl sm:text-3xl text-[#2F3437] transition-all duration-300">
              {iconAmenity[amenity.icon]}
            </div>
            {/* Title */}
            <p className="text-[#2F3437] text-xs sm:text-sm text-center tracking-wide transition-all duration-300">
              {amenity.title}
            </p>
          </div>
        ))}
      </div>

      {/* Hotel Information  */}
      <div className="max-w-6xl mx-auto mt-14 border-t border-[#e8e0d5] pt-10">
        <h3 className="text-[#234E3B] text-xl sm:text-2xl font-serif mb-6 tracking-wide">
          Hotel Information
        </h3>
        <div className="flex flex-col">
          {/* Check-in */}
          <div className="flex items-center gap-4 py-4 pl-20">
            <div className="w-10 h-10 bg-[#F6F5F2] rounded-full flex items-center justify-center text-[#234E3B]">
              {iconAmenity[checkIn?.icon]}
            </div>
            <div>
              <p className="text-[#C89B3C] text-xs tracking-widest uppercase">
                Check-in
              </p>
              <p className="text-[#234E3B] text-sm font-semibold mt-0.5">
                2:00 PM
              </p>
            </div>
          </div>

          {/* Check-out */}
          <div className="flex items-center gap-4 py-4 pl-20">
            <div className="w-10 h-10 bg-[#F6F5F2] rounded-full flex items-center justify-center text-[#234E3B]">
              {iconAmenity[checkOut?.icon]}
            </div>
            <div>
              <p className="text-[#C89B3C] text-xs tracking-widest uppercase">
                Check-out
              </p>
              <p className="text-[#234E3B] text-sm font-semibold mt-0.5">
                12:00 PM
              </p>
            </div>
          </div>

          {/* Minimum Age */}
          <div className="flex items-center gap-4 py-4 pl-20">
            <div className="w-10 h-10 bg-[#F6F5F2] rounded-full flex items-center justify-center text-[#234E3B]">
              {iconAmenity[minAge?.icon]}
            </div>
            <div>
              <p className="text-[#C89B3C] text-xs tracking-widest uppercase">
                Minimum Age to Check In
              </p>
              <p className="text-[#234E3B] text-sm font-semibold mt-0.5">
                18 Years
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
