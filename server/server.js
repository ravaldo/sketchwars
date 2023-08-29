const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:*"
  }
});

app.use(cors());

app.get('/api/game', (req, res) => {
  res.json({ message: 'API response' });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on('sendImageData', (imageDataObject) => {
    console.log("Received image data");

    socket.broadcast.emit('receivedImageData', imageDataObject);
  });

  socket.on('disconnect', () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(5000, () => {
  console.log("Server is running on port 5000");
});




