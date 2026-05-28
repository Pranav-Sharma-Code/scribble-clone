import React from 'react';


const WordBox = (props) => {
    
  return (
    
    <div className=' w-full max-w-[800px] min-h-[80px] rounded-xl bg-slate-700/95 border-2 
                   border-slate-700 flex justify-center items-center px-4 py-2 shadow-2xl gap-20'>

        {/* -------------ROUND--------------- */}

        <div className='w-14 h-14 rounded-full bg-white flex flex-col items-center
                        justify-center border-4 border-black text-black font-bold'>
                <span className='text-[10px] leading-none'>ROUND</span>
                <span className='text-xl leading-none'>{props.round}/3</span>
        </div>
           
           {/* ----------WORD------------ */}

        <div className='flex flex-col items-center'>
            <h1 className='text-white text-sm md:text-lg font-bold tracking-widest'>WORD</h1>

            {/* ------------hidden word----------- */}

            <div className='flex gap-2 mt-1'>
                {props.word.split("").map((_,index)=>(
                    <span key={index} className='text-white text-xl md:text-3xl font-bold
                                      border-b-4 border-white w-6 md:w-8 text-center'>
                                      _
                    </span>
                ))}
            </div>
        </div>

        {/* ----------TIMER----------- */}

        <div className="w-24 h-12 bg-slate-800 rounded-xl border-2 border-slate-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-mono tracking-widest">
               {props.time}
            </span>
        </div>
        
    </div>
  )
}

export default WordBox;

