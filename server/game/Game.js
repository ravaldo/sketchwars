const fs = require('fs');
const path = require("path");

const words = fs.readFileSync(path.resolve(__dirname, './words.txt'), 'utf-8').split('\n');

class Game {
    constructor(code) {
        this.gameCode = code;
        this.status = "SETUP";  // SETUP, WAITING_FOR_PLAYER, DRAWING, RESULTS; 
        this.redTeam = [];
        this.blueTeam = [];
        this.redScore = 0;
        this.blueScore = 0;
        this.numOfRounds = 1;
        this.drawTime = 60;
        this.wordsPerTurn = 5;
        this.currentRoundNum = 1;
        this.isPaused = false;      // could refactor and make this a possible .status
        this.timer = null

        this.TV = null;
        this.Tablet = null;
        this.savedImages = [];
        return this;
    }


    joinGame(socket, role) {
        if (this.Tablet?.id == socket.id) { // ignore tablets reconnecting
            this.sendState();
            return;
        }
        this[role] = socket;
        socket.role = role; //add these to the socket itself for debugging
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
            this.sendState();
        });

        this.Tablet.on("unpause", () => {
            console.log("receieved a UNpause command")
            this.isPaused = false;
            this.sendState()
        });

        this.Tablet.on('newImageData', (data) => {
            this.TV?.emit('newImageData', data);
        });

        this.Tablet.on('newContextData', (data) => {
            this.TV?.emit('newContextData', data);
        });

        this.Tablet.on('tabletDimensions', (data) => {
            this.TV?.emit('tabletDimensions', data);
        });

        this.Tablet.on('clearCanvas', () => {
            this.TV?.emit('clearCanvas');
        });

        this.Tablet.on('startGame', () => {
            console.log("receieved start game request " + this.gameCode);
            this.startGame();
            this.sendState();
        });

        this.Tablet.on('incrementRed', () => {
            this.redScore++;
            this.sendState();
        });

        this.Tablet.on('incrementBlue', () => {
            this.blueScore++;
            this.sendState()
        });

        this.Tablet.on('savedImage', (colour, player, word, imageData) => {
            this.savedImages.push({ colour, player, word, imageData });
        });

        this.Tablet.on('settings', (settings) => {
            this.numOfRounds = settings.numRounds;
            this.drawTime = settings.drawTime;
            this.wordsPerTurn = settings.wordsPerTurn;
            this.redTeam = settings.redTeam;
            this.blueTeam = settings.blueTeam;
            this.sendState()
        });

        this.Tablet.on("turnFinished", () => {
            console.log(`${this.gameCode} ${this.player}'s turn finished early`);
            this.stopTimer();
            this.sendState();
            this.turnResolve();
        });

        this.Tablet.on("startDrawing", () => {
            console.log(`${this.gameCode} ${this.currentPlayer} hit start`);
            this.status = "DRAWING";
            this.drawTimeLeft = this.drawTime;
            this.sendState();
            this.startTimer(this.currentPlayer, () => {
                console.log(`${this.gameCode} ${this.currentPlayer}'s turn finished`);
                this.stopTimer();
                this.sendState();
                this.turnResolve();
            });
        });

        this.Tablet.on("updateWordGuesses", words => {
            this.turnWords = words;
            this.sendState();
        });

    }

    async startGame() {
        for (this.currentRoundNum; this.currentRoundNum <= this.numOfRounds; this.currentRoundNum++) {
            console.log(`${this.gameCode} round ${this.currentRoundNum} of ${this.numOfRounds} started`)
            await this.playRound();
            console.log(`${this.gameCode} round ${this.currentRoundNum} finished`)
        }
        this.endGame();
    }

    async playRound() {
        const redPlayers = this.redTeam.slice();
        const bluePlayers = this.blueTeam.slice();

        while (redPlayers.length > 0 || bluePlayers.length > 0) {
            if (redPlayers.length > 0)
                await this.takeTurn(redPlayers.shift());
            if (bluePlayers.length > 0)
                await this.takeTurn(bluePlayers.shift());
        }
    }

    async takeTurn(player) {
        console.log(`selected ${player}`);
        this.currentPlayer = player;
        const words = Array.from({ length: this.wordsPerTurn }, () => Game.getRandomWord().trim());
        this.turnWords = words.map(w => ({ word: w, guess: "unattempted" }))
        this.status = "WAITING_FOR_PLAYER";
        this.sendState();
        this.TV?.emit('clearCanvas');
        await new Promise(resolve => this.turnResolve = resolve);
    }

    endGame() {
        console.log(this.gameCode + " game ended")
        this.status = "RESULTS";
        this.sendState()
    }


    startTimer(player, callback) {
        let startTime = Date.now();
        let elapsedTime = 0;

        const timerCallback = () => {
            if (!this.isPaused) {
                elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                this.drawTimeLeft = this.drawTime - elapsedTime;
                if (elapsedTime > this.drawTime) {
                    console.log(`${this.gameCode} ${player} ran out of time`);
                    this.sendState();
                    callback();
                } else {
                    this.timer = setTimeout(timerCallback, 1000);
                }
            } else {
                // account for the time spent paused
                startTime = Date.now() - (elapsedTime * 1000);
                this.timer = setTimeout(timerCallback, 1000);
            }
        };
        this.timer = setTimeout(timerCallback, 1000);
    }


    stopTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }


    sendState() {
        if (this.TV)
            this.TV.emit('gameState', this.toString());
        if (this.Tablet)
            this.Tablet.emit('gameState', this.toString());
    }


    dispose() {
        this.stopTimer();
        this.TV = null;
        this.Tablet = null;
        this.savedImages = null;
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
        if (temp.savedImages) // don't want to send images back to the clients during a game
            temp.savedImages = temp.savedImages.length;
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
