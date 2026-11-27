import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Contact from '../components/ContactComponent'
import Chat from '../components/ChatComponent'
import api from '../service/api.js'

function MisChats(){
    // ================= ESTADOS Y DATOS DE EJEMPLO =================
    const [chats, setChats] = useState([]);
    const [chatActivo, setChatActivo] = useState(chats[0]);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [menuOpcionesAbierto, setMenuOpcionesAbierto] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
  useEffect(() => { 

     if (!token ) {
        navigate('/')
        return
    };  // si no hay token guardado, no está logueado y frenamos la ejecución
    const controller = new AbortController(); // parche para que no salte doble notificacion de error

    api.get('/chats',{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
    }).then(response => {
        setChats(response.data)
        console.log(response.data)
    }). catch (error => {
        if (axios.isCancel(error)) return; // ignorar la cancelada
        setChats([]);
        if (error.response?.status !== 404) {
            console.error("Error al traer los chats:", error);
            toast.error(`Error al traer los chats: ${error.response?.status}`)
        }
    })
    return () => controller.abort();
  }, []);

  const seleccionarChat = (chat) => {
    if (chat.bloqueado) return; // Si está bloqueado, no se puede seleccionar
    setChatActivo(chat);
    setEditDescripcion(chat.descripcion);
    setEditColor(chat.colorFondo);
    setMenuOpcionesAbierto(false);
  };

  const guardarEdicionChat = (e) => {
    e.preventDefault();
    // Validación de descripción: vacía o entre 20 y 40 caracteres con letras y números
    if (editDescripcion !== '' && (editDescripcion.length < 20 || editDescripcion.length > 40 || !/^[a-zA-Z0-9\s]+$/.test(editDescripcion))) {
      setErrorValidacion('La descripción debe tener entre 20 y 40 caracteres (solo letras y números) o estar vacía.');
      return;
    }

    setErrorValidacion('');
    setChats(chats.map(c => c.id === chatActivo.id ? { ...c, descripcion: editDescripcion, colorFondo: editColor } : c));
    setChatActivo({ ...chatActivo, descripcion: editDescripcion, colorFondo: editColor });
    setMostrarModalEdicion(false);
  };

  return (
    <div className="flex h-[70vh] w-full bg-gray-100 overflow-hidden font-sans">
      
      
      <Contact chats={chats} chatActivo={chatActivo} onSeleccionarChat={seleccionarChat}/>

      
      <Chat 
        chatActivo={chatActivo} 
        setChatActivo={setChatActivo}
        chats={chats}
        setChats={setChats}
      />

      {/* ================= MODAL DE EDICIÓN DE CHAT (Si fue creado por mí) ================= */}
      {mostrarModalEdicion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Editar Configuración del Chat</h3>
            
            <form onSubmit={guardarEdicionChat} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción (20-40 caracteres, alfanumérica)</label>
                <input 
                  type="text" 
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Ej: Grupo oficial de trabajo 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Color de Fondo (Hexadecimal)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-10 h-10 border rounded cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="flex-1 border p-2 rounded text-sm"
                  />
                </div>
              </div>

              {errorValidacion && <p className="text-red-500 text-xs">{errorValidacion}</p>}

              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => setMostrarModalEdicion(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-black text-sm font-medium rounded hover:bg-amber-300"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default MisChats