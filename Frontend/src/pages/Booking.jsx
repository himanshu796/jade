import { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import useAuth from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import { getAvailableRooms } from "../services/roomService.js";
import BookingDetails from "../components/booking/BookingDetails.jsx";
import StepsIndicator from "../components/booking/StepsIndicator.jsx";
import DateSelector from "../components/booking/DateSelector.jsx";
import RoomList from "../components/booking/RoomList.jsx";
import usePayment from "../hooks/usePayment.js";

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startPayment } = usePayment();

  // Step 1 - Dates
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [dateError, setDateError] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Step 2 - Rooms
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Step 3 - Payment
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Current step
  const [step, setStep] = useState(1);

  // Calculated values
  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = selectedRoom ? nights * selectedRoom.price : 0;

  // Step 1 - Search available rooms
  const handleSearchRooms = async () => {
    setDateError("");

    if (!checkIn || !checkOut) {
      setDateError("Please select check-in and check-out dates");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setDateError("Check-out date must be after check-in date");
      return;
    }
    if (new Date(checkIn) < new Date()) {
      setDateError("Check-in date must be in the future");
      return;
    }

    setLoadingRooms(true);
    try {
      const data = await getAvailableRooms(checkIn, checkOut);
      const totalGuests = guests.adults + guests.children;
      setRooms(data.filter((r) => r.maxGuests >= totalGuests));
      setStep(2);
    } catch (error) {
      setDateError("Error fetching rooms. Please try again.");
    } finally {
      setLoadingRooms(false);
    }
  };

  // Step 2 - Select room
  const handleSelectRoom = (room) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedRoom(room);
    setStep(3);
  };

  // Reset to step 1 when dates change
  const handleDateChange = () => {
    setStep(1);
    setSelectedRoom(null);
    setRooms([]);
  };

  return (
    <div>
      <Header />

      {/* Page Heading */}
      <div className="w-full bg-[#1a3c2e] px-4 py-16 text-center">
        <p className="text-[#d4af6e] text-sm tracking-widest font-semibold mb-2 uppercase">
          Reserve Your Stay
        </p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold font-serif">
          Book a Room
        </h1>
      </div>

      {/* Steps Indicator */}
      <StepsIndicator step={step} />

      {/* Main Content */}
      <div className="w-full bg-[#f9f5f0] px-4 sm:px-8 md:px-16 py-12 sm:py-16">
        <div
          className={`mx-auto flex flex-col gap-8 ${
            step >= 3 ? "max-w-7xl" : "max-w-4xl"
          }`}
        >
          {/* Step 1 - Date Selector */}
          <DateSelector
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guests={guests}
            setGuests={setGuests}
            onSearch={handleSearchRooms}
            loading={loadingRooms}
            error={dateError}
            onDateChange={handleDateChange}
          />

          {/* Step 2/3 - Room List + Booking Details */}
          {step >= 2 && (
            <div
              className={
                step >= 3
                  ? "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                  : ""
              }
            >
              {/* Room List */}
              <div className={step >= 3 ? "lg:col-span-2" : ""}>
                <RoomList
                  rooms={rooms}
                  nights={nights}
                  selectedRoom={selectedRoom}
                  onSelect={handleSelectRoom}
                />
              </div>

              {/* Step 3 - Booking Details + Payment */}
              {step >= 3 && selectedRoom && (
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-24">
                    <BookingDetails
                      selectedRoom={selectedRoom}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      nights={nights}
                      guests={guests}
                      totalPrice={totalPrice}
                      paymentLoading={paymentLoading}
                      setPaymentLoading={setPaymentLoading}
                      paymentError={paymentError}
                      setPaymentError={setPaymentError}
                      startPayment={startPayment}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
