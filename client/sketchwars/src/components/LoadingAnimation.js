import React from "react";
import "./LoadingAnimation.css";

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Connecting to server...</p>
    </div>
  );
};

export default LoadingAnimation;
