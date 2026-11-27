import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { crearChat } from "../service/chat";
import EnviarMensaje from "./EnviarMensajeComponent";

const COLOR_POR_DEFECTO = "#FFEB3B";

export default function CrearChatComponent({ userId, nombre, esAdmin_otro, soyAdmin, onCreado }) {
  const navigate = useNavigate();

  // El chat se crea recién al enviar el primer mensaje
  const enviar = async (texto) => {
    try {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return false;
      }

      await crearChat(userId, texto);
      toast.success("Chat creado");
      onCreado?.();
      return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return false;
      }
      const e = error?.response?.data?.error;
      toast.error(Array.isArray(e) ? e.join(", ") : e || "No se pudo crear el chat");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
      <ToastContainer theme="dark" position="top-right" />

      <div
        className="w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden text-slate-900"
        style={{ backgroundColor: COLOR_POR_DEFECTO }}
      >
        <div className="px-5 py-4 border-b border-black/10">
          <h1 className="text-xl font-bold">{nombre ?? "Chat"}</h1>
        </div>

        <p className="h-96 flex items-center justify-center text-sm opacity-70 px-4 text-center">
          Todavía no hay mensajes. Escribí el primero para crear el chat.
        </p>

        <EnviarMensaje
          onEnviar={enviar}
          esAdmin={Boolean(esAdmin_otro)}
          deshabilitado={false}
          motivo=""
          soyAdmin={soyAdmin}
        />
      </div>
    </div>
  );
}