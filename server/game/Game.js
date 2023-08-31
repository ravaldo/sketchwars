class Game {
	constructor(code) {
		this.gameCode = code;
		this.status = "SETUP"      // SETUP, WAITING_FOR_PLAYER, PAUSED, DRAWING, RESULTS; 
        this.redTeam = [];
        this.blueTeam = [];
        this.roundTime = 90;
        this.numOfRounds = 3;
        this.currentRoundNum = 1;
		this.timeLeft = null;
		this.isPaused = false;
		this.currentRoundNum = 0;
        this.TV = null
        this.Tablet = null
    }
}

function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = ""
    while (code.length <= 5)
      code += chars[Math.floor(Math.random()*chars.length)]
    return code;
}

module.exports = Game;