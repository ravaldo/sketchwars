import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useParams } from "react-router-dom";
import { fabric } from 'fabric';
import DrawingTools from './DrawingTools';
import Timer from './Timer';
import Scoreboard from './Scoreboard';

import socket from '../socket';

const Fabric = () => {

   

    const { gameCode } = useParams();
    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [joined, setJoined] = useState(false);
    


    useLayoutEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
            backgroundColor: '#eee',
            selection: false
        });
        fabricRef.current = canvas;
        handleResize();
        setBrushSize("smallBrush")
        window.addEventListener('resize', handleResize);


        if (!joined) {
            socket.emit('joinGame', gameCode)

            socket.on('joined', (data) => {
                if (data) {
                    setJoined(true);
                    console.log("Tablet joined " + gameCode)
                }
            })

            socket.on('disconnect', () => {
                setJoined(false);
            })
        }

        // canvas.on('object:added', () => {
        //     submitImage();
        // });

        let isDrawing = false;
        let x = 0;
        let y = 0;
        let x2 = 0;
        let y2 = 0;
        let sum = 0;
        // let lineWidth = 3;
        // let selectedColour = "#000"
        let imageData = {}


        // if(isMobile){
    
        canvas.on('mouse:down', (e) => {
          x = e.e.clientX || e.e.changedTouches[0].clientX
          y = e.e.clientY || e.e.changedTouches[0].clientY
          isDrawing = true;
          imageData = {
            x1: x,
            y1: y,
            x2: x,
            y2: y,
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
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, [joined]);

    const throttle = (callback, delay) => {
        let previousCall = new Date().getTime();
        return function() {
          const time = new Date().getTime();
  
          if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
          }
        };
      };

    const handleResize = () => {
        fabricRef.current.setWidth(window.innerWidth - 100)
        fabricRef.current.setHeight(window.innerHeight - 100)
    };

    const setBrushColour = (value) => {
        fabricRef.current.freeDrawingBrush.color = value;
        // colour = value;
    };

    const setBrushSize = (value) => {
        if (value == "smallBrush")
            fabricRef.current.freeDrawingBrush.width = 4;
            // lineWidth = 4;
        if (value == "mediumBrush")
            fabricRef.current.freeDrawingBrush.width = 16;
            // lineWidth = 16;
        if (value == "largeBrush")
            fabricRef.current.freeDrawingBrush.width = 25;
            // lineWidth = 25;
    }

    const clearCanvas = () => {
        fabricRef.current.forEachObject(obj => {
            fabricRef.current.remove(obj);
            socket.emit('clearTVCanvas', "")
        });
    };


    // const submitImage = () => {
    //     const imageData = fabricRef.current.toDataURL();
    //     socket.emit('sendImageData', { gameCode, imageData });
    // }


    if (!joined) {
        return <div>Connecting to server...</div>;
    }

    return (
        <>
            <h2>{gameCode}</h2>

            <canvas ref={canvasRef} />
            <DrawingTools setBrushColour={setBrushColour} setBrushSize={setBrushSize} clearCanvas={clearCanvas} />
            <Timer />
            <Scoreboard/>
        </>
    );
};

export default Fabric;