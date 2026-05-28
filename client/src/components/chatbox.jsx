import React from 'react'

const ChatBox = () => {
  return (
    <div className='bg-white/70 shadow-2xl backdrop-blur-lg w-100 h-180 rounded-2xl flex flex-col-reverse items-center p-2 g-2'>

        
        <input type="text" className='bg-white rounded-2xl w-60 h-10 p-2' placeholder='...type' />
    
        <div className='flex flex-col-reverse justify-items-start '>
            {/* Live Chat */}
        </div>
        
        
    </div>
  )
}

export default ChatBox;
