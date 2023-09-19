import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fabric } from "fabric";
import DrawingTools from "./DrawingTools";
import Timer from "./Timer";
import Score from "./Score";
import LoadingAnimation from "./LoadingAnimation";
import Pause from "./Pause";
import "./Tablet.css";

import socket from "../socket";
import NextPlayer from "./NextPlayer";

const Tablet = ({ }) => {

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [ctxData, setCtxData] = useState([]);

  const gameCode = useParams().gameCode.toUpperCase();

  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [gameState, setGameState] = useState(null);
  const [useRealTime, setRealTime] = useState(true);

  const debug = process.env.NODE_ENV !== "production" && true;

  useEffect(() => {
    socket.on('gameState', (data) => setGameState(data));

    // coming from the JoinGame component the socket is already assigned to a game
    // the below emit handles the scenario when the browser is refreshed
    // or the user types a game url directly into the address bar
    if (!gameState)
      socket.emit('joinGame', gameCode, 'Tablet', _ => { })

    return () => {
      socket.off('gameState');
      console.log("Tablet socket cleanup performed")
    };
  }, []);

  // initialise canvas only once
  useEffect(() => {
    if (gameState && !fabricRef.current) {
      console.log("Tablet canvas initialised")
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        backgroundColor: "#eee",
        selection: false
      });
      handleResize();
      setFabricListeners();
      setBrushSize("smallBrush");
      window.addEventListener("resize", handleResize);
    }
  }, [gameState]);

  // clear canvas when it's a new turn
  useEffect(() => clearCanvas(), [gameState?.currentPlayer])

  // cleanup canvas on unmount
  useEffect(() => {
    return () => {
      if (fabricRef.current) {
        window.removeEventListener("resize", handleResize);
        fabricRef.current.dispose();
        console.log("Tablet canvas cleanup performed")
      }
    };
  }, []);

  useEffect(() => {
    if (fabricRef.current)
      setFabricListeners();
  }, [useRealTime]);

  const setFabricListeners = () => {
    const canvas = fabricRef.current;

    // remove all event listeners
    canvas.__eventListeners = {};

    // set to draw via base64 encoded PNGs
    if (!useRealTime) {
      canvas.on("object:added", () => {
        const imageData = canvas.toDataURL();
        socket.emit('newImageData', imageData);
      });
    }

    // set to draw via remote controlled context
    else {
      let isDrawing = false;

      canvas.on('mouse:down', (e) => {
        isDrawing = true;
        const x = Math.floor(canvas.getPointer(e).x)
        const y = Math.floor(canvas.getPointer(e).y)
        setCtxData(_ => {
          const newData = [{ x, y }, { x, y }] // insert start point twice so we can draw dots 
          socket.emit("newContextData", {
            points: newData,
            colour: canvas.freeDrawingBrush.color,
            width: canvas.freeDrawingBrush.width
          })
          return newData;
        });
      });

      canvas.on('mouse:move', (e) => {
        if (isDrawing) {
          const x = Math.floor(canvas.getPointer(e).x)
          const y = Math.floor(canvas.getPointer(e).y)
          setCtxData(prevData => {
            const newData = [...prevData, { x, y }]
            socket.emit("newContextData", {
              points: newData,
              colour: canvas.freeDrawingBrush.color,
              width: canvas.freeDrawingBrush.width
            })
            return newData;
          });
        }
      });

      canvas.on('mouse:up', () => isDrawing = false);
    }
  }

  const handleResize = () => {
    if (fabricRef.current) {
      fabricRef.current.setWidth(window.innerWidth * 0.95);
      const topbarElement = document.querySelector('div.topbar')
      const toolsElement = document.querySelector('div.toolbar')
      if (topbarElement && toolsElement) {
        const height = (window.innerHeight - topbarElement.scrollHeight - toolsElement.scrollHeight);
        fabricRef.current.setHeight(height);
      }
      sendTabletDimensions();
    }
  }

  const sendTabletDimensions = () => {
    socket.emit("tabletDimensions", {
      fabricWidth: fabricRef.current.width,
      fabricHeight: fabricRef.current.height,
      canvasWidth: canvasRef.current.width,
      canvasHeight: canvasRef.current.height,
      dpr: window.devicePixelRatio
    })
  }

  const setBrushColour = (value) => {
    fabricRef.current.freeDrawingBrush.color = value;
  }

  const setBrushSize = (value) => {
    if (value === "smallBrush")
      fabricRef.current.freeDrawingBrush.width = 4;
    if (value === "mediumBrush")
      fabricRef.current.freeDrawingBrush.width = 16;
    if (value === "largeBrush")
      fabricRef.current.freeDrawingBrush.width = 25;
  }

  const clearCanvas = () => {
    if (fabricRef.current) {
      fabricRef.current.forEachObject((obj) => fabricRef.current.remove(obj));
      socket.emit('clearCanvas');
    }
  }

  const handlePause = () => {
    socket.emit('pause');
  }

  const handlePass = () => {
    clearCanvas();
    words[wordIndex].guess = "passed"
    nextWordIndex();
  }

  const handleCorrect = () => {
    const imageData = fabricRef.current.toDataURL();

    if (gameState.redTeam.includes(gameState.currentPlayer)) {
      socket.emit('incrementRed');
      socket.emit('savedImage', "red", gameState.currentPlayer, currentWord(), imageData);
    }
    else {
      socket.emit('incrementBlue');
      socket.emit('savedImage', "blue", gameState.currentPlayer, currentWord(), imageData);
    }
    clearCanvas();
    words[wordIndex].guess = "correct"
    nextWordIndex();
  }

  const currentWord = () => words[wordIndex]?.word;

  const nextWordIndex = () => {
    socket.emit("updateWordGuesses", words);

    const allCorrect = words.every(w => w.guess === "correct");
    if (allCorrect && words.length > 0) {
      socket.emit("turnFinished")
      return
    }

    let i = wordIndex;
    while (true) {
      i = (i + 1) % words.length;
      if (words[i].guess !== "correct") {
        setWordIndex(i);
        break;
      }
    }
  }


  if (!gameState)
    return <p>Can not find game {gameCode}</p>

  if (gameState?.status === "RESULTS")
    navigate('/results/' + gameState.gameCode);

  if (gameState?.status === "SETUP")
    return <p>You need to perform tablet setup and enter your teams. Start again on both devices!</p>

  if (gameState?.status === "DRAWING") {
    if (words[wordIndex]?.word !== gameState?.turnWords[wordIndex].word) {
      setWords(gameState.turnWords);

      // handle the scenario if we refreshed and some words have been guessed already
      for (let i = 0; i < gameState.turnWords.length; i++) {
        if (gameState.turnWords[i].guess !== "correct") {
          setWordIndex(i);
          break;
        }
      }
    }
  }


  return (
    <div className="tablet">
      <div className="topbar">
        <Timer gameState={gameState} key={gameState?.currentPlayer} />
        <span id="pause" onClick={handlePause}>PAUSE</span>
        <span id="space"></span>
        <span id="player">{gameState ? gameState?.currentPlayer.toUpperCase() : "ANON"}</span>
        <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
      </div>
      <div className="controls">
        <button onClick={handlePass}>PASS</button>
        <div id="word"> {gameState?.status === "DRAWING" ? currentWord() : ""}   </div>
        <button onClick={handleCorrect}>GOT IT</button>
      </div>
      <canvas ref={canvasRef} />
      <DrawingTools className="toolbar"
        setBrushColour={setBrushColour}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
        useRealTime={useRealTime}
        setRealTime={setRealTime}
      />
      {gameState?.isPaused && <Pause />}
      {gameState?.status === "WAITING_FOR_PLAYER" && <NextPlayer gameState={gameState} />}
    </div>
  );


};

export default Tablet;
