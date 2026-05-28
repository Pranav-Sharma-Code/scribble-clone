import React,{ useEffect, useRef, useState } from 'react'
import socket from '../socket/socket.js';
import WordBox from '../components/wordbox';
import Tools from './tools.jsx';
import GuessWord from './guessWord.jsx';


const DrawBoard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [color, setColor] = useState("black");
    const [brushSize, setBrushSize] = useState(5);
    
   
    const [round, setRound] = useState(1);
    const [time, setTime] = useState(80);
    const [word, setWord] = useState("");

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        socket.on("receive-draw", (data)=>{
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.brushSize;
            ctx.beginPath();
            ctx.moveTo(data.prevX, data.prevY);
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        });

        socket.on("game-state", (data) => {

            setRound(data.round);
            setTime(data.time);
            setWord(data.word);

        })

        return () => {
            socket.off("receive-draw");
            socket.off("game-state");
        };

    },[]);

    const startDrawing = (event) =>{
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

    const stopDrawing = () =>{
        setIsDrawing(false);
    };

   

    const draw = (event) => {
        if(!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineTo(x, y);
        ctx.stroke();

        socket.emit("draw",{
            x, y,
            prevX: x-1,
            prevY: y-1,
            color, brushSize,
        });
        ctx.beginPath();
        ctx.moveTo(x,y);
    }

  return (
    <div className='flex flex-col justify-center items-center w-full min-h-screen gap-4'>

        <WordBox round={round} time={time} word={word} />

        {/* testing button */}

        <button onClick={() => socket.emit("start-game")} className='bg-green-600 text-white px-4 py-2 rounded-xl'>Start Game</button>

  

        <canvas ref={canvasRef} width={800} height={600} onMouseDown={startDrawing} onMouseUp={stopDrawing}
                                onMouseMove={draw}  onMouseLeave={stopDrawing} 
                className='bg-white w-full max-w-[800px] aspect-[4/3] border-2 border-purple-500 rounded-xl cursor-crosshair' />


        {
            isDrawing.current ?
                                <Tools color={color} setColor={setColor} brushSize={brushSize} canvasRef={canvasRef}
                                       setBrushSize={setBrushSize} history={history} setHistory={setHistory} />
                              :
                                <GuessWord />
        }

    </div>
  )
}

export default DrawBoard;
