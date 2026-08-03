import { FaChartArea } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";

const RoomCard = ({ room, selectedRoom, onSelect }) => {
  const isSelected = selectedRoom?.id === room.id;

  const formatType = (type) =>
    type
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-[#d4af6e] bg-[#f9f5f0]"
          : "border-gray-100 hover:border-[#d4af6e]"
      }`}
      onClick={() => onSelect(room)}
    >
      {/* Image */}
      <img
        src={room.image}
        alt={room.category}
        className="w-full sm:w-36 h-28 object-cover rounded-lg shrink-0"
      />

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 gap-2">
        <div>
          <p className="text-[#d4af6e] text-xs tracking-widest uppercase font-semibold">
            {formatType(room.category)} Room
          </p>
          <p className="text-gray-500 text-sm">{room.description}</p>
        </div>
        <div className="flex items-center flex-wrap gap-2 text-xs text-gray-900">
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <FaChartArea />
            {room.area} sq.ft
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <BsPeopleFill /> Max {room.maxGuests} guests
          </span>

          <p className="text-[#1a3c2e] font-bold text-lg ml-auto">
            INR {room.price}
            <span className="text-xs font-normal text-gray-400"> /night</span>
          </p>
        </div>
      </div>

      {/* Select Button */}
      <div className="flex items-center justify-center sm:justify-end">
        <button
          className={`px-5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 ${
            isSelected
              ? "bg-[#d4af6e] text-[#1a3c2e]"
              : "bg-[#1a3c2e] text-white hover:bg-[#d4af6e] hover:text-[#1a3c2e]"
          }`}
        >
          {isSelected ? "Selected ✓" : "Select"}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
