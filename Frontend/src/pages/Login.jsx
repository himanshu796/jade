import { useEffect, useState } from "react";
import { useNavigate, } from "react-router-dom";
import { axiosInstance } from "../utils/axios.js";
import useAuth from "../context/useAuth.js";
import LoginForm from "../components/form/LoginForm";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { getBgLoginImage } from "../services/imageService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBg = async () => {
      try {
        const imageUrl = await getBgLoginImage();
        setBgImage(imageUrl);
      } catch (error) {
        console.log("Failed to load login background", error);
      }
    };
    fetchBg();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/users/login", formData);
      const { user } = response.data.data;

      // Save user
      login(user);

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header />

      {/* Login */}
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 bg-cover bg-center"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
      >
        <LoginForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          error={error}
        />
      </div>

      <Footer />
    </>
  );
};

export default Login;
