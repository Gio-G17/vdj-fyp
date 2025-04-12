import React from "react";
import "../styles/djsection.css";

import djRyan from "../assets/imgs/dj-ryan.png";
import djLiza from "../assets/imgs/dj-liza.png";
import djAJNJ from "../assets/imgs/dj-ajnj.png";
import djSara from "../assets/imgs/dj-sara.png";

const DJSection = () => {
  const djs = [
    { id: 1, name: "DJ Ryan", genre: "Techno Music", image: djRyan },
    { id: 2, name: "DJ Liza", genre: "R&B Music", image: djLiza },
    { id: 3, name: "DJs AJ & J", genre: "House Music", image: djAJNJ },
    { id: 4, name: "DJ Sara", genre: "Commercial Music", image: djSara },
  ];

  return (
    <section className="djs-section">
      <div className="djs-intro">
        <p className="djs-subtitle">Turn up the volume</p>
        <h2 className="djs-title">
          People who bring you the <br /> <strong> Best in audio</strong>
        </h2>
      </div>

      <div className="djs-list">
        {djs.map((dj) => (
          <div key={dj.id} className="dj-card">
            <img src={dj.image} alt={dj.name} className="dj-image" />
            <h3 className="dj-name">{dj.name}</h3>
            <p className="dj-genre">{dj.genre}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DJSection;
