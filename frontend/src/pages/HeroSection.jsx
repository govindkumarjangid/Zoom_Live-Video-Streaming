import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import BgGlowingEffect from '../components/BgGlowingEffect';

const HeroSection = () => {

  return (
    <div className="relative min-h-screen w-full bg-[#050308] overflow-hidden z-0 flex flex-col">

      {/* Background glowing effect */}
      <BgGlowingEffect />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Hero />

    </div>
  );
}


export default HeroSection;