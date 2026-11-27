
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// POST /chats/:user_id
export async function crearChat(id, mensaje) {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/chats/${id}`,
    { mensaje },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

// GET /chats
export async function getChats() {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/chats`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

// GET /chats/:user_id/historia/:quantity
export async function getHistoria(id, quantity , offset ) {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/chats/${id}/historia/${quantity}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        offset
      }
    }
  );

  return response.data;
}

// PUT /chats/:user_id
export async function actualizarChat(id, datos) {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/chats/${id}`,
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

// DELETE /mensajes/:message_id
export async function eliminarMensaje(id) {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/mensajes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}
