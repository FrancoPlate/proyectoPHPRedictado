import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChatsPage from './pages/misChatsPage.jsx'
import StartPage from './pages/StartPage.jsx'
//import editarPage from './pages/editarUsuario'
import MainLayout from './utils/MainLayout.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<StartPage/>} />
          <Route path="/misChats" element={<ChatsPage />} />
         
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App
