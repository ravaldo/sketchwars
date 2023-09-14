import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { api_url } from "../api";
import "./JoinGame.css";


import socket from '../socket';

const JoinGame = ({ onClose }) => {

    const navigate = useNavigate();

    const roundNumber = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
    ];
    const turnWords = [
        { value: 0, label: "5" },
        { value: 1, label: "10" },
        { value: 2, label: "∞" },
    ];
    const time = [
        { value: 120, label: "2" },
        { value: 150, label: "2.5" },
        { value: 180, label: "3" },
    ];

    const [code, setCode] = useState("");
    const [numRounds, setNumRounds] = useState(1);
    const [drawTime, setDrawTime] = useState(time[0].value);
    const [wordsPerTurn, setWordsPerTurn] = useState(0);
    const [name, setName] = useState("");
    const [redTeam, setRedTeam] = useState(["alice", "bob"]);
    const [blueTeam, setBlueTeam] = useState(["charlie", "david"]);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (joined && e.key === 'Enter')
                handleSubmit();
        };
        document.addEventListener('keypress', handleKeyPress);

        if (joined) {
            // lets check if the user is rejoining an in-progress game
            const status = fetch(`${api_url}/api/games/${code}`)
                .then(res => res.json())
                .then(gameState => {
                    if (gameState.status !== "SETUP")
                        navigate('/draw/' + code);
                });
        }

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, [joined]);

    useEffect(() => {
        const wpt = [5, 10, 99][wordsPerTurn];
        const settings = { code, numRounds, drawTime, wordsPerTurn: wpt, redTeam, blueTeam }
        socket.emit('settings', settings);
    }, [numRounds, drawTime, wordsPerTurn, redTeam, blueTeam, joined]);

    const handleCodeChange = (event) => {
        const newCode = event.target.value.toUpperCase();
        setCode(newCode);
        // state setters are asynchronous, so emit the newCode 
        // and not the state which could be lagging behind
        socket.emit('joinGame', newCode, 'Tablet', success => {
            setJoined(success);
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

    const handleSubmit = () => {
        if (redTeam.length >= 2 && blueTeam.length >= 2) {
            socket.emit('startGame');
            navigate('/draw/' + code);
        }
        else
            console.log("Need at least 2 players on each team")
    };

    return (
        <div className="modal-overlay joingame">
            <div className="modal">
                <div className="header">
                    <h2 id="title">Join Game</h2>
                    <button className="closeBtn" onClick={onClose}>X</button>
                </div>
                <div className="setting-row">
                    <label>TV code</label>
                    <input
                        className="codeBox"
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                        disabled={joined}
                        autoFocus
                    />
                </div>
                <div className="setting-row">
                    <label>Number of rounds</label>
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
                    <label>Time per turn</label>
                    <Box className="slider">
                        <Slider
                            value={drawTime}
                            onChange={handleDrawTimeChange}
                            step={30}
                            marks={time}
                            min={time[0].value}
                            max={time[2].value}
                            disabled={!joined}
                        />
                    </Box>
                </div>
                <div className="setting-row">
                    <label>Max words per turn</label>
                    <Box className="slider">
                        <Slider
                            value={wordsPerTurn}
                            onChange={handleWordsPerTurnChange}
                            step={1}
                            marks={turnWords}
                            min={0}
                            max={2}
                            disabled={!joined}
                        />
                    </Box>
                </div>
                <h3 className="teamHeading">Assign teams</h3>
                <div className="input-row">
                    <button className="plusBtn red-bg" name="red" onClick={handleTeamAdd} disabled={!joined}>+</button>
                    <input
                        className="nameBox"
                        type="text"
                        placeholder="Player Name..."
                        value={name}
                        onChange={handleNameChange}
                        disabled={!joined}
                    />
                    <button className="plusBtn blue-bg" name="blue" onClick={handleTeamAdd} disabled={!joined}>+</button>
                </div>

                <div className="grid-container">
                    <div className="red-column">
                        <h3 className="red-font">Red Team</h3>
                        {redTeam.map((playerName, index) =>
                            <p key={index}>
                                <span>{playerName}</span>
                                <span onClick={() => { setRedTeam(redTeam.filter((name) => name != playerName)) }}>X</span>
                            </p>
                        )}
                    </div>
                    <div className="blue-column">
                        <h3 className="blue-font">Blue Team</h3>
                        {blueTeam.map((playerName, index) =>
                            <p key={index}>
                                <span>{playerName}</span>
                                <span onClick={() => { setBlueTeam(blueTeam.filter((name) => name != playerName)) }}>X</span>
                            </p>
                        )}
                    </div>
                </div>
                <button className="startBtn" onClick={handleSubmit}>START</button>
            </div>
        </div>
    );
};

export default JoinGame;
