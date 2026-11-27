import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// Mensajes permitidos al hablar con un administrador
const OPCIONES_ADMIN = ["Modificar Password", "Dar de Baja"];

const validarMensaje = (texto) => {
  const limpio = texto.trim();

  if (limpio === "") return "El mensaje no puede ser vacío";
  if (limpio.length > 255) return "El mensaje no puede superar los 255 caracteres";
  return null;
};

export default function EnviarMensaje({
  onEnviar,
  esAdmin,
  deshabilitado,
  motivo,soyAdmin,onEliminarUsuario,onEditarContrasena
}) {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();

    const error = validarMensaje(mensaje);
    if (error) {
      toast.error(error);
      return;
    }

    setEnviando(true);
    const ok = await onEnviar(mensaje.trim());
    setEnviando(false);

    if (ok) setMensaje("");
  };
  //validamos que seamos usuarios normales y no admin y el otro sea admin
  function validar(){
    if(soyAdmin){
      return false;
    }if(!soyAdmin&&esAdmin){
       return true;
    }
    return false;
  }
  //alerta para confimar baja de un usuario.
const confirmarAccion = async () => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  if (result.isConfirmed) {
    onEliminarUsuario();
    console.log("Acción confirmada");
    
  }
};
  const mostrarAccionesAdmin = soyAdmin && !esAdmin;


  return (
    <form onSubmit={enviar} className="px-4 py-3 border-t border-black/10">
      {motivo && <p className="text-sm mb-2">{motivo}</p>}

      <div className="flex gap-2">
        {validar()==true ? (
          // Contacto administrador: solo dos textos posibles
          <select
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            disabled={deshabilitado}
            className="flex-1 px-3 py-2 rounded-xl bg-white text-slate-900 border border-black/20"
          >
            <option value="">Elegí una solicitud...</option>
            {OPCIONES_ADMIN.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={mensaje}
            placeholder="Escribí un mensaje"
            disabled={deshabilitado}
            onChange={(e) => setMensaje(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-white text-slate-900 border border-black/20 outline-none focus:border-indigo-500"
          />
        )}

        <button
          type="submit"
          disabled={deshabilitado || enviando}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium disabled:opacity-50"
        >
          Enviar
        </button>
      {mostrarAccionesAdmin==true && (
         <div className="flex flex-col gap-1 mt-1">
          <button
            type="button"
            onClick={confirmarAccion}
            className="flex-1 px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-medium"
          >
            Eliminar usuario
          </button>
          <button
            type="button"
            onClick={() => onEditarContrasena?.()}
            className="flex-1 px-3 py-2 rounded-xl bg-white text-slate-900 border border-black/20 text-sm font-medium"
          >
            Modificar password
          </button>
        </div>
      )}
      </div>
    </form>
  );
}