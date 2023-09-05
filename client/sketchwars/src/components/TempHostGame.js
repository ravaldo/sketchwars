import React, { useState } from "react";
import "./HostGame.css";

const HostGame = ({ redTeamNames, blueTeamNames }) => {


    return (
        <div className="modal-overlay host-game-container">
            <div className="modal">
                <h2>Choose your teams and hit start</h2>
                <div className="teams">
                    <div className="team-list">
                        <h4 id='red'>Red Team</h4>
                        <ul>
                            {redTeamNames.map((playerName, index) => (
                                <li key={index}>{playerName}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="team-list">
                        <h4 id='blue'>Blue Team</h4>
                        <ul>
                            {blueTeamNames.map((playerName, index) => (
                                <li key={index}>{playerName}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostGame;
