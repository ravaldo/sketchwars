import React, { useState } from "react";
import "./HostGame.css";

const HostGame = ({ onClose, redTeamNames, blueTeamNames }) => {
  const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    console.log(result);
    return result;
  };

  const [roomCode, setRoomCode] = useState(generateRandomString(6));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose}>X</button>
        <h2>Host game</h2>
        <p>Room code: {roomCode}</p>
        <h4>Red Team Names:</h4>
        <ul>
          {redTeamNames.map((playerName, index) => (
            <li key={index}>{playerName}</li>
          ))}
        </ul>
        <h4>Blue Team Names:</h4>
        <ul>
          {blueTeamNames.map((playerName, index) => (
            <li key={index}>{playerName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HostGame;
