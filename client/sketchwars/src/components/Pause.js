import React from 'react'
import socket from "../socket";

const Pause = ( ) => {

    const handleClick = () => socket.emit("unpause");

    return (
        <div className="modal-overlay">
            <div className="modal next-player">
                <h2 id="title">Paused</h2>
                <p>hit the button to get back to drawing</p>
                <button onClick={handleClick}>Back</button>
            </div>
        </div>
    );

}

export default Pause