import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { fabric } from "fabric";
import Timer from "./Timer";
import socket from "../socket";
import "./TV.css";
import Scoreboard from "./Scoreboard";
import HostGame from "./HostGame";

const TV = () => {

  const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [imgData, setImgData] = useState('');
    const [joined, setJoined] = useState(false);
    const gameRef = useRef("gameRef is null");
    const [gameState, setGameState] = useState(null);
    const [draweeName, setDraweeName] = useState(null);

  useLayoutEffect(() => {

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      backgroundColor: "#eeeeee",
      selection: false,
    });
    fabricRef.current = canvas;
    handleResize();
    window.addEventListener("resize", handleResize);

    if (!joined) {

      socket.emit('createGame', (gameCode) => {
          gameRef.current = gameCode;
          socket.emit('joinGame', gameCode, 'TV', (success) => {
              setJoined(success);
          })
      })

      socket.on('gameState', (data) => {
          setGameState(data);
          console.log(data);
      })


      socket.on('newImageData', (data) => {
          console.log("TV receieved an image")
          setImgData(data);
      })

      socket.on('disconnect', () => {
          setJoined(false);
      })
  }

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, [joined]);  // need to set joined as the canvas is already created and not rendered otherwise

  
  useEffect(() => {
    if (imgData) {
      const img = new Image();
      img.src = imgData;
      img.onload = function () {
        canvasRef.current.getContext("2d").drawImage(img, 0, 0);
      };
    }
  }, [imgData]);

  const handleResize = () => {
    const timerCodeContainerHeight =
      document.querySelector(".timer-code-container")?.offsetHeight || 0;
    const canvasMargin = 30;
    const maxHeight =
      window.innerHeight - timerCodeContainerHeight - canvasMargin * 2;
    const maxWidth = window.innerWidth - canvasMargin * 2;

    const canvasElement = canvasRef.current;

    if (canvasElement) {
      canvasElement.width = maxWidth;
      canvasElement.height = maxHeight;

      fabricRef.current.setWidth(maxWidth);
      fabricRef.current.setHeight(maxHeight);
    }
  };

  const clearCanvas = () => {
    fabricRef.current.forEachObject((obj) => {
      fabricRef.current.remove(obj);
    });
  };

  if (!joined || !gameState) {
    return <div>Connecting to server...</div>;
}

if (gameState.status == "SETUP" && !gameState.Tablet) {
    return <div>On your tablet, join {gameRef.current}</div>;
}

if (gameState.status == "SETUP" && gameState.Tablet) {
    return (

        <>
            <HostGame redTeamNames={gameState.redTeam} blueTeamNames={gameState.blueTeam} />
        </>





    );
}

  return (
    <div className="tv-container">
      <div className="content-container">
        <div className="timer-container">
          <Timer />
        </div>
        <div className="code-container">
          <h2 className="code">{gameRef.current}</h2>
        </div>
        <div className="scoreboard-container">
          <Scoreboard />
        </div>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default TV;
