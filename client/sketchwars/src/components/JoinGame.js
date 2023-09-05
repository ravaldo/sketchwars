import React, { useState, useEffect } from "react";
import "./JoinGame.css";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import socket from '../socket';

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
    const [joined, setJoined] = useState(false);


    const handleCodeChange = (event) => {
        const newCode = event.target.value.toUpperCase();
        setCode(newCode);
        // state setters are asynchronous, so emit the newCode 
        // and not the state which could be lagging behind
        socket.emit('joinGame', newCode, 'Tablet', success => {
            setJoined(success)
        });
    };

    const handleSubmit = () => {
        console.log("Submit");
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

    useEffect(() => {
        const settings = {code, roundTime, numRounds, redTeamNames, blueTeamNames}
        socket.emit('settings', settings);
    }, [roundTime, numRounds, redTeamNames, blueTeamNames]);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <button className="closeBtn" onClick={onClose}>X</button>
                    <h2 className="title">Join Game</h2>
                </div>
                <form className="codeForm">
                    <h4>Enter code</h4>
                    <input
                        className="codeBox"
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                        disabled={joined}
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
                            disabled={!joined}
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
                            disabled={!joined}
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
                        disabled={!joined}
                    />
                    <br />
                    <button className="redBtn" onClick={handleRedTeamNameSubmit} disabled={!joined}></button>
                    <button className="blueBtn" onClick={handleBlueTeamNameSubmit} disabled={!joined}></button>
                </form>
                <div className="teams">
                    <div className="team-list">
                        <h4 className="redTeamTitle">Red Team</h4>
                        <ul>
                            {redTeamNames.map((playerName, index) => (<li key={index}>{playerName}</li>))}
                        </ul>
                    </div>
                    <div className="team-list">
                        <h4 className="blueTeamTitle">Blue Team</h4>
                        <ul>
                            {blueTeamNames.map((playerName, index) => (<li key={index}>{playerName}</li>))}
                        </ul>
                    </div>
                </div>
                <button className="startBtn" onClick={handleSubmit} disabled={!joined}>Submit</button>
            </div>
        </div>
    );
};

export default JoinGame;
