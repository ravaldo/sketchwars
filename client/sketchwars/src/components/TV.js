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
  const fabricRef = useRef(null);
  const [gameState, setGameState] = useState(null);

  const [imgData, setImgData] = useState(null);
  const [ctxData, setCtxData] = useState(null);
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
    socket.on('onMouseDown', (data) => onMouseDown(data))
    socket.on('onMouseMove', (data) => onMouseMove(data))
    socket.on('onMouseUp', () => onMouseUp())
    socket.on('clearCanvas', () => clearCanvas())

    return () => {
      socket.off('gameState');
      socket.off('newImageData');
      socket.off('newContextData');
      socket.off('tabletDimensions');
      socket.off('onMouseDown');
      socket.off('onMouseMove');
      socket.off('onMouseUp');
      socket.off('clearCanvas');
      console.log("TV cleanup performed");
    };
  }, []);

  // initialise fabric only once
  useEffect(() => {
    if (gameState?.status === "WAITING_FOR_PLAYER" && !fabricRef.current) {
      console.log("TV canvas initialised")
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: false,
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
        fabricRef.current.dispose();
        window.removeEventListener("resize", handleResize);
        console.log("TV canvas cleanup performed")
      }
    };
  }, []);

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

  // drawing via fabric mouse events
  const onMouseDown = (data) => {
    let point = data.pointer;
    const t = fabric.util.composeMatrix(updateTransform());
    point = fabric.util.transformPoint(point, t);
    fabricRef.current.freeDrawingBrush.width = data.strokeWidth;
    fabricRef.current.freeDrawingBrush.color = data.strokeColour;
    fabricRef.current.freeDrawingBrush.onMouseDown(point, { e: new MouseEvent("mousedown") });
  };
  const onMouseMove = (data) => {
    let point = data.pointer;
    const t = fabric.util.composeMatrix(updateTransform());
    point = fabric.util.transformPoint(point, t);
    fabricRef.current.freeDrawingBrush.onMouseMove(point, { e: new MouseEvent("mousemove") });
  };
  const onMouseUp = () => {
    fabricRef.current.freeDrawingBrush.onMouseUp({ e: new MouseEvent("mouseup") });
  };

  const clearCanvas = () => {
    // clear canvas if drawing via 2d context
    if (canvasRef.current) {
      // const ctx = canvasRef.current.getContext("2d", { alpha: false });
      // const temp = ctx.getTransform()
      // ctx.resetTransform()
      // ctx.fillStyle = '#eee';
      // ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      // ctx.setTransform(temp);
    }

    //clear canvas if drawing via fabric mouse events
    if (fabricRef.current)
      fabricRef.current.forEachObject((obj) => fabricRef.current.remove(obj));
  };

  const handleResize = () => {
    if (fabricRef.current) {
      fabricRef.current.setWidth(window.innerWidth * 0.97);
      const topbarElement = document.querySelector('div.topbar')
      if (topbarElement) {
        const height = (window.innerHeight - topbarElement.offsetHeight) * 0.97;
        fabricRef.current.setHeight(height);
      }
      // updateTransform();
      // clearCanvas();
    }
  }

  const updateTransform = () => {
    if (fabricRef.current && tabletDimensions.current) {
      const canvas = fabricRef.current;
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
      // ctx.setTransform(scale, 0, 0, scale, translateX, translateY);
      // console.log("transform set")
      return {
        angle: 0,
        scaleX: scale,
        scaleY: scale,
        flipX: false,
        flipY: false,
        skewX: 0,
        skewX: 0,
        translateX,
        translateY
      }

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
