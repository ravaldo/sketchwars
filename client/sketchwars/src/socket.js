import { io } from "socket.io-client";
import { socket_url } from "./api";

const socket = io(socket_url);

socket.on("connect", () => {
    console.log(`socket connected: ${socket._opts.hostname}:${socket._opts.port}`);
    socket.isConnected = true;
});

socket.on("disconnect", (reason) => {
    console.log(`socket disconnected: ${reason}`)
    socket.isConnected = false;
});

socket.on('error', (error) => {
    console.error('socket.io error:', error);
});

export default socket;
