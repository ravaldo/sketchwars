import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { fabric } from 'fabric';
import Timer from './components/Timer';
import socket from './socket';


const TV = () => {

    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [imgData, setImgData] = useState('');
    const [joined, setJoined] = useState(false);
    const gameRef = useRef("gameRef is null");

    function generateCode() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        let code = ""
        while (code.length <= 5)
            code += chars[Math.floor(Math.random() * chars.length)]
        return code;
    }

    useLayoutEffect(() => {

        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: false,
            backgroundColor: '#fdf',
            selection: false
        });
        fabricRef.current = canvas;
        handleResize();
        window.addEventListener('resize', handleResize);

        if (!joined) {
            gameRef.current = generateCode();

            socket.emit('setupGame', gameRef.current)
            setJoined(true);

            socket.on('receivedImageData', (data) => {
                console.log("TV receieved an image")
                setImgData(data);
            })

            socket.on('disconnect', () => {
                setJoined(false);
            })
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, [joined]); // need to set joined as the canvas is already created and not rendered otherwise


    useEffect(() => {
        if (imgData) {
        console.log(imgData.x1, imgData.x2, imgData.y1, imgData.y2)
        var context = fabricRef.current.getContext('2d')
        context.strokeStyle = "blue";
        context.lineWidth = 9;
        context.beginPath();
        context.moveTo(imgData.x1, imgData.y1);
        context.lineTo(imgData.x2, imgData.y2);
        context.stroke();
        context.closePath();
        }
    }, [imgData]);

    const handleResize = () => {
        fabricRef.current.setWidth(window.innerWidth - 100)
        fabricRef.current.setHeight(window.innerHeight - 100)
    };

    const clearCanvas = () => {
        fabricRef.current.forEachObject(obj => {
            fabricRef.current.remove(obj);
        });
    };

    if (!joined) {
        return <div>Connecting to server...</div>;
    }

    return (
        <>
            <h2>{gameRef.current}</h2>
            <canvas ref={canvasRef} />
            <Timer/>
        </>
    );
};


export default TV