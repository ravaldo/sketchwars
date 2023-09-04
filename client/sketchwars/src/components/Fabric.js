import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { fabric } from "fabric";
import DrawingTools from "./DrawingTools";
import Timer from "./Timer";
import Scoreboard from "./Scoreboard";
import "./Fabric.css";

import socket from "../socket";

const Fabric = () => {
  const { gameCode } = useParams();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [joined, setJoined] = useState(false);

  useLayoutEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: "#eee",
      selection: false,
    });
    fabricRef.current = canvas;
    handleResize();
    setBrushSize("smallBrush");
    window.addEventListener("resize", handleResize);

    if (!joined) {
      socket.emit("joinGame", gameCode);

      socket.on("joined", (data) => {
        if (data) {
          setJoined(true);
          console.log("Tablet joined " + gameCode);
        }
      });

      socket.on("disconnect", () => {
        setJoined(false);
      });
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
    fabricRef.current.setWidth(window.innerWidth - 100);
    fabricRef.current.setHeight(window.innerHeight - 100);
  };

  const setBrushColour = (value) => {
    fabricRef.current.freeDrawingBrush.color = value;
  };

  const setBrushSize = (value) => {
    if (value === "smallBrush") fabricRef.current.freeDrawingBrush.width = 4;
    if (value === "mediumBrush") fabricRef.current.freeDrawingBrush.width = 16;
    if (value === "largeBrush") fabricRef.current.freeDrawingBrush.width = 25;
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
    socket.emit("sendImageData", { gameCode, imageData });
  };

  if (!joined) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div className="tv-container">
      <div className="content-container">
        <div className="timer-container">
          <Timer />
        </div>
        <div className="scoreboard-container">
          <Scoreboard />
        </div>
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
      <DrawingTools
        setBrushColour={setBrushColour}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
      />
    </div>
  );
};

export default Fabric;
