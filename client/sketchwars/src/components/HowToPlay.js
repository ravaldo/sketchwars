import React from "react";


const HowToPlay = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal howtoplay">
        <div className="header">
          <h2 id="title">How to play</h2>
          <button className="closeBtn" onClick={onClose}>X</button>
        </div>
        <p>Gather your friends and divide into two teams, each with 3 to 5 players.
          You'll need two devices: one with a big screen that everyone can see and also a tablet.</p>
        <p>In each round, one player becomes the artist and gets their hands on the tablet. They'll
          be shown a secret word and their task is to draw it. The catch? The drawing will appear
          on the big screen, and everyone on their team must guess what the word is based on the drawing.</p>
        <p>When your team shouts out the correct answer, it's time to hit that 'GOT IT' button on the
          tablet, and your team will score a point! If the word is a bit too tricky, no worries – you can
          hit 'pass' and move on to the next one.</p>
        <p>The goal is to draw and guess as many words as possible before the time runs out.</p>

      </div>
    </div>
  );
};

export default HowToPlay;
