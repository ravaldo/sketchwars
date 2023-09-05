
const port = process.env.PORT || 9000;

const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Game = require("./game/Game");


allowedOrigins = ["http://localhost:3000", "http://192.168.0.5:3000", "https://sketchwars.vercel.app", "http://192.168.0.42:3000", "http://172.16.0.220:3000", "http://172.16.0.1:3000"]
const app = express();
app.use(cors({
    origin: allowedOrigins,
    methods: "GET,POST"
}));
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});


const games = {};

app.get('/api/games', (req, res) => {
    const temp = {};
    for (gameCode in games)
        temp[gameCode] = games[gameCode].toString();
    res.json(temp);
});

app.get('/', (req, res) => {
    res.send( "Backend is up!");
});

io.on("connection", (socket) => {
    console.log(`device connected from ${socket.handshake.address}`);

    socket.on("setupGame", (gameCode) => {
        const game = new Game(gameCode);
        game.TV = socket
        games[gameCode] = game;

        // for debugging
        socket.role = "TV"
        socket.gameCode = gameCode;
        console.log("a TV joined " + gameCode)
    });

    socket.on("joinGame", (gameCode) => {
        if (gameCode in games) {
            games[gameCode].Tablet = socket.id;

            socket.emit("joined", true);

            // for debugging
            socket.role = "Tablet"
            socket.gameCode = gameCode;
            console.log("a Tablet joined " + gameCode)
        }
        else {
            console.log(`a Tablet tried to join ${gameCode} which doesn't exist`);
        }
    });
    
    const throttle = (callback, delay) => {
        let previousCall = new Date().getTime();
        return function() {
          const time = new Date().getTime();
  
          if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
          }
        };
      };

    socket.on('sendImageData', ({ gameCode, imageData }) => {
        console.log("received image for " + gameCode);
        console.log(imageData)
        if (!games[gameCode].TV)
            console.log("... but there's no associated TV");
        else
            games[gameCode].TV.emit('receivedImageData', imageData);
    });


    socket.on('clearTVCanvas', (clearTVCanvas) => {
        console.log('received TV clear')
        socket.emit('clearTVCanvas', clearTVCanvas);
      });


    socket.on('disconnect', () => {
        if (socket.role)
            console.log(`${socket.role} ${socket.gameCode} disconnected`);
        else
            console.log(`${socket.handshake.address} disconnected`);
    
  });
});

httpServer.listen(port, () => {
    console.log("Server is running on port " + port);
});




