import React, { useState, useEffect } from 'react';

function ListadoUsuarios() {
  // --- 1. ESTADOS LOCALES (BUSQUEDA) ---
  const [busqueda, setBusqueda] = useState(''); 

  // ==========================================
  //            MANEJADORES DE EVENTOS
  // ==========================================
  
  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
  };
  
  return (
    <p>hola</p>
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