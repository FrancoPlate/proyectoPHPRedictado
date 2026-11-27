import { useState } from "react";
import { toast } from "react-toastify";

// Vacía o 20-40 caracteres entre letras, números y espacios
const validarDescripcion = (descripcion) => {
  const errores = [];

  if (descripcion === "") return errores;

  if (descripcion.length < 20 || descripcion.length > 40) {
    errores.push("La descripción debe tener entre 20 y 40 caracteres.");
  }
  if (!/^[\p{L}\p{N} ]+$/u.test(descripcion)) {
    errores.push("La descripción solo puede contener letras y números.");
  }
  return errores;
};

export default function ChatOpciones({
  chat,
  esCreador,
  colorPorDefecto,
  onBloquear,
  onGuardar,
}) {
  const [abierto, setAbierto] = useState(false);
  const [descripcion, setDescripcion] = useState(chat.descripcion ?? "");
  const [color, setColor] = useState(chat.color ?? "");

  const bloquear = () => {
    if (
      window.confirm(
        "¿Bloquear este chat? Esta acción no se puede deshacer."
      )
    ) {
      onBloquear();
      setAbierto(false);
    }
  };

  const guardar = (e) => {
    e.preventDefault();

    const errores = validarDescripcion(descripcion);
    if (errores.length > 0) {
      errores.forEach((msg) => toast.error(msg));
      return;
    }

    // Solo se envía lo que cambió
    const datos = {};
    if (descripcion !== (chat.descripcion ?? "")) datos.descripcion = descripcion;
    if (color !== "" && color !== (chat.color ?? "")) datos.color = color;

    if (Object.keys(datos).length === 0) {
      toast.info("No modificaste ningún dato");
      return;
    }

    onGuardar(datos);
    setAbierto(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-label="Opciones del chat"
        className="px-2 text-2xl leading-none font-bold"
      >
        ⋮
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-64 z-10 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 shadow-xl p-4 space-y-4">
          {!chat.esta_bloqueado && (
            <button
              type="button"
              onClick={bloquear}
              className="w-full text-left text-red-400 hover:text-red-300"
            >
              Bloquear chat
            </button>
          )}

          {chat.esta_bloqueado ? (
            <p className="text-sm">Este chat está bloqueado.</p>
          ) : null}

          {esCreador ===true&& (
            <form onSubmit={guardar} className="space-y-3" noValidate>
              <div>
                <label htmlFor="descripcion" className="block text-sm mb-1">
                  Descripción
                </label>
                <input
                  id="descripcion"
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm mb-1">
                  Color de fondo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="color"
                    type="color"
                    value={color || colorPorDefecto}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 bg-transparent cursor-pointer"
                  />
                  <span className="text-sm">
                    {color || `${colorPorDefecto} (por defecto)`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg"
              >
                Guardar
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}