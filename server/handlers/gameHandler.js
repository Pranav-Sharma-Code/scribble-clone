import roomManager from "../managers/RoomManager.js";

const gameHandler = (io, socket) => {

    // ----------Start Game--------------

    socket.on("start_game", ({ roomCode }) => {
        const room = roomManager.getRoom(roomCode);

        if (!room) return;
        if (room.hostId !== socket.id) return;

        if (room.players.length < 2) {
            return io.to(room.hostId).emit(
                "game_error", "Minimum 2 players required"
            );
        }

        room.gameStarted = true;

        io.to(roomCode).emit("game_started");
    });


}

export default gameHandler;