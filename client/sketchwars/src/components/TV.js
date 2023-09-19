import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fabric } from "fabric";
import Timer from "./Timer";
import Score from "./Score";
import HostGame from "./TV_Setup";
import socket from "../socket";
import LoadingAnimation from "./LoadingAnimation";
import NextPlayer from "./NextPlayer";
import Pause from "./Pause";
import "./TV.css";

const TV = () => {

  const navigate = useNavigate();
  const gameRef = useRef(null);
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);

  const [imgData, setImgData] = useState('');
  const [ctxData, setCtxData] = useState('');
  const tabletDimensions = useRef(null)

  const debug = process.env.NODE_ENV !== "production" && true;

  useEffect(() => {
    socket.emit('createGame', (gameCode) => {
      gameRef.current = gameCode;
      socket.emit('joinGame', gameCode, 'TV', () => { })
    })
    socket.on('gameState', (data) => setGameState(data))
    socket.on('newImageData', (data) => setImgData(data))
    socket.on('newContextData', (data) => setCtxData(data))
    socket.on('tabletDimensions', (data) => tabletDimensions.current = data)
    socket.on('clearCanvas', () => clearCanvas())
    window.addEventListener("resize", handleResize);

    return () => {
      socket.off('gameState');
      socket.off('newImageData');
      socket.off('newContextData');
      socket.off('clearCanvas');
      window.removeEventListener("resize", handleResize);
      console.log("TV cleanup performed");
    };
  }, []);


  // ensure the canvas is sized correctly when first rendered
  useEffect(() => handleResize(), [canvasRef.current]);
  
  // update our transform if the tablet resizes 
  useEffect(() => updateTransform(), [tabletDimensions.current]);

  // drawing via base64 encoded PNGs
  useEffect(() => {
    if (imgData && canvasRef.current) {
      const img = new Image();
      img.src = imgData;
      img.onload = function () {
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };
    }
  }, [imgData]);

  // drawing via remote controlled context
  useEffect(() => {
    if (ctxData?.points?.length > 1 && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d", { alpha: false });
      ctx.strokeStyle = ctxData.colour;
      ctx.lineWidth = ctxData.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(ctxData.points[0].x, ctxData.points[0].y);

      for (let i = 1; i < ctxData.points.length; i++) {
        const { x, y } = ctxData.points[i];
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [ctxData]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d", { alpha: false });
      const temp = ctx.getTransform()
      ctx.resetTransform()
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.setTransform(temp);
    }
  };

  const handleResize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * 0.97;
      const topbarElement = document.querySelector('div.topbar')
      if (topbarElement)
        canvasRef.current.height = (window.innerHeight - topbarElement.offsetHeight) * 0.97;
      updateTransform();
      clearCanvas();
    }
  }

  const updateTransform = () => {
    if (canvasRef.current && tabletDimensions.current) {
      const canvas = canvasRef.current;
      const tablet = tabletDimensions.current;
      const ctx = canvas.getContext("2d", { alpha: false });

      const scaleX = canvas.width / tablet.fabricWidth;
      const scaleY = canvas.height / tablet.fabricHeight;
      const scale = Math.min(scaleX, scaleY);
      const centerX1 = tablet.fabricWidth / 2;
      const centerY1 = tablet.fabricHeight / 2;
      const centerX2 = canvas.width / 2;
      const centerY2 = canvas.height / 2;
      const translateX = centerX2 - centerX1 * scale;
      const translateY = centerY2 - centerY1 * scale;
      ctx.resetTransform();
      ctx.setTransform(scale, 0, 0, scale, translateX, translateY);
      console.log("transform set")
    }
  }

  if (!gameState)
    return <LoadingAnimation />;

  if (gameState.status == "SETUP")
    return <HostGame gameState={gameState} />;

  if (gameState.status == "RESULTS")
    navigate('/results/' + gameState.gameCode);


  return (
    <div className="tv">
      <div className="topbar">
        <Timer gameState={gameState} key={gameState.currentPlayer} />
        <span id="code">{gameState?.gameCode}</span>
        <span id="player">{gameState ? gameState.currentPlayer.toUpperCase() : "ANON"}</span>
        <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
      </div>
      <canvas ref={canvasRef} />
      {gameState?.isPaused && <Pause />}
      {gameState?.status === "WAITING_FOR_PLAYER" && <NextPlayer gameState={gameState} />}

    </div>
  );
};

export default TV;
