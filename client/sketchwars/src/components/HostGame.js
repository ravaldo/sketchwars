import React, { useState } from 'react';

const HostGame = ({ onClose }) => {
  return (
    <div>
      <p>This is the host game pop up</p>
      <button onClick={onClose}>X</button>
    </div>
  );
};

export default HostGame;
