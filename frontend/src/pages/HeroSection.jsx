import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import BgGlowingEffect from '../components/BgGlowingEffect';

const HeroSection = () => {

  return (
    <div className="relative h-screen w-full bg-[#050308] z-0 flex flex-col overflow-y-auto overflow-x-hidden md:overflow-hidden">

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