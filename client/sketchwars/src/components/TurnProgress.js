import React from 'react';
import './TurnProgress.css';

const TurnProgress = ({ words }) => {

    const markers = words.map((w, index) => <div className={w.guess} key={index}></div>)

    if (words.length > 10)
        return null

    return <div className='markers'>{markers}</div>;

}

export default TurnProgress
