import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';


const WordBox = (props) => {

    const [word, setWord] = useState("");

    useEffect(() => {
        const handleDrawerWord = ({ word }) => {
            setWord(word);
        };

        socket.on("drawer_word", handleDrawerWord);
        return () => {
            socket.off("drawer_word", handleDrawerWord);
        };
    }, [])

    useEffect(() => {
        if (socket.id !== props.drawerId) {
            setWord("");
        }
    }, [props.drawerId]);

    return (

        <div className=' w-full max-w-[800px] min-h-[60px] md:min-h-[80px] rounded-xl bg-slate-700/95 border-2 
                   border-slate-700 flex justify-evenly items-center px-2 md:px-4 py-2 shadow-2xl gap-4 md:gap-16 cursor-default'>

        

            <div className='w-14 h-14 rounded-full bg-white flex flex-col items-center
                        justify-center border-4 border-black text-black font-bold cursor-default'>
                <span className='text-[10px] leading-none'>ROUND</span>
                <span className='text-xl leading-none'>{props.round}/{props.maxRounds}</span>
            </div>

            {/* ----------WORD------------ */}

            <div className="flex flex-col items-center whitespace-nowrap cursor-default">
                <h1 className="text-white text-sm md:text-lg font-bold tracking-widest drop-shadow-md cursor-default">
                    WORD
                </h1>

                <div className="flex gap-1 mt-2 flex-wrap justify-center whitespace-nowrap cursor-default">
                    {(socket.id === props.drawerId ? word : props.word)
                        ?.split("")
                        .map((char, index) => (
                            <span
                                key={index}
                                className="text-white text-base md:text-lg lg:text-xl font-bold min-w-4 text-center pb-1 shadow-sm cursor-default"
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}

                </div>
            </div>


            <div className="w-24 h-12 bg-slate-800 rounded-xl border-2 border-slate-600 flex items-center justify-center shadow-lg cursor-default">
                <span className="text-white text-xl font-mono tracking-widest">
                    {props.time}
                </span>
            </div>

        </div>
    )
}

export default WordBox;

