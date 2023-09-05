import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { fabric } from "fabric";
import Timer from "./Timer";
import Score from "./Score";
import HostGame from "./TV_Setup";
import "./TV.css";
import socket from "../socket";

const TV = () => {

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [imgData, setImgData] = useState('');
  const [joined, setJoined] = useState(false);
  const gameRef = useRef("gameRef is null");
  const [gameState, setGameState] = useState(null);

  useLayoutEffect(() => {

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      backgroundColor: "#eee",
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
      })


      socket.on('newImageData', (data) => {
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
  }, [joined, gameState]);


  useEffect(() => {
    if (imgData && canvasRef.current) {
      const img = new Image();
      img.src = imgData;
      img.onload = function () {
        // canvasRef.current.getContext("2d").drawImage(img, 0, 0);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
         
        const scale = Math.min(scaleX, scaleY);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        
        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY = (canvas.height - newHeight) / 2;
         
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      };
    }
  }, [imgData]);

  const handleResize = () => {
    fabricRef.current.setWidth(window.innerWidth * 0.95);

    const topbarElement = document.querySelector('div.topbar')
    if (topbarElement) {
      const height = (window.innerHeight - topbarElement.offsetHeight) * 0.97;
      fabricRef.current.setHeight(height);
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
 
  if (gameState.status == "SETUP") {
    return <HostGame gameState={gameState} />;
  }

  return (
    <div className="tv">
      <div className="topbar">
        <Timer />
        <span id="code">{gameRef.current}</span>
        <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default TV;
