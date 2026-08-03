import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import RegisterForm from "../components/form/RegisterForm.jsx";
import { getBgLoginImage } from "../services/imageService.js";

const Register = () => {
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    getBgLoginImage()
      .then((url) => setBgImage(url))
      .catch((error) => console.log("Error fetching image", error));
  }, []);

  return (
    <div>
      <Header />

      {/* Background Section */}
      <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-16">
        {/* Background Image */}
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/10" />

        {/* Register Form */}
        <div className="relative z-10 w-full max-w-2xl">
          <RegisterForm onSuccess={() => navigate("/login")} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
