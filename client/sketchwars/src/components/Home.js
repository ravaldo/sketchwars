import React, { useState } from "react";
import { Link } from "react-router-dom";
import HostGame from "./HostGame";
import JoinGame from "./JoinGame";
import HowToPlay from "./HowToPlay";
import "./Home.css";

const Home = () => {
  const [showHostPopup, setShowHostPopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showHowToPlayPopup, setShowHowToPlayPopup] = useState(false);
  const [redTeamNames, setRedTeamNames] = useState([]);
  const [blueTeamNames, setBlueTeamNames] = useState([]);

  const handleHostGameClick = () => {
    setShowHostPopup(true);
  };

  const handleJoinGameClick = () => {
    setShowJoinPopup(true);
  };

  const handleHowToPlayClick = () => {
    setShowHowToPlayPopup(true);
  };

  const handleClosePopup = () => {
    setShowHostPopup(false);
    setShowJoinPopup(false);
    setShowHowToPlayPopup(false);
  };

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
      {showHostPopup && (
        <HostGame onClose={handleClosePopup} redTeamNames={redTeamNames} blueTeamNames={blueTeamNames} />
      )}
      {showJoinPopup && (
        <JoinGame
          onClose={handleClosePopup}
          redTeamNames={redTeamNames}
          setRedTeamNames={setRedTeamNames}
          blueTeamNames={blueTeamNames}
          setBlueTeamName={setBlueTeamNames}
        />
      )}
      {showHowToPlayPopup && <HowToPlay onClose={handleClosePopup} />}
      <Link to="/draw">DRAWING PAGE</Link>
      <br />
      <Link to="/tv">TV PAGE</Link>
    </div>
  );
};

export default Home;
