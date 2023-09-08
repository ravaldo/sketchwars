
const port = process.env.PORT || 9000;

const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Game = require("./game/Game");


allowedOrigins = ["http://localhost:3000", "http://192.168.0.5:3000", "https://sketchwars.vercel.app"]
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

app.get('/', (req, res) => {
    res.send("Backend is up!");
});

app.get('/api/games', (req, res) => {
    const temp = {};
    for (gameCode in games)
        temp[gameCode] = games[gameCode].toString();
    res.json(temp);
});


app.get('/api/pics/:id', (req, res) => {
    const id = req.params.id;
    if (id in games)
        res.json(games[gameCode].savedImages);
    else
        res.send({Empty: "Empty"});
});

app.get('/api/game/:id', (req, res) => {
    const id = req.params.id;
    if (id in games)
        res.json(games[gameCode].toString());
    else
        res.send({Empty: "Empty"});
});



io.on("connection", (socket) => {
    console.log(`device connected from ${socket.handshake.address}`);

    socket.on("createGame", (callback) => {
        do {
            code = Game.generateCode();
        } while (code in games);
        games[code] = new Game(code);
        console.log("game greated: " + code);
        callback(code);
    });

    socket.on("joinGame", (gameCode, role, callback) => {
        if (gameCode in games) {
            games[gameCode].joinGame(socket, role)
            callback(true);
        }
        else
            callback(false);
    });

    socket.on('disconnect', () => {
        if (socket.gameCode) {
            console.log(`${socket.role} ${socket.gameCode} disconnected`);
            // games[socket.gameCode].dispose()
            // delete games[socket.gameCode]
        }
        else
            console.log(`${socket.handshake.address} disconnected`);
    });
});

httpServer.listen(port, () => {
    console.log("Server is running on port " + port);
});




