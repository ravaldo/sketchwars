import React, { useState } from "react";
import "./JoinGame.css";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

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
  const [roundTime, setRoundTime] = useState(60);

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumRoundsChange = (event, newValue) => {
    setNumRounds(newValue);
  };

  const handleRoundTimeChange = (event, newValue) => {
    setRoundTime(newValue);
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

  const handleTimeSubmit = (event) => {
    console.log("Time:", roundTime);
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
          <input
            className="codeBox"
            type="text"
            value={code}
            onChange={handleCodeChange}
          />
        </form>
        <form className="roundForm">
          <h4>Number of rounds</h4>
          <Box sx={{ width: 200 }}>
            <Slider
              value={numRounds}
              onChange={handleNumRoundsChange}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={3}
            />
          </Box>
        </form>
        <form className="roundForm">
          <h4>Round time</h4>
          <Box sx={{ width: 200 }}>
            <Slider
              value={roundTime}
              onChange={handleRoundTimeChange}
              valueLabelDisplay="auto"
              step={30}
              marks
              min={60}
              max={120}
            />
          </Box>
        </form>
        <h3 className="teamHeading">Assign teams</h3>
        <form className="nameForm">
          <input
            className="nameBox"
            type="text"
            placeholder="Player Name..."
            value={name}
            onChange={handleNameChange}
          />
          <br />
          <button className="redBtn" onClick={handleRedTeamNameSubmit}></button>
          <button
            className="blueBtn"
            onClick={handleBlueTeamNameSubmit}
          ></button>
        </form>
        <div className="teams">
          <div className="team-list">
            <h4 className="redTeamTitle">Red Team</h4>
            <ul>
              {redTeamNames.map((playerName, index) => (
                <li key={index}>{playerName}</li>
              ))}
            </ul>
          </div>
          <div className="team-list">
            <h4 className="blueTeamTitle">Blue Team</h4>
            <ul>
              {blueTeamNames.map((playerName, index) => (
                <li key={index}>{playerName}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="startBtn"
          onClick={() => {
            handleCodeSubmit();
            handleRoundsSubmit();
            handleTimeSubmit();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
