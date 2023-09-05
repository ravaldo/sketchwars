import React, { useState } from "react";
import { Link } from "react-router-dom";
import HostGame from "./TV_Setup";
import JoinGame from "./JoinGame";
import HowToPlay from "./HowToPlay";
import "./Home.css";
import './modal.css';
import menuSelectSound from "../sounds/menuSelectSound.mp3";
import closePopUpSound from "../sounds/closePopUpSound.mp3";

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

    const handleTVClick = () => {
        setShowHostPopup(true);
        playMenuSelectSound();
    };

    const handleTabletClick = () => {
        setShowJoinPopup(true);
        playMenuSelectSound();
    };

    const handleHowToPlayClick = () => {
        setShowHowToPlayPopup(true);
        playMenuSelectSound();
    };

    const handleClosePopup = () => {
        setShowHostPopup(false);
        setShowJoinPopup(false);
        setShowHowToPlayPopup(false);
        playclosePopUpSound();
    };

    return (
        <div className="home">
            <h1>SketchWars</h1>
            <h2>Select Your Device</h2>
            <div className="images">
                <Link to="/tv"> <img id="tvImage" alt="TV Image" src={require("../images/tv.png")} /></Link>
                <img id="tabletImage" alt="Tablet Image" onClick={handleTabletClick} src={require("../images/tablet.png")} />
            </div>
            <h2 id="howtoplay" onClick={handleHowToPlayClick}>how to play</h2>
            {showHostPopup && <HostGame onClose={handleClosePopup} />}
            {showJoinPopup && <JoinGame onClose={handleClosePopup} />}
            {showHowToPlayPopup && <HowToPlay onClose={handleClosePopup} />}
        </div>
    );
};

export default Home;
