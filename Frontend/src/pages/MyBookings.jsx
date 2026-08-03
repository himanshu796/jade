import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { axiosInstance } from "../utils/axios.js";
import useAuth from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import usePayment from "../hooks/usePayment.js";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { startPayment } = usePayment();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get("/bookings/my-bookings");
      setBookings(response.data.data);
    } catch (error) {
      console.log("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, authLoading, navigate]);

  const handleCancel = async (booking_id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setCancelling(booking_id);
    try {
      await axiosInstance.patch(`/bookings/cancel/${booking_id}`);
      fetchBookings();
    } catch (error) {
      console.log("Error cancelling booking", error);
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-In", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatType = (type) =>
    type
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");

  return (
    <div>
      <Header />

      {/* Page Heading */}
      <div className="w-full bg-[#C89B3C] px-4 py-16 text-center">
        <p className="text-[#234E3B] text-lg tracking-widest font-semibold mb-2 uppercase">
          Your Reservations
        </p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold font-serif">
          My Bookings
        </h1>
      </div>

      {/* Bookings List */}
      <div className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-[#234E3B] text-xl tracking-widest animate-pulse">
                Loading...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <p className="text-gray-500 text-xl">No bookings found</p>
              <button
                onClick={() => navigate("/booking")}
                className="bg-[#234E3B] text-white font-semibold px-8 py-3 rounded-lg tracking-widest hover:bg-[#C89B3C] hover:text-[#234E3B] transition-all duration-300"
              >
                BOOK A ROOM
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking.booking_id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Room Image */}
                    <img
                      src={booking.room?.roomType.image}
                      alt={booking.room?.roomType.category}
                      className="w-full sm:w-48 h-48 sm:h-auto object-cover shrink-0"
                    />

                    {/* Booking Info */}
                    <div className="flex flex-col justify-between flex-1 p-6 gap-4">
                      <div className="flex items-start justify-between flex-wrap gap-3">
                        <div>
                          <p className="text-[#C89B3C] text-xs tracking-widest uppercase font-semibold mb-1">
                            {booking.room?.type &&
                              formatType(booking.room.type)}
                          </p>
                          <h3 className="text-[#234E3B] text-xl font-bold font-serif">
                            Room {booking.room?.number}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1">
                            Booking ID: #{booking.booking_id}
                          </p>
                        </div>
                        {/* Status Badge */}
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${statusColors[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {/* Dates & Price */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                            Check In
                          </p>
                          <p className="text-[#234E3B] font-semibold">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                            Check Out
                          </p>
                          <p className="text-[#234E3B] font-semibold">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-800 text-xs uppercase tracking-wide mb-1">
                            Total Price
                          </p>
                          <p className="text-[#234E3B] font-bold text-base">
                            INR {booking.totalPrice}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {booking.status === "PENDING" ||
                        booking.status === "CONFIRMED" ? (
                          <button
                            onClick={() => handleCancel(booking.booking_id)}
                            disabled={cancelling === booking.booking_id}
                            className="border-2 border-red-500 text-red-700 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-red-300 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                          >
                            {cancelling === booking.booking_id
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
