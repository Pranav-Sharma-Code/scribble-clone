import React, { useState, useEffect } from 'react'
import socket from '../socket/socket';

const GuessWord = ({ roomCode }) => {

  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const handleGuessCorrect = (data) => {
      if (data.playerId === socket.id) {
        setMessage(`+${data.scoreEarned} Points`);
        setIsCorrect(true);
      }
    };

    const handleWordSelected = () => {
      setMessage("");
      setIsCorrect(false);
    };

    const handleNewRound = () => {
      setMessage("");
      setIsCorrect(false);
    };

    const handleGuessWrong = ({ guess }) => {
      setMessage(guess);
      setIsCorrect(false);
    };

    socket.on("guess_correct", handleGuessCorrect);
    socket.on("word_selected", handleWordSelected);
    socket.on("new_round", handleNewRound);
    socket.on("guess_wrong", handleGuessWrong);

    return () => {
      socket.off("guess_correct", handleGuessCorrect);
      socket.off("word_selected", handleWordSelected);
      socket.off("new_round", handleNewRound);
      socket.off("guess_wrong", handleGuessWrong);
    };
  }, []);

  const submitGuess = () => {
    if (!guess.trim()) return;
    socket.emit("guess_word", { roomCode, guess });
    setGuess("");
  };

  return (
    <div className='bg-black/30 backdrop-blur-lg w-full px-4 h-24 rounded-2xl flex flex-col-reverse items-center pt-2 pb-0.5 gap-2'>
      <div className='relative w-80'>
        <input type="text" value={guess}
          onChange={(event) => setGuess(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submitGuess()
            }
          }}
          className='w-full bg-white/95 rounded-full py-3 pl-4 pr-4 pt-4 text-gray-800 outline-none shadow-md' placeholder='Guess the word...' />
        <button onClick={submitGuess}
                className='absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center text-sky-400 transition-all
                           justify-center rounded-lg font-bold active:scale-95 active:text-sky-500 active:translate-x-1 duration-100'
        >
          ➤
        </button>
       
      </div>
      <p className={`font-extrabold text-xl font-sans ${isCorrect ? "text-green-500" : "text-red-500"} `}>
        {message}
      </p>
    </div>
  )
}

export default GuessWord;

