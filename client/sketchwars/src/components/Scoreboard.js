import React, { useState } from "react";
import "./Scoreboard.css";


const Scoreboard = ({

}) => {
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);

  const handleRedTeamScoreChange = () => {
    setRedTeamScore(redTeamScore + 1);
  };

  const handleBlueTeamScoreChange = () => {
    setBlueTeamScore(blueTeamScore + 1);
  };

  return (
    <>
      <div className="scores-container">
        <div className="team-names">
          <div className="team">
            <h3>Red Team</h3>
            <div className="score red-score">{redTeamScore}</div>
          </div>
          <div className="team">
            <h4>Blue Team</h4>
            <div className="score blue-score">{blueTeamScore}</div>
          </div>
        </div>
        <div className="scores">
        </div>
      </div>
    </>
  );  
};

export default Scoreboard;