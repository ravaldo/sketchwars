import React, { useState, useEffect } from 'react'
import "./Timer.css";


function Timer({ gameState, resetTimer }) {


  const [display, setDisplay] = useState('01:00');

  useEffect(() => {
    let interval;

    if (gameState) {
      if (gameState.status == "DRAWING" && !gameState.isPaused) {
        const startTime = Date.now();
        interval = setInterval(() => {
          const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          const remainingTime = Math.max(60 - elapsedTime, 0);
          const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
          const seconds = String(remainingTime % 60).padStart(2, '0');
          setDisplay(`${minutes}:${seconds}`);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }

    return () => clearInterval(interval);
  }, [gameState]);

  return <span className='timer'>{display}</span>;
}

export default Timer;
