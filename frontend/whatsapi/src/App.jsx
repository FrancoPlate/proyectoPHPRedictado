import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChatsPage from './pages/MisChatsPage.jsx'
import StartPage from './pages/StartPage.jsx'
//import editarPage from './pages/editarUsuario'
import MainLayout from './utils/MainLayout.jsx'
//import api from './service/api.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem('token');

  /*useEffect(() => {
    // si no hay token guardado, no está logueado
    if (!token) {
        return; // Frenamos la ejecución
    }
    api.get('/user', {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        setIsLoggedIn(true); 
        setName(response.data.name); 
        setIsAdmin(response.data.is_admin); 
    })
    .catch(error => {        
        console.error(`Error: ${error.status}. Validación de sesión fallida:, ${error}`);
        setName("");
        // borramos el token ya que no sirve -> modificar se tiene que eliminar en la base de datos tambien
        localStorage.removeItem('sessionToken');
        if (error.response) {
            alert(`Sesión expirada o inválida (Error ${error.response.status})`);
        }
    });

    }, []);*/
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<StartPage logueado={isLoggedIn}/>} />
          <Route path="/misChats" element={<ChatsPage />} />
         
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App