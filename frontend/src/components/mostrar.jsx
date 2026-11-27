import { use, useState } from "react";
import ChatComponent from "./ChatComponent";
import CrearChatComponent from "./CrearChatComponent";

export function MostrarChats() {
  // Datos a enviar al componente 
  const id_otro = 5;
  const nombre = "juan";// nombre del chat(contacto)
  const creado_por = 12;
  const esAdmin_otro = 1;
  const soyAdmin = 0;
  const chat_color = "#a19f87";
  const esta_bloqueado = false;
  // null = no hay chat creado con este contacto
  const [chat,SetChat]= useState(null);

  const [chatExiste, setChatExiste] = useState(chat !== null);

  return (
    <div>
      {chatExiste ? (
        <ChatComponent
          userId={id_otro}
          nombre={nombre}
          creado_por={creado_por}
          esAdmin_otro={esAdmin_otro}
          soyAdmin={soyAdmin}
          chat_color={chat_color}
          esta_bloqueado={esta_bloqueado}
        />
      ) : (
        <CrearChatComponent
          userId={id_otro}
          nombre={nombre}
          esAdmin_otro={esAdmin_otro}
          soyAdmin={soyAdmin}
          onCreado={() => setChatExiste(true)}
        />
      )}
    </div>
  );
}