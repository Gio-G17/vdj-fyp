import React from "react";
import onAirAbtImg from "../assets/onAirAbtImg.svg";
import "../styles/aboutsection.css"

const AboutUs = () => {
  return (
    <div className="main-about">
      <div className="col-about">
        <div className="colr1-about">
          <p className="subslgn-about">
            Turn up the volume
          </p>
          <h1>Behind the Beats</h1>
          <p className="abttext-about">
            Welcome to Radio LIT, where the beats are as hot as the talk! As a high-energy station, we pride ourselves on delivering the latest hits that transcend genres, from the catchy tunes of pop to the rhythm and flow of hip-hop, the pulsating beats of electronic, and the soulful vibes of.
          </p>
        </div>
        <div className="red-about">
          <p></p>
        </div>
        <div className="statsec-about">
          <div className="stat-about">
            <h1 className="statNb-about">15+</h1>
            <p>Signed <br></br> DJs</p>
          </div>
          <div className="stat-about">
            <h1 className="statNb-about">1.5k</h1>
            <p>Clients</p>

          </div>
          <div className="stat-about">
            <h1 className="statNb-about">25+</h1>
            <p>Years of <br></br> Experience</p>

          </div>
        </div>
      </div>
      <div className="img-about">
        <img src={onAirAbtImg} >
        </img>
      </div>
    </div>
  );
};

export default AboutUs;
