import Header from "../components/Header";
import Footer from "../components/Footer";
import DiningSection from "../components/home/DiningSection";
import FeaturedRooms from "../components/home/FeaturedRooms";
import HamburgerMenu from "../components/home/HamburgerMenuSection";
import HeroSlideSection from "../components/home/HeroSlideSection";
import WelcomeSection from "../components/home/WelcomeSection";
import AttractionsSection from "../components/home/AttractionsSection";
import AmenitiesSection from "../components/home/AmenitiesSection";
import ReviewSection from "../components/home/ReviewSection";

const Home = () => {
  return (
    <div>
      <Header />
      <HeroSlideSection />
      <WelcomeSection />
      <FeaturedRooms />
      <DiningSection />
      <AttractionsSection />
      <AmenitiesSection />
      <ReviewSection />
      <Footer />
    </div>
  );
};
export default Home;
