import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import BgGlowingEffect from '../components/BgGlowingEffect';

const HeroSection = () => {

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-[#050308]  z-0 flex flex-col overflow-x-hidden md:overflow-hidden">

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