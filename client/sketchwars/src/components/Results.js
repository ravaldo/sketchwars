import React, {useState} from 'react'
import './Results.css';
import Scoreboard from './Scoreboard';


const Results = () => {

    const [name, setName] = useState('')
    const [word, setWord] = useState('')
    const [img, setImg] = useState('')

    return (
        <>
        <div className = "results results-page-body">
            <div className="results-container">
                <h1 className='winningTeam'>Red Team wins!</h1>
                <div className='scoreboard'></div>
                <Scoreboard/>
            </div>
            <div className='picturesContainer'>
                
                <div className='nameAndDrawing'>
                    <h5>Cambuslang</h5>
                    <h5 style={{ color: 'red' }}>Randolph</h5>
                </div>
            </div>
        </div>
        </>
    );
}

export default Results