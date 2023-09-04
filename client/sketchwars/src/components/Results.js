import React, {useState} from 'react'
import './Results.css';
import Scoreboard from './Scoreboard';

const Results = () => {

    const [name, setName] = useState('')
    const [word, setWord] = useState('')
    const [img, setImg] = useState('')

    return (
        <>
        <div className = "results-page-body">
            <div className="results-container">
                <h1 className='winningTeam'>Red Team wins!</h1>
                <div className='scoreboard'></div>
                <Scoreboard/>
            </div>
            <div className='picturesContainer'>
                <div className='picture'>
                    <img src={require("../images/stockDrawing.jpeg")}></img>
                </div>
                <div className='nameAndDrawing'>
                    <p>Cambuslang</p>
                    <p>Leslie</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default Results