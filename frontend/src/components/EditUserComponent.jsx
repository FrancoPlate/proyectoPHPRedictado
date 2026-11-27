import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

import {
  getUsuario,
  updateUsuario
} from "../service/usuarios";

export default function EditUser() {
  const [nombre, setNombre] = useState("");
  const [publicCheck, setPublicCheck] = useState(0);
  const [contraseña, setContraseña] = useState("");
  const [repeContraseña, setRepeContraseña] = useState("");
  const [verContraseñas, setVerContraseñas] = useState(false);
  const [user, setUser] = useState({});
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Si recibe userId desde el chat, está editando otro usuario
  const userId = location.state?.userId;
  const editandoOtroUsuario = Boolean(userId);

  // CARGAR USUARIO
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const idUsuario = userId ?? payload.usuario;

        const usuario = await getUsuario(idUsuario);

        setUser(usuario);
        setNombre(usuario.nombre ?? "");
        setPublicCheck(Number(usuario.es_publico));
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        toast.error("No se pudo cargar el usuario");
      }
    };

    cargarUsuario();
  }, [userId, navigate]);

  // ACTUALIZAR DATOS
  const actualizardato = async (e) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();
    const nombreCambio =
      !editandoOtroUsuario && nombreLimpio !== (user.nombre ?? "").trim();

    // VALIDAR NOMBRE (solo si es el perfil propio y cambió)
    if (nombreCambio) {
      if (nombreLimpio.length === 0) {
        toast.error("El nombre no puede estar vacío");
        return;
      }

      if (nombreLimpio.length < 2 || nombreLimpio.length > 50) {
        toast.error("El nombre debe tener entre 2 y 50 caracteres");
        return;
      }

      if (!/^[\p{L}\s]+$/u.test(nombreLimpio)) {
        toast.error("El nombre solo puede contener letras y espacios");
        return;
      }
    }

    // VALIDAR CONTRASEÑA
    if (contraseña !== "" || repeContraseña !== "") {
      const passwordValida =
        contraseña.length >= 8 &&
        contraseña.length <= 15 &&
        /[a-z]/.test(contraseña) &&
        /[A-Z]/.test(contraseña) &&
        /[0-9]/.test(contraseña) &&
        /[^a-zA-Z0-9\s]/.test(contraseña); // especial: no letra, no número, no espacio

      if (!passwordValida) {
        toast.error(
          "La contraseña debe tener entre 8 y 15 caracteres, al menos una minúscula, una mayúscula, un número y un carácter especial."
        );
        return;
      }

      if (contraseña !== repeContraseña) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
    }

    // ARMAR SOLO LO NECESARIO
    const datos = {};

    if (editandoOtroUsuario) {
      // Si edita a otro usuario, solamente modifica la contraseña
      if (contraseña !== "") datos.password = contraseña;
    } else {
      if (nombreCambio) datos.nombre = nombreLimpio;

      if (Number(publicCheck) !== Number(user.es_publico)) {
        datos.is_public = Number(publicCheck);
      }

      if (contraseña !== "") datos.password = contraseña;
    }

    // COMPROBAR SI HUBO CAMBIOS
    if (Object.keys(datos).length === 0) {
      toast.info("No modificaste ningún dato");
      return;
    }

    // ENVIAR PETICIÓN
    try {
      setCargando(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const idUsuario = userId ?? payload.usuario;

      const respuesta = await updateUsuario(idUsuario, datos);

      // ACTUALIZAR ESTADO (sin password y mapeando is_public -> es_publico)
      const { password, is_public, ...resto } = datos;
      const usuarioActualizado = {
        ...user,
        ...resto,
        ...(is_public !== undefined && { es_publico: is_public }),
        ...(respuesta?.usuario ?? {})
      };

      setUser(usuarioActualizado);
      setNombre(usuarioActualizado.nombre ?? "");
      setPublicCheck(Number(usuarioActualizado.es_publico));

      setContraseña("");
      setRepeContraseña("");

      toast.success(
        editandoOtroUsuario
          ? "Contraseña modificada correctamente"
          : "Usuario actualizado correctamente"
      );
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("Sesión vencida");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.error?.[0] ||
          error.response?.data?.[0] ||
          "Error al actualizar el usuario"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
      <ToastContainer theme="dark" position="top-right" />

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 shadow-2xl rounded-2xl p-8">
        {/* ENCABEZADO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {editandoOtroUsuario ? "Modificar contraseña" : "Mi perfil"}
          </h1>

          <p className="text-slate-400 mt-2">
            {editandoOtroUsuario
              ? "Modificá la contraseña del usuario que solicitó el cambio"
              : "Administrá tu información personal"}
          </p>
        </div>

        <form onSubmit={actualizardato} className="space-y-6">
          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nombre
            </label>

            <input
              type="text"
              value={nombre}
              maxLength={50}
              disabled={editandoOtroUsuario}
              placeholder="Ingresá tu nuevo nombre"
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {/* PERFIL PUBLICO */}
          <div className="flex items-center justify-between bg-slate-900 rounded-xl p-4 border border-slate-700">
            <div>
              <p className="text-white font-medium">Perfil público</p>

              <p className="text-sm text-slate-400">
                Permitir que otros vean tu perfil
              </p>
            </div>

            <input
              type="checkbox"
              checked={publicCheck === 1}
              disabled={editandoOtroUsuario}
              onChange={(e) => setPublicCheck(e.target.checked ? 1 : 0)}
              className="w-5 h-5 accent-indigo-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {/* NUEVA CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nueva contraseña
            </label>

            <input
              type={verContraseñas ? "text" : "password"}
              value={contraseña}
              maxLength={15}
              placeholder="Ingresá tu nueva contraseña"
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* REPETIR CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Repetir contraseña
            </label>

            <input
              type={verContraseñas ? "text" : "password"}
              value={repeContraseña}
              maxLength={15}
              placeholder="Repetí tu contraseña"
              onChange={(e) => setRepeContraseña(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* MOSTRAR CONTRASEÑAS */}
          <button
            type="button"
            onClick={() => setVerContraseñas(!verContraseñas)}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition"
          >
            {verContraseñas ? "Ocultar contraseñas" : "Mostrar contraseñas"}
          </button>

          {/* ACTUALIZAR */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition duration-200"
          >
            {cargando
              ? "Actualizando..."
              : editandoOtroUsuario
                ? "Modificar contraseña"
                : "Actualizar perfil"}
          </button>

          {/* VOLVER */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 rounded-xl transition"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}