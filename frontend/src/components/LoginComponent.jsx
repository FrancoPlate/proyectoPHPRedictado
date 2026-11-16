
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import authlogin from "../service/auth";

export default function LoginComponent() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const validarLogin = async (e) => {
    e.preventDefault();

    // Validar username
    const ValidUsername = /^@[a-zA-Z0-9]{4,11}$/;

    if (!ValidUsername.test(username)) {
      toast.error(
        "El usuario debe comenzar con @ y tener entre 5 y 12 caracteres."
      );
      return;
    }

    // Validar password
    const ValidPassoword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/;

    if (!ValidPassoword.test(password)) {
      toast.error(
        "La contraseña debe tener entre 8 y 15 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }

    // Login con backend
    try {
      const response = await authlogin(username, password);

      localStorage.setItem("token", response.token);

      toast.success("Login Exitoso");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        toast.error(error.response.data[0]);
      } else {
        toast.error("No se pudo verificar el usuario en el servidor.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">

      <ToastContainer position="top-right" autoClose={3000} />

      <form
        onSubmit={validarLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Iniciar sesión
        </h2>

        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@usuario123"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Contraseña
          </label>

          <input
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu contraseña"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={mostrarPassword}
              onChange={(e) => setMostrarPassword(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            Mostrar contraseña
          </label>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
        >
          Ingresar
        </button>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-500">
          ¿No tenés cuenta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Registrate
          </span>
        </p>

      </form>
    </div>
  );
}
