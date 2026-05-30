import words from "../data/Words.js";


export default class GameManager {
    constructor(room) {
        this.room = room;
        this.currentRound = 1;
        this.currentDrawerIndex = 0;
        this.currentDrawerId = null;
        this.timeLeft = room.settings.drawTime;
        this.timer = null
        this.currentWord = null;
        this.guessedPlayers = [];
        this.status = "waiting";
    }

    startGame(io) {
        console.log("GAME STARTED");
        console.log("PLAYERS:", this.room.players);

        const firstDrawer = this.room.players[this.currentDrawerIndex];
        this.currentDrawerId = firstDrawer.id;
        const wordOptions = this.getRandomWords(3);

        this.wordSelectionTimer = setTimeout(() => {
            if (!this.currentWord) {
                this.currentWord = wordOptions[0];
                io.to(this.room.roomCode).emit("word_selected", {
                    wordLength: wordOptions[0].length
                });
                io.to(this.currentDrawerId).emit("drawer_word", {
                    word: wordOptions[0]
                });
                this.startTimer(io);
            }
        }, 15000)

        this.room.gameStarted = true;
        this.status = "playing";

        console.log("DRAWER:", this.currentDrawerId);
        console.log("WORDS:", wordOptions);

        return {
            round: this.currentRound,
            drawerId: this.currentDrawerId,
            wordOptions
        };
    }

    getRandomWords(count = 3) {

        const categories = Object.keys(words);
        const selectedWords = [];

        while (selectedWords.length < count) {

            const categary = categories[Math.floor(Math.random() * categories.length)];
            const arr = words[categary];
            const word = arr[Math.floor(Math.random() * arr.length)]
            if (!selectedWords.includes(word)) selectedWords.push(word);
        }
        return selectedWords;
    }

    startTimer(io) {
        this.timeLeft = this.room.settings.drawTime;
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.emitGameState(io);

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.endRound(io);
            }
        }, 1000);
    }

    endRound(io) {

        io.to(this.room.roomCode).emit("round_end", {
            word: this.currentWord
        });

        setTimeout(() => {
            this.nextTurn(io);
        }, 5000);
    }

    nextTurn(io) {

        if (this.room.players.length === 0) {
            return;
        }
        
        this.room.canvasStrokes = [];
        io.to(this.room.roomCode).emit("canvas_clear");
    
        if (this.currentDrawerIndex >= this.room.players.length) {
            this.currentDrawerIndex = 0;
        }
        clearTimeout(this.wordSelectionTimer);
        console.log("=== NEXT TURN ===");
        console.log("Players:", this.room.players);
        console.log("Length:", this.room.players.length);
        console.log("Current Index:", this.currentDrawerIndex);
        this.currentDrawerIndex++;
        this.currentWord = null;
        this.guessedPlayers = [];

        if (this.currentDrawerIndex >= this.room.players.length) {
            this.currentDrawerIndex = 0;
            this.currentRound++;
        }

        if (this.currentRound > this.room.settings.maxRounds) {
            return this.endGame(io);
        }

        const drawer = this.room.players[this.currentDrawerIndex];
        if (!drawer) {
            console.log("DRAWER NOT FOUND");
            console.log(this.room.players);
            console.log(this.currentDrawerIndex);
            return;
        }

        this.currentDrawerId = drawer.id;
        const wordOptions = this.getRandomWords(3);

        io.to(this.room.roomCode).emit("new_round", {
            round: this.currentRound,
            drawerId: this.currentDrawerId
        });

        io.to(drawer.id).emit("choose_word", {
            words: wordOptions
        });

        this.wordSelectionTimer = setTimeout(() => {
            if (!this.currentWord) {
                this.currentWord = wordOptions[0];
                io.to(this.room.roomCode).emit("word_selected", {
                    wordLength: wordOptions[0].length
                });
                io.to(drawer.id).emit("drawer_word", {
                    word: wordOptions[0]
                });
                this.startTimer(io);
            }
        }, 15000);
    }

    endGame(io) {
        this.room.gameStarted = false;
        this.status = "finished";
        const leaderboard = [...this.room.players].sort((a, b) => b.score - a.score);

        io.to(this.room.roomCode).emit("game_over", {
            winner: leaderboard[0],
            leaderboard
        });
    }

    handleCorrectGuess(player, io) {

        if (this.guessedPlayers.includes(player.id)) return;
        this.guessedPlayers.push(player.id);

        player.score += this.timeLeft * 5;

        const drawer = this.room.players.find(p => p.id === this.currentDrawerId);

        if (drawer) {
            drawer.score += Math.floor(this.timeLeft * 2);
        }

        io.to(this.room.roomCode).emit("leaderboard_update", this.room.players);

        io.to(this.room.roomCode).emit("guess_correct", { playerId: player.id, playerName: player.name, score: player.score, scoreEarned: this.timeLeft * 5 });



        const remainingPlayers = this.room.players.filter(
            p => p.id !== this.currentDrawerId);

        if (this.guessedPlayers.length >= remainingPlayers.length) {

            clearInterval(this.timer);
            this.endRound(io);
        }
    }

    emitGameState = (io) => {
        io.to(this.room.roomCode).emit("game_state", {
            status: this.status,
            currentRound: this.currentRound,
            maxRounds: this.room.settings.maxRounds,
            drawerId: this.currentDrawerId,
            timeLeft: this.timeLeft,
            guessedPlayers: this.guessedPlayers,
            word: this.currentWord
                ? "_".repeat(this.currentWord.length)
                : ""
        }
        );
    }

}