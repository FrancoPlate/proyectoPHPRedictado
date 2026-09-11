<?php
namespace App\Controllers;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\UserModel;
class UserController{
public function crearUsuario(Request $request, Response $response)
{
        $user = json_decode($request->getBody()->getContents(), true) ?? [];
        $username=$user['username']??"";
        $password=$user['contraseña']??"";
        $nombre=$user['nombre']?? "";
        if ((empty($usename))&&(!preg_match('/^@[a-zA-Z]+$/', $username)) ||(strlen($username) < 5) || (strlen($username) > 12)){
          return $this->mensaje($response,"El username debe poseer minimo 5 letras incluido @ al principio,caracteres maximo 15",400);       
        }
        if(UserModel::UsuarioExistente($username)){
          return $this->mensaje($response,"El username ya existe pruebe con otro",400);
        }
        if ((empty($password))||(!preg_match('/[a-z]/', $password)) ||!preg_match('/[A-Z]/', $password) ||!preg_match('/[0-9]/', $password) ||!preg_match('/[^a-zA-Z0-9]/', $password) ||strlen($password) < 8 ||strlen($password) > 15) {
           return $this->mensaje($response,"La contraseña al menos debe tener 1 minúscula, 1 mayúscula, 1 número, 1 carácter especia, minimo 8 caracteres, maximo 15 caracteres",400);
        }
        if(empty($nombre)||(strlen($nombre)<2)||(strlen($nombre)>50)){
          return $this->mensaje($response,"El nombre debe poseer minimo 2 letras maximo 50",400);
        }
        $password=password_hash($password,PASSWORD_BCRYPT);
        Usermodel::RegistrarUsuario($username, $nombre, $password);
        return $this->mensaje($response,"Registro exitoso",200);
}


private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }
}