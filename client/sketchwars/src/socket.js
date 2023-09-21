import { io } from "socket.io-client";
import { socket_url } from "./api";

const socket = io(socket_url);

socket.on("connect", () => {
    console.log(`connected to backend at ${socket._opts.hostname}:${socket._opts.port}`);
    socket.isConnected = true;
});

socket.on("disconnect", () => {
    console.log("disconnected from backend");
    socket.isConnected = false;
});

socket.on('error', (error) => {
    console.error('Socket.io error:', error);
});

export default socket;
