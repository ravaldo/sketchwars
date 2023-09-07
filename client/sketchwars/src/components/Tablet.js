import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import DrawingTools from "./DrawingTools";
import Timer from "./Timer";
import Score from "./Score";
import "./Tablet.css";

import socket from "../socket";
import LoadingAnimation from "./LoadingAnimation";

const Tablet = ({ useRealtime }) => {

  const gameCode = useParams().gameCode.toUpperCase();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [word, setWord] = useState(null);
  const [player, setPlayer] = useState(null);
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
        setGameState(data)
      })
      socket.on('disconnect', () => {
        setJoined(false)
      })

      socket.on('turn', (givenPlayer, givenWord, callback) => {
        callback("start")
        setTimeout(() => {
          setWord(givenWord);
          setPlayer(givenPlayer);
        }, 3000);
      })


    }
    socket.emit('startGame');
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, [joined]);


  useEffect(() => {
    if (!useRealtime)
      fabricRef.current.on("object:added", () => sendImage());
    else {
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
    fabricRef.current.forEachObject((obj) => {
      fabricRef.current.remove(obj);
    });
    socket.emit('clearCanvas');
  };

  const sendImage = () => {
    const imageData = fabricRef.current.toDataURL();
    socket.emit('newImageData', imageData);
  }

  if (!joined) {
    return <LoadingAnimation/>;
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
