import React, { useState, useEffect } from 'react';

import api from '../service/api.js';
import star from "../assets/star.svg"
import '../assets/styles/styleStartPage.css'

function ListadoUsuarios(logueado) {
  // --- 1. ESTADOS LOCALES (BUSQUEDA) ---
  const [users, setUsers] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ascendente, setAscendente] = useState(true); 
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 6;
  const token = localStorage.getItem('token');
    
  // ==========================================
  //            MANEJADORES DE EVENTOS
  // ==========================================

  const siguientePagina = () => {
    if (users.length < usuariosPorPagina) return;
    setPaginaActual((prev) => prev + 1)
    
  };

  const paginaAnterior = () => {
    setPaginaActual((prev) => (prev > 1 ? prev - 1 : 1));
  };

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const orden = ascendente ? 'ASC' : 'DESC';
        

        const respuesta = await api.get('/usuarios', {
          params: {
            search: busqueda,
            order: orden,
            limit: usuariosPorPagina,
            offset: (paginaActual - 1) * usuariosPorPagina,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(respuesta.data);
      } catch (error) {
        setUsers([]);
        if (error.response?.status !== 404) {
          console.error("Error al traer los usuarios:", error);
        }
      }
    };

    // Aplicamos el debounce de 400ms solo si el cambio vino por la búsqueda
    const timer = setTimeout(() => {
      obtenerUsuarios();
    }, 400);

    return () => clearTimeout(timer);
  }, [ascendente, paginaActual, busqueda, usuariosPorPagina]);
  
  return (
    <div className='my-5 bg-amber-400 w-100 min-h-auto max-h-auto rounded-2xl'>
        {/*Seccion Encabezado*/}
        <div className='flex justify-end h-15 w-auto'>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Reiniciar a la página 1 al buscar
            }}
            className="m-2 p-3 bg-amber-200 border-3 border-transparent rounded-2xl font-medium focus:border-amber-100 focus:border-3 focus:outline-0"
          />
        </div>
        {/*Seccion Contenido*/}
        <div className='m-2 p-1 max-w-auto min-h-15 max-h-120 bg-transparent '>

          {users.length > 0 ? (
            users.map((user)=> (
              <div key={user.id} className="m-2 p-2 max-w-auto h-12 bg-amber-200 flex justify-between content-center rounded-2xl transition-all duration-300 hover:shadow-xl/20 hover:shadow-amber-100">
                  <div className='flex justify-center items-center'>
                    {user.is_admin?(
                        <span className='isAdmin'><img className='max-h-4 max-w-4 text-amber-400' src={star}/> </span> 
                      ) : 
                        <></>
                    }
                    
                    <h3 className='h-auto w-auto mx-1 font-medium'>{user.nombre}</h3>
                    {user.cantidadChats !== undefined &&(
                        <p className='h-6 w-auto mx-1 text-[10px] font-medium flex items-end'>{user.cantidadChats}</p>
                      )
                    }
                    
                  </div>
                  <button onClick={() => console.log(user.id)} className='mx-3 p-1 h-auto w-auto border-b-2 border-transparent transition-all duration-300 ease-out hover:cursor-pointer hover:border-black'>Z   </button>
              </div>
            ))
          ):(
            <p className="mt-4 text-1xl font-medium">No se encontraron Usuarios.</p>
          )}
        </div>
        {/*Seccion paginacion*/}
        <div className='m-1 flex justify-end h-10 w-auto'>
          {ascendente ?(
              <button onClick={()=> setAscendente(false)} className="estilo-filtro ">{'asc'}</button>
            ):(
              <button onClick={()=> setAscendente(true)}  className="estilo-filtro ">{'des'}</button>
            )
          }
          
          <button onClick={paginaAnterior} className="estilo-filtro ">{'<'}</button>
          <p className="m-1 px-1 h-auto w-11 bg-amber-200 border-3 border-transparent rounded-full font-medium">{paginaActual}</p>
          <button onClick={siguientePagina} disabled={users.length < usuariosPorPagina || users.length === 0} className="estilo-filtro
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600">{'>'}</button>

        </div>

    </div>
  );
}

export default ListadoUsuarios;