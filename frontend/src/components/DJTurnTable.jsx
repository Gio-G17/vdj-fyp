import { useState, useRef, useEffect } from "react";
import "../styles/djturntable.css";

const DJTurntable = () => {
  const [angle, setAngle] = useState(0);
  const turntableRef = useRef(null);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);

  // Handles rotation when dragging
  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastAngle.current = getAngle(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const newAngle = getAngle(e);
    setAngle((prev) => prev + (newAngle - lastAngle.current));
    lastAngle.current = newAngle;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const getAngle = (e) => {
    if (!turntableRef.current) return 0;
    const rect = turntableRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Makes the turntable spin automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => prev + 0.1); // Slow auto rotation
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout">
      <div className="turntable">
        <div className="disc-container">
          <div
            ref={turntableRef}
            className="disc"
            id="disc"
            style={{ transform: `rotate(${angle}deg)` }}
            onMouseDown={handleMouseDown}
          >
            <div className="disc__que"></div>
            <div className="disc__label"></div>
            <div className="disc__middle"></div>
          </div>
          <div className="disc__glare"></div>
        </div>
      </div>
    </div>
  );
};

export default DJTurntable;
