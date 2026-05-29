export default class Room {
    constructor(roomCode, hostId) {
        this.roomCode = roomCode;
        this.hostId = hostId;
        this.players = [];
        this.gameStarted = false;
        this.settings = {
            rounds: 3,
            drawTime: 75,
            maxPlayers: 8
        };
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
