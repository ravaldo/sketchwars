import React, { useState, useEffect } from "react";
import "./JoinGame.css";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import socket from '../socket';

const JoinGame = ({ onClose }) => {

    const [code, setCode] = useState("");
    const [numRounds, setNumRounds] = useState(1);
    const [drawTime, setDrawTime] = useState(60);
    const [wordsPerTurn, setWordsPerTurn] = useState(1);
    const [name, setName] = useState("");
    const [redTeam, setRedTeam] = useState([]);
    const [blueTeam, setBlueTeam] = useState([]);
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

    const handleNameChange = (event) => setName(event.target.value);
    const handleNumRoundsChange = (event, newValue) => setNumRounds(newValue);
    const handleDrawTimeChange = (event, newValue) => setDrawTime(newValue);
    const handleWordsPerTurnChange = (event, newValue) => setWordsPerTurn(newValue);

    const handleTeamAdd = (event) => {
        if (event.target.name == "red")
            setRedTeam([...redTeam, name]);
        if (event.target.name == "blue")
            setBlueTeam([...blueTeam, name]);
        setName("");
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
    ];

    const handleSubmit = () => {
        console.log("Submit");
    };


    useEffect(() => {
        const wordsPer = () => {
            if (wordsPerTurn == 1)
                return 5;
            if (wordsPerTurn == 2)
                return 10;
            if (wordsPerTurn == 3)
                return 999;
        }
        const settings = { code, numRounds, drawTime, wordsPer, redTeam, blueTeam }
        socket.emit('settings', settings);
    }, [numRounds, drawTime, wordsPerTurn, redTeam, blueTeam]);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <button className="closeBtn" onClick={onClose}>X</button>
                    <h2 className="title">Join Game</h2>
                </div>
                <div className="setting-row">
                    <h4>Enter code</h4>
                    <input
                        className="codeBox"
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                        disabled={joined}
                    />
                </div>
                <div className="setting-row">
                    <h4>Number of rounds</h4>
                    <Box className="slider">
                        <Slider
                            value={numRounds}
                            onChange={handleNumRoundsChange}
                            step={1}
                            marks={roundNumber}
                            min={1}
                            max={3}
                            disabled={!joined}
                        />
                    </Box>
                </div>
                <div className="setting-row">
                    <h4>Time per turn</h4>
                    <Box className="slider">
                        <Slider
                            value={drawTime}
                            onChange={handleDrawTimeChange}
                            step={30}
                            marks={time}
                            min={60}
                            max={120}
                            disabled={!joined}
                        />
                    </Box>
                </div>
                <div className="setting-row">
                    <h4>Max words per turn</h4>
                    <Box className="slider">
                        <Slider
                            value={wordsPerTurn}
                            onChange={handleWordsPerTurnChange}
                            step={1}
                            marks={turnWords}
                            min={1}
                            max={3}
                            disabled={!joined}
                        />
                    </Box>
                </div>
                <h3 className="teamHeading">Assign teams</h3>
                <div className="nameForm">
                    <button className="redBtn plusBtn" name="red" onClick={handleTeamAdd} disabled={!joined}>+</button>
                    <input
                        className="nameBox"
                        type="text"
                        placeholder="Player Name..."
                        value={name}
                        onChange={handleNameChange}
                        disabled={!joined}
                    />
                    <br />
                    <button className="blueBtn plusBtn" name="blue" onClick={handleTeamAdd} disabled={!joined}>+</button>
                </div>
                <div className="team-titles">
                    <h3 className="teamHeading redTeamTitle">Red Team</h3>
                    <h3 className="teamHeading blueTeamTitle">Blue Team</h3>
                </div>
                <div className="teams">
                    <div className="team-list">
                            <ul>
                                {redTeam.map((playerName, index) => (
                                    <li key={index}>{playerName}</li>
                                ))}
                            </ul>
                    </div>
                    <div className="team-list">
                            <ul>
                                {blueTeam.map((playerName, index) => (
                                    <li key={index}>{playerName}</li>
                                ))}
                            </ul>
                    </div>
                </div>
                <button className="startBtn" onClick={handleSubmit}>START</button>
            </div>
        </div>
    );
};

export default JoinGame;
