
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Obtener usuario
export async function getUsuario(id) {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/usuarios/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

// Actualizar usuario
export async function updateUsuario(id, datos) {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/usuarios/${id}`,
    datos,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}
export async function EliminarUsuario(id) {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/usuarios/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}
