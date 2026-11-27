import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatsPage from './pages/MisChatsPage.jsx'
import StartPage from './pages/StartPage.jsx'
import Register from './pages/RegistroPage.jsx'
import MainLayout from './utils/MainLayout.jsx'
import api from './service/api.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const token = localStorage.getItem('token');
  

  useEffect(() => {
   
    if (!token ) return;  // si no hay token guardado, no está logueado y frenamos la ejecución
    const controller = new AbortController(); // parche para que no salte doble notificacion de error

    api.get('/usuario', {
        headers: {'Authorization': `Bearer ${token}`},
        signal: controller.signal,
    }).then(response => {
        setIsLoggedIn(true); 
        setName(response.data['nombre']); 
        const isAdmin = response.data.isAdmin
          ? Object.keys(response.data.isAdmin).length > 0
          : false;
        
        setIsAdmin(isAdmin);
        
    }).catch(error => {
        if (axios.isCancel(error)) return; // ignorar la cancelada
        console.error(`Error: ${error.status}. Validación de sesión fallida:, ${error}`);
        setName('');
        setIsAdmin(false);
        setIsLoggedIn(false);
        if (error.response) {
          localStorage.removeItem('token');
          toast.error(`Sesión expirada o inválida (Error ${error.response.status})`);
        }
    });
    return () => controller.abort();
    }, []);

  //Función para cerrar sesión (Log out)
  const handleLogout = () => {
    const token = localStorage.getItem('token'); 
    api.post('/logout',{}, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
    })
    .then(response => {
        toast.success(`Sesión cerrada correctamente.`);
    })
    .catch(error => {
        toast.error(`Error: ${error.status}. Hubo un problema al intentar cerrar sesión.`);
        console.error(`Error: ${error.status}. Hubo un problema al intentar cerrar sesión:, ${error}`);
    }).finally( e => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setName('');
    })
  };
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route element={<MainLayout datos={name} isLoggedIn={isLoggedIn} onLogout={handleLogout}/>}>
          <Route path="/" element={<StartPage logueado={isLoggedIn} isAdmin={isAdmin}/>} />
          <Route path="/misChats" element={<ChatsPage />} />
        </Route>
        <Route path="/register" element={<Register />} />

        
      </Routes>
    </Router>
  )
}

export default App
