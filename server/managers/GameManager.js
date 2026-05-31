import WordManager from "../utils/WordManager.js";
import HintManager from "../utils/HintManager.js";


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
        this.displayWord = "";
        this.revealedIndexes = [];
        this.hintTimers = [];
        this.wordSelectionTimer = null;
    }

    startGame(io) {
        const firstDrawer = this.room.players[this.currentDrawerIndex];
        this.currentDrawerId = firstDrawer.id;

        this.room.gameStarted = true;
        this.status = "playing";
        this.startWordSelection(io);

        return {
            round: this.currentRound,
            drawerId: this.currentDrawerId
        };
    }


    startTimer(io) {
        this.timeLeft = this.room.settings.drawTime;
        this.scheduleHints(io);
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
        this.hintTimers.forEach(timer => clearTimeout(timer));
        this.hintTimers = [];
        io.to(this.room.roomCode).emit("round_end", {
            word: this.currentWord
        });
        setTimeout(() => {
            this.nextTurn(io);
        }, 5000);
    }

    startWordSelection(io) {
        const drawer = this.room.players.find(player => player.id === this.currentDrawerId);
        if (!drawer) return;

        const wordOptions = [];

        for (let i = 0; i < this.room.settings.wordCount; i++) {
            wordOptions.push(this.generateRoundWord());
        }

        setTimeout(() => {
            io.to(drawer.id).emit("choose_word", { words: wordOptions });
        },1000);
        this.wordSelectionTimer = setTimeout(() => {
            if (this.currentWord) return;
            this.currentWord = wordOptions[0];
            this.displayWord = this.generateDisplayWord();
            this.revealedIndexes = [];
            io.to(this.room.roomCode).emit("word_selected", { displayWord: this.displayWord });
            io.to(drawer.id).emit("drawer_word", { word: wordOptions[0] });
            this.startTimer(io);
        }, 15000);
    }

    generateRoundWord() {
        const mode = this.room.settings.gameMode;
        const category = this.room.settings.category;
        if (mode.toLowerCase() === "combination") {
            return WordManager.getCombinationWord(category);
        }
        return WordManager.getRandomWords(1, category)[0];
    }

    scheduleHints(io) {
        if (!this.room.settings.hintsEnabled) return;
        if (this.room.settings.gameMode.toLowerCase() === "hidden") return;

        const drawTime = this.room.settings.drawTime;
        const firstHintTime = Math.floor(drawTime * 0.35) * 1000;
        const secondHintTime = Math.floor(drawTime * 0.70) * 1000;
        const hint1 = setTimeout(() => { this.revealHint(io) }, firstHintTime);
        const hint2 = setTimeout(() => { this.revealHint(io); }, secondHintTime);

        this.hintTimers.push(hint1, hint2);
    }

    revealHint(io) {

        if (!HintManager.canReveal(this.revealedIndexes, this.room.settings.hintCount)) return;

        const result = HintManager.revealLetter(
            this.currentWord,
            this.displayWord,
            this.revealedIndexes
        );

        this.displayWord = result.displayWord;

        this.revealedIndexes = result.revealedIndexes;

        io.to(this.room.roomCode).emit("hint_reveal", {
            displayWord: this.displayWord,
            revealedIndex: result.revealedIndex
        });
    }

    nextTurn(io) {

        if (this.room.players.length === 0) return;

        this.room.canvasStrokes = [];
        io.to(this.room.roomCode).emit("canvas_clear");

        if (this.currentDrawerIndex >= this.room.players.length) {
            this.currentDrawerIndex = 0;
        }
        clearTimeout(this.wordSelectionTimer);
        this.currentDrawerIndex++;
        this.currentWord = null;
        this.displayWord = "";
        this.revealedIndexes = [];
        this.guessedPlayers = [];
        this.displayWord = "";
        this.revealedIndexes = [];

        this.hintTimers.forEach(timer => clearTimeout(timer));
        this.hintTimers = [];

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
        io.to(this.room.roomCode).emit("new_round", {
            round: this.currentRound,
            drawerId: this.currentDrawerId
        });
        this.startWordSelection(io);

    }

    endGame(io) {
        clearInterval(this.timer);
        this.hintTimers.forEach(timer => clearTimeout(timer));
        this.hintTimers = [];
        this.room.gameStarted = false;
        this.status = "finished";
        const leaderboard = [...this.room.players].sort((a, b) => b.score - a.score);

        io.to(this.room.roomCode).emit("game_over", {
            winner: leaderboard[0],
            leaderboard
        });
    }

    generateDisplayWord() {
        const mode = this.room.settings.gameMode;
        if (mode.toLowerCase() === "hidden") {
            return "";
        }
        return WordManager.createDisplayWord(
            this.currentWord
        );
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
            word: this.displayWord
        }
        );
    }

}