import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

import socket from './socket';

const TV = () => {
    console.log("TV component started")

    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [imgData, setImgData] = useState('');

    const [joined, setJoined] = useState(false);
    const gameRef = useRef(generateCode());

    function generateCode() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        let code = ""
        while (code.length <= 5)
            code += chars[Math.floor(Math.random() * chars.length)]
        console.log(code)
        return code;
    }

    useEffect(() => {

        // setGameCode(generateCode());

        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: false,
            backgroundColor: '#fce',
            selection: false
        });
        fabricRef.current = canvas;
        handleResize();
        window.addEventListener('resize', handleResize);

        if (!joined) {
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
            console.log("TV component shutting down")
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, [joined]);



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
        </>
    );
};


export default TV