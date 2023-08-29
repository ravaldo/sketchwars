import React, { useState } from "react";
import { Link } from 'react-router-dom';
import HostGame from "./HostGame";
import JoinGame from "./JoinGame";

const Home = () => {

    const [showHostPopup, setShowHostPopup] = useState(false);
    const [showJoinPopup, setShowJoinPopup] = useState(false);


    const handleHostGameClick = () => {
      setShowHostPopup(true);
    }

    const handleClosePopup = () => {
        setShowHostPopup(false);
        setShowJoinPopup(false);
    }

    const handleJoinGameClick = () => {
        setShowJoinPopup(true);
    }

  return (
    <>
      <h1>PictoMania</h1>
      <ul>
        <li>
          <p onClick={handleHostGameClick}>host game</p>
        </li>
        <li>
          <p onClick={handleJoinGameClick}>join game</p>
        </li>
        <li>
          <p>how to play</p>
        </li>
      </ul>
      {showHostPopup && <HostGame onClose={handleClosePopup}/>} 
      {showJoinPopup && <JoinGame onClose={handleClosePopup}/>}
      <Link to='/draw'>DRAWING PAGE</Link><br/>
      <Link to='/tv'>TV PAGE</Link>
    </>
  );
};

export default Home;
