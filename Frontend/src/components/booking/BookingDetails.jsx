import { axiosInstance } from "../../utils/axios.js";

const BookingDetails = ({
  selectedRoom,
  checkIn,
  checkOut,
  nights,
  guests,
  totalPrice,
  paymentLoading,
  setPaymentLoading,
  paymentError,
  setPaymentError,
  startPayment,
}) => {
  const formatType = (type) =>
    type
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // GST based on per-night room tariff
  const getGstRate = (pricePerNight) => {
    if (pricePerNight <= 1000) return 0;
    if (pricePerNight <= 7500) return 0.05;
    return 0.18;
  };

  const gstRate = getGstRate(selectedRoom.price);
  const taxAmount = Math.round(totalPrice * gstRate);
  const grandTotal = totalPrice + taxAmount;

  const handlePayNow = async () => {
    setPaymentError(null);
    setPaymentLoading(true);
    try {
      const { data } = await axiosInstance.post(
        "/bookings/createBooking",
        {
          roomTypeId: selectedRoom.id,
          checkIn,
          checkOut,
        },
        { withCredentials: true },
      );

      const booking = data.data;

      await startPayment({
        bookingId: booking.booking_id,
        setLoading: setPaymentLoading,
        setError: setPaymentError,
      });
    } catch (error) {
      setPaymentError(
        error?.response?.data?.message || "Failed to create booking",
      );
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-[#1a3c2e] text-xl font-bold font-serif mb-6">
        Booking Details
      </h2>

      {paymentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ❌ {paymentError}
        </div>
      )}

      <div className="flex flex-col gap-4 mb-8">
        {/* Room Preview */}
        <div className="flex items-center gap-4 p-4 bg-[#f9f5f0] rounded-lg">
          <img
            src={selectedRoom.image}
            alt={selectedRoom.category}
            className="w-24 h-20 object-cover rounded-lg shrink-0"
          />
          <div>
            <p className="text-[#9c8356] text-xs tracking-widest uppercase font-semibold">
              {formatType(selectedRoom.category)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-900">Check In</span>
            <span className="text-[#1a3c2e] font-semibold">
              {formatDate(checkIn)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-900">Check Out</span>
            <span className="text-[#1a3c2e] font-semibold">
              {formatDate(checkOut)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-900">Guests</span>
            <span className="text-[#1a3c2e] font-semibold">
              {guests.adults} {guests.adults === 1 ? "Adult" : "Adults"}
              {guests.children > 0 &&
                `, ${guests.children} ${guests.children === 1 ? "Child" : "Children"}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-900">Price per night</span>
            <span className="text-[#1a3c2e] font-semibold">
              INR {selectedRoom.price}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-900">
              Subtotal ({nights} {nights === 1 ? "night" : "nights"})
            </span>
            <span className="text-[#1a3c2e] font-semibold">
              INR {totalPrice}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-900">GST</span>
            <span className="text-[#1a3c2e] font-semibold">
              INR {taxAmount}
            </span>
          </div>
          <div className="h-px bg-gray-400 my-1" />
          <div className="flex justify-between text-base">
            <span className="text-[#1a3c2e] font-bold">Total Amount</span>
            <span className="text-[#1a3c2e] font-bold text-xl">
              INR {grandTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Razorpay button */}
      <button
        onClick={handlePayNow}
        disabled={paymentLoading}
        className="bg-[#1a3c2e] text-white font-semibold px-8 py-4 rounded-lg tracking-widest hover:bg-[#d4af6e] hover:text-[#1a3c2e] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {paymentLoading ? "Processing..." : "PAY NOW"}
      </button>

      <p className="text-center text-xs text-gray-400 mt-2">
        Secured by Razorpay 🔒
      </p>
    </div>
  );
};

export default BookingDetails;
