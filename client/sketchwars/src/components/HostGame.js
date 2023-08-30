import React, { useState } from "react";
import "./HostGame.css";

const HostGame = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Your modal content */}

        <p>Modal content goes here...</p>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default HostGame;
