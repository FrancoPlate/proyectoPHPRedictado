<?php
namespace App\Controllers;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\AutenticacionModel;
use Firebase\JWT\JWT;
use App\Middleware\IsLoggedMiddleware;

class AutenticacionController{
public function Logout(Request $request, Response $response): Response
{
    $authHeader = $request->getHeaderLine('Authorization');
        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        return $this->mensaje(
            $response,"Requiere de token",401);
    }
    $token = str_replace('Bearer ', '', $authHeader);
    $user = AutenticacionModel::ObtenerIdUsuario($token);
    if (!$user) {
        return $this->mensaje($response,"El token no existe",404);
    }
    AutenticacionModel::ActualizarToken($user['id'],null,null);
    return $this->mensaje(
        $response,"Token actualizado",200);
}
public function IniciarSesion(Request $request,Response $response){
    $data = json_decode($request->getBody()->getContents(),true) ?? [];
    $username=$data['username']?? "";
    $password=$data['password']??"";
   
    if(empty($username)||(empty($password))){
        return $this->mensaje($response,"El username o la contraseña no puede ser vacio",400);
    }
     $user= AutenticacionModel::ValidarSesion($username);
     if (!$user || !password_verify($password, $user['password'])) {
        return $this->mensaje($response,"Username o contraseña incorrecta",400);
    }
        $exp = (new \DateTime("now"))
            ->modify("+5 minutes")
            ->format("Y-m-d H:i:s");

        $token = JWT::encode([
            "usuario" => $user["id"],
            "token_expired_at" => $exp
        ], IsLoggedMiddleware::$secret, 'HS256');

        $response->getBody()->write(json_encode([
            "mensaje" => "Usuario logueado",
            "token" => $token
        ]));     
    AutenticacionModel::ActualizarToken($user['id'],$token,$exp);
  return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

}

private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }

}