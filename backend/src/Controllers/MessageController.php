<?php
    namesPace App\Controllers;

    use App\Models\MensajeModel;
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;

    class MessageController{
        public function deleteMessage(Request $request, Response $response, array $args){
            
            $message_id = $args['message_id'] ? (int) $args['message_id'] : 0;

            if($message_id == 0 ){
                return $this->mensaje($response, "El mensaje a eliminar no existe", 400);
            }

            $result = MensajeModel::deleteMessage($message_id);
            if($result){
                return $this->mensaje($response, "Mensaje eliminado con exito.", 200);
            }else{
                return $this->mensaje($response, "Error al querer eliminarl el mensaje.", 500);
            }
    }

    private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }
    }