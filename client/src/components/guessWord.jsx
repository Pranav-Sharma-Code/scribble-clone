import React, { useState, useEffect } from 'react'
import socket from '../socket/socket';
import { data } from 'react-router-dom';

const GuessWord = ({ roomCode }) => {

  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    socket.on("guess_correct", (data) => {
      console.log("CORRECT EVENT:", data);
      if (data.playerId === socket.id) {
        setMessage(`+${data.scoreEarned} Points`);
        setIsCorrect(true);
      }
    });

    socket.on("word_selected", () => {
      setMessage("");
      setIsCorrect(false);
    })

    socket.on("new_round", () => {
      setMessage("");
      setIsCorrect(false);
    })


    socket.on("guess_wrong", ({ guess }) => {
      console.log(`wrong guess: ${guess}`);
      setMessage(guess);
      setIsCorrect(false);
    });

    socket.on("leaderboard_update", (players) => {
      console.log(players);
    });

    return () => {
      socket.off("guess_correct");
      socket.off("leaderboard_update");
      socket.off("guess_wrong");
    };
  }, []);

  const submitGuess = () => {
    if (!guess.trim()) return;
    socket.emit("guess_word", { roomCode, guess });
    setGuess("");
  };

  return (
    <div className='bg-black/30 backdrop-blur-lg w-80 h-20 rounded-2xl flex flex-col-reverse items-center p-2 gap-2'>
      <input type="text" value={guess} onChange={(event) => setGuess(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { submitGuess() } }}
        className='bg-white rounded-xl p-1 pl-3' placeholder='...Guess Here' />
      <p className={`font-extrabold text-xl font-sans ${isCorrect ? "text-green-500" : "text-red-500"} `}>
        {message}
      </p>
    </div>
  )
}

export default GuessWord; 
