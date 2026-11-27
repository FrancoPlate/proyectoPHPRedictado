import React, { useState, useEffect } from 'react';
import '../assets/styles/colors.css';

function Contact({ chats, chatActivo, onSeleccionarChat }){
    return(
        <div className="w-1/3 min-w-[320px] second-bg-color border-r third-border-color flex flex-col">
            <div className="p-4 second-bg-color border-b third-border-color font-bold primary-text-color">
                Mis Contactos / Chats
            </div>

            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => {
                    const bloqueado = !!chat.esta_bloqueado;
                    const titulo = chat.nombre_interlocutor || chat.nombre;
                    const activo = chatActivo?.id === chat.id;
                    return (
                        <div 
                            key={chat.id}
                            onClick={() => onSeleccionarChat(chat)}
                            // Si está bloqueado, se muestra en gris y cursor prohibido
                            title={chat.descripcion} // Evento hover nativo con la descripción
                            className={`flex items-center px-4 py-3 border-l-4 second-border-color transition-all duration-300 ease-out ${
                            bloqueado 
                                ? 'opacity-40 bg-slate-900/50 cursor-not-allowed text-gray-400'  //bloqueado
                                : activo
                                ? 'third-border-color cursor-pointer' 
                                : 'hover:third-border-color cursor-pointer'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold second-text-color mr-3 shadow-sm 
                            ${bloqueado
                                ? 'bg-slate-600 text-slate-300' 
                                : 'third-bg-color'}`}>
                            {titulo.charAt(0)}
                            </div>
                            
                            <div className='flex-1'>
                                <div className="flex flex-row justify-between min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className={`font-medium truncate ${chat.bloqueado ? 'line-through text-gray-500' : 'primary-text-color'}`}>
                                        {titulo} {bloqueado && '(Bloqueado)'}
                                        </h4>
                                    </div>
                                    <p className="text-sm primary-text-color truncate">
                                        
                                    </p>
                                </div>
                                <p className="text-sm primary-text-color truncate text-left">
                                    {chat.ultimo_mensaje || 'Sin mensajes aún'}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Contact