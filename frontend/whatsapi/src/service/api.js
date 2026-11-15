import axios from 'axios';

const api = axios.create({
  // Reemplaza con la URL exacta donde esté corriendo tu servidor backend
  baseURL: 'http://localhost:8080', 
  timeout: 5000, // Si el backend tarda más de 5 segundos, cancela la petición
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;