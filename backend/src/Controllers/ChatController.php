<?php

namespace App\Controllers;

use App\Models\ChatModel;
use App\Models\UserModel;
use App\Models\MessageModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
class ChatController{

    public function newChat(Request $request, Response $response, array $args){
        $usuario = $request->getAttribute('usuario');
        
        
        $user_id = (int) $args['user_id'];
        if ($usuario === $user_id) {
            return $this->mensaje($response, "No se puede iniciar un chat con uno mismo", 400);
        }
        //buscar el id del usuario al iniciar el chat
        $usuario_id = UserModel::ObtenerUsuario($user_id);
        if (!$usuario_id) {
            return $this->mensaje($response, "El usuario con el que quieres iniciar el chat no existe", 500);
        }

        $params = $request->getParsedBody();

        if (!is_array($params)) {
            return $this->mensaje($response, 'El formato JSON enviado es inválido.', 400);
        }
        $chat = $params['chat'] ?? null;
        $mensaje = $params['mensaje'] ?? null;

        $largo = mb_strlen($mensaje);
        if ($largo < 1 || $largo > 255) {
            return $this->mensaje($response,'El mensaje debe tener entre 1 y 255 caracteres.',400);
        }

        //devuelve el chat
        $existingChat = ChatModel::buscarChatEntreUsuarios($usuario, $user_id);
        
        if (!$existingChat) {
            // No existe chat: se crea el chat y el primer mensaje.

            $chatId = ChatModel::crearChat($usuario, $user_id, $chat);
            $result = MessageModel::newMessage($chatId, $usuario, $mensaje);
            if($result){
                return $this->mensaje($response, 'Chat creado y Mensaje enviado', 200);
            }else{
                return $this->mensaje($response, 'Error al crear el chat o enviar el mensaje', 500);
            }
        }
        
        
        // Ya existe un chat entre ambos usuarios.
        if ((int) $existingChat['esta_bloqueado'] === 1) {
            return $this->mensaje($response,'No se pueden enviar mensajes, el chat esta bloqueado.',401);
        }
        
        $verificar =  MessageModel::obtenerHistoria($existingChat['id'], 2, 0);
        if(count($verificar) === 1 && $verificar[0]['enviado_por'] == $usuario){
            return $this->mensaje($response,'No se pueden enviar mensajes, el destinatario debe responder.',401);
        }
        $result = MessageModel::newMessage($existingChat['id'], $usuario, $mensaje);
        if($result){
            return $this->mensaje($response, 'Mensaje enviado', 200);
        }else{
            return $this->mensaje($response, 'Error al enviar el mensaje', 500);
        }
        
    }

    public function getChats(Request $request, Response $response)
    {
        echo("aaa");
        $usuario = $request->getAttribute('usuario');
        $result = chatModel::listarChatsDeUsuario($usuario);
        
        return $this->mensaje($response, $result, 200);
    }

    public function putChat(Request $request, Response $response, array $args)
    {
        $usuario = $request->getAttribute('usuario');

        $user_id = (int) $args['user_id'];
        //devuelve el chat
        $existingChat = ChatModel::buscarChatEntreUsuarios($usuario, $user_id);

        if (!$existingChat) {
            return $this->mensaje($response, 'No existe un chat con ese usuario.', 404);
        }

        $params = $request->getParsedBody();

        $nombre = $params['nombre'] ? $params['nombre'] : $existingChat['nombre'];
        $descripcion = $params['descripcion'] ? $params['descripcion'] :  $existingChat['descripcion'];
        $color = $params['color'] ? $params['color'] : $existingChat['color'];
        $esta_bloqueado = $params['esta_bloqueado'] ?$params['esta_bloqueado']: $existingChat['esta_bloqueado'];

        
        $largoNombre = mb_strlen($nombre);
        if ($largoNombre < 3 || $largoNombre > 15 || !preg_match('/^[A-Za-z0-9 ]+$/', $nombre)) {
            return $this->mensaje($response, 'El nombre debe contener solo letras y números, entre 3 y 15 caracteres.', 400);
        }
        
        $largoDesc = mb_strlen($descripcion);
        if ($largoDesc < 20 || $largoDesc > 40 || !preg_match('/^[A-Za-z0-9 ]+$/', $descripcion)) {
            return $this->mensaje($response, 'La descripción debe contener solo letras y números, entre 20 y 40 caracteres.', 400);
        }

        if (!empty($color) && !preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
            return $this->mensaje($response, 'El color debe ser un código hexadecimal válido (ej: #FFAA00)', 400);
        }

        if ($esta_bloqueado === null || !in_array((int)$esta_bloqueado, [0, 1], true)) {
            return $this->mensaje($response, 'El estado bloqueado debe ser 1 o 0.', 400);
        }

        $actualizado = ChatModel::actualizarChat($existingChat['id'], $nombre,$descripcion,$color,$esta_bloqueado);

        if ($actualizado) {
            return $this->mensaje($response, 'Chat actualizado correctamente.', 200);
        } else {
            return $this->mensaje($response, 'No se pudo actualizar el chat o no se realizaron cambios.', 400);
        }
        
    }

    public function getHistory(Request $request, Response $response, array $args)
    {
        $usuario = $request->getAttribute('usuario');

        $user_id = (int) $args['user_id'];

        //devuelve el chat
        $existingChat = ChatModel::buscarChatEntreUsuarios($usuario, $user_id);

        if (!$existingChat) {
            return $this->mensaje($response, 'No existe un chat con ese usuario.', 404);
        }

        $quantity = $args['quantity'] ? (int) $args['quantity'] : 5;
        if ($quantity <= 0) {
            $quantity = 5;
        }
        if ($quantity > 10) {
            $quantity = 10;
        }

        $queryParams = $request->getQueryParams();
        $offset = isset($queryParams['offset']) ?  (int) $queryParams['offset'] : 0;
 
        $mensajes = MessageModel::obtenerHistoria($existingChat['id'], $quantity, $offset);

        return $this->mensaje($response, $mensajes, 200);
    }

    private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }
}