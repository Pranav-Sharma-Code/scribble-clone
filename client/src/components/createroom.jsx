import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import PropTypes from 'prop-types';

const CreateRoom = ({ setOpen }) => {

  const playerName = localStorage.getItem("name") || "";


  const navigate = useNavigate();

  const [players, setPlayers] = useState(8);
  const [drawTime, setDrawTime] = useState(75);
  const [rounds, setRounds] = useState(3);
  const [gameMode, setGameMode] = useState("Normal");

  const createRoom = () => {

    if (!/^[A-Za-z0-9_]{2,8}$/.test(playerName)) {
      alert("Name should have 2 or more character and only use A-Z a-z 0-9 '_'");
      return;
    }

    socket.emit("create_room", {
      playerName, settings: {
        maxPlayers: players,
        drawTime,
        rounds,
        gameMode
      },
    },

      (response) => {
        console.log(response);

        if (!response.success) {
          alert("Failed to create room");
          return;
        }
        localStorage.setItem("isHost", "true");
        setOpen(false);
        navigate(`/room/${response.roomCode}`);
      }
    );
  }

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4'>

      <div className='relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 md:p-10'>

        {/* ----------Close Button-------------- */}
        <button
          onClick={() => setOpen(false)}
          className='absolute top-5 right-5 hover:scale-110 transition-all duration-200 cursor-pointer'
        >
          <span
            className='material-symbols-outlined text-gray-700'
            style={{ fontSize: '38px' }}
          >
            close
          </span>
        </button>

        <div className='mb-10'>
          <h1 className='text-4xl font-black text-gray-800'>
            Create Room
          </h1>

          <p className='text-gray-500 mt-2 text-lg'>
            Customize your game settings and invite friends.
          </p>
        </div>


        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>


          <div className='flex flex-col gap-2'>
            <label className='text-xl font-bold text-gray-700'>
              Players
            </label>

            <select
              value={players} onChange={(event) => setPlayers(Number(event.target.value))}
              className='w-full border-2 border-gray-200 rounded-2xl p-4 text-lg font-semibold focus:outline-none focus:border-blue-500 transition-all'
            >
              {[...Array(19)].map((_, i) => (
                <option key={i + 2} value={i + 2}>
                  {i + 2}
                </option>
              ))}
            </select>
          </div>


          <div className='flex flex-col gap-2'>
            <label className='text-xl font-bold text-gray-700'>
              Draw Time
            </label>

            <select
              value={drawTime} onChange={(event) => setDrawTime(Number(event.target.value))}
              className='w-full border-2 border-gray-200 rounded-2xl p-4 text-lg font-semibold focus:outline-none focus:border-blue-500 transition-all'
            >
              {[...Array(16)].map((_, i) => (
                <option key={(i + 1) * 15} value={(i + 1) * 15}>
                  {(i + 1) * 15}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-xl font-bold text-gray-700'>
              Rounds
            </label>

            <select
              value={rounds} onChange={(event) => setRounds(Number(event.target.value))}
              className='w-full border-2 border-gray-200 rounded-2xl p-4 text-lg font-semibold focus:outline-none focus:border-blue-500 transition-all'
            >
              {[...Array(9)].map((_, i) => (
                <option key={i + 2} value={i + 2}>
                  {i + 2}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-xl font-bold text-gray-700'>
              Game Mode
            </label>

            <select
              value={gameMode} onChange={(event) => setGameMode(event.target.value)}
              className='w-full border-2 border-gray-200 rounded-2xl p-4 text-lg font-semibold focus:outline-none focus:border-blue-500 transition-all'
            >
              <option value='Normal'>Normal</option>
              <option value='Hidden'>Hidden</option>
              <option value='Combination'>Combination</option>
            </select>
          </div>
        </div>

        <div className='flex justify-center mt-10'>
          <button
            onClick={createRoom}
            className='bg-blue-600 hover:bg-blue-700 hover:scale-95 active:scale-90 transition-all duration-200 text-white font-black text-xl px-10 py-4 rounded-2xl shadow-lg cursor-pointer'
          >
            Create Room
          </button>
        </div>

      </div>
    </div>
  )
}

CreateRoom.propTypes = {
  setOpen: PropTypes.func.isRequired
};

export default CreateRoom