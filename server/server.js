const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Game = require("./game/Game");


const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "https://sketchwars.vercel.app"],
  methods: "GET,POST"
}));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://sketchwars.vercel.app"],
  }
});



const games = {};

app.get('/api/game', (req, res) => {
  res.json(games);
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.handshake.address}`);

  socket.on("setupGame", (gameCode) => {
    const game = new Game(gameCode);
    game.TV = socket
    games[gameCode] = game;
    console.log("a TV joined " + gameCode)
  });

  socket.on("joinGame", (gameCode) => {
    if (gameCode in games) {
      games[gameCode].Tablet = socket;
      console.log("a Tablet joined " + gameCode)
    }
    else {
      console.log(`a Tablet tried to join ${gameCode} which doesn't exist1`);
    }
  });

  socket.on('sendImageData', ({ gameCode, imageDataObject }) => {
    console.log("received image data from " + gameCode);
    games[gameCode].TV.emit('receivedImageData', imageDataObject);
  });



  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.handshake.address}`);
  });
});

httpServer.listen(9000, () => {
  console.log("Server is running on port 9000");
});




