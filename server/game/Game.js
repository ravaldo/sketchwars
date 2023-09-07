const fs = require('fs');
const path = require("path");
const { stdout } = require('process');

const words = fs.readFileSync(path.resolve(__dirname, './words.txt'), 'utf-8').split('\n');

class Game {
    constructor(code) {
        this.gameCode = code;
        this.status = "SETUP";  // SETUP, WAITING_FOR_PLAYER, PAUSED, DRAWING, RESULTS; 
        this.redTeam = [];
        this.blueTeam = [];
        this.redScore = 0;
        this.blueScore = 0;
        this.numOfRounds = 1;
        this.drawTime = 10;
        this.wordsPerTurn = 5;
        this.currentRoundNum = 1;
        this.isPaused = false;
        this.timer = null
        this.TV = null;
        this.Tablet = null;
        return this;
    }


    joinGame(socket, role) {
        this[role] = socket;
        socket.role = role;
        socket.gameCode = this.gameCode;
        console.log(`a ${role} joined ${this.gameCode}`);
        this.sendState();

        if (role == "Tablet")
            this.attachTabletListeners();
    }


    attachTVListeners() { }


    attachTabletListeners() {

        this.Tablet.on("pause", () => {
            console.log("receieved a pause command")
            this.isPaused = true;
            this.sendState()

        });

        this.Tablet.on("unpause", () => {
            console.log("receieved a UNpause command")
            this.isPaused = false;
            this.sendState()
        });

        this.Tablet.on('newImageData', (data) => {
            console.log("new imageData for " + this.gameCode);
            this.TV.emit('newImageData', data);
        });

        this.Tablet.on('newContextData', (data) => {
            console.log("new contextData for " + this.gameCode);
            this.TV.emit('newContextData', data);
        });

        this.Tablet.on('clearCanvas', () => {
            this.TV.emit('clearCanvas');
        });

        this.Tablet.on('startGame', () => {
            console.log("receieved start game request " + this.gameCode);
            this.status = "WAITING_FOR_PLAYER";
            this.startGame();
            this.sendState()
        });

        this.Tablet.on('playerGo', () => {
            console.log("receieved player go request " + this.gameCode);
            this.status = "DRAWING";
            this.sendState()
        });

        this.Tablet.on('settings', (settings) => {
            this.numOfRounds = settings.numRounds;
            this.drawTime = settings.drawTime;
            this.wordsPerTurn = settings.wordsPerTurn;
            this.redTeam = settings.redTeam;
            this.blueTeam = settings.blueTeam;
            this.sendState()
        });



    }


   
    sendState() {
        this.TV.emit('gameState', this.toString());
        if (this.Tablet)
            this.Tablet.emit('gameState', this.toString());
    }


    dispose() {
        this.TV = null
        this.Tablet = null
    }


    // printing a socket out to console or the response parser throws a circular
    // JSON error so use this to replace the socket object with its id
    toString() {
        const temp = { ...this }
        if (temp.TV)
            temp.TV = temp.TV.id;
        if (temp.Tablet)
            temp.Tablet = temp.Tablet.id;
        if (temp.timer)
            temp.timer = null;
        return temp;
    }


    static getRandomWord() {
        return words[Math.floor(Math.random() * words.length)]
    }


    static generateCode() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        let code = ""
        while (code.length < 4)
            code += chars[Math.floor(Math.random() * chars.length)]
        return code;
    }

}


module.exports = Game;
