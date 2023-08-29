import React from 'react'

const JoinGame = ({onClose}) => {
  return (
    <div>
        <p>This is the join game pop up</p>
        <button onClick={onClose}>X</button>
    </div>
  )
}

export default JoinGame