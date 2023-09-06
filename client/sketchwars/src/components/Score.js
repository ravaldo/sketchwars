import React, { useState } from "react";
import Results from "./Results";
import './Score.css';

const Score = ( {redScore, blueScore} ) => {

  return (
    <div className="scores">
        <div className="team red-bg"><span>{redScore}</span></div>
        <div className="team blue-bg"><span>{blueScore}</span></div>
    </div>
  );
};

export default Score;
