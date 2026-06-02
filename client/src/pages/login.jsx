import React, { useEffect, useState } from 'react'
import Avatar from '../components/avatar'
import { useNavigate } from 'react-router-dom';
import CreateRoom from '../components/createroom.jsx';
import Join from '../components/join.jsx';
import socket from '../socket/socket.js';

function Login() {

  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);

  // Name
  const [name, setName] = useState(
    localStorage.getItem("name") || ""
  );

  // Avatar
  const emoji_array = [
    '🙂', '😎', '💀', '😁', '😡', '🫣', '🌚', '😋', '😉',
    '😍', '🫡', '😪', '😌', '🥸', '🤠', '🤡', '😇',
    '🤖', '👾', '👽', '👻', '🦁', '🦊'
  ];

  const [index, setIndex] = useState(
    Number(localStorage.getItem("emojiIndex")) || 0
  );

  const leftClick = () => {
    const newIndex = (index - 1 + emoji_array.length) % emoji_array.length;
    setIndex(newIndex);
    localStorage.setItem("emojiIndex", newIndex)
  };

  const rightClick = () => {
    const newIndex = (index + 1) % emoji_array.length;
    setIndex(newIndex);
    localStorage.setItem("emojiIndex", newIndex)
  };

  const playButton = () => {

    if (!/^[A-Za-z0-9_]{2,8}$/.test(name)) {
      alert("Name should have 2 or more character and only use A-Z a-z 0-9 '_'");
      return;
    }

    socket.emit("quick_play", {
      playerName: name,
      emojiIndex: index
    });

  }

const navigate = useNavigate();

useEffect(() => {
  socket.on("quick_play_joined",({ roomCode }) => {
      navigate(`/room/${roomCode}`);
    }
  );

  return () => {socket.off("quick_play_joined");};

}, [navigate]);


return (
  <>
    <div className="bg-purple-400 p-6 gap-20 grid justify-center items-center w-[90vw] max-w-[400px] min-h-[500px] rounded-3xl" >

      <div className="bg-purple-500 p-1  w-full h-[200px] flex items-center justify-between rounded-3xl cursor-default">
        <button onClick={leftClick}
                 className=" p-4 text-white cursor-pointer active:-translate-x-1
                  hover:scale-90 active:text-white/40 rounded-full transition-all duration-100"
            style={{ fontSize: "60px" }}
          >
            ❮
          
        </button>

        <div className='flex flex-col mt-6 items-center justify-center h-40' >
          <Avatar emoji={emoji_array[index]} />
          <span className='font-bold text-3xl font-stretch-semi-expanded flex justify-center translate-y-4  text-emerald-50'>
            {name.charAt(0).toUpperCase() + name.slice(1) || ""}
          </span>
        </div>

        <button onClick={rightClick}
                className=" p-4 text-white cursor-pointer active:translate-x-1
                  hover:scale-90 active:text-white/40 transition-all duration-100"
            style={{ fontSize: "60px" }}
          >
            ❯
          
        </button>
      </div>
      <input type="text" placeholder='...name(max-length 8)' maxLength={8} className='bg-white/40 border-2 border-purple-950/40 
                rounded-2xl p-2 w-full max-w-[250px] mx-auto '
        value={name} onChange={(event) => {
          setName(event.target.value);
          localStorage.setItem("name", event.target.value);
        }}
      />


      <div className='flex justify-center gap-10'>

        <button className='bg-blue-900 p-2 px-4 py-2 text-white rounded-3xl font-bold hover:scale-95 
                hover:bg-blue-800 active:scale-90 transition-all duration-100 cursor-pointer'
          onClick={() => {
            if (!/^[A-Za-z0-9_]{2,8}$/.test(name)) {
              alert("Name should have 2 or more character and only use A-Z a-z 0-9 '_'");
              return;
            }
            setOpenJoin(true)
          }} >
          Join
        </button>

        <button className='bg-blue-900 p-2 px-4 py-2 text-white rounded-3xl font-bold cursor-pointer
                  hover:bg-blue-800 hover:scale-95 active:scale-90 transition-all duration-100
          '  onClick={() => {
            if (!/^[A-Za-z0-9_]{2,8}$/.test(name)) {
              alert("Name should have 2 or more character and only use A-Z a-z 0-9 '_'");
              return;
            }
            setOpenCreateRoom(true)
          }}>
          Create
        </button >

        <button
          className='bg-blue-900 p-2 px-4 py-2 text-white rounded-3xl font-bold hover:scale-95
                    hover:bg-blue-800 active:scale-90 transition-all duration-100 cursor-pointer'
          onClick={ playButton }
        >
          Play
        </button>

      </div>


      <div>
        {
          openJoin && (
            <Join
              setOpen={setOpenJoin}
            />
          )
        }

        {
          openCreateRoom && (
            <CreateRoom
              setOpen={setOpenCreateRoom}
            />
          )
        }
      </div>
    </div>
  </>
)
}

export default Login;
