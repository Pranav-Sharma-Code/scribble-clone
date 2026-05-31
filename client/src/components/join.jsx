import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import PropTypes from 'prop-types';

const Join = (props) => {

    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    const joinRoom = () => {

        const roomCodeRegex = /^[A-Z0-9]{6}$/;

        if (!roomCodeRegex.test(roomCode)) {
            alert("Enter valid 6 character room code");
            return;
        }

        const playerName = localStorage.getItem("name")?.trim() || "Player";

        if (!/^[A-Za-z0-9_]{2,8}$/.test(playerName)) {
            alert("Name should have 2 or more character and only use A-Z a-z 0-9 '_'");
            return;
        }

        const emoji_array = ['🙂', '😎', '💀', '😁', '😡', '🫣', '🌚', '😋', '😉', '😍', '🫡', '😪', '😌', '🥸', '🤠', '🤡', '😇', '🤖', '👾', '👽', '👻', '🦁', '🦊'];
        const avatar = emoji_array[Number(localStorage.getItem("emojiIndex")) || 0] || '😀';

        socket.emit("join_room", { roomCode, playerName, avatar }, (response) => {
            if (!response.success) {
                alert(response.message);
                return;
            }
            
            navigate(`/room/${roomCode}`);
        });
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4'>

            <div className='relative bg-white w-full max-w-xs rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col gap-8 '>

                <button onClick={() => props.setOpen(false)}
                    className='absolute top-5 right-5 hover:scale-110 transition-all duration-200 cursor-pointer'
                >
                    <span className='material-symbols-outlined text-gray-700'
                        style={{ fontSize: '38px' }}
                    >
                        close
                    </span>
                </button>

                <div className='flex flex-col justify-center items-center  w-full max-w-xs  p-2 rounded-4xl'>
                    <h1 className='text-3xl font-bold text-purple-900/40 bg-purple-400/10 backdrop-blur-xs  p-4 rounded-2xl'>Code</h1>
                </div>
                <input type="text" value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                    className='w-full max-w-sm border-2 border-black/40 rounded-2xl p-2  text-2xl font-bold' placeholder='Enter Here...' />

                <button onClick={() => joinRoom()}
                    className='bg-blue-600 hover:bg-blue-700 hover:scale-95 active:scale-90 transition-all duration-200 text-white font-black text-xl px-10 py-4 rounded-2xl shadow-lg cursor-pointer'>
                    Join
                </button>
            </div>

        </div>
    );
};

Join.propTypes = {
    setOpen: PropTypes.func.isRequired
}

export default Join;