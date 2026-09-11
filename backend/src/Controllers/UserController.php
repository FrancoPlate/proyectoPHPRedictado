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
           return $this->mensaje($response,"La contraseña al menos debe tener 1 minúscula, 1 mayúscula, 1 número, 1 carácter especial, minimo 8 caracteres, maximo 15 caracteres",400);
        }
        if(empty($nombre)||(strlen($nombre)<2)||(strlen($nombre)>50)){
          return $this->mensaje($response,"El nombre debe poseer minimo 2 letras maximo 50",400);
        }
        $password=password_hash($password,PASSWORD_BCRYPT);
        Usermodel::RegistrarUsuario($username, $nombre, $password);
        return $this->mensaje($response,"Registro exitoso",200);
}


public function ObtenerUsuario(Request $request, Response $response,$args)
{   $id=(int)$args['user_id'];
    $user_id=(int)$request->getAttribute('usuario');  
    if ($user_id !== $id && !UserModel::EsAdmin($user_id)) {
      return $this->mensaje($response,"No se puede acceder a otro perfil que no sea propio",401);
    }
    $user=UserModel::ObtenerUsuario($id);
    if(!$user){
      return $this->mensaje($response,"el usuario requerido no existe",404);
    }
    $response->getBody()->write(json_encode($user));
     return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
}
public function EditarUsuario(Request $request, Response $response,$args)
{   $id=(int)$args['user_id'];
    $user_id=(int)$request->getAttribute('usuario');  
    $datosActualizar = json_decode($request->getBody()->getContents(), true) ?? [];
    $nombre=$datosActualizar['nombre']??"";
    $password=$datosActualizar['password']??"";
    $es_public=$datosActualizar['is_public']??null;
    if ($user_id !== $id && !UserModel::EsAdmin($user_id)) {
      return $this->mensaje($response,"No se puede acceder a otro perfil que no sea propio",401);
    }
    $user=UserModel::ObtenerUsuario($id); // verificamos que exista el usuario a actualizar
    if(!$user){
      return $this->mensaje($response,"el usuario requerido no existe",404);
    }
    if(empty($nombre)&&(empty($password))&&($es_public===null)){
      return $this->mensaje($response,"al menos se debe editar un campo",400);
    }
    if(!empty($nombre)&&((strlen($nombre)<2)||(strlen($nombre)>50))){
       return $this->mensaje($response,"El nombre debe poseer minimo 2 letras maximo 50",400);
    }
    if ((!empty($password))&&((!preg_match('/[a-z]/', $password)) ||!preg_match('/[A-Z]/', $password) ||!preg_match('/[0-9]/', $password) ||!preg_match('/[^a-zA-Z0-9]/', $password) ||strlen($password) < 8 ||strlen($password) > 15)) {
      return $this->mensaje($response,"La contraseña al menos debe tener 1 minúscula, 1 mayúscula, 1 número, 1 carácter especial, minimo 8 caracteres, maximo 15 caracteres",400);
    }   
    $password = password_hash($password, PASSWORD_BCRYPT);
     UserModel::ActualizarDatos($nombre,$password,$es_public,$id);
     return $this->mensaje($response,"Actualizacion de datos exitosa",200);
}

private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }
}