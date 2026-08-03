import RoomCard from "./RoomCard.jsx";

const RoomList = ({ rooms, nights, selectedRoom, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-[#1a3c2e] text-xl font-bold font-serif mb-6">
        Available Rooms
        <span className="text-sm font-normal text-gray-400 ml-2">
          ({nights} night{nights > 1 ? "s" : ""})
        </span>
      </h2>

      {rooms.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No rooms available for the selected dates and guests.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              selectedRoom={selectedRoom}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
