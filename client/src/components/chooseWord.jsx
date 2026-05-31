import React, { useEffect, useState } from "react";
import socket from "../socket/socket";

const ChooseWord = ({ words = [], roomCode, setOpen }) => {

    const selectWord = (word) => {
    socket.emit("choose_word", { roomCode, word });
    setOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-96 flex flex-col gap-4">

                <h2 className="text-2xl font-bold text-center">
                    Choose a Word
                </h2>

                {words.map((word, index) => (
                    <button
                        key={`${word}-${index}`}
                        onClick={() => selectWord(word)}
                        className="w-full p-4 rounded-xl bg-purple-500 text-white text-xl font-semibold hover:bg-purple-600 transition"
                    >
                        {word}
                    </button>
                ))}

            </div>
        </div>
    );
};

export default ChooseWord;