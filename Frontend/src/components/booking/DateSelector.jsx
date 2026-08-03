import GuestSelector from "./GuestSelector.jsx";

const DateSelector = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  onSearch,
  loading,
  error,
  onDateChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-[#1a3c2e] text-xl font-bold font-serif mb-6">
        Select Your Dates
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Check In */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
            Check In
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              onDateChange();
            }}
            min={new Date().toISOString().split("T")[0]}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e]"  
          />
        </div>

        {/* Check Out */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
            Check Out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => {
              setCheckOut(e.target.value);
              onDateChange();
            }}
            min={checkIn || new Date().toISOString().split("T")[0]}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#d4af6e] text-[#1a3c2e]"
          />
        </div>

        {/* Guests */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-[#1a3c2e] uppercase tracking-wide">
            Guests
          </label>
          <GuestSelector value={guests} onChange={setGuests} />
        </div>
      </div>
      <button
        onClick={onSearch}
        disabled={loading}
        className="mt-6 bg-[#1a3c2e] text-white font-semibold px-8 py-3 rounded-lg tracking-widest hover:bg-[#d4af6e] hover:text-[#1a3c2e] transition-all duration-300 disabled:opacity-50 w-full sm:w-auto"
      >
        {loading ? "Searching..." : "SEARCH ROOMS"}
      </button>
    </div>
  );
};

export default DateSelector;
