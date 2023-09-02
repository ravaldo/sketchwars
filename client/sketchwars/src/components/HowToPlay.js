import React from "react";
// import './HowToPlay.css';

const HowToPlay = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Your modal content */}
      
        <h2>How to play</h2>
        <ul>
          <li>Hey there, when your team and your name pop up, it's your time to shine as the artist!</li>
          <li>You'll spot a secret word on the screen, just for you</li>
          <li>Get creative and draw something that hints at that word</li>
          <li>Your fantastic teammates will put on their thinking caps to guess the word</li>
          <li>If they nail it, give that 'Got it!' button a tap to score 1 point and move on to the next word!</li>
          <li>Your mission? Guess as many words as you can before the time runs out</li>
          <li> And remember, if the word is too tricky, you can always hit 'pass' to skip to the next word</li>
          <li>(P.S. If it's not your team's turn, maybe keep your guesses to yourself for now!)</li>
        </ul>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default HowToPlay;
