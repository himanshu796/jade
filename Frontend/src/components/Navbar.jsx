import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"></Link>
      </div>

      <div className="navbar-links">
        <Link to="/"></Link>
        <Link to="/rooms"></Link>

        {/* Show if logged in */}
        {user && <Link to="/my-bookings">My Bookings</Link>}

        {/* Show if admin */}
        {user?.role === "ADMIN" && <Link to="/dashboard">Dashboard</Link>}
      </div>

      <div className="navbar-auth">
        {user ? (
          <>
            <span>Welcome, {user.fullname}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"></Link>
            <Link to="/register"></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
