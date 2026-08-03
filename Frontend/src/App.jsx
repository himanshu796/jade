import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Booking from "./pages/Booking.jsx";  
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Rooms from "./pages/Rooms.jsx";
import Reviews from "./pages/Reviews.jsx";
import Gallery from "./pages/Gallery.jsx";
import About from "./pages/About.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Profile from "./pages/Profile.jsx";

// Components
import AuthProvider from "./context/AuthProvider";
import ScrollToTop from "./components/ScrollToTop.jsx";


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/review" element={<Reviews />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
