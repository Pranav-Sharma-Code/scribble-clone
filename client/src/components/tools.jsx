import React, { useEffect, useState } from 'react'
import socket from '../socket/socket';

const Tools = ({ color, setColor, brushSize, setBrushSize, tool, setTool, roomCode }) => {

     const clearCanvas = () => {
          socket.emit("canvas_clear", { roomCode });
     }
     const undoCanvas = () => {
          socket.emit("draw_undo", { roomCode });
     }

     return (
          <div className='flex flex-col md:flex-row bg-white/10 backdrop-blur-md border border-white/20 
                        rounded-3xl shadow-xl gap-10 p-3 items-center justify-center w-full max-w-[600px]'>


               <div className=' grid rounded-xl gap-2 cursor-pointer'>
                    <div className='flex gap-1'>
                         <button onClick={() => setColor("pink")}
                              className='bg-pink-700 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-pink-300' />
                         <button onClick={() => setColor("green")}
                              className='bg-green-700 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-green-300' />
                         <button onClick={() => setColor("black")}
                              className='bg-black w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-white' />
                         <button onClick={() => setColor("purple")}
                              className='bg-purple-700 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-purple-300' />
                         <button onClick={() => setColor("red")}
                              className='bg-red-700 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-red-300' />
                    </div>
                    <div className='flex gap-1'>
                         <button onClick={() => setColor("blue")}
                              className='bg-blue-700 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-blue-300' />
                         <button onClick={() => setColor("white")}
                              className='bg-white w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-black' />
                         <button onClick={() => setColor("orange")}
                              className='bg-orange-500 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-orange-300' />
                         <button onClick={() => setColor("yellow")}
                              className='bg-yellow-500 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-yellow-300' />
                         <button onClick={() => setColor("brown")}
                              className='bg-amber-950 w-10 h-10 rounded-xl hover:scale-90 transition duration-200 active:ring-2 active:ring-amber-300' />

                    </div>
               </div>

               <div className='flex flex-col items-center justify-center gap-1 flex-wrap'>
                    <input type="range" min='1' max='20' value={brushSize}
                         onChange={(event) => setBrushSize(event.target.value)}
                         className='w-32 md:w-40 accent-blue-700 active:scale-115 transition duration-300
                              cursor-grab active:cursor-grabbing'
                    />
                    <div className='cursor-pointer'>
                         <button onClick={() => setTool("brush")}
                              className={`p-2 rounded-xl ${tool === "brush" ? "bg-green-500" : "bg-white/10"}`}>
                              <span class="material-symbols-outlined"
                                   style={{ fontSize: "24px" }}>
                                   brush
                              </span>
                         </button>
                         <button onClick={() => setTool("eraser")}
                                 className={`p-2 rounded-xl ${tool === "eraser" ? "bg-red-500" : "bg-white/10"}`}>
                              <span class="material-symbols-outlined"
                                   style={{ fontSize: "24px" }}>
                                   ink_eraser
                              </span>
                         </button>
                    </div>
               </div>

               <div className=' flex items-center justify-center gap-4'>
                    <span onClick={undoCanvas} className=" material-symbols-outlined text-white cursor-pointer 
                                                        active:scale-90 active:-translate-x-1  transition duration-200 "
                         style={{ fontSize: "38px" }}
                    >
                         undo
                    </span>

                    <span onClick={clearCanvas} className=" material-symbols-outlined text-white cursor-pointer 
                                                        active:scale-90 active:rotate-90 transition duration-200"
                         style={{ fontSize: "38px" }}
                    >
                         refresh
                    </span>

               </div>

          </div>
     )
}

export default Tools;
