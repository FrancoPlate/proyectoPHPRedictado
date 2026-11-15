import React, { useState, useEffect } from 'react';

import api from '../service/api.js';
import star from "../assets/star.svg"
import '../assets/styles/styleStartPage.css'

function ListadoUsuarios( isAdmin, logueado) {
  // --- 1. ESTADOS LOCALES (BUSQUEDA) ---
  const [users, setUsers] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ascendente, setAscendente] = useState(true); 
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 6;
    
  // ==========================================
  //            MANEJADORES DE EVENTOS
  // ==========================================

  const siguientePagina = () => {
    if (usuarios.length < usuariosPorPagina) return;
    setPaginaActual((prev) => prev + 1)
    
  };

  const paginaAnterior = () => {
    setPaginaActual((prev) => (prev > 1 ? prev - 1 : 1));
  };

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        // Convertimos el booleano a string 'ASC' o 'DESC' para el backend
        const orden = ascendente ? 'ASC' : 'DESC';

        const respuesta = await api.get('/usuarios', {
          params: {
            search: busqueda,
            order: orden,
            limit: usuariosPorPagina,
            offset: (paginaActual - 1) * usuariosPorPagina,
          }
        });  
        setUsers(respuesta.data);
      } catch (error) {
        console.error("Error al traer los usuarios:", error);
      }
    };
    obtenerUsuarios();
  }, [ascendente, paginaActual]);
  
  return (
    <div className='my-5 bg-amber-400 w-[400px] min-h-auto max-h-auto rounded-2xl'>
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
                    {isAdmin ?(
                        <p className='h-[24px] w-auto mx-1 text-[10px] font-medium flex items-end'>{user.cantidad}</p>
                      ) : 
                        <></>
                    }
                    
                  </div>
                  <button onClick={isAdmin?console.log(1):console.log(2)} className='mx-3 p-1 h-auto w-auto border-b-2 border-transparent transition-all duration-300 ease-out hover:cursor-pointer hover:border-black'>Z   </button>
              </div>
            ))
          ):(
            <p className="mt-4 text-1xl font-medium">No se encontraron Usuarios.</p>
          )}
        </div>
        {/*Seccion paginacion*/}
        <div className='m-1 flex justify-end h-10 w-auto'>
          {ascendente ?(
              <button onClick={()=> setAscendente(false)} className="estilo-filtro">{'asc'}</button>
            ):(
              <button onClick={()=> setAscendente(true)}  className="estilo-filtro ">{'des'}</button>
            )
          }
          
          <button onClick={paginaAnterior} className="estilo-filtro">{'<'}</button>
          <p className="estilo-filtro">{paginaActual}</p>
          <button onClick={siguientePagina} disabled={users.length < usuariosPorPagina || users.length === 0} className="estilo-filtro 
            ${
              users.length < usuariosPorPagina || users.length === 0 
                ? 'bg-gray-300 opacity-50 cursor-not-allowed pointer-events-none' 
                : 'bg-amber-400 hover:bg-amber-300 text-black'
            }">{'>'}</button>

        </div>

    </div>
  );
}

export default ListadoUsuarios;

/*

// Hojas de estilo
import styleStartPage from '../assets/styles/listAssets.module.css';

/**
 * Función auxiliar para convertir strings de precios directamente a números legibles.
 
const limpiarPrecio = (precioStr) => {
  if (!precioStr) return 0;
  return parseFloat(String(precioStr).replace(/[^0-9.-]+/g, ""));
};

function ListadoActivos({activos,cargando,errorMsg}) {
  // --- 1. ESTADOS LOCALES (BUSQUEDA Y ORDENAMIENTO) ---
  const [busqueda, setBusqueda] = useState(''); 
  const [sortConfig, setSortConfig] = useState({key: "price",direction: "asc", });

  // ==========================================
  //            MANEJADORES DE EVENTOS
  // ==========================================
  
  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // ==========================================
  //       LÓGICA DE FILTRADO Y ORDENAMIENTO
  // ==========================================

  const activosFiltrados = activos.filter((activo) => {
    const termino = busqueda.toLowerCase();
    const nombre = activo.name ? activo.name.toLowerCase() : '';
    const ticker = activo.ticker ? activo.ticker.toLowerCase() : ''; // Salvavidas por si no viene ticker
    
    return nombre.includes(termino) || ticker.includes(termino);
  });

  activosFiltrados.sort((a, b) => {
    if (sortConfig.key === "name") {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
      if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }

    if (sortConfig.key === "price") {
      // Usamos current_price que es como lo llama tu backend
      const precioA = limpiarPrecio(a.current_price);
      const precioB = limpiarPrecio(b.current_price);
      return sortConfig.direction === "asc" ? precioA - precioB : precioB - precioA;
    }

    return 0;
  });
  
  return (
    <div className="contenedor-lista">
      
      {/* SECCIÓN SUPERIOR: BARRA DE BÚSQUEDA Y CONTADOR }
      <div className='seccion-barraBusqueda'>
        <input
          type="text"
          placeholder="Buscar por nombre (ej. BTC, Apple)..."
          value={busqueda}
          onChange={handleInputChange}
          className="input-busqueda"
        />
        <span className={styleStartPage.contadorResultados}>
          Resultados: {activosFiltrados.length}
        </span>
      </div>
      
      {/* SECCIÓN DE ENCABEZADOS: FILTRADO INTERACTIVO }
      <div className={styleStartPage.seccionFiltro}>
        <ul className={styleStartPage.filtroNombre}>
          <li onClick={() => handleSort("name")} className="cursor-pointer">
            Nombre {sortConfig.key === "name" && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
          </li>
        </ul> 
        <ul className={styleStartPage.filtroPrecios}>
          <li onClick={() => handleSort("price")} className="cursor-pointer">
            Precio {sortConfig.key === "price" && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
          </li>
          <li>Cambio</li>
        </ul>
      </div>
      
      {/* SECCIÓN INFERIOR: PRESENTACIÓN DE DATOS (TABLA) }
      <div className="tabla-activos">
        {cargando ? (
          <p className="sin-resultados">Cargando información del mercado...</p>
        ) : errorMsg ? (
          <p className="sin-resultados" className='error-meg'>{errorMsg}</p>
        ) : activosFiltrados.length > 0 ? ( 
          activosFiltrados.map((activo) => (
            <div key={activo.id || activo.asset_id} className="tarjeta-activo">
              <div className='info-principal'>
                <span className='ticker'>
                  {activo.ticker || (activo.name ? activo.name.substring(0, 3).toUpperCase() : 'ND')}
                </span>
                <span className='nombre'>{activo.name}</span>
              </div>
              <div className={styleStartPage.infoFinanciera}>
                <span className={styleStartPage.precio}>${activo.current_price}</span>
                <span className={activo.diferencia >= 0 ? styleStartPage.diferenciaPos : styleStartPage.diferenciaNeg}>
                  {activo.diferencia >= 0 ? `+${activo.diferencia.toFixed(2)}` : activo.diferencia.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="sin-resultados">No se encontraron activos que coincidan.</p>
        )}
      </div>

    </div>
  );
}
*/