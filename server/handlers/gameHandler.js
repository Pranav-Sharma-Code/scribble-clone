import roomManager from "../managers/RoomManager.js";

const gameHandler = (io, socket) => {

    // ----------Start Game--------------

    socket.on("start_game", ({ roomCode }) => {

        console.log("======== START_GAME ========")

        const room = roomManager.getRoom(roomCode);

        if (!room) return;
        if (room.hostId !== socket.id) return;

        if (room.players.length < 2) {
            return io.to(room.hostId).emit(
                "game_error", "Minimum 2 players required"
            );
        }

        room.gameStarted = true;

        const gameState = room.gameManager.startGame(io);
        console.log("GAME STATE:", gameState);

        room.gameManager.emitGameState(io);

        io.to(roomCode).emit("game_started", gameState);

        console.log(
            "EMITTING CHOOSE WORD TO:",
            gameState.drawerId
        );

        setTimeout(() => {
            io.to(gameState.drawerId).emit("choose_word", {
                words: gameState.wordOptions
            });
        }, 500);
        console.log("after io.emit ")
    },);

    // ----------------Word-------------------------

    socket.on("choose_word", ({ roomCode, word }) => {
        const room = roomManager.getRoom(roomCode);
        if (!room) return;
        if (room.gameManager.currentDrawerId !== socket.id) return;
        clearTimeout(room.gameManager.wordSelectionTimer);

        room.gameManager.currentWord = word;
        room.gameManager.displayWord = room.gameManager.generateDisplayWord();
        room.gameManager.revealedIndexes = [];
        room.gameManager.startTimer(io);

        io.to(roomCode).emit("word_selected", { displayWord: room.gameManager.displayWord });
        io.to(socket.id).emit("drawer_word",{ word });
    });


    // --------------- Guess ---------------------

    socket.on("guess_word", ({ roomCode, guess }) => {

        const room = roomManager.getRoom(roomCode);
        if (!room) return;
        const game = room.gameManager;
        if (!game.currentWord) return;

        if (socket.id === game.currentDrawerId) return;
        if (game.guessedPlayers.includes(socket.id)) return;

        if (guess.toLowerCase().trim() === game.currentWord.replace(/\+/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim()) {
            const player = room.getPlayer(socket.id);
            game.handleCorrectGuess(player, io);
        }
        else {
            socket.emit("guess_wrong", { guess });
        }
    });


}

export default gameHandler;