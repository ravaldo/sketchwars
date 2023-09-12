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

  const gameCode = useParams().gameCode.toUpperCase();

  const [words, setWords] = useState("banana");
  const [wordIndex, setWordIndex] = useState(0);
  const [gameState, setGameState] = useState(null);
  const [useRealTime, setRealTime] = useState(true);

  useEffect(() => {
    socket.on('gameState', (data) => {
      setGameState(data)
    })

    socket.on('disconnect', () => {
    })

    socket.on('turn', (givenPlayer, givenWords) => {
      console.log(`new turn for ${givenPlayer}`);
      // let worddict = {}
      // for (const w in words)
      //   worddict[w] = false
      // setWords(worddict);
      clearCanvas();
      setWordIndex(0);
      setWords(givenWords)
    })

    // handle a refresh
    if (!gameState)
      socket.emit('joinGame', gameCode, 'Tablet', _ => { })

    return () => {
      socket.removeAllListeners();
    };
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


  useLayoutEffect(() => {
    // remove all event listeners
    fabricRef.current.__eventListeners = {};

    // set to draw via base64 encoded PNGs
    if (!useRealTime) {
      fabricRef.current.on("object:added", () => {
        const imageData = fabricRef.current.toDataURL();
        socket.emit('newImageData', imageData);
      });
    }

    // set to draw via remote controlled context
    else {
      let isDrawing = false;
      let x1, y1, x2, y2 = 0;

      fabricRef.current.on('mouse:down', (e) => {
        // clientX is relative to viewport
        x1 = e.pointer.x
        y1 = e.pointer.y
        isDrawing = true;
      });

      fabricRef.current.on('mouse:move', (e) => {
        if (isDrawing) {
          x2 = e.pointer.x
          y2 = e.pointer.y
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
          if (0 < x2 < fabricRef.current.width && 0 < y2 < fabricRef.current.height)
            socket.emit('newContextData', contextData);
          x1 = x2;
          y1 = y2;
        }
      });

      fabricRef.current.on('mouse:up', () => {
        isDrawing = false;
      });
    }
  }, [useRealTime]);

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
    clearCanvas();
    setWordIndex(wordIndex + 1)
  }

  const handlePause = () => {
    socket.emit('pause');
  }

  const word = () => {
    // if (Object.values(wordchoices).every(element => element === true))
    //   socket.emit("turnFinished")
  }

  // if (!gameState) {
  //   return <LoadingAnimation />;
  // }


  if (gameState?.status === "RESULTS")
    navigate('/results/' + gameState.gameCode);

  if (gameState?.status === "SETUP")
    return <p>You need to perform tablet setup and enter your teams. Start again on both devices!</p>
    

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
        <div id="word"> {gameState?.status === "DRAWING" ? words[wordIndex] : ""}   </div>
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
