import React,{ useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';

const socket = io("http://localhost:3001");

const DrawBoard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [color, setColor] = useState("black");
    const [brushSize, setBrushSize] = useState(5);

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

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, canvas.width, canvas.height);
    }

    const undoCanvas = () => {
        if (history.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const newHistory = [...history];
        newHistory.pop();
        setHistory(newHistory);
        const previousState = newHistory[newHistory.length-1];
        const img = new Image();
        img.src = previousState;
        img.onload = () => {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            
            if(previousState){
                ctx.drawImage(img, 0, 0);
            }
        };
        if(!previousState){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

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
    <div className='grid justify-center items-center w-full h-full gap-0.5'>
        <div className='bg-purple-200 w-[800px] h-[80px] border-purple-500 border-2'></div>
        <canvas ref={canvasRef} width={800} height={600} onMouseDown={startDrawing} onMouseUp={stopDrawing}
                                onMouseMove={draw}  onMouseLeave={stopDrawing}
                className='bg-white w-[800px] h-[600px] border-2 border-purple-500' />

        <div className='flex bg-purple-300 gap-30 p-4'>

            <div type='color' className=' w-60 h-20 grid rounded-xl gap-1'>
                <div className='flex gap-0.5'>
                    <div onClick={() => setColor("pink")} 
                         className='bg-pink-700 w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("green")} 
                         className='bg-green-700 w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("black")} 
                         className='bg-black w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("purple")}
                         className='bg-purple-700 w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("red")}
                         className='bg-red-700 w-10 h-10 rounded-xl hover:scale-95 transition' />
                </div>
                <div className='flex gap-0.5'>
                    <div onClick={() => setColor("blue")}
                         className='bg-blue-700 w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("white")}
                         className='bg-white w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("orange")}
                         className='bg-orange-500 w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("yellow")}
                         className='bg-yellow-500 w-10 h-10 rounded-xl hover:scale-95 transition' />
                    <div onClick={() => setColor("brown")}
                         className='bg-amber-950 w-10 h-10 rounded-xl hover:scale-95 transition' />
                    
                </div>
            </div>

            <input type="range" min='1' max='20' value={brushSize}
                   onChange={(event) => setBrushSize(event.target.value)}
                
            />

            <div className='gap-100'>
                <span onClick={undoCanvas}
                  className="material-symbols-outlined text-white cursor-pointer hover:scale-90 transition
                             relative top-1"
                  style={{ fontSize: "60px"}}
                 >
                    undo
            </span>

            <span onClick={resetCanvas}
            className="material-symbols-outlined text-white cursor-pointer hover:scale-90 transition 
                        relative top-1"
                        style={{ fontSize: "60px" }}
            >
                refresh
            </span>
            </div>

        </div>
    </div>
  )
}

export default DrawBoard;
