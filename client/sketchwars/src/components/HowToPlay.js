import React from "react";


const HowToPlay = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal howtoplay">
        <div className="header">
          <h2 id="title">How to play</h2>
          <button className="closeBtn" onClick={onClose}>X</button>
        </div>
        <p>Hey there, when your team and your name pop up, it's your time to shine as the artist!</p>
        <p>
          You'll spot a secret word on the screen, just for you.
          Get creative and draw something that hints at that word.
          Your teammates will put on their thinking caps to guess the word.
          If they nail it, give that 'Got it!' button a tap to score 1 point and move on to the next word!
          Drawn and guess as many words as you can before the time runs out </p>

        <p>If the word is too tricky, you can always hit 'Pass' to skip to the next word.</p>
        <p>P.S. If it's not your team's turn, maybe keep your guesses to yourself untill the time is up!</p>
      </div>
    </div>
  );
};

export default HowToPlay;
