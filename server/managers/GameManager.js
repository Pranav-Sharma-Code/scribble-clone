import words from '../data/words.js';
import GameState from '../state/gameState.js';

class GameManager{
    constructor(io){
        this.io = io;
    }

    getRandomWord(){
        const categories = Object.keys(words);

        const randomCategory = 
        categories[
            Math.floor(Math.random()*categories.length)
        ];
        const categoryWords = words[randomCategory];

        const randomWord = categoryWords[
            Math.floor(Math.random()*categoryWords.length)
        ];

        return randomWord;
    }

    startGame(){
        GameState.isPlaying = true;
        GameState.round = 1;
        GameState.time = 80;
        GameState.word = this.getRandomWord();
        this.startTimer();
        this.sendGameState();
    }

    startNextRound(){
        GameState.round++;
        if(GameState.round > GameState.maxRounds){
            GameState.round = 1;
        }
        GameState.time = 80;
        GameState.word = this.getRandomWord();
        this.sendGameState();
    }

    startTimer(){
        setInterval(() => {
            if(!GameState.isPlaying) return;
            if(GameState.time > 0){
                GameState.time--;
            }
            else{
                this.startNextRound();
            }
            this.sendGameState();
        },1000);
    }
    
    sendGameState(){
        this.io.emit("game-state", GameState);
    }
}

export default GameManager;
