const fs = require('fs');
const path = require("path");

const words = fs.readFileSync(path.resolve(__dirname,'./words.txt'), 'utf-8').split('\n');

class Game {
    constructor(code) {
        this.gameCode = code;
        this.status = "SETUP";  // SETUP, WAITING_FOR_PLAYER, PAUSED, DRAWING, RESULTS; 
        this.redTeam = [];
        this.blueTeam = [];
        this.redScore = 0;
        this.blueScore = 0;
        this.numOfRounds = 1;
        this.drawTime = 60;
        this.wordsPerTurn = 5;
        this.currentRoundNum = 1;
        this.isPaused = false;
        this.TV = null;
        this.Tablet = null;
        return this;
    }

    turn() {

        // generate player order 
        // generate words for turn
        // emit the player and word
        // check for pause and emit
        // check for unpause and emit

    }

    
    joinGame(socket, role) {
        this[role] = socket;
        socket.role = role;
        socket.gameCode = this.gameCode;
        console.log(`a ${role} joined ${this.gameCode}`);
        this.TV.emit('gameState', this.toString());

        if (role=="Tablet")
          this.attachTabletListeners();
    }


    attachTVListeners() { }


    attachTabletListeners() {

        this.Tablet.on("pause", () => {
            this.isPaused = true;
            this.TV.emit("pause")
        });

        this.Tablet.on("unpause", () => {
            this.isPaused = false;
            this.TV.emit("unpause")
        });

        this.Tablet.on('newImageData', (data) => {
            console.log("new imageData for " + this.gameCode);
            this.TV.emit('newImageData', data);
        });

        this.Tablet.on('newContextData', (data) => {
            console.log("new contextData for " + this.gameCode);
            this.TV.emit('newContextData', data);
        });



        this.Tablet.on('startGame', () => {
            console.log("receieved start game request " + this.gameCode);
            this.status = "WAITING_FOR_PLAYER";
            this.updateTV()
        });


        this.Tablet.on('settings', ( settings ) => {
            this.numOfRounds = settings.numRounds;
            this.drawTime = settings.drawTime;
            this.wordsPerTurn = settings.wordsPerTurn;
            this.redTeam = settings.redTeam;
            this.blueTeam = settings.blueTeam;
            this.updateTV()   
        });


    }

    updateTV() {
        this.TV.emit('gameState', this.toString());
        if (this.Tablet)
            this.Tablet.emit('gameState', this.toString());
    }


    // printing a socket out to console or the response parser throws a circular
    // JSON error so use this to replace the socket object with its id
    toString() {
        const temp = { ...this }
        if (temp.TV)
            temp.TV = temp.TV.id;
        if (temp.Tablet)
            temp.Tablet = temp.Tablet.id;
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
