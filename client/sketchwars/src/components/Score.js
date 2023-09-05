import React, { useState } from "react";
import Results from "./Results";
import './Score.css';

const Score = ( {redScore, blueScore} ) => {

  return (
    <div className="scores">
        <div className="team red"><span>{redScore}</span></div>
        <div className="team blue"><span>{blueScore}</span></div>
    </div>
  );
};

export default Score;
