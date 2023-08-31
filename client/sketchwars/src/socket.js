
// should fire up and connect the first time it's imported
// the same socket is then used throughout for each component

import { io } from "socket.io-client";

const socket = io("ws://localhost:9000");

socket.on("connect", () => {
    console.log("connected to server")
});

socket.on("disconnect", () => {
    console.log("disconnected from server")
});

export default socket;
