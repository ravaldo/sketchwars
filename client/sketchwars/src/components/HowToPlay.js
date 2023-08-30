import React from "react";
// import './HowToPlay.css';

const HowToPlay = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Your modal content */}
      
        <h2>How to play</h2>
        <p>Modal content goes here...</p>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default HowToPlay;
