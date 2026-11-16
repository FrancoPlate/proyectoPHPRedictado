import React, { useState, useEffect } from 'react';

function Contact({ chats, chatActivo, onSeleccionarChat }){

    const [hora, setHora] = useState(new Date());

    return(

        <div className="w-1/3 min-w-[320px] bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
                Mis Contactos / Chats
            </div>

            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                <div 
                    key={chat.id}
                    onClick={() => onSeleccionarChat(chat)}
                    // Si está bloqueado, se muestra en gris y cursor prohibido
                    title={chat.descripcion} // Evento hover nativo con la descripción
                    className={`flex items-center px-4 py-3 border-b border-gray-100 transition-colors ${
                    chat.bloqueado 
                        ? 'bg-gray-200 opacity-60 cursor-not-allowed text-gray-400' 
                        : chatActivo.id === chat.id 
                        ? 'bg-gray-100 cursor-pointer' 
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                >
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center font-bold text-black mr-3 shadow-sm">
                    {chat.nombre.charAt(0)}
                    </div>
                    
                    <div className='flex-1'>
                        <div className="flex flex-row justify-between min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h4 className={`font-medium truncate ${chat.bloqueado ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {chat.nombre} {chat.bloqueado && '(Bloqueado)'}
                                </h4>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                                {hora.toLocaleTimeString() || ''}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 truncate text-left">
                            {chat.ultimoMensaje || 'Sin mensajes aún'}
                        </p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Contact