import React from 'react'

const GuessWord = () => {
  return (
    <div className='bg-white/40 backdrop-blur-sm w-80 h-20 rounded-2xl flex flex-col-reverse items-center p-2 gap-2'>
        <input type="text" className='bg-white rounded-xl p-1 pl-3' placeholder='...Guess Here' />
        <p className='font-serif text-xl'>message </p>
    </div>
  )
}

export default GuessWord; 
