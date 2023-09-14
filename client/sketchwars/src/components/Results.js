import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { api_url } from "../api";
import Score from './Score';


import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import './Results.css';

const Results = () => {

    const gameCode = useParams().gameCode.toUpperCase();
    const [gameState, setGameState] = useState(null);

    const [index, setIndex] = useState(0);
    const [results, setResults] = useState(null);

    const stateUrl = `${api_url}/api/games/${gameCode}`;
    const picsUrl  = `${api_url}/api/games/${gameCode}/images`;


    async function fetchResults() {
        try {
            const response = await fetch(picsUrl)
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Fetch failed with status ${response.status}`);
                    return response
                })
                .then(response => response.json())
                .then(data => {
                    if (!Array.isArray(data))
                        throw new Error(`did not get an array from fetch`);
                    setResults(data)
                })

            const state = await fetch(stateUrl)
                .then(response => response.json())
                .then(data => setGameState(data))
        } catch (error) {
            console.error('Error fetching image data:', error);
            throw error;
        }
    }

    useEffect(() => {
        fetchResults()
    }, [])

    const next = () => setIndex(index === results.length - 1 ? 0 : index + 1);
    const prev = () => setIndex(index === 0 ? results.length - 1 : index - 1);

    if (!results || !gameState)
        return "Loading"

    return (
        <div className="results">
            <div className="topbar">
                <h1 id="winner">
                    {gameState.redScore == gameState.blueScore ? "It's a draw!" : ""}
                    {gameState.redScore > gameState.blueScore ? "Red Team wins!" : ""}
                    {gameState.redScore < gameState.blueScore ? "Blue Team wins!" : ""}
                </h1>
                <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
            </div>

            {results.length > 0 ? (
                <>
                    <div className='picturesContainer'>
                        <FaArrowAltCircleLeft className='left-arrow' onClick={prev} />
                        <img src={results[index].imageData} />
                        <FaArrowAltCircleRight className='right-arrow' onClick={next} />
                    </div>
                    <div className='details'>
                        <h2>{results[index].word}</h2>
                        <h2 style={{ color: `${results[index].colour}` }}>{results[index].player}</h2>
                    </div>
                </>
            ) : (
                <div className='details'>
                    <h2>No results to show</h2>
                </div>
            )}

        </div>
    );
}

export default Results