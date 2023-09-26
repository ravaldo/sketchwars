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
  const [gameState, setGameState] = useState(null);
  const [imgData, setImgData] = useState(null);
  const tabletDimensions = useRef(null)
  const myTransform = useRef(null)

  const debug = process.env.NODE_ENV !== "production" && true;

  useEffect(() => {
    socket.emit('createGame', (gameCode) => {
      socket.emit('joinGame', gameCode, 'TV', () => { })
    })
    socket.on('gameState', (data) => setGameState(data))
    socket.on('newImageData', (data) => setImgData(data))
    socket.on('tabletDimensions', (data) => {
      tabletDimensions.current = data;
      updateTransform();
    })
    socket.on('onMouseDown', (data) => onMouseDown(data))
    socket.on('onMouseMove', (data) => onMouseMove(data))
    socket.on('onMouseUp', () => onMouseUp())
    socket.on('clearCanvas', () => clearCanvas())
    socket.on("disconnect", () => setGameState({ status: "DISCONNECTED" }))
    window.addEventListener("resize", handleResize);

    return () => {
      socket.off('gameState');
      socket.off('newImageData');
      socket.off('tabletDimensions');
      socket.off('onMouseDown');
      socket.off('onMouseMove');
      socket.off('onMouseUp');
      socket.off('clearCanvas');
      window.removeEventListener("resize", handleResize);

      if (fabricRef.current)
        fabricRef.current.dispose();
      console.log("TV cleanup performed");
    };
  }, []);


  // initialise fabric. because of our conditional returns it's easy for
  // fabric to miss injecting into the canvas element. best solution seems
  // to be check if it's in the DOM already and re-initialise if not
  useEffect(() => {
    if (!document.querySelector("div.canvas-container")) {
      console.log("TV canvas initialised")
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: false,
        backgroundColor: "#eee",
        selection: false
      });
      handleResize();
    }
  }, [gameState]);


  // drawing via base64 encoded PNGs
  useEffect(() => {
    if (imgData && canvasRef.current) {
      const img = new Image();
      img.src = imgData;
      img.onload = function () {
        const ctx = canvasRef.current.getContext("2d");
        const scale = myTransform.current[0]
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        const offsetX = (fabricRef.current.width - newWidth) / 2;
        const offsetY = (fabricRef.current.height - newHeight) / 2;
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      };
    }
  }, [imgData]);


  // drawing via fabric mouse events
  const onMouseDown = (data) => {
    const point = fabric.util.transformPoint(data.pointer, myTransform.current);
    fabricRef.current.freeDrawingBrush.width = data.strokeWidth;
    fabricRef.current.freeDrawingBrush.color = data.strokeColour;
    fabricRef.current.freeDrawingBrush.onMouseDown(point, { e: new MouseEvent("mousedown") });
  };
  const onMouseMove = (data) => {
    const point = fabric.util.transformPoint(data.pointer, myTransform.current);
    fabricRef.current.freeDrawingBrush.onMouseMove(point, { e: new MouseEvent("mousemove") });
  };
  const onMouseUp = () => {
    fabricRef.current.freeDrawingBrush.onMouseUp({ e: new MouseEvent("mouseup") });
  };


  const clearCanvas = () => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = '#eee';
      fabricRef.current.renderAll();
    }
  };


  const handleResize = () => {
    if (fabricRef.current) {
      fabricRef.current.setWidth(window.innerWidth * 0.97);
      const topbarElement = document.querySelector('div.topbar')
      if (topbarElement) {
        const height = (window.innerHeight - topbarElement.offsetHeight) * 0.97;
        fabricRef.current.setHeight(height);
      }
      updateTransform();  // update our transform if the TV resizes
      clearCanvas();
    }
  }


  const updateTransform = () => {
    if (fabricRef.current && tabletDimensions.current) {
      const canvas = fabricRef.current;
      const tablet = tabletDimensions.current;

      const scaleX = canvas.width / tablet.fabricWidth;
      const scaleY = canvas.height / tablet.fabricHeight;
      const scale = Math.min(scaleX, scaleY);
      const centerX1 = tablet.fabricWidth / 2;
      const centerY1 = tablet.fabricHeight / 2;
      const centerX2 = canvas.width / 2;
      const centerY2 = canvas.height / 2;
      const translateX = centerX2 - centerX1 * scale;
      const translateY = centerY2 - centerY1 * scale;

      const options = {
        angle: 0,
        scaleX: scale,
        scaleY: scale,
        flipX: false,
        flipY: false,
        skewX: 0,
        skewY: 0,
        translateX,
        translateY
      }
      myTransform.current = fabric.util.composeMatrix(options);
    }
  }


  if (!gameState)
    return <LoadingAnimation />;

  if (gameState.status == "DISCONNECTED")
    return <p>Disconnected from server</p>;

  if (gameState.status == "SETUP")
    return <HostGame gameState={gameState} />;

  if (gameState.status == "RESULTS")
    navigate('/results/' + gameState.gameCode);

  if (!gameState.Tablet)
    return <p>Tablet disconnected</p>;


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