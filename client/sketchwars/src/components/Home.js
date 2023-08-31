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
                <img className='tvImage' onClick={handleHostGameClick} src={require("../images/tv.png")}/>
                <img className='tabletImage' onClick={handleJoinGameClick} src={require("../images/tablet.png")}/>   
            </div>
            <div className="links">
                    <p onClick={handleHowToPlayClick}>how to play</p>
                </div>
            {showHostPopup && <HostGame onClose={handleClosePopup}/>} 
            {showJoinPopup && <JoinGame onClose={handleClosePopup}/>}
            {showHowToPlayPopup && <HowToPlay onClose={handleClosePopup}/>}
        </div>
        </>
    );
    
};

export default Home;
