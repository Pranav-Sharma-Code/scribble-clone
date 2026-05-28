import React from 'react'

const Join = () => {
  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4'>
        
        <div className='relative bg-white w-full max-w-xs rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col '>

            <button onClick={() => setOpen(false)}
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
            <input type="text" className='w-full max-w-sm border-2 border-black/40 rounded-2xl p-2 mt-4 text-2xl font-bold' placeholder='Enter Here...' />
            
           <button className=' mt-10 bg-blue-900 p-4 text-white font-bold text-2xl rounded-4xl hover:scale-90 transition-all duration-200 '
                    // onClick={}
                    >Join
            </button>
        </div>

    </div>
  )
}

export default Join;