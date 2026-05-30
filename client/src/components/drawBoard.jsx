import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import socket from '../socket/socket.js';
import WordBox from '../components/wordbox';
import Tools from './tools.jsx';
import GuessWord from './guessWord.jsx';
import ChooseWord from './chooseWord.jsx';


const DrawBoard = () => {
    const canvasRef = useRef(null);
    const lastPointRef = useRef(null);
    const strokesRef = useRef([]);
    const timeoutRef = useRef(null);

    const { roomCode } = useParams();
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [color, setColor] = useState("black");
    const [tool, setTool] = useState("brush");

    const [brushSize, setBrushSize] = useState(5);
    const [hiddenWord, setHiddenWord] = useState("");
    const [currentDrawerId, setCurrentDrawerId] = useState(null);

    const [showWordDialog, setShowWordDialog] = useState(false);
    const [wordOptions, setWordOptions] = useState([]);

    const [showRoundEnd, setshowRoundEnd] = useState(false);
    const [revealedWord, setRevealedWord] = useState("");

    let [maxRounds, setMaxRounds] = useState(0)
    const [round, setRound] = useState(0);
    let [time, setTime] = useState(0);
    const [word, setWord] = useState("");

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const stroke of strokesRef.current) {
            if (!stroke.points.length) continue;

            ctx.beginPath();
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.size;
            ctx.lineCap = "round";
            ctx.moveTo(
                stroke.points[0].x,
                stroke.points[0].y
            );

            for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(
                    stroke.points[i].x,
                    stroke.points[i].y
                );
            }
            ctx.stroke();
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;

        socket.on("draw_start", (stroke) => {
            strokesRef.current.push(stroke);
            redrawCanvas();
        });

        socket.on("draw_move", ({
            strokeId, x, y
        }) => {
            const stroke = strokesRef.current.find(
                s => s.id === strokeId
            );

            if (!stroke) return;
            stroke.points.push({ x, y });
            redrawCanvas();
        });

        socket.on("draw_undo", (strokes) => {
            strokesRef.current = strokes;
            redrawCanvas();
        });

        socket.on("canvas_clear", () => {
            strokesRef.current = [];
            redrawCanvas();
        });

        socket.on("canvas_state", (strokes) => {
            strokesRef.current = strokes;
            redrawCanvas();
        })

        socket.on("game_state", (data) => {
            setRound(data.currentRound);
            setTime(data.timeLeft);
            setWord(data.word);
            setMaxRounds(data.maxRounds)
            setCurrentDrawerId(data.drawerId);
            setHiddenWord(data.word);
        });

        socket.on("round_end", ({ word }) => {
            clearTimeout(timeoutRef.current);
            setshowRoundEnd(true);
            setRevealedWord(word);
            timeoutRef.current = setTimeout(() => {
                setshowRoundEnd(false);
            }, 5000);
        });

        socket.on("new_round", (data) => {
            setRevealedWord("");
        })

        socket.on("choose_word", ({ words }) => {
            setWordOptions(words);
            setShowWordDialog(true);
        });

        return () => {
            socket.off("draw_start");
            socket.off("draw_move");
            socket.off("draw_undo");

            socket.off("canvas_clear");
            socket.off("canvas_state");

            socket.off("game_state");
            socket.off("choose_word");
            socket.off("round_end");
            socket.off("new_round");
        };

    }, []);

    useEffect(() => {
        console.log("CURRENT TOOL:", tool);
    }, [tool]);

    const startDrawing = (event) => {
        if (socket.id !== currentDrawerId) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        lastPointRef.current = { x, y };
        socket.emit("draw_start", {
            roomCode,
            x, y,
            color: tool === "eraser" ? "white" : color,
            size: brushSize
        });
    };

    const stopDrawing = () => {
        if (!isDrawing) return;

        socket.emit("draw_end");
        setIsDrawing(false);
        lastPointRef.current = null;
    };



    const draw = (event) => {
        if (!isDrawing) return;

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        socket.emit("draw_move", {
            roomCode,
            x, y
        });
    };

    if (showRoundEnd) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50">
                <div className='flex flex-col font-bold text-5xl text-white justify-center items-center gap-10'>
                    <h1 className="text-4xl md:text-6xl font-extrabold  text-white/30 font-serif">
                        Word Was
                    </h1>
                    <div className='bg-purple-600/20  max-w-md flex justify-center items-center p-5 rounded-2xl border-purple-950/20 border-2 font-serif animate-[wordReveal_1.0s_ease-out]'>
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
                    <Tools color={color} setColor={setColor} brushSize={brushSize}
                        setBrushSize={setBrushSize} tool={tool} setTool={setTool} roomCode={roomCode} />
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
