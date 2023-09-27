import React, { useEffect, useState } from 'react';
import './FadingWord.css';

const FadingWord = ({ word }) => {

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timeout = setTimeout(() => setIsVisible(false), 2000);
        return () => clearTimeout(timeout);
    }, [word])


    return (
        <div className={`fading-word ${isVisible ? '' : 'hidden'}`}>
            {word}
        </div>
    );

}

export default FadingWord
