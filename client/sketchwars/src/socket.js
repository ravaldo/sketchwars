
import { io } from "socket.io-client";

const { protocol, host } = window.location;

// assume the backend is running on the same domain as the react app
// and at port 9000... unless we're hosted at vercel.com

let socketURL = '';
if (host.includes("vercel"))
    socketURL = "https://sketchwars-backend.vercel.app"
else {
    const domain = host.replace(/:\d{4}$/, "");
    socketURL = `${protocol === "https:" ? "wss" : "ws"}://${domain}:9000`;
}
const socket = io(socketURL);

socket.on("connect", () => {
    console.log(`connected to backend at ${socket._opts.hostname}:${socket._opts.port}`);
    socket.isConnected = true;
});

socket.on("disconnect", () => {
    console.log("disconnected from backend");
    socket.isConnected = false;
});

export default socket;
