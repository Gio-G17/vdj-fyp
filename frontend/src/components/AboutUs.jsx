import React from "react";

const AboutUs = () => {
  return (
    <section className="about flex justify-center items-center p-10">
      <div className="w-1/2">
        <h2 className="text-3xl font-bold">Behind the Beats</h2>
        <p className="mt-4">
          Welcome to VDJ, where the beats are as hot as the talk! We deliver the latest hits 
          across multiple genres with top DJs.
        </p>
      </div>
      <div className="w-1/2">
        <img src="/images/about-us.png" alt="About Us" className="rounded-lg shadow-lg" />
      </div>
    </section>
  );
};

export default AboutUs;
