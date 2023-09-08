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
        this.savedImages = []
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
            this.TV.emit('newImageData', data);
        });

        this.Tablet.on('newContextData', (data) => {
            this.TV.emit('newContextData', data);
        });

        this.Tablet.on('clearCanvas', () => {
            this.TV.emit('clearCanvas');
        });

        this.Tablet.on('startGame', () => {
            console.log("receieved start game request " + this.gameCode);
            this.startGame();
            this.sendState()
        });

        this.Tablet.on('incrementRed', () => {
            this.redScore = this.redScore+1
            this.sendState()
        });

        this.Tablet.on('incrementBlue', () => {
            this.blueScore = this.blueScore+1
            this.sendState()
        });

        this.Tablet.on('savedImage', (colour, player, word, imageData) => {
            let obj = {colour, player, word, imageData}
            // console.log(obj)
            this.savedImages.push ( {colour, player, word, imageData} )
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


    async startGame() {
        for (this.currentRoundNum; this.currentRoundNum <= this.numOfRounds; this.currentRoundNum++) {
            console.log(`${this.gameCode} round ${this.currentRoundNum} of ${this.numOfRounds} started`)
            await this.playRound();
            console.log(`${this.gameCode} round ${this.currentRoundNum} finished`)
        }
        this.endGame();
    }


    * nextPlayer() { // generator
        const redIterator = this.redTeam[Symbol.iterator]();
        const blueIterator = this.blueTeam[Symbol.iterator]();

        while (true) {
            const redPlayer = redIterator.next();
            if (!redPlayer.done)
                yield redPlayer.value;

            const bluePlayer = blueIterator.next();
            if (!bluePlayer.done)
                yield bluePlayer.value;

            if (redPlayer.done && bluePlayer.done) {
                break;
            }
        }
    }


    async playRound() {
        const players = this.nextPlayer();

        const playNextTurn = async () => {
            const player = players.next().value;
            console.log(`selected ${player}`);
            if (!player)
                return;

            const words = () => Array.from({ length: 100 }, () => Game.getRandomWord());
            // console.log(words());

            this.currentPlayer = player;
            this.status = "WAITING_FOR_PLAYER";
            this.sendState();

            await new Promise((resolve) => {

                const turnFinishedHandler = () => {
                    console.log(`${this.gameCode} ${player}'s turn finished early`);
                    this.stopTimer();
                    this.sendState();
                    this.Tablet.off("turnFinished", turnFinishedHandler);
                    resolve();
                };

                this.Tablet.on("turnFinished", turnFinishedHandler);

                this.Tablet.emit("turn", player, words(), (acknowledgment) => {
                    if (acknowledgment === "start") {
                        console.log(`${this.gameCode} ${player} hit start`);
                        this.status = "DRAWING";
                        this.sendState();
                        this.startTimer(player, () => {
                            console.log(`${this.gameCode} ${player}'s turn finished`);
                            this.stopTimer();
                            this.Tablet.off("turnFinished", turnFinishedHandler);
                            resolve();
                        });
                    } else {
                        console.error("Invalid acknowledgment");
                        resolve();
                    }
                });
            });
            await playNextTurn();  // continue
        };
        await playNextTurn();   // start the first turn
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
                console.log(elapsedTime);
                if (elapsedTime > 3) {
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
        if (temp.savedImages)
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
