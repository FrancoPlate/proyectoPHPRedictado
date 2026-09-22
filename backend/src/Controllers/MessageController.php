<?php
    namesPace App\Controllers;

    use App\Models\MessageModel;
use App\Models\UserModel;
use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;

    class MessageController{
        public function deleteMessage(Request $request, Response $response, array $args){
            
            $message_id = $args['message_id'] ? (int) $args['message_id'] : 0;

            if($message_id == 0 ){
                return $this->mensaje($response, "El mensaje a eliminar no existe", 400);
            }
            //obtenemos el usuario
            $usuario = $request->getAttribute('usuario');
            //Verificamos si es admin
            $isAdmin = UserModel::EsAdmin($usuario);

            if($isAdmin){
                $result = MessageModel::deleteMessage($message_id);
                if($result){
                    return $this->mensaje($response, "Mensaje eliminado con exito.", 200);
                }else{
                    return $this->mensaje($response, "El mensaje no existe o ya fue eliminado.", 409);
                }
            }

            //obtenemos el mensaje para luego comparar si el usuario es el creador del mensaje 
            $message = MessageModel::getMessage($message_id);
            if($message['enviado_por'] == $usuario){
                $result = MessageModel::deleteMessage($message_id);
                if($result){
                    return $this->mensaje($response, "Mensaje eliminado con exito.", 200);
                }else{
                    return $this->mensaje($response, "El mensaje no existe o ya fue eliminado.", 409);
                }
            }
            else{
                return $this->mensaje($response, "Error al querer eliminar el mensaje. El mesanje a eliminar no es suyo", 409);
            }
            
    }

    private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }
    }