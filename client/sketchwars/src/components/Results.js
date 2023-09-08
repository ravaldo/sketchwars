import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Score from './Score';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import './Results.css';

const Results = () => {

    const gameCode = useParams().gameCode.toUpperCase();

    const [index, setIndex] = useState(0);
    const [results, setResults] = useState(null);
    const [gameState, setGameState] = useState(null);

    const [slides, setSlides] = useState(null);

    const { protocol, host } = window.location;
    const domain = host.replace(/:\d{4}$/, "");

    const picsUrl = `${protocol}://${domain}:9000/api/pics/${gameCode}`;
    const stateUrl = `${protocol}://${domain}:9000/api/game/${gameCode}`;

    async function fetchResults() {
        try {
            const response = await fetch(picsUrl)
            if (!response.ok)
                throw new Error(`Fetch failed with status ${response.status}`);

            const data = await response.json();
            setResults([...data])

            const decodedImages = data.map(item => {
                const imageBytes = atob(item.imageData);
                const imageArray = new Uint8Array(imageBytes.length);
                for (let i = 0; i < imageBytes.length; i++) {
                    imageArray[i] = imageBytes.charCodeAt(i);
                }
                return new Blob([imageArray], { type: 'image/png' }); // Adjust the type as needed
            });

            setSlides([...decodedImages])

            const state = await fetch(stateUrl)
                .then(res => res.json())
                .then(data => setGameState(data))

        } catch (error) {
            console.error('Error fetching image data:', error);
            throw error;
        }
    }

    useEffect(() => {
        fetchResults()
    }, [])

    const next = () => setIndex(index === slides.length - 1 ? 0 : index + 1);
    const prev = () => setIndex(index === 0 ? slides.length - 1 : index - 1);

    if (!results)
        return "Loading"


    return (
        <div className="results">
            <div className="topbar">
                <h1 id="winner">Red Team Wins!</h1>
                <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
            </div>

            <div className='picturesContainer'>
                <FaArrowAltCircleLeft className='left-arrow' onClick={prev} />
                <img src={slides[index]} />
                <FaArrowAltCircleRight className='right-arrow' onClick={next} />
            </div>

            <div className='details'>
                <h2>results[index].word</h2>
                <h2 style={{ color: `${results[index].colour}` }}>results[index].player</h2>
            </div>

        </div>
    );
}

export default Results