import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import socket from "../socket";
import './NextPlayer.css';



const NextPlayer = ({ gameState }) => {

    if (!gameState)
        return "Loading..."

    const teamcolour = gameState.redTeam.includes
                    (gameState.currentPlayer)? "red-font" : "blue-font";

    const handleClick = () => {
        socket.emit("startDrawing")
    }

    return (
        <div className="modal-overlay">
            <div className="modal next-player">
                <h2 id="title">Ready up <span className={`${teamcolour}`}> {gameState.currentPlayer.toUpperCase()} </span> </h2>
                <p>it's your turn to draw!</p>
                {window.location.pathname.endsWith("tv") ? "" : <button onClick={handleClick}>GO!</button>}
            </div>
        </div>
    );

}

export default NextPlayer;