import React from "react";

const HeroSection = () => {
  return (
    <section className="hero bg-black text-white flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Turn Up the Volume</h1>
      <p className="mt-2 text-lg">Bringing the best beats from top DJs</p>
      <button className="mt-6 px-6 py-2 bg-red-600 text-white rounded">Book Now</button>
    </section>
  );
};

export default HeroSection;
