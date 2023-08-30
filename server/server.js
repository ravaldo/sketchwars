const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");


const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST"
}));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


app.get('/api/game', (req, res) => {
  res.json({ message: 'API response' });
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.handshake.address}`);

  socket.on('sendImageData', (imageDataObject) => {
    console.log("received image data");
    socket.broadcast.emit('receivedImageData', imageDataObject);
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.handshake.address}`);
  });
});

httpServer.listen(9000, () => {
  console.log("Server is running on port 9000");
});




