import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// LOGIN
export default async function authlogin(nombre, password) {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      username: nombre,
      password: password
    }
  );

  return response.data;
}

// LOGOUT
export async function CerrarSesion() {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}