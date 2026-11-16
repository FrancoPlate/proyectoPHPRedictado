import axios from "axios";

export default async function authlogin(nombre, password) {
  const response = await axios.post(
    "http://localhost:8000/login",
    {
      username: nombre,
      password: password
    }
  );

  return response.data;
}