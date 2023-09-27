import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fabric } from "fabric";
import DrawingTools from "./DrawingTools";
import Timer from "./Timer";
import Score from "./Score";
import Pause from "./Pause";
import NextPlayer from "./NextPlayer";
import LoadingAnimation from "./LoadingAnimation";
import Results from "./Results";
import TurnProgress from "./TurnProgress";
import socket from "../socket";
import "./Tablet.css";

const Tablet = ({ }) => {

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const gameCode = useParams().gameCode.toUpperCase();

  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [gameState, setGameState] = useState(null);
  const [useRealTime, setRealTime] = useState(true);

  const debug = process.env.NODE_ENV !== "production" && true;

  useEffect(() => {
    socket.on('gameState', (data) => setGameState(data));
    socket.on("disconnect", () => setGameState({ status: "DISCONNECTED" }))

    // coming from the JoinGame component the socket is already assigned to a game
    // the below emit handles the scenario when the browser is refreshed
    // or the user types a game url directly into the address bar
    if (!gameState) {
      socket.emit('joinGame', gameCode, 'Tablet', success => {
        if (!success)
          setGameState({ status: "404" })
      })
    }

    window.addEventListener("resize", handleResize);
    return () => {
      socket.off('gameState');
      window.removeEventListener("resize", handleResize);

      if (fabricRef.current)
        fabricRef.current.dispose();
      console.log("Tablet cleanup performed")
    };
  }, []);


  // initialise fabric. because of our conditional returns it's easy for
  // fabric to miss injecting into the canvas element. best solution seems
  // to be check if it's in the DOM already and re-initialise if not
  useEffect(() => {
    if (!document.querySelector("div.canvas-container")) {
      console.log("Tablet canvas initialised")
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        backgroundColor: "#eee",
        selection: false
      });
      handleResize();
      setFabricListeners();
      setBrushSize("smallBrush");
    }
  }, [gameState]);


  // clear canvas when it's a new turn
  useEffect(() => clearCanvas(), [gameState?.currentPlayer])


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
      return;
    }

    // else, set to draw via simulated mouse events
    let isDrawing = false;

    canvas.on('mouse:down', (e) => {
      isDrawing = true;
      e.strokeWidth = fabricRef.current.freeDrawingBrush.width;
      e.strokeColour = fabricRef.current.freeDrawingBrush.color;
      socket.emit('onMouseDown', e);
    });

    canvas.on('mouse:move', (e) => {
      if (isDrawing)
        socket.emit('onMouseMove', e);
    });

    canvas.on('mouse:up', (e) => {
      isDrawing = false;
      socket.emit('onMouseUp');
    });
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

      socket.emit("tabletDimensions", {
        fabricWidth: fabricRef.current.width,
        fabricHeight: fabricRef.current.height,
        canvasWidth: canvasRef.current?.width,
        canvasHeight: canvasRef.current?.height,
        dpr: window.devicePixelRatio
      })
    }
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
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = '#eee';
      fabricRef.current.renderAll();
    }
    socket.emit('clearCanvas');
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
    socket.emit("correctGuess", words[wordIndex].word)
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
    return <LoadingAnimation />;

  if (gameState.status === "404")
    return <p>Can not find game {gameCode}</p>

  if (gameState.status == "DISCONNECTED")
    return <p>Disconnected from server</p>;

  if (gameState.status === "SETUP")
    return <p>You need to perform tablet setup and enter your teams. Start again on both devices!</p>

  if (gameState.status === "RESULTS")
    return <Results gameState={gameState} isTV={false} />;

  if (!gameState.TV)
    return <p>TV disconnected</p>;

  if (gameState.status === "DRAWING") {
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
      {gameState?.status === "DRAWING" && <TurnProgress words={words} />}
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