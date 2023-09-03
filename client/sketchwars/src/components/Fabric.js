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

    
        canvas.on('mouse:down', (e) => {
          x = e.e.clientX;
          y = e.e.clientY
          isDrawing = true;
        });
    
        canvas.on('mouse:move', (e) => {
          if (isDrawing) {
            const x2 = e.e.clientX
            const y2 = e.e.clientY
            console.log(e)

            console.log(e.e.clientX)

            const imageData = {
              x1: x,
              y1: y,
              x2: x2,
              y2: y2,
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
