import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import socket from '../socket/socket.js';
import WordBox from '../components/wordbox';
import Tools from './tools.jsx';
import GuessWord from './guessWord.jsx';
import ChooseWord from './chooseWord.jsx';


const DrawBoard = () => {
    const canvasRef = useRef(null);
    const { roomCode } = useParams();

    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [color, setColor] = useState("black");

    const [brushSize, setBrushSize] = useState(5);
    const [currentDrawerId, setCurrentDrawerId] = useState(null);

    const [showWordDialog, setShowWordDialog] = useState(false);
    const [wordOptions, setWordOptions] = useState([]);

    const [round, setRound] = useState(1);
    const [time, setTime] = useState(75);
    const [word, setWord] = useState("");

    useEffect(() => {

        console.log(
            "DRAWBOARD MOUNTED",
            socket.id
        );
        socket.onAny((event, ...args) => {
            console.log("EVENT:", event, args);
        });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        socket.on("receive-draw", (data) => {
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.brushSize;
            ctx.beginPath();
            ctx.moveTo(data.prevX, data.prevY);
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        });

        socket.on("game_state", (data) => {
            console.log("GAME_STATE RECEIVED", data);

            setRound(data.currentRound);
            setTime(data.timeLeft);
            setWord(data.word);
            setCurrentDrawerId(data.drawerId);
        });

        socket.on("round_end", ({ word }) => {
            console.log("Word was:", word);
        });

        socket.on("new_round", (data) => {
            console.log("Round:", data.round);
        })

        console.log("REGISTERING CHOOSE_WORD LISTENER");
        socket.on("choose_word", ({ words }) => {
            console.log("CHOOSE WORD RECEIVED", words);
            setWordOptions(words);
            setShowWordDialog(true);
        });

        return () => {
            socket.off("receive-draw");
            socket.off("game_state");
            socket.off("choose_word");
            socket.off("round_end");
            socket.off("new_round");
            socket.offAny();
        };

    }, []);

    const startDrawing = (event) => {
        if (socket.id !== currentDrawerId) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const snapshot = canvas.toDataURL();
        const ctx = canvas.getContext('2d');
        setHistory((prev) => [...prev, snapshot]);
        ctx.beginPath();
        ctx.moveTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
        );
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };



    const draw = (event) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineTo(x, y);
        ctx.stroke();

        socket.emit("draw", {
            x, y,
            prevX: x - 1,
            prevY: y - 1,
            color, brushSize,
        });
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    return (
        <div className='flex flex-col justify-center items-center w-full min-h-screen gap-4'>

            <WordBox round={round} time={time} word={word} />

            <canvas ref={canvasRef} width={800} height={600} onMouseDown={startDrawing} onMouseUp={stopDrawing}
                onMouseMove={draw} onMouseLeave={stopDrawing}
                className='bg-white w-full max-w-[800px] aspect-[4/3] border-2 border-purple-500 rounded-xl cursor-crosshair' />

            {
                showWordDialog && (
                    <ChooseWord
                        words={wordOptions}
                        roomCode={roomCode}
                        setOpen={setShowWordDialog}
                    />
                )
            }


            {
                socket.id === currentDrawerId &&
                (
                    <Tools color={color} setColor={setColor} brushSize={brushSize} canvasRef={canvasRef}
                        setBrushSize={setBrushSize} history={history} setHistory={setHistory} />
                )
            }
            {
                socket.id !== currentDrawerId &&
                (
                    <GuessWord roomCode={roomCode} />
                )
            }



        </div>
    )
}

export default DrawBoard;
