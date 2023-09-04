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
  const [wordPerTurn, setWordPerTurn] = useState(1);

  const handleCodeChange = (event) => {
    const inputValue = event.target.value.toUpperCase();
    setCode(inputValue);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumRoundsChange = (event, newValue) => {
    setNumRounds(newValue);
  };
  const handleWordsPerTurnChange = (event, newValue) => {
    setWordPerTurn(newValue);
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

  const handleWordsPerTurnSubmit = (event) => {
    switch (wordPerTurn) {
      case 1:console.log("word per turn:", 5)
      break;
      case 2:console.log("word per turn:", 10)
      break;
      case 3:console.log("word per turn:", 999)
      break;
    }
    // console.log("Words per turn:", wordPerTurn);
  };

  const handleRoundsSubmit = (event) => {
    // event.preventDefault();
    console.log("Number of rounds:", numRounds);
  };

  const handleTimeSubmit = (event) => {
    console.log("Time:", roundTime);
  };

  const turnWords = [
    { value: 1, label: "5" },
    { value: 2, label: "10" },
    { value: 3, label: "∞" },
  ];

  const roundNumber = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
  ];

  const time = [
    { value: 60, label: "60" },
    { value: 90, label: "90" },
    { value: 120, label: "120" },
  ]

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
          <Box className="slider">
            <Slider
              value={numRounds}
              onChange={handleNumRoundsChange}
              step={1}
              marks = {roundNumber}
              min={1}
              max={3}
            />
          </Box>
        </form>


        <form className="roundForm">
          <h4>Time per turn</h4>
          <Box className="slider">
            <Slider
              value={roundTime}
              onChange={handleRoundTimeChange}
              step={30}
              marks = {time}
              min={60}
              max={120}
            />
          </Box>
        </form>


        <form className="roundForm">
          <h4>Max words per turn</h4>
          <Box className="slider">
            <Slider
                value={wordPerTurn}
                onChange={handleWordsPerTurnChange}
                step={1}
                marks = {turnWords}
                min={1}
                max={3}
            />
          </Box>
        </form>


        <h3 className="teamHeading">Assign teams</h3>
        <form className="nameForm">
          <button className="redBtn plusBtn" onClick={handleRedTeamNameSubmit}>+</button>
          <input
            className="nameBox"
            type="text"
            placeholder="Player Name..."
            value={name}
            onChange={handleNameChange}
          />
          <br />
          <button
            className="blueBtn plusBtn"
            onClick={handleBlueTeamNameSubmit}
          >+</button>
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
            handleWordsPerTurnSubmit();
          }}
        >
          START
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
