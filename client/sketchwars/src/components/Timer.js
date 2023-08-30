import React, { useState, useEffect } from 'react'

function Timer() {

  const [ display, setDisplay ] = useState("")
  const [ totalTime, setTotalTime ] = useState(10)
  const [secsFromInitialStart, setSecsFromInitialStart] = useState(0)
  const [ clock, setClock ] = useState()
  const [ clockPaused, setClockPaused ] = useState(false)


  const startClockFn = () => {
    const start = new Date()
    let secsFromLastPaused = 0
    if(clockPaused) {
      secsFromLastPaused += secsFromInitialStart
      setClockPaused(false)
    }

    setClock(setInterval(() => {   
      let current 
      current = Number(((new Date() - start) / 1000).toFixed())
      current += secsFromLastPaused
      setSecsFromInitialStart(current)
      current = totalTime - current
      let mins = (current / 60).toString().split(".")[0].padStart(2, "0")
      let secs = (current % 60).toString().padStart(2, "0")
      setDisplay(`${mins}:${secs}`)
    }, 1000))
}

useEffect(() => {
  if(Number(secsFromInitialStart) === Number(totalTime)) {
    stopClockFn()
  }
}, [secsFromInitialStart])

const stopClockFn = () => {
  clearInterval(clock)
}

const pauseClockFn = () => {
  setClockPaused(true)
  clearInterval(clock)
}

const setTimer = (event) => {
    console.log(typeof event.nativeEvent.data)
    // const displayCopy = display
    let newDisplay = display + event.nativeEvent.data
  setDisplay(newDisplay)
  let newTotalTime = newDisplay.charAt(3) + newDisplay.charAt(4)
  setTotalTime(Number(newTotalTime))
}

return (
    <div style={{ textAlign: 'center' }}>
      <h1>{display}</h1>
      <button onClick={startClockFn}>
        Start
      </button>
      &#8287;
      <button onClick={pauseClockFn}>
        Pause
      </button>
      <input onChange={setTimer}/>
    </div>
  )
}
export default Timer