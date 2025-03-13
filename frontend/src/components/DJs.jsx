import React, { useEffect, useState } from "react";
import axios from "axios";

const DJs = () => {
  const [djs, setDjs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/djs")
      .then(response => setDjs(response.data))
      .catch(error => console.error("Error fetching DJs", error));
  }, []);

  return (
    <section className="djs grid grid-cols-4 gap-6 p-10">
      {djs.map((dj) => (
        <div key={dj._id} className="dj text-center text-white">
          <img src={dj.image} alt={dj.name} className="rounded-full w-24 h-24 mx-auto" />
          <h3 className="mt-2 font-bold">{dj.name}</h3>
          <p className="text-sm">{dj.genre}</p>
        </div>
      ))}
    </section>
  );
};

export default DJs;
