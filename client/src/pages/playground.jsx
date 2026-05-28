import React from 'react'
import DrawBoard from '../components/drawBoard';
import ChatBox from '../components/chatbox';
import PlayerList from '../components/playerlist';

const Playground = () => {
  return (
    <div className='flex justify-center items-center gap-2 '>
      <PlayerList />
      <DrawBoard />
      <ChatBox />
    </div>
  )
}

export default Playground;
