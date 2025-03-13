import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutUs from "../components/AboutUs";
import MusicRooms from "../components/MusicRooms";
import DJs from "../components/DJs";

const HomePage = () => {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <HeroSection />
      <AboutUs />
      <MusicRooms />
      <DJs />
    </div>
  );
};

export default HomePage;
