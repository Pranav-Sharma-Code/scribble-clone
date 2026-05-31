import GameManager from "../managers/GameManager.js";

export default class Room {
    constructor(roomCode, hostId, settings) {
        this.roomCode = roomCode;
        this.hostId = hostId;
        this.settings = {
            maxPlayers: settings.maxPlayers || 8,
            maxRounds: settings.maxRounds || 3,
            drawTime: settings.drawTime || 75,
            gameMode: settings.gameMode || "normal",
            category: settings.category || "all",
            wordCount: settings.wordCount || 3,
            hintsEnabled: settings.hintsEnabled ?? true,
            hintCount: settings.hintCount || 2
        };
        this.players = [];
        this.canvasStrokes = [];
        this.gameManager = new GameManager(this);
        this.gameStarted = false;
    }



    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(socketId) {
        this.players = this.players.filter((player) => player.id !== socketId);
    }

    getPlayer(socketId) {
        return this.players.find(
            (player) => player.id === socketId
        );
    }

    isEmpty() {
        return this.players.length === 0;
    }

}   
