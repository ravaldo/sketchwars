import React, {useState} from 'react'
import './Results.css';
import Scoreboard from './Scoreboard';
import SwipeableViews from 'react-swipeable-views';


const Results = () => {

    const [name, setName] = useState('')
    const [word, setWord] = useState('')
    const [img, setImg] = useState('')

    const styles = {
        slide: {
        //   padding: 15,
        //   minHeight: 100,
        //   color: '#fff',
        }
      };

    return (
        <>
        <div className = "results results-page-body">
            <div className="results-container">
                <h1 className='winningTeam'>Red Team wins!</h1>
                <div className='scoreboard'></div>
                <Scoreboard/>
            </div>
            <div className='picturesContainer'>
            <SwipeableViews enableMouseEvents>
            <div style={Object.assign({}, styles.slide, styles.slide1)}>
            <img src={require("../images/stockDrawing.jpeg")}  alt=''></img>
            </div>
            <div style={Object.assign({}, styles.slide, styles.slide1)}>
            <img src={require("../images/futuristicCities.webp")}  alt=''></img>
            </div>
            <div style={Object.assign({}, styles.slide, styles.slide1)}>
            <img src={require("../images/stockDrawing.jpeg")}  alt=''></img>
            </div>
            </SwipeableViews>
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