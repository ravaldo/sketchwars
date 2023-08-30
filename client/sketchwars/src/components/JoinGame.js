import React, { useState } from "react";
import "./JoinGame.css";

const JoinGame = ({
  onClose,
  redTeamNames,
  setRedTeamNames,
  blueTeamNames,
  setBlueTeamName,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [numRounds, setNumRounds] = useState(1);
  // const [redTeamNames, setRedTeamNames] = useState([]);

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
    // event.preventDefault();
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
    // event.preventDefault();
    console.log("Number of rounds:", numRounds);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <button className="closeBtn" onClick={onClose}>
            X
          </button>
          <h2 className="title">Join Game</h2>
        </div>
        <form className="codeForm">
          <h4>Enter code</h4>
          <input className="codeBox" type="text" value={code} onChange={handleCodeChange} />
        </form>
        <form className="roundForm">
          <h4>Number of rounds</h4>
          <select className="roundForm" value={numRounds} onChange={handleNumRoundsChange}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </form>
        <form className="nameForm">
          {/* <h4>Enter your name</h4> */}
          <input type="text" placeholder="Player Name..." value={name} onChange={handleNameChange} />
          <br />
          <button className="redBtn" onClick={handleRedTeamNameSubmit}></button>
          <button className="blueBtn" onClick={handleBlueTeamNameSubmit}></button>
        </form>
        <div className="teams">
          <div className="team-list">
            <h4>Red Team</h4>
            <ul>
              {redTeamNames.map((playerName, index) => (
                <li key={index}>{playerName}</li>
              ))}
            </ul>
          </div>
          <div className="team-list">
            <h4>Blue Team</h4>
            <ul>
              {blueTeamNames.map((playerName, index) => (
                <li key={index}>{playerName}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={() => {
            handleCodeSubmit();
            handleRoundsSubmit();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
