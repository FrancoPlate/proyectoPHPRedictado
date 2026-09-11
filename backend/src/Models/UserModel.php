<?php
namespace App\Models;

use PDO;
use App\DB\DB;
class UserModel{
    public static function RegistrarUsuario($username,$nombre,$password){
     $pdo = DB::conexion();
     $sql = "INSERT INTO usuario (username, nombre, password) VALUES (?, ?, ?)";
     $stmt = $pdo->prepare($sql);
     return $stmt->execute([$username, $nombre, $password]);
  
    } 
    public static function UsuarioExistente($username) {
     $pdo = DB::conexion();
     $sql = "SELECT 1 FROM usuario WHERE username = ?";
     $stmt = $pdo->prepare($sql);
     $stmt->execute([$username]);

    return $stmt->fetch() ;
}
    public static function ObtenerUsuario($user_id){
     $pdo = DB::conexion();
     $sql = "SELECT username,nombre,es_publico FROM usuario where id=?;";
     $stmt = $pdo->prepare($sql);
     $stmt->execute([$user_id]);
     return $stmt->fetch() ;
  
    } 
    public static function EsAdmin($user_id) {
     $pdo = DB::conexion();
     $sql = "SELECT 1 FROM usuario WHERE id = ? and is_admin = true";
     $stmt = $pdo->prepare($sql);
     $stmt->execute([$user_id]);

    return $stmt->fetch() ;

}    
public static function ActualizarDatos($nombre, $password, $es_public, $id)
{
    $pdo = DB::conexion();
    $datos = [];
    $valores = [];
    if (!empty($nombre)) {
        $datos[] = "nombre = ?";
        $valores[] = $nombre;
    }
    if (!empty($password)) {
        $datos[] = "password = ?";
        $valores[] = $password;
    }
    if (($es_public)!==null ) {
        $datos[] = "es_publico = ?";
        $valores[] = $es_public;
    }
    $sql = "UPDATE usuario SET " . implode(", ", $datos) . " WHERE id = ?";
    $valores[] = $id;
    $stmt = $pdo->prepare($sql);
    return $stmt->execute($valores);
}


}
