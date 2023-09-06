import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import DrawingTools from "./DrawingTools";
import Timer from "./Timer";
import Score from "./Score";
import "./Tablet.css";

import socket from "../socket";

const Tablet = () => {

  const gameCode = useParams().gameCode.toUpperCase();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [gameState, setGameState] = useState(null);


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

    if (!joined) {
      socket.emit('joinGame', gameCode, 'Tablet', (success) => {
        setJoined(success);
      })

      socket.on('gameState', (data) => {
        setGameState(data);
      })

      socket.on('disconnect', () => {
        setJoined(false);
      })
    } else {
      socket.emit('startGame');
    }

    canvas.on("object:added", () => {
      submitImage();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, [joined]);

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
    fabricRef.current.clear();
    fabricRef.current.setBackgroundColor(
      "#eee",
      fabricRef.current.renderAll.bind(fabricRef.current)
    );
  };

  const submitImage = () => {
    const imageData = fabricRef.current.toDataURL();
    socket.emit('newImageData', imageData);
  }

  if (!joined) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div className="tablet">
      <div className="topbar">
        <Timer />
        <span id="player">Harold</span>
        <span id="word">BANANA</span>
        <Score redScore={gameState ? gameState.redScore : 0} blueScore={gameState ? gameState.blueScore : 0} />
      </div>
      <canvas ref={canvasRef} />
      <DrawingTools className="toolbar"
        setBrushColour={setBrushColour}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
      />
    </div>
  );


};

export default Tablet;
