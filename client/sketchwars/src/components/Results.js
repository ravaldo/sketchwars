import React, { useState } from 'react'
import Score from './Score';
import './Results.css';

const Results = () => {

    const gameState = null

    const [name, setName] = useState('')
    const [word, setWord] = useState('')
    const [img, setImg] = useState('')


    return (
        <div className="results">
            <div className="topbar">
                <h1 id="winner">Red Team Wins!</h1>
                <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
            </div>

            <div className='picturesContainer'>
                <img src={require("../images/stockDrawing.jpeg")} alt=''></img>
            </div>

            <div className='details'>
                <h2>"Cambuslang"</h2>
                <h2 style={{ color: 'red' }}>Randolph</h2>
            </div>

        </div>
    );
}

export default Results