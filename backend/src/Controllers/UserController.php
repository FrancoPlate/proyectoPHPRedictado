<?php
namespace App\Controllers;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\UserModel;
use App\Middleware\IsLoggedMiddleware;
use App\Models\AutenticacionModel;

class UserController{
public function crearUsuario(Request $request, Response $response)
{
        $user = json_decode($request->getBody()->getContents(), true) ?? [];
        $username=$user['username']??"";
        $password=$user['password']??"";
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
public function EliminarUsuario(Request $request, Response $response,$args)
{ $id=(int)$args['user_id'];
  $user_id=(int)$request->getAttribute('usuario');  
  if(!UserModel::EsAdmin($user_id)){
    return $this->mensaje($response,"Accion requiere permiso de admin",401);
  }
  if(!UserModel::ObtenerUsuario($id)){
    return $this->mensaje($response,"El usuario no existe",404);
  }
  if(!UserModel::DeleteUser($id)){
    return $this->mensaje($response,"no se pudo eliminar el usuario error",409);
  }
  return $this->mensaje($response,"Usuario eliminado correctamente",200);
}
public function ObtenerUsuarios(Request $request, Response $response)
{
    $data = $request->getQueryParams();

    $search = $data['search'] ?? "";
    $order  = $data['order'] ?? "ASC";
    $limit  = $data['limit'] ?? 0;
    $offset = $data['offset'] ?? 0;
    $user_id=0;
    $token = str_replace('Bearer ', '', $request->getHeaderLine("Authorization"))??"";
    // Si el token es inválido, solamente devuelve perfiles públicos
    $tokenValido=IsLoggedMiddleware::VerificarToken($token)??false;
    echo $tokenValido;
    if (empty($token) ||!($tokenValido)) {
      // si 1 representa es publico
       $users = UserModel::ObtenerUsuarios($user_id,1,$search,$order,$limit,$offset);
        if(!$users){
          return $this->mensaje($response,"No hay usuarios Publicos disponibles", 404);
         }
      $response->getBody()->write(json_encode($users));
      return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }
     $token=AutenticacionModel::ObtenerToken($token);
      $user_id=$token['id'];
     // Devuelve todos los usuarios excepto el usuario logueado.
    // el 2 es para que devuelva tantos publicos como privados.
    $users = UserModel::ObtenerUsuarios($user_id,2,$search,$order,$limit,$offset);
    if(!$users){
      return $this->mensaje($response,"No hay usuarios Publicos o Privados disponibles", 404);
    }
    $esAdmin = UserModel::EsAdmin($user_id);
    if(($user_id!==null)&&($esAdmin!==false)){
      foreach ($users as $key => $user) {
        $cantidad = UserModel::ObtenerCantidad($user['id']);
        $users[$key]['cantidad'] = $cantidad;
      }
    }
    $response->getBody()->write(json_encode($users));
    return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
}

private function mensaje($response, $msj, $num): Response {
        $response->getBody()->write(json_encode([$msj]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($num);
    }
}