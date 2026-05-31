import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import bg from './assets/bg.svg'
import Login from './pages/login.jsx'
import Playground from './pages/playground.jsx';
import Lobby from './pages/lobby.jsx';


function App() {
  return (
    <div className="app-bg">
      <Toaster position="top-center"
        toastOptions={{duration: 2000,
          style: {
            background: '#1e1b4b',
            color: '#fff',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/playground/:roomCode' element={<Playground />} />
          <Route path="/room/:roomCode" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
