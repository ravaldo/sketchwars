import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { io } from "socket.io-client";
import Timer from './components/Timer';
const socket = io("ws://localhost:9000")

const TV = () => {

    const canvasRef = useRef(null);
    const fabricRef = useRef(null);
    const [img, setImg] = useState('');

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: false,
            backgroundColor: '#fce',
            selection: false
        });
        fabricRef.current = canvas;
        handleResize();
        window.addEventListener('resize', handleResize);

        socket.on('receivedImageData', (data) => {
            console.log(data)
            setImg(data);
        })

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
            socket.off('receivedImageData');
        };
    }, []);



    useEffect(() => {
        if (img) {
            const new_img = new Image();
            new_img.src = img;
            new_img.onload = function() {
                canvasRef.current.getContext('2d').drawImage(new_img, 0, 0);
            };
        } 
    }, [img]);

    const handleResize = () => {
        fabricRef.current.setWidth(window.innerWidth - 100)
        fabricRef.current.setHeight(window.innerHeight - 100)
    };

    const clearCanvas = () => {
        fabricRef.current.forEachObject(obj => {
            fabricRef.current.remove(obj);
        });
    };

    return (
        <>
            <canvas ref={canvasRef} />
            <Timer/>
        </>
    );
};


export default TV