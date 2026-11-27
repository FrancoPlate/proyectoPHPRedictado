import React,{useState, useEffect, use} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import '../assets/styles/nav.css'
import '../assets/styles/colors.css'
import api from '../service/api'

 function NavBar({nombreUsuario,isLoggedIn,onLogout}){

    const navigate = useNavigate();
    const cerrarSesion = async () => {
        await onLogout();   // esperar a que se limpien los estados
        navigate('/');
    };

    return(
        <div className="">
            {isLoggedIn ? (
                <ul className="estilo-ul">
                    
                    {nombreUsuario !== "" ? (
                        <li><p className="estilo-nombre">Hola {nombreUsuario}</p></li>
                    ) : (
                        <li><p className="estilo-nombre">-Nombre del usuario-</p></li>
                    )}

                    <li className="estilo-li"><Link className="estilo-a" to="/misChats">Mis chats</Link></li>
                    <li className="estilo-li"><Link className="estilo-a" to="/editarUsuario">Editar usuario</Link></li>                    
                    <li className="estilo-li"><button className="estilo-selec" onClick={() => cerrarSesion()}>Logout</button></li>
                    
                </ul>
            ) : (
                
                <ul className="estilo-ul">
                    <li className="estilo-li"><Link className="estilo-a" to="/login">Login</Link></li>
                    <li className="estilo-li"><Link className="estilo-a" to="/register">Registro de usuario</Link></li>
                </ul>
            )}
        </div>
    )
}

export default NavBar