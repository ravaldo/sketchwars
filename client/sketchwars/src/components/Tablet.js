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

    // canvas.on("object:added", () => {
    //   submitImage();
    // });

        let isDrawing = false;
        let x = 0;
        let y = 0;
        let x2 = 0;
        let y2 = 0;

        let w = canvas.width
        let h = canvas.height

        let imageData = {}

        canvas.on('mouse:down', (e) => {
        x = e.e.clientX || e.e.changedTouches[0].clientX
        y = e.e.clientY || e.e.changedTouches[0].clientY
            isDrawing = true;
            imageData = {
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            w: w,
            h: h,
            strokeWidth: fabricRef.current.freeDrawingBrush.width,
            colour: fabricRef.current.freeDrawingBrush.color
        }
        socket.emit('sendImageData', { gameCode, imageData });

        });
    
        canvas.on('mouse:move', (e) => {
        if (isDrawing) {
            x2 = e.e.clientX || e.e.changedTouches[0].clientX
            y2 = e.e.clientY || e.e.changedTouches[0].clientY
            console.log(e)

            console.log(x2, y2)

            imageData = {
            x1: x,
            y1: y,
            x2: x2,
            y2: y2,
            strokeWidth: fabricRef.current.freeDrawingBrush.width,
            colour: fabricRef.current.freeDrawingBrush.color
            };

            x = x2;
            y = y2;

            console.log(imageData)
            socket.emit('sendImageData', { gameCode, imageData });
        }
        });

        canvas.on('mouse:up', () => {
        isDrawing = false;
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
