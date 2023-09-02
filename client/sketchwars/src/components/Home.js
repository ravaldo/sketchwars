import React, { useState } from "react";
import { Link } from 'react-router-dom';
import HostGame from "./HostGame";
import JoinGame from "./JoinGame";
import HowToPlay from "./HowToPlay";
import './Home.css';
import menuSelectSound from '../sounds/menuSelectSound.mp3'
import closePopUpSound from '../sounds/closePopUpSound.mp3'

const Home = () => {

    const [showHostPopup, setShowHostPopup] = useState(false);
    const [showJoinPopup, setShowJoinPopup] = useState(false);
    const [showHowToPlayPopup, setShowHowToPlayPopup] = useState(false);


    const [redTeamNames, setRedTeamNames] = useState([]);
    const [blueTeamNames, setBlueTeamNames] = useState([]);


    const menuSelectSoundEffect = new Audio(menuSelectSound);
    function playMenuSelectSound() {
        menuSelectSoundEffect.play();
    }

    const closePopUpSoundEffect = new Audio(closePopUpSound);
    function playclosePopUpSound() {
        closePopUpSoundEffect.play();
    }

    const handleHostGameClick = () => {
        setShowHostPopup(true);
        playMenuSelectSound()
    }

    const handleJoinGameClick = () => {
        setShowJoinPopup(true);
        playMenuSelectSound()
    }

    const handleHowToPlayClick = () => {
        setShowHowToPlayPopup(true);
        playMenuSelectSound()
    }

    const handleClosePopup = () => {
        setShowHostPopup(false);
        setShowJoinPopup(false);
        setShowHowToPlayPopup(false);
        playclosePopUpSound()

    }

    return (
        <>
            <div className="container">
                <h1>PictoMania</h1>
                <h2>Select Your Device</h2>
                <div className="content">
                    {/* temporarily bypassed the pop-up. still want that to display a code and then go to canvas when tablet joins */}
                    {/* <img className='tvImage' onClick={handleHostGameClick} src={require("../images/tv.png")}/> */}
                    <Link to='/TV'> <img className='tvImage' src={require("../images/tv.png")} /> </Link>
                    <img className='tabletImage' onClick={handleJoinGameClick} src={require("../images/tablet.png")} />
                </div>
                <div className="links">
                    <p onClick={handleHowToPlayClick}>how to play</p>
                </div>
                {showHostPopup && (
                    <HostGame onClose={handleClosePopup} redTeamNames={redTeamNames} blueTeamNames={blueTeamNames} />)}
                {showJoinPopup && (
                    <JoinGame
                        onClose={handleClosePopup}
                        redTeamNames={redTeamNames}
                        setRedTeamNames={setRedTeamNames}
                        blueTeamNames={blueTeamNames}
                        setBlueTeamName={setBlueTeamNames}
                    />)}
                {showHowToPlayPopup && <HowToPlay onClose={handleClosePopup} />}
                <Link to="/draw">DRAWING PAGE</Link>
            </div>
        </>
    );

};

export default Home;
