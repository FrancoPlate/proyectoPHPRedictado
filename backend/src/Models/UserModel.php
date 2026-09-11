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


}
