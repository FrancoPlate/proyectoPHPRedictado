<?php
namespace App\Models;

use PDO;
use App\DB\DB;
class AutenticacionModel{
public static function ActualizarToken($id, $token, $expToken)
{
    $pdo = DB::conexion();
    $sql = "UPDATE usuario SET token = ?, token_expired_at = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    return $stmt->execute([$token,$expToken,$id]);
}

public static function ObtenerIdUsuario($token)
{
    $pdo = DB::conexion();
    $sql = "SELECT id FROM usuario WHERE token = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}
public static function ValidarSesion($username)
{
    $pdo = DB::conexion();
    $sql = "SELECT id,password FROM usuario WHERE username = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

public static function ObtenerToken($token){

    $pdo = DB::conexion();
    $sql = "SELECT token,token_expired_at,id FROM usuario WHERE token = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

    }