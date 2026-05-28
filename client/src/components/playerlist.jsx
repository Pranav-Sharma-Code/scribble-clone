import React from 'react'
import Avatar from './avatar';

const PlayerList = () => {
  return (
    <div className='bg-white/70 shadow-2xl backdrop-blur-lg w-70 h-180 rounded-2xl gap-1 p-1  flex flex-col items-center'>
        <div className='w-65 h-20 bg-white rounded-2xl text-black flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
                <Avatar name={name} />
                <p>Points: </p>
            </div>
        </div>
        <div className='w-65 h-20 bg-white rounded-2xl text-black flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
                <Avatar name={name} />
                <p>Points: </p>
            </div>
        </div>
    </div>
  )
}

export default PlayerList;