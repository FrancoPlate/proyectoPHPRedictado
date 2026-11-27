import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import '../assets/styles/colors.css'
import api from '../service/api'

function Registro() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [nombre, setNombreUser] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const validarRegistro = async (e) => {
    e.preventDefault();

    // Validar username
    const ValidUsername = /^@?[a-zA-Z0-9]*$/;
    const valorUserName = username.trim()
    if (!valorUserName.startsWith('@')) {
      toast.error("El userName debe comenzar con @");
      return;
    }
    if(!ValidUsername.test(valorUserName)){
      toast.error("El userName solo puede tener letras y números (sin caracteres especiales).");
      return;
    }
    if(valorUserName.length < 6 || valorUserName.length > 12 ){
      toast.error("El userName debe tener entre 6 y 12 caracteres (incluido el @).");
      return;
    }

    // Validar Nombre de Usuario
    const valorNombre = nombre.trim()
    if (valorNombre.length === 0 || valorNombre === '@') {
      toast.error('El nombre no puede estar vacío ni ser solo @.');
      return;
    }
    if (valorNombre.length > 30) {
      toast.error('El nombre puede tener como máximo 30 caracteres.');
      return;
    }
    if (/\d/.test(valorNombre)) {
      toast.error('El nombre no puede contener números.');
      return;
    }

    // Validar password
    const ValidPassoword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/;
    const valorPassoword = password.trim()
    if(valorPassoword.length < 8 || valorPassoword.length > 15){
      toast.error("La contraseña debe tener entre 8 y 15 caracteres.");
      return;
    }
    if(!/[a-z]/.test(valorPassoword)){
      toast.error("La contraseña debe tener al menos una minúscula.");
      return;
    }
    if(!/[A-Z]/.test(valorPassoword)){
      toast.error("La contraseña debe tener al menos una mayúscula.");
      return;
    }
    if(!/[^a-zA-Z0-9]/.test(valorPassoword)){
      toast.error("La contraseña debe tener al menos un carácter especial.");
      return;
    }
    if(!/\d/.test(valorPassoword)){
      toast.error("La contraseña debe tener al menos un número.");
      return;
    }

    // Registro con backend
    try {
      const response = await api.post('/usuarios', {username,password,nombre})
      toast.success("Login Exitoso");
      setTimeout(() => {
        navigate("/login");
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
    <div className="min-h-screen flex items-center justify-center px-4">

      <ToastContainer position="top-right" autoClose={3000} />

      <form
        onSubmit={validarRegistro}
        className="w-full max-w-md second-bg-color p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center primary-text-color">
          Registro de usuario
        </h2>

        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-sm font-medium primary-text-color">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@usuario123"
            className="w-full px-4 py-3 border primary-text-color third-border-color rounded-lg outline-none focus:ring-2 focus:third-border-color"
          />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium primary-text-color">
                Nombre del usuario
            </label>
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombreUser(e.target.value)}
                placeholder="Pedro Sanches"
                className="w-full px-4 py-3 border primary-text-color third-border-color rounded-lg outline-none focus:ring-2 focus:third-border-color"
            />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm font-medium primary-text-color">
            Contraseña
          </label>

          <input
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu contraseña"
            className="w-full px-4 py-3 border primary-text-color third-border-color rounded-lg outline-none focus:ring-2 focus:third-border-color"
          />

          <label className="flex items-center gap-2 text-sm primary-text-color cursor-pointer">
            <input
              type="checkbox"
              checked={mostrarPassword}
              onChange={(e) => setMostrarPassword(e.target.checked)}
              className="w-4 h-4  third-accent-color cursor-pointer"
            />
            Mostrar contraseña
          </label>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full third-bg-color border third-border-color second-text-color font-semibold py-3 rounded-lg transition duration-300 shadow-md cursor-pointer"
        >
          Ingresar
        </button>

        {/* Login */}
        <p className="text-center text-sm primary-text-color">
          ¿No tenés cuenta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="third-text-color font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}


export default Registro;