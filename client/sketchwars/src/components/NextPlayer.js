import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import socket from "../socket";
import './NextPlayer.css';



const NextPlayer = ({ gamestate, goCallBack }) => {

    const teamcolour = gamestate.redTeam.includes
                    (gamestate.currentPlayer)? "red-font" : "blue-font";

    const handleClick = () => {
        goCallBack("start")
    }

    return (
        <div className="modal-overlay">
            <div className="modal next-player">
                <h2 id="title">Ready up <span className={`${teamcolour}`}>    {gamestate ? gamestate.currentPlayer.toUpperCase() : "ANON"}   </span> </h2>
                <p>it's your turn to draw!</p>
                <button onClick={handleClick}>GO!</button>
            </div>
        </div>
    );

}

export default NextPlayer;