import React, { useState, useEffect } from 'react'
function Timer() {
  const [ display, setDisplay ] = useState("01:00")
  const [ totalTime, setTotalTime ] = useState(60)
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

const updateDisplay = (newTotalTime) => {
  let current = newTotalTime - secsFromInitialStart;
  let mins = (current / 60).toString().split('.')[0].padStart(2, '0');
  let secs = (current % 60).toString().padStart(2, '0');
  setDisplay(`${mins}:${secs}`);
};

  const add30Secs = () => {
  setTotalTime(totalTime +30)
  console.log(totalTime)
  updateDisplay(totalTime + 30)

}

const minus30Secs = () => {
  if (totalTime > 0)
  {setTotalTime(totalTime -30)}
  else
  {setTotalTime(totalTime)}
  console.log(totalTime)
  updateDisplay(totalTime - 30)

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
      <button className='-30'
      onClick={minus30Secs}>
      -30 secs
      </button>
      <button className='+30'
      onClick={add30Secs}>
      +30 secs
      </button>
    </div>
  )
}
export default Timer