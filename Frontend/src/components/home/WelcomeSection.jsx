import { useState, useEffect } from "react";
import { getWelcomeImage } from "../../services/imageService";

const WelcomeSection = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [welcome, setWelcome] = useState(null);

  // Live clock - Pahalgam is in India
  useEffect(() => {
    const updateClock = () => {
      const time = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(time);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live temperature - Pahalgam coordinates, via Open-Meteo (no API key needed)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=34.0161&longitude=75.3220&current_weather=true",
        );
        const data = await res.json();
        setTemperature(Math.round(data.current_weather.temperature));
      } catch (error) {
        console.log("Failed to fetch weather:", error);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getWelcomeImage()
      .then((url) => setImageUrl(url))
      .catch((error) => console.log("Error fetching welcome image", error));
  }, []);

  useEffect(() => {
    getWelcomeData()
      .then((data) => setWelcome(data))
      .catch((error) => console.log("Error fetching welcome data", error));
  }, []);

  const paragraphs = welcome?.paragraphs
    ? welcome.paragraphs.split("\n\n").filter(Boolean)
    : [];

  return (
    <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left- Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-[#C89B3C] text-sm sm:text-base tracking-widest font-semibold mb-2 uppercase">
            {welcome?.subheading || "Welcome to"}
          </p>
          <h2 className="text-[#1a3c2e] text-2xl sm:text-3xl md:tet-4xl font-bold font-serif mb-4 sm:mb-6">
            {welcome?.heading || "Jade River Resort"}
          </h2>

          {paragraphs.length > 0 && (
            <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}

          {/* Local Time & Temperature */}
          <div className="flex flex-col gap-1 mt-6 sm:mt-8 mb-2 sm:mb-4 text-gray-500">
            <span className="text-sm sm:text-base font-medium">
              Local Time: {currentTime || "--:--"}
            </span>
            <span className="text-sm sm:text-base font-medium">
              Current Temperature:{" "}
              {temperature !== null ? `${temperature}°C` : "--°C"}
            </span>
          </div>
        </div>

        {/* Right - Image*/}
        <div className="w-full md:w-3/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Welcome Image"
              className="w-full h-64 sm:h-72 md:h-80 lg:h-150 object-cover rounded-lg shadow-lg transition-transform duration-700 ease-out hover:scale-110"
            />
          ) : (
            <div className="w-full h-64 sm:h-72 md:h-80 bg-gray-200 rounded-lg animate-pulse" />
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
