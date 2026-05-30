import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';


const WordBox = (props) => {

    const [word, setWord] = useState("");

    useEffect(() => {
        socket.on("drawer_word", ({ word }) => {
            setWord(word);
        })

        return () => {
            socket.off("drawer_word");
        }
    }, [])

    return (

        <div className=' w-full max-w-[800px] min-h-[80px] rounded-xl bg-slate-700/95 border-2 
                   border-slate-700 flex justify-center items-center px-4 py-2 shadow-2xl gap-20'>

            {/* -------------ROUND--------------- */}

            <div className='w-14 h-14 rounded-full bg-white flex flex-col items-center
                        justify-center border-4 border-black text-black font-bold'>
                <span className='text-[10px] leading-none'>ROUND</span>
                <span className='text-xl leading-none'>{props.round}/{props.maxRounds}</span>
            </div>

            {/* ----------WORD------------ */}

            <div className="flex flex-col items-center">
                <h1 className="text-white text-sm md:text-lg font-bold tracking-widest drop-shadow-md">
                    WORD
                </h1>

                {/* ------------ Hidden Word / Revealed Word ----------- */}
                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                    {(socket.id === props.drawerId ? word : props.word)
                        ?.split("") 
                        .map((char, index) => (
                            <span
                                key={index}
                                className="text-white text-xl md:text-2xl font-bold w-3 md:w-3 text-center pb-1 font-serif shadow-sm"
                            >
                                {char === " " ? "\u00A0" : char}
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

