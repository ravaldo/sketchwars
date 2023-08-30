import React from "react";
import './JoinGame.css';

const JoinGame = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Your modal content */}
        <h2>Join Game</h2>
        <p>Modal content goes here...</p>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default JoinGame;
