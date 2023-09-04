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
                <div id="carouselExample" class="carousel slide">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                        <img src={require("../images/stockDrawing.jpeg")}  class="d-block w-100" alt="pic1"/>
                        </div>
                        <div class="carousel-item">
                        <img src={require("../images/stockDrawing.jpeg")}  class="d-block w-100" alt="pic2"/>
                        </div>
                        <div class="carousel-item">
                        <img src={require("../images/stockDrawing.jpeg")}   class="d-block w-100" alt="pic3"/>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                    </div>
                </div>
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