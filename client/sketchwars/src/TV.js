import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { fabric } from 'fabric';
import Timer from './components/Timer';
import socket from './socket';


const TV = () => {

    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [imgData, setImgData] = useState('');
    const [joined, setJoined] = useState(false);
    // const [start, setJoined] = useState(false);
    const gameRef = useRef("gameRef is null");

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

            socket.emit('createGame', (gameCode) => {
                gameRef.current = gameCode;
                socket.emit('joinGame', gameCode, 'TV', (success) => {
                    setJoined(success);
                })
            });

            socket.on('newImageData', (data) => {
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
            const img = new Image();
            img.src = imgData;
            img.onload = function () {
                canvasRef.current.getContext('2d').drawImage(img, 0, 0);
            };
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