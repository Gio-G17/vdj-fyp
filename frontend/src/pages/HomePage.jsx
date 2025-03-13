import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutUs from "../components/AboutUs";
import MusicRooms from "../components/MusicRooms";
import DJs from "../components/DJs";
import DJTurnTable from "../components/DJTurnTable";
import "../styles/homepage.css"

const HomePage = () => {
  return (
    <div>
    <div className="main-sec">
      <Navbar />
      <DJTurnTable />
      {/* <HeroSection /> */}
      </div>
       <div className="sec-sec">
  
      <AboutUs />
      <MusicRooms />
      <DJs />
    </div>
    </div>
  );
};

export default HomePage;
