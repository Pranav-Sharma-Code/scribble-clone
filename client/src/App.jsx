import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import bg from './assets/bg.svg'
import Login from './pages/login.jsx'
import Playground from './pages/playground.jsx';
import Lobby from './pages/lobby.jsx';


function App() {
  return (
    <div className="bg-center bg-cover h-screen w-full flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/playground/:roomCode' element={<Playground />} />
          <Route path="/room/:roomCode" element={<Lobby />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
