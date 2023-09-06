import React, { useState, useEffect } from "react";
import "./LoadingAnimation.css";

const LoadingAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots.length === 3) {
        setDots("");
      } else {
        setDots((prevDots) => prevDots + ".");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [dots]);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Connecting to server{dots}</p>
    </div>
  );
};

export default LoadingAnimation;
