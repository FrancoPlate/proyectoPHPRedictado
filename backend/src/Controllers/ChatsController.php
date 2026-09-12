<?php

namespace App\Controllers;

use App\Models\ChatModel;
use App\Models\UserModel;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
class ChatController{

    public function newChat(Request $request, Response $response, array $args){
        $usuario = $request->getAttribute('usuario');
        
        //buscar el id del creador
        $creado = UserModel::ObtenerUsuario($usuario);
        if ($creado ?? null) {
            return $this->mensaje($response, "El usuario creador debe estar logueado", 401);
        }

        
        $user_id = (int) $args['user_id'];
        if ($creado === $user_id) {
            return $this->mensaje($response, "El usuario con el que quiere iniciar el chat no existe", 400);
        }
        //buscar el id del usuaior a iniciar el chat
        $usuario_id = UserModel::ObtenerUsuario($user_id);
        if ($usuario_id ?? null) {
            return $this->mensaje($response, "El usuario con el que quieres iniciar el chat no existe", 404);
        }

        $params = $request->getParsedBody();
        $chat = $params['chat'] ?? null;
        $mensaje = $params['mensaje'] ?? null;

        $largo = mb_strlen($mensaje);
        if ($largo < 1 || $largo > 255) {
            return $this->mensaje($response,'El mensaje debe tener entre 1 y 255 caracteres.',400);
        }

        //devuelve el chat
        $existingChat = ChatModel::buscarChatEntreUsuarios($creado, $user_id);

        if (!$existingChat) {
            // No existe chat: se crea el chat y el primer mensaje.
            $chatId = ChatModel::crearChat($creado, $user_id, $chat);
            ChatModel::crearMensaje($chatId, $creado, $mensaje);
            return $this->mensaje($response, 'Chat creado y Mensaje enviado', 200);
        }

        // Ya existe un chat entre ambos usuarios.
        if ((int) $chat['esta_bloqueado'] === 1) {
            return $this->mensaje($response,'No se pueden enviar mensajes, el chat esta bloqueado.',401);
        }

        ChatModel::crearMensaje($existingChat['id'], $creado, $mensaje);
        return $this->mensaje($response, 'Mensaje enviado', 200);
    }

    public function getChats(Request $request, Response $response, array $args)
    {
        $usuario = $request->getAttribute('usuario');
        //buscar el id
        $user = UserModel::ObtenerUsuario($usuario);
        $result = chatModel::listarChatsDeUsuario($user);

        return $this->mensaje($response, $result, 200);
    }

    public function actualizar(Request $request, Response $response, array $args)
    {
        $usuario = $request->getAttribute('usuario');
        //buscar el id
        $creado = UserModel::ObtenerUsuario($usuario);

        $user_id = (int) $args['user_id'];
        //devuelve el chat
        $existingChat = ChatModel::buscarChatEntreUsuarios($creado, $user_id);

        if ($existingChat) {
            return $this->mensaje($response, 'No existe un chat con ese usuario.', 404);
        }

        $params = $request->getParsedBody();

        $nombre = $params['nombre'] ?? '';
        $descripcion = $params['descripcion'] ?? '';
        $color = $params['color'] ?? '';
        $esta_bloqueado = $params['esta_bloqueado'] ?? '';

        
        if (empty($nombre) || !preg_match('/^[A-Za-z0-9]$/', $nombre) || (strlen($descripcion)<3)||(strlen($descripcion)>15)) {
            return $this->mensaje($response, 'El nombre debe contener solo letras y numeros, entre 3 y 15 caracteres.', 400);
        }

        if (empty($descripcion) || !preg_match('/^[A-Za-z0-9 ]+$/', $descripcion) || (strlen($descripcion)<20)||(strlen($descripcion)>50)) {
            return $this->mensaje($response, 'La descripcion debe contener solo letras y numeros, entre 20 y 40 caracteres.', 400);
        }

        if (empty($color) && !preg_match('/^#?[0-9A-Fa-f]/', $color)|| (strlen($color)<1)||(strlen($color)>7)) {
            return $this->mensaje($response, 'El color debe ser un codigo hexadecimal valido (ej: #FFAA00)', 400);
        }

        if (empty($esta_bloqueado)) {
            return $this->mensaje($response, 'El bloqueado debe ser 1 o 0.', 400);
        }

        ChatModel::actualizarChat($existingChat['id'], $nombre,$descripcion,$color,$esta_bloqueado);

        return $this->mensaje($response, 'Chat actualizado correctamente.', 200);
    }

    public function historia(Request $request, Response $response, array $args)
    {
        $usuario = $request->getAttribute('usuario');
        //buscar el id
        $creado = UserModel::ObtenerUsuario($usuario);

        $user_id = (int) $args['user_id'];
        //devuelve el chat
        $existingChat = ChatModel::buscarChatEntreUsuarios($creado, $user_id);

        if ($existingChat) {
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
        $offset = $queryParams['offset'] ?  (int) $queryParams['offset'] : 0;

        $mensajes = ChatModel::obtenerHistoria($existingChat['id'], $quantity, $offset);

        return $this->mensaje($response, $mensajes, 200);
    }

    private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }
}