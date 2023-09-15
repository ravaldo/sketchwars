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

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const gameRef = useRef(null);
  const [imgData, setImgData] = useState('');
  const [ctxData, setCtxData] = useState('');
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.emit('createGame', (gameCode) => {
      gameRef.current = gameCode;
      socket.emit('joinGame', gameCode, 'TV', () => { })
    })
    socket.on('gameState', (data) => setGameState(data))
    socket.on('newImageData', (data) => setImgData(data))
    socket.on('newContextData', (data) => setCtxData(data))
    socket.on('clearCanvas', () => clearCanvas())

    return () => {
      socket.off('gameState');
      socket.off('newImageData');
      socket.off('newContextData');
      socket.off('clearCanvas');
      console.log("TV socket cleanup performed");
    };
  }, []);

  // initialise canvas only once and AFTER the setup screen disappears
  useEffect(() => {
    if (gameState?.status === "WAITING_FOR_PLAYER" && !fabricRef.current) {
      console.log("TV canvas initialised")
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        backgroundColor: "#eee",
        selection: false
      });
      handleResize();
      window.addEventListener("resize", handleResize);
    }
  }, [gameState]);

// cleanup canvas on unmount
  useEffect(() => {
    return () => {
      if (fabricRef.current) {
        window.removeEventListener("resize", handleResize);
        fabricRef.current.dispose();
        console.log("TV canvas cleanup performed")
      }
    };
  }, []);

  // drawing via base64 encoded PNGs
  useEffect(() => {
    if (imgData && canvasRef.current) {
      const img = new Image();
      img.src = imgData;
      img.onload = function () {
        const ctx = canvasRef.current.getContext("2d");
        const scaleX = fabricRef.current.width / img.width;
        const scaleY = fabricRef.current.height / img.height;
        const scale = Math.min(scaleX, scaleY);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        const offsetX = (fabricRef.current.width - newWidth) / 2;
        const offsetY = (fabricRef.current.height - newHeight) / 2;
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      };
    }
  }, [imgData]);


  // drawing via remote controlled context
  useEffect(() => {
    if (ctxData && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      let { x1, y1, x2, y2, strokeWidth, colour, srcWidth, srcHeight } = ctxData;

      const dpr = window.devicePixelRatio || 1;
      const scaleX = canvasRef.current.width / srcWidth;
      const scaleY = canvasRef.current.height / srcHeight;
      const scale = Math.min(scaleX, scaleY);
      const centerX1 = srcWidth / 2;
      const centerY1 = srcHeight / 2;
      const centerX2 = canvasRef.current.width / 2;
      const centerY2 = canvasRef.current.height / 2;
      const translateX = centerX2 - centerX1 * scale;
      const translateY = centerY2 - centerY1 * scale;
      ctx.scale(dpr, dpr);
      ctx.setTransform(scale, 0, 0, scale, translateX, translateY);

      const x = {
        fabricCanvas: `${fabricRef.current.width}, ${fabricRef.current.height}`,
        htmlCanvas: `${canvasRef.current.width}, ${canvasRef.current.height}`,
        img: `${srcWidth}, ${srcHeight}`,
        scale: `${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}`,
        XY: `${x1}, ${y1}`,
        scaledXY: `${x1 * scale}, ${y1 * scale}`,
        dpr: `${window.devicePixelRatio}`
      }
      // console.log(x)

      ctx.strokeStyle = colour;
      ctx.fillStyle = colour;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc(x1, y1, Math.floor((strokeWidth / 2) * 0.97), 0, 2 * Math.PI)
      ctx.arc(x2, y2, Math.floor((strokeWidth / 2) * 0.97), 0, 2 * Math.PI)
      ctx.fill();
      ctx.resetTransform()
    }
  }, [ctxData]);


  const handleResize = () => {
    fabricRef.current.setWidth(window.innerWidth * 0.95);
    const topbarElement = document.querySelector('div.topbar')
    if (topbarElement) {
      const height = (window.innerHeight - topbarElement.offsetHeight) * 0.97;
      fabricRef.current.setHeight(height);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      fabricRef.current.forEachObject((obj) => fabricRef.current.remove(obj));
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

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
