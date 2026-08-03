import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { getAbout, getBgAboutImage } from "../services/imageService.js";

const About = () => {
  const [bgImage, setBgImage] = useState(null);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBgAboutImage()
      .then((url) => setBgImage(url))
      .catch((err) => console.log(err));

    getAbout()
      .then((data) => setAbout(data))
      .catch((err) => console.log("Error fetching about", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="w-full min-h-screen flex items-center justify-center">
          <p className="text-[#234E3B] text-xl tracking-widest animate-pulse">
            Loading...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      {/* Full Width Resort Image */}
      <div className="w-full h-full overflow-hidden">
        {bgImage && (
          <img
            src={bgImage}
            alt="Jade River Resort"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Our Story section */}
      <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[#C89B3C] text-sm tracking-widest font-semibold mb-2 uppercase">
              Who We Are
            </p>

            <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
              Our Story
            </h2>
          </div>

          {/* Story Paragraphs */}
          <div className="flex flex-col gap-3 text-[#2F3437] text-base leading-relaxed">
            {about?.storyParagraphs?.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Vision Section */}
      <section className="w-full bg-[#F6F5F2] px-4 sm:px-8 md:px-16 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left - Owner Image */}
          <div className="w-full md:w-2/5 flex flex-col items-center gap-4">
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl border-4 border-[#C89B3C]">
              <img
                src={about?.ownerImage}
                alt={about?.ownerName}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[#234E3B] text-lg font-bold font-serif">
              Mr. {about?.ownerName}
            </p>
            <p className="text-[#C89B3C] text-sm tracking-widest uppercase font-semibold">
              Founder & Owner
            </p>
          </div>

          {/* Right - Vision */}
          <div className="w-full md:w-3/5 text-center md:text-left">
            <p className="text-[#C89B3C] text-sm tracking-widest font-semibold mb-2 uppercase">
              A Message From Our Founder
            </p>
            <h2 className="text-[#234E3B] text-2xl sm:text-3xl md:text-4xl font-bold font-serif mb-6">
              Our Vision
            </h2>
            <div className="flex flex-col gap-3 text-[#2F3437] text-base leading-relaxed">
              {about?.visionParagraphs?.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            {/* Signature */}
            <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
              <div className="h-px w-12 bg-[#C89B3C]" />
              <p className="text-[#234E3B] font-bold font-serif italic text-lg">
                {about?.ownerName}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
