import React, { useState } from "react";
import "./Scoreboard.css";

const Scoreboard = () => {
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);

  const handleRedTeamScoreChange = () => {
    setRedTeamScore(redTeamScore + 1);
  };

  const handleBlueTeamScoreChange = () => {
    setBlueTeamScore(blueTeamScore + 1);
  };

  return (
    <div className="scores-container">
      <div className="team-names">
        <div className="team">
          <div className="score red-score">{redTeamScore}</div>
        </div>
        <div className="team">
          <div className="score blue-score">{blueTeamScore}</div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
