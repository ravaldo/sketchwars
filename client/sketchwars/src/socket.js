
import { io } from "socket.io-client";


let url = '';

if (process.env.NODE_ENV === "production") {
    url = process.env.REACT_APP_BACKEND_SOCKET_URL
}

// assume the backend is running on the same domain as the react app at port 9000
else {
    const { protocol, host } = window.location;
    const domain = host.replace(/:\d{4}$/, "");
    url = `${protocol === "https:" ? "wss" : "ws"}://${domain}:9000`;
}
const socket = io(url);

socket.on("connect", () => {
    console.log(`connected to backend at ${socket._opts.hostname}:${socket._opts.port}`);
    socket.isConnected = true;
});

socket.on("disconnect", () => {
    console.log("disconnected from backend");
    socket.isConnected = false;
});

export default socket;
