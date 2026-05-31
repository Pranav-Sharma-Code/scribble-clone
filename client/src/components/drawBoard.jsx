import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("black");
    const [tool, setTool] = useState("brush");

    const [brushSize, setBrushSize] = useState(5);
    const [currentDrawerId, setCurrentDrawerId] = useState(null);

    const [showWordDialog, setShowWordDialog] = useState(false);
    const [wordOptions, setWordOptions] = useState([]);

    const [showRoundEnd, setshowRoundEnd] = useState(false);
    const [revealedWord, setRevealedWord] = useState("");

    const [maxRounds, setMaxRounds] = useState(0)
    const [round, setRound] = useState(0);
    const [time, setTime] = useState(0);
    const [word, setWord] = useState("");

    const [gameOver, setGameOver] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [winner, setWinner] = useState(null);

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
        const handleDrawStart = (stroke) => {
            strokesRef.current.push(stroke);
            redrawCanvas();
        };
        const handleDrawMove = ({ strokeId, x, y }) => {
            const stroke = strokesRef.current.find(s => s.id === strokeId);
            if (!stroke) return;
            stroke.points.push({ x, y });
            redrawCanvas();
        };
        const handleDrawUndo = (strokes) => {
            strokesRef.current = strokes;
            redrawCanvas();
        };
        const handleCanvasClear = () => {
            strokesRef.current = [];
            redrawCanvas();
        };
        const handleCanvasState = (strokes) => {
            strokesRef.current = strokes;
            redrawCanvas();
        };
        const handleGameState = (data) => {
            setRound(data.currentRound);
            setTime(data.timeLeft);
            setWord(data.word);
            setMaxRounds(data.maxRounds);
            setCurrentDrawerId(data.drawerId);
        };
        const handleWordSelected = () => {
            setShowWordDialog(false);
        };
        const handleHintReveal = ({ displayWord }) => {
            setWord(displayWord);
        };
        const handleRoundEnd = ({ word }) => {
            clearTimeout(timeoutRef.current);
            setshowRoundEnd(true);
            setRevealedWord(word);
            timeoutRef.current = setTimeout(() => {
                setshowRoundEnd(false);
            }, 5000);
        };
        const handleNewRound = () => {
            setRevealedWord("");
        };
        const handleChooseWord = ({ words }) => {
            setWordOptions(words || []);
            setShowWordDialog(true);
        };
        const handleGameOver = ({ winner, leaderboard }) => {
            setGameOver(true);
            setWinner(winner);
            setLeaderboard(leaderboard || []);
            setShowWordDialog(false);
            setshowRoundEnd(false);
        };

        socket.on("draw_start", handleDrawStart);
        socket.on("draw_move", handleDrawMove);
        socket.on("draw_undo", handleDrawUndo);
        socket.on("canvas_clear", handleCanvasClear);
        socket.on("canvas_state", handleCanvasState);
        socket.on("game_state", handleGameState);
        socket.on("word_selected", handleWordSelected);
        socket.on("hint_reveal", handleHintReveal);
        socket.on("round_end", handleRoundEnd);
        socket.on("new_round", handleNewRound);
        socket.on("choose_word", handleChooseWord);
        socket.on("game_over", handleGameOver);

        return () => {
            clearTimeout(timeoutRef.current);
            socket.off("draw_start", handleDrawStart);
            socket.off("draw_move", handleDrawMove);
            socket.off("draw_undo", handleDrawUndo);
            socket.off("canvas_clear", handleCanvasClear);
            socket.off("canvas_state", handleCanvasState);
            socket.off("game_state", handleGameState);
            socket.off("word_selected", handleWordSelected);
            socket.off("hint_reveal", handleHintReveal);
            socket.off("round_end", handleRoundEnd);
            socket.off("new_round", handleNewRound);
            socket.off("choose_word", handleChooseWord);
            socket.off("game_over", handleGameOver);
        };

    }, []);


    const startDrawing = (event) => {
        if (socket.id !== currentDrawerId) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (event.nativeEvent.offsetX / rect.width) * canvas.width;
        const y = (event.nativeEvent.offsetY / rect.height) * canvas.height;

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

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (event.nativeEvent.offsetX / rect.width) * canvas.width;
        const y = (event.nativeEvent.offsetY / rect.height) * canvas.height;

        socket.emit("draw_move", {
            roomCode,
            x, y
        });
    };

    if (gameOver) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
                <div className='flex flex-col items-center gap-6 bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 max-w-md w-full'>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">
                        🏆 Game Over!
                    </h1>
                    {winner && (
                        <div className='text-center'>
                            <p className='text-white/60 text-lg'>Winner</p>
                            <p className='text-3xl font-bold text-white'>{winner.avatar || '😀'} {winner.name}</p>
                            <p className='text-yellow-300 text-xl font-bold'>{winner.score} Points</p>
                        </div>
                    )}
                    <div className='w-full space-y-2 mt-2'>
                        <h2 className='text-white/60 text-center text-sm font-bold uppercase tracking-wider'>Leaderboard</h2>
                        {leaderboard.map((player, i) => (
                            <div key={player.id} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-yellow-500/20 border border-yellow-400/50' : 'bg-white/5'}`}>
                                <div className='flex items-center gap-3'>
                                    <span className='text-white/50 font-bold w-6'>#{i + 1}</span>
                                    <span className='text-lg'>{player.avatar || '😀'}</span>
                                    <span className='text-white font-bold'>{player.name}</span>
                                </div>
                                <span className='text-yellow-300 font-bold'>{player.score}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate(`/room/${roomCode}`)}
                        className='mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-3 rounded-2xl transition-all hover:scale-95'>
                        Back to Lobby
                    </button>
                </div>
            </div>
        )
    }

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
