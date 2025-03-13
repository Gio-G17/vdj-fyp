import React from "react";

const rooms = [
  { name: "Techno Music", image: "/images/techno.jpg" },
  { name: "Commercial Music", image: "/images/commercial.jpg" },
  { name: "House Music", image: "/images/house.jpg" },
  { name: "R&B Music", image: "/images/rnb.jpg" },
];

const MusicRooms = () => {
  return (
    <section className="rooms grid grid-cols-4 gap-6 p-10">
      {rooms.map((room, index) => (
        <div key={index} className="room bg-gray-800 text-white p-4 rounded-lg">
          <img src={room.image} alt={room.name} className="rounded-md w-full h-40 object-cover" />
          <h3 className="text-xl font-bold mt-2">{room.name}</h3>
        </div>
      ))}
    </section>
  );
};

export default MusicRooms;
