import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import bg from './assets/bg.svg'
import Login from './pages/login.jsx'
import Playground from './pages/playground.jsx';

function App() {
  return(
    <div className="bg-center bg-cover h-screen w-full flex justify-center items-center"
         style={{ backgroundImage: `url(${bg})`}}>
      <BrowserRouter>
       <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/playground' element={<Playground />} />
       </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
