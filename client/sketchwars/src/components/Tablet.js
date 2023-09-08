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

const Tablet = ({ useRealtime }) => {

  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const gameCode = useParams().gameCode.toUpperCase();
  // const [joined, setJoined] = useState(true);
  const hasStartedGameRef = useRef(false);

  const [words, setWords] = useState("banana");
  const [wordIndex, setWordIndex] = useState(0);
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [goCallBack, setGoCallBack] = useState(null);

  const [savedPics, setSavedPics] = useState(null);


  useEffect(() => {
    socket.on('gameState', (data) => {
      setGameState(data)
    })

    socket.on('disconnect', () => {
      // setJoined(false)
    })

    socket.on('turn', (givenPlayer, givenWords, callback) => {
      console.log(`new turn for ${givenPlayer}`);
      // let worddict = {}
      // for (const w in words)
      //   worddict[w] = false
      // setWords(worddict);
      setWordIndex(0);
      setWords(givenWords)
      setPlayer(givenPlayer);
      setGoCallBack(() => callback)
    })

    if (!hasStartedGameRef.current) {
      socket.emit('startGame');
      hasStartedGameRef.current = true;
    }
  }, []);


  useLayoutEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: "#eee",
      selection: false
    });

    fabricRef.current = canvas;
    handleResize();
    setBrushSize("smallBrush");
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);


  useEffect(() => {
    if (!useRealtime)   // drawing via base64 encoded PNGs
      fabricRef.current.on("object:added", () => sendImage());
    else {              // drawing via remote controlled context
      let isDrawing = false;
      let x1, y1, x2, y2 = 0;

      fabricRef.current.on('mouse:down', (e) => {
        // clientX is relative to viewport
        x1 = e.pointer.x || (e.e.changedTouches && e.e.changedTouches[0].clientX)
        y1 = e.pointer.y || (e.e.changedTouches && e.e.changedTouches[0].clientY)
        isDrawing = true;
        let contextData = {
          x1,
          y1,
          x2: x1,
          y2: y1,
          strokeWidth: fabricRef.current.freeDrawingBrush.width,
          colour: fabricRef.current.freeDrawingBrush.color,
          srcWidth: fabricRef.current.width,
          srcHeight: fabricRef.current.height
        }
        socket.emit('newContextData', contextData);
      });

      fabricRef.current.on('mouse:move', (e) => {
        if (isDrawing) {
          x2 = e.pointer.x || (e.e.changedTouches && e.e.changedTouches[0].clientX)
          y2 = e.pointer.y || (e.e.changedTouches && e.e.changedTouches[0].clientY)
          let contextData = {
            x1,
            y1,
            x2,
            y2,
            strokeWidth: fabricRef.current.freeDrawingBrush.width,
            colour: fabricRef.current.freeDrawingBrush.color,
            srcWidth: fabricRef.current.width,
            srcHeight: fabricRef.current.height
          };
          x1 = x2;
          y1 = y2;
          if (x2 > 0 && x2 < fabricRef.current.width && y2 > 0 && y2 < fabricRef.current.height)
            socket.emit('newContextData', contextData);
        }
      });

      fabricRef.current.on('mouse:up', () => {
        isDrawing = false;
      });
    }
  }, []);



  const handleResize = () => {
    fabricRef.current.setWidth(window.innerWidth * 0.95);

    const topbarElement = document.querySelector('div.topbar')
    const toolsElement = document.querySelector('div.toolbar')
    if (topbarElement && toolsElement) {
      const height = (window.innerHeight - topbarElement.scrollHeight - toolsElement.scrollHeight);
      fabricRef.current.setHeight(height);
    }
  };

  const setBrushColour = (value) => {
    fabricRef.current.freeDrawingBrush.color = value;
  };

  const setBrushSize = (value) => {
    if (value === "smallBrush")
      fabricRef.current.freeDrawingBrush.width = 4;
    if (value === "mediumBrush")
      fabricRef.current.freeDrawingBrush.width = 16;
    if (value === "largeBrush")
      fabricRef.current.freeDrawingBrush.width = 25;
  };

  const clearCanvas = () => {
    fabricRef.current.forEachObject((obj) => {
      fabricRef.current.remove(obj);
    });
    socket.emit('clearCanvas');
  };

  const sendImage = () => {
    const imageData = fabricRef.current.toDataURL();
    socket.emit('newImageData', imageData);
  }

  const handlePass = () => {
    clearCanvas();
    setWordIndex(wordIndex + 1)
  }

  const handleCorrect = () => {
    const imageData = fabricRef.current.toDataURL();

    if (gameState.redTeam.includes(gameState.currentPlayer)) {
      socket.emit('incrementRed');
      socket.emit('savedImage', "red", gameState.currentPlayer, words[wordIndex], imageData);
    }
    else {
      socket.emit('incrementBlue');
      socket.emit('savedImage', "blue", gameState.currentPlayer, words[wordIndex], imageData);
    }
    setWordIndex(wordIndex + 1)
    clearCanvas();
  }

  const handlePause = () => {
    socket.emit('pause');
  }

  const word = () => {
    // if (Object.values(wordchoices).every(element => element === true))
    //   socket.emit("turnFinished")
  }

  // if (!joined)
  //   return <LoadingAnimation />

  if (gameState?.status === "RESULTS")
    navigate('/results/' + gameState.gameCode);

  return (
    <div className="tablet">
      <div className="topbar">
        <Timer isPaused={gameState?.isPaused} key={gameState?.currentPlayer} />
        <span id="pause" onClick={handlePause}>PAUSE</span>
        <span id="space"></span>
        <span id="player">{gameState ? gameState.currentPlayer.toUpperCase() : "ANON"}</span>
        <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
      </div>
      <div className="controls">
        <button onClick={handlePass}>PASS</button>
        <div id="word">{words[wordIndex]}</div>
        <button onClick={handleCorrect}>GOT IT</button>
      </div>
      <canvas ref={canvasRef} />
      <DrawingTools className="toolbar"
        setBrushColour={setBrushColour}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
      />
      {gameState?.isPaused && <Pause />}
      {gameState?.status === "WAITING_FOR_PLAYER" && <NextPlayer gameState={gameState} goCallBack={goCallBack} />}
    </div>
  );


};

export default Tablet;
