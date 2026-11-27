
import { useEffect, useLayoutEffect, useRef } from "react";

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  // "2026-11-25 23:14:24" -> "2026-11-25T23:14:24"
  const date = new Date(String(fecha).replace(" ", "T"));

  if (isNaN(date.getTime())) return "Fecha inválida";

return date.toLocaleString("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});
};

export default function MensajesLista({
  mensajes = [],
  miId,
  hayMas,
  cargandoMas,
  onCargarMas,
  onEliminar,
}) {
  const contenedorRef = useRef(null);
  const alturaPrevia = useRef(null);

  const lista = Array.isArray(mensajes) ? mensajes : [];

  const primerId = lista[0]?.id;
  const ultimoId = lista[lista.length - 1]?.id;

  // Baja al final solo cuando cambia el último mensaje
  useEffect(() => {
    const el = contenedorRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ultimoId]);

  // Mantiene la posición al cargar mensajes anteriores
  useLayoutEffect(() => {
    const el = contenedorRef.current;
    if (el && alturaPrevia.current !== null) {
      el.scrollTop = el.scrollHeight - alturaPrevia.current;
      alturaPrevia.current = null;
    }
  }, [primerId]);

  // Descarta la altura guardada cuando termina de cargar
  useEffect(() => {
    if (!cargandoMas) alturaPrevia.current = null;
  }, [cargandoMas]);

  const pedirMas = () => {
    if (!hayMas || cargandoMas) return;
    alturaPrevia.current = contenedorRef.current?.scrollHeight ?? null;
    onCargarMas?.();
  };

  // Scroll hasta arriba: carga los anteriores
  const onScroll = (e) => {
    if (e.currentTarget.scrollTop <= 0) pedirMas();
  };

  return (
    <div
      ref={contenedorRef}
      onScroll={onScroll}
      className="h-96 overflow-y-auto px-4 py-3 space-y-2"
    >
      {lista.length > 0 && (
        <button
          type="button"
          onClick={pedirMas}
          disabled={!hayMas || cargandoMas}
          className="block mx-auto text-sm underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
        >
          {cargandoMas ? "Cargando..." : "Mostrar más"}
        </button>
      )}

      {lista.length === 0 && (
        <p className="text-center text-sm opacity-70 pt-8">
          Todavía no hay mensajes. Escribí el primero.
        </p>
      )}

      {lista.map((m) => {
        const propio = String(m.enviado_por) === String(miId);

        return (
          <div
            key={m.id}
            className={`flex ${propio ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                propio
                  ? "bg-slate-900 text-white"
                  : "bg-white/80 text-slate-900"
              }`}
            >
              <p className="break-words">{m.texto}</p>

              <div className="flex items-center justify-between gap-3 mt-1 text-xs opacity-70">
                <span>
                  {formatearFecha(
                    m.fecha ?? m.fecha_creacion ?? m.created_at
                  )}
                </span>

                {propio && (
                  <button
                    type="button"
                    onClick={() => onEliminar?.(m.id)}
                    aria-label="Eliminar mensaje"
                    title="Eliminar mensaje"
                    className="hover:opacity-100 hover:text-red-400"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
