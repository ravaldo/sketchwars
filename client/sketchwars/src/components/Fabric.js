import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import DrawingTools from './DrawingTools';

import { io } from "socket.io-client";

const Fabric = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const socket = io("ws://localhost:5000")

  
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      backgroundColor: '#eee',
      selection: false
    });
    fabricRef.current = canvas;
    handleResize();
    setBrushSize("smallBrush")
    window.addEventListener('resize', handleResize);
    canvas.on('object:added', () => {
      submitImage();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  const handleResize = () => {
    fabricRef.current.setWidth(window.innerWidth - 100)
    fabricRef.current.setHeight(window.innerHeight - 100)
  };

  const setBrushColour = (value) => {
    fabricRef.current.freeDrawingBrush.color = value;
  };

  const setBrushSize = (value) => {
    if (value == "smallBrush")
      fabricRef.current.freeDrawingBrush.width = 4;
    if (value == "mediumBrush")
      fabricRef.current.freeDrawingBrush.width = 16;
    if (value == "largeBrush")
      fabricRef.current.freeDrawingBrush.width = 25;
  }

  const clearCanvas = () => {
    fabricRef.current.forEachObject(obj => {
      fabricRef.current.remove(obj);
    });
  };


  const submitImage = () => {
    const imagedata = fabricRef.current.toDataURL();
    socket.emit('sendImageData', imagedata);
  }


  return (
    <>
      <button onClick={submitImage}>Submit</button>
      <canvas ref={canvasRef} />
      <DrawingTools setBrushColour={setBrushColour} setBrushSize={setBrushSize} clearCanvas={clearCanvas} />
    </>
  );
};

export default Fabric;
