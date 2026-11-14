import React,{useState, useEffect, use} from "react";
import { Link } from "react-router-dom";

import '../assets/styles/nav.css'
//import api from '../service/api'

 function NavBar(){
    // Simulamos el estado de autenticación (cambia a true para probar)
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [name, setName] = useState("");
    const token = localStorage.getItem('sessionToken'); 
    // useEffect para revisar el localStorage apenas se carga la barra de navegación
    // Se ejecuta una sola vez al montar el componente
  useEffect(() => {
    // si ni siquiera hay un token guardado, no está logueado
    if (!token) {
        setIsLoggedIn(true);
        return; // Frenamos la ejecución
    }
    api.get('/user', {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        setIsLoggedIn(true); // Recién acá el Nav cambia a modo "Usuario Logueado"
        setName(response.data.name); // Guardamos su nombre real
    })
    .catch(error => {        
        console.error(`Error: ${error.status}. Validación de sesión fallida:, ${error}`);
        setIsLoggedIn(false);
        setName("");
        // el token ya no sirve, lo borramos
        localStorage.removeItem('sessionToken');
        if (error.response) {
            alert(`Sesión expirada o inválida (Error ${error.response.status})`);
        }
    });

    }, []);

  //Función para cerrar sesión (Log out)
  const handleLogout = () => {
    const token = localStorage.getItem('sessionToken'); 
    api.post('/logout',{}, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
    })
    .then(response => { 
        setIsLoggedIn(false);
        localStorage.removeItem('sessionToken');
    })
    .catch(error => {        
        console.error(`Error: ${error.status}. Hubo un problema al intentar cerrar sesión:, ${error}`);
    });
  };
    return(
        <div className="">
            {isLoggedIn ? (
                <ul className="estilo-ul">
                    
                    {name !== "" ? (
                        <li><p>Hola {name}</p></li>
                    ) : (
                        <li><p>-nombre del usuario-</p></li>
                    )}

                    <li className="estilo-li"><Link className="estilo-a" to="/misChats">Mis chats</Link></li>
                    <li className="estilo-li"><Link className="estilo-a" to="/editarUsuario">Editar usuario</Link></li>                    
                    <li className="estilo-li"><button className="estilo-a" onClick={() => handleLogout()}>Logout</button></li>
                    
                    
                </ul>
            ) : (
                
                <ul className="estilo-ul">
                    <li className="estilo-li"><Link to="/auth?tab=login">Login</Link></li>
                    <li className="estilo-li"><Link to="/auth?tab=register">Registro de usuario</Link></li>
                </ul>
            )}
        </div>
    )
}

export default NavBar