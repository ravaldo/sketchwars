import React, { useState } from "react";
import "./JoinGame.css";

const JoinGame = ({ onClose, redTeamNames, setRedTeamNames, blueTeamNames, setBlueTeamName }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [numRounds, setNumRounds] = useState(1);
  // const [redTeamNames, setRedTeamNames] = useState([]);
  // const [blueTeamNames, setBlueTeamName] = useState([]);

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumRoundsChange = (event) => {
    setNumRounds(Number(event.target.value));
  };

  const handleCodeSubmit = (event) => {
    event.preventDefault();
    console.log("Entered code:", code);
  };

  const handleRedTeamNameSubmit = (event) => {
    event.preventDefault();
    console.log("Entered name:", name);
    setRedTeamNames([...redTeamNames, name]);
    setName("");
  };

  const handleBlueTeamNameSubmit = (event) => {
    event.preventDefault();
    console.log("Entered name:", name);
    setBlueTeamName([...blueTeamNames, name]);
    setName("");
  };

  const handleRoundsSubmit = (event) => {
    event.preventDefault();
    console.log("Number of rounds:", numRounds);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="closeBtn" onClick={onClose}>
          X
        </button>
        <h2>Join Game</h2>
        <form>
          <h4>Enter code</h4>
          <input type="text" value={code} onChange={handleCodeChange} />
          <button onClick={handleCodeSubmit}>Submit Code</button>
        </form>
        <form>
          <h4>Enter your name</h4>
          <input type="text" value={name} onChange={handleNameChange} />
          <br />
          <button onClick={handleRedTeamNameSubmit}>add to Red Team</button>
          <button onClick={handleBlueTeamNameSubmit}>add to Blue Team</button>
        </form>
        <form>
          <h4>Number of rounds</h4>
          <select value={numRounds} onChange={handleNumRoundsChange}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button onClick={handleRoundsSubmit}>Submit Rounds</button>
        </form>
        <div>
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
    </div>
  );
};

export default JoinGame;