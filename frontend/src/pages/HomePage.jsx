import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutUs from "../components/AboutUs";
import ClientRoomSection from "../components/ClientRoomSection";
import DJSection from "../components/DJSection";
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
        <div className="abt-sec"><AboutUs /></div>
        <div className="dj-sec"><DJSection /></div>
        <div className="cr-sec"><ClientRoomSection /> </div>
      </div>
    </div>
  );
};

export default HomePage;
