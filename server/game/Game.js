const fs = require('fs');
const path = require("path");

const words = fs.readFileSync(path.resolve(__dirname,'./words.txt'), 'utf-8').split('\n');

class Game {
    constructor(code) {
        this.gameCode = code;
        this.status = "SETUP";  // SETUP, WAITING_FOR_PLAYER, PAUSED, DRAWING, RESULTS; 
        this.redTeam = [];
        this.blueTeam = [];
        this.drawTime = 90;
        this.numOfRounds = 3;
        this.currentRoundNum = 1;
        this.isPaused = false;
        this.TV = null
        this.Tablet = null
        return this;
    }

    
    joinGame(socket, role) {
        this[role] = socket;
        socket.role = role;
        socket.gameCode = this.gameCode;
        console.log(`a ${role} joined ${this.gameCode}`);

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

        this.Tablet.on('newImageData', (imageData) => {
            console.log("new imageData for " + this.gameCode);
            this.TV.emit('newImageData', imageData);
        });

        this.Tablet.on('setupGame', ( settings ) => {
            this.redTeam = settings.redTeam;
            this.blueTeam = settings.blueTeam;
            this.drawTime = settings.drawTime;
            this.numOfRounds = settings.numOfRounds;
            console.log("settings applied for " + this.gameCode);
        });



    }


    getRandomWord() {
        return words[Math.floor(Math.random() * words.length)]
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
