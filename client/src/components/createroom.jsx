import React from 'react'

const CreateRoom = ({ setOpen, setOpenJoinRoom }) => {
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
              defaultValue={8}
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
              defaultValue={75}
              className='w-full border-2 border-gray-200 rounded-2xl p-4 text-lg font-semibold focus:outline-none focus:border-blue-500 transition-all'
            >
              {[...Array(16)].map((_, i) => (
                <option key={(i+1)*15} value={(i+1)*15}>
                  {(i+1)*15}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-xl font-bold text-gray-700'>
              Rounds
            </label>

            <select
              defaultValue={3}
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
              className='w-full border-2 border-gray-200 rounded-2xl p-4 text-lg font-semibold focus:outline-none focus:border-blue-500 transition-all'
            >
              <option value='Normal'>Normal</option>
              <option value='Hidden'>Hidden</option>
              <option value='Combination'>Combination</option>
            </select>
          </div>
        </div>

   
        <div className='mt-10 bg-gray-100 rounded-3xl p-6 flex flex-col gap-4'>

          <h2 className='text-2xl font-black text-gray-800'>
            Invite Friends
          </h2>

          <div className='bg-white rounded-2xl p-4 border border-gray-200'>
            <p className='text-gray-500 font-semibold'>Invite Link</p>
            <p className='text-blue-600 font-bold break-all'>
              https://scribble-game.vercel.app/room/ABCD123
            </p>
          </div>

          <div className='bg-white rounded-2xl p-4 border border-gray-200'>
            <p className='text-gray-500 font-semibold'>Room Code</p>
            <p className='text-3xl font-black tracking-widest text-gray-800'>
              ABCD123
            </p>
          </div>
        </div>

        
        <div className='flex justify-center mt-10'>
          <button className='bg-blue-600 hover:bg-blue-700 hover:scale-95 active:scale-90 transition-all duration-200 text-white font-black text-xl px-10 py-4 rounded-2xl shadow-lg'>
            Start Game
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreateRoom