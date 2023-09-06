import React, { useState } from 'react'
import Score from './Score';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import './Results.css';

const Results = () => {

    const gameState = null
    const [index, setIndex] = useState(0);

    const slides = [
      require("../images/stockDrawing.jpeg"),
      require("../images/Doodling.jpg"),
      require("../images/stockDrawing.jpeg"),
      require("../images/Doodling.jpg"),
      require("../images/stockDrawing.jpeg")
    ]
  
    const next = () => setIndex(index === slides.length - 1 ? 0 : index + 1);
    const prev = () => setIndex(index === 0 ? slides.length - 1 : index - 1);


    return (
        <div className="results">
            <div className="topbar">
                <h1 id="winner">Red Team Wins!</h1>
                <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
            </div>

            <div className='picturesContainer'>
                <FaArrowAltCircleLeft className='left-arrow' onClick={prev} />
                <img src={slides[index]} />
                <FaArrowAltCircleRight className='right-arrow' onClick={next} />
            </div>

            <div className='details'>
                <h2>"Cambuslang"</h2>
                <h2 style={{ color: 'red' }}>Randolph</h2>
            </div>

        </div>
    );
}

export default Results