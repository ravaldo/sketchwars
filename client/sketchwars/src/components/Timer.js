import React, { useState, useEffect, useRef } from 'react'
import "./Timer.css";


function Timer({ gameState }) {

    const [display, setDisplay] = useState('00:00');
    const [timeLeft, setTimeLeft] = useState(null);
    const pauseRef = useRef(null)
    const startedRef = useRef(false)

    const timerCallback = () => {
        if (!pauseRef.current) {
            setTimeLeft((prevTime) => {
                const newTime = prevTime - 1;
                updateDisplay(newTime);
                if (newTime > 0)
                    setTimeout(timerCallback, 1000);
                return newTime;
            });
        }
        else
            setTimeout(timerCallback, 1000);
    };

    const updateDisplay = (timeLeft) => {
        const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const seconds = String(timeLeft % 60).padStart(2, '0');
        setDisplay(`${minutes}:${seconds}`);
    }

    useEffect(() => {
        if (gameState?.drawTimeLeft >= 0) {
            setTimeLeft(gameState.drawTimeLeft)
            pauseRef.current = gameState.isPaused;

            if (gameState.status == "DRAWING" && !startedRef.current) {
                setTimeout(timerCallback, 1000);
                startedRef.current = true;
            }
        }
    }, [gameState])

    return <span className='timer'>{display}</span>;
}

export default Timer;
