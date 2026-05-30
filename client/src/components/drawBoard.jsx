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
    const [hiddenWord, setHiddenWord] = useState("");
    const [currentDrawerId, setCurrentDrawerId] = useState(null);

    const [showWordDialog, setShowWordDialog] = useState(false);
    const [wordOptions, setWordOptions] = useState([]);

    const [showRoundEnd, setshowRoundEnd] = useState(false);
    const [revealedWord, setRevealedWord] = useState("");

    let [maxRounds, setMaxRounds] = useState("-")
    const [round, setRound] = useState(1);
    let [time, setTime] = useState("-");
    const [word, setWord] = useState("");

    useEffect(() => {
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
            setRound(data.currentRound);
            setTime(data.timeLeft);
            setWord(data.word);
            setMaxRounds(data.maxRounds)
            setCurrentDrawerId(data.drawerId);
            setHiddenWord(data.word);
        });

        socket.on("round_end", ({ word }) => {
            setshowRoundEnd(true);
            setRevealedWord(word);
            setTimeout(()=>{
                setshowRoundEnd(false);
            },5000);
        });

        socket.on("new_round", (data) => {
            setRevealedWord("");
        })

        socket.on("choose_word", ({ words }) => {
            setWordOptions(words);
            setShowWordDialog(true);
        });

        return () => {
            socket.off("receive-draw");
            socket.off("game_state");
            socket.off("choose_word");
            socket.off("round_end");
            socket.off("new_round");
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

    if (showRoundEnd) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50">
                <div className='flex flex-col font-bold text-5xl text-white justify-center items-center gap-10'>
                    <h1 className="text-4xl md:text-6xl font-extrabold  text-white/30 font-serif">
                        Word Was
                    </h1>
                    <div className='bg-purple-600/20  max-w-md flex justify-center items-center p-5 rounded-2xl border-purple-950/20 border-2 font-serif'>
                        {revealedWord}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col justify-center items-center w-full min-h-screen gap-4'>

            <WordBox round={round} time={time} maxRounds={maxRounds} word={word} drawerId={currentDrawerId} />

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
