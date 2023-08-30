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

    function menuSelectSFX() {
        new Audio(menuSelectSound).play()
    }
    function closePopUpSFX() {
        new Audio(closePopUpSound).play()
    }



    const handleHostGameClick = () => {
        setShowHostPopup(true);
        menuSelectSFX()
    }

    const handleJoinGameClick = () => {
        setShowJoinPopup(true);
        menuSelectSFX()
    }

    const handleHowToPlayClick = () => {
      setShowHowToPlayPopup(true);
      menuSelectSFX()
    }

    const handleClosePopup = () => {
        setShowHostPopup(false);
        setShowJoinPopup(false);
        setShowHowToPlayPopup(false);
        closePopUpSFX() 

    }


    return (
        <div className="container">
            <h1>PictoMania</h1>
            <ul>
                <li>
                    <p onClick={handleHostGameClick}>host game</p>
                </li>
                <li>
                    <p onClick={handleJoinGameClick}>join game</p>
                </li>
                <li>
                    <p onClick={handleHowToPlayClick}>how to play</p>
                </li>
            </ul>
            {showHostPopup && <HostGame onClose={handleClosePopup}/>} 
            {showJoinPopup && <JoinGame onClose={handleClosePopup}/>}
            {showHowToPlayPopup && <HowToPlay onClose={handleClosePopup}/>}
            <Link to='/draw'>DRAWING PAGE</Link><br/>
            <Link to='/tv'>TV PAGE</Link>
        </div>
    );
};

export default Home;
