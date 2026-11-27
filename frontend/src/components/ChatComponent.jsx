
import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  getHistoria,
  actualizarChat,
  eliminarMensaje,crearChat
} from "../service/chat";

import MensajesLista from "./MensajesListaComponent";
import EnviarMensaje from "./EnviarMensajeComponent";
import ChatOpciones from "./ChatOpcionesComponent";
import { EliminarUsuario } from "../service/usuarios";

const COLOR_POR_DEFECTO = "#FFEB3B";
const PRIMERA_PAGINA = 5;
const PAGINA = 5;

const leerPayload = (token) => {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

const mostrarError = (error, porDefecto) => {
  const e = error.response?.data?.error;
  toast.error(Array.isArray(e) ? e.join(", ") : e || porDefecto);
};
//recibe el id del usuario a enviar mensaje
export default function ChatComponent({userId,nombre,creado_por,esAdmin_otro,soyAdmin,chat_color,esta_bloqueado }) {
  const navigate = useNavigate();

  const [miId, setMiId] = useState(null);
  const [chat, setChat] = useState({});
  const [mensajes, setMensajes] = useState([]);
  const [hayMas, setHayMas] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);

  // CARGA INICIAL
  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const usuario = leerPayload(token).usuario;

        setMiId(Number(usuario));

        const historia = await getHistoria(
          userId,
          PRIMERA_PAGINA
        );
        setMensajes([...historia].reverse());
        setHayMas(historia.length === PRIMERA_PAGINA);

        // El chat ya existe porque fue seleccionado.
        setChat({ id: Number(userId) });

      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        mostrarError(error, "No se pudo cargar el chat");
      }
    };

    cargar();
  }, [userId, navigate]);

  // MENSAJES ANTERIORES
  const cargarAnteriores = async () => {
    try {
      setCargandoMas(true);

      const anteriores = await getHistoria(
        userId,
        PAGINA,
        mensajes.length
      );

      setMensajes((prev) => [...[...anteriores].reverse(), ...prev]);
      setHayMas(anteriores.length === PAGINA);

    } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

      mostrarError(error, "No se pudieron cargar más mensajes");
    } finally {
      setCargandoMas(false);
    }
  };

  // ENVIAR MENSAJE
  const enviar = async (texto) => {
    try {
      const token=localStorage.getItem("token");
      if(!token){
        navigate('/login');
        return false;
      }
      const nuevo = await crearChat(userId, texto);

      if (nuevo?.id) {
        setMensajes((prev) => [...prev, nuevo]);
      } else {
        const ultimo = await getHistoria(userId, 1);
        setMensajes((prev) => [...prev, ...ultimo]);
      }

      toast.success("Mensaje enviado correctamente");
      return true;

    } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        if (error.response?.status === 403) {
        toast.error(error.response.data[0]);
          return false;
        }

      mostrarError(error, "No se pudo enviar el mensaje");
      return false;
    }
  };
// CONFIRMAR ELIMINACIÓN
const ConfirmarELiminarMensaje = async () => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer."+"\n"+"Se eliminara el mensaje",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  return result.isConfirmed;
};

// ELIMINAR MENSAJE PROPIO
const eliminar = async (idMensaje) => {
  const confirmado = await ConfirmarELiminarMensaje();

  if (!confirmado) return;

  try {
    await eliminarMensaje(idMensaje);

    // Quitar el mensaje de la lista sin recargar la página
    setMensajes((prev) =>
      prev.filter((m) => Number(m.id) !== Number(idMensaje))
    );

    toast.success("Mensaje eliminado correctamente");

  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    mostrarError(error, "No se pudo eliminar el mensaje");
  }
};
// BLOQUEAR / EDITAR DESCRIPCIÓN Y COLOR
  const modificarChat = async (datos, mensajeOk) => {
    try {
      await actualizarChat(userId, datos);

      setChat((prev) => ({ ...prev, ...datos }));

      toast.success(mensajeOk);

    } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

      mostrarError(error, "No se pudo modificar el chat");
    }
  };

  const bloqueado = Boolean(esta_bloqueado);

  const esperandoRespuesta =
    mensajes.length === 1 &&
    Number(mensajes[0].enviado_por) === miId;

  let motivoDeshabilitado = "";

  if (bloqueado) {
    motivoDeshabilitado = "Este chat está bloqueado.";
  } else if (esperandoRespuesta) {
    motivoDeshabilitado = "Esperá la respuesta para seguir escribiendo.";
  }

// ELIMINAR USUARIO
const eliminarUsuario = async () => {
  try {
    await EliminarUsuario(Number(userId));

    toast.success("Usuario eliminado correctamente");
    window.location.reload();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    mostrarError(error, "No se pudo eliminar el usuario");
  }
};

// IR A EDITAR CONTRASEÑA / PERFIL DEL USUARIO
const editarContrasena = () => {
  navigate("/editarperfil", { state: { userId } });
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">

      <ToastContainer theme="dark" position="top-right" />

      <div
        className="w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden text-slate-900"
        style={{
          backgroundColor:  chat_color || COLOR_POR_DEFECTO,
        }}
      >

        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">

          <h1 className="text-xl font-bold">
            {nombre ?? "Chat"}
          </h1>

          {chat && (
            <ChatOpciones
              chat={chat}
              esCreador={creado_por === miId}
              colorPorDefecto={COLOR_POR_DEFECTO}
              onBloquear={() =>
                modificarChat(
                  { esta_bloqueado: true },
                  "Chat bloqueado"
                )
              }
              onGuardar={(datos) =>
                modificarChat(
                  datos,
                  "Chat actualizado correctamente"
                )
              }
            />
          )}

        </div>

        <MensajesLista
          mensajes={mensajes}
          miId={miId}
          hayMas={hayMas}
          cargandoMas={cargandoMas}
          onCargarMas={cargarAnteriores}
          onEliminar={eliminar}
        />

        <EnviarMensaje
        onEnviar={enviar}
        esAdmin={Boolean(esAdmin_otro)}
        deshabilitado={Boolean(motivoDeshabilitado)}
        motivo={motivoDeshabilitado}
        soyAdmin={soyAdmin}
        onEliminarUsuario={eliminarUsuario}
        onEditarContrasena={editarContrasena}
        />
      </div>
    </div>
  );
}
