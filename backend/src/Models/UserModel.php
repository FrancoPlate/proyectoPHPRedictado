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

    return $stmt->fetch(PDO::FETCH_ASSOC) ;
}
    public static function ObtenerUsuario($user_id){
     $pdo = DB::conexion();
     $sql = "SELECT username,nombre,es_publico FROM usuario where id=?;";
     $stmt = $pdo->prepare($sql);
     $stmt->execute([$user_id]);
     return $stmt->fetch(PDO::FETCH_ASSOC) ;
  
    } 
    public static function EsAdmin($user_id) {
     $pdo = DB::conexion();
     $sql = "SELECT 1 FROM usuario WHERE id = ? and is_admin = 1";
     $stmt = $pdo->prepare($sql);
     $stmt->execute([$user_id]);

    return $stmt->fetch(PDO::FETCH_ASSOC) ;

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

public static function DeleteUser($id)
{
    $pdo = null;

    try {
        $pdo = DB::conexion();
        $pdo->beginTransaction();

        // Eliminar mensajes
        $sql = "DELETE FROM mensaje WHERE enviado_por = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);

        // Eliminar chat
        $sql = "DELETE FROM chat WHERE usuario_id = ? OR creado_por=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id,$id]);  

        // Eliminar usuario
        $sql = "DELETE FROM usuario WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);

        $pdo->commit();

        return true;

    } catch (\Throwable $e) {

        if ($pdo !== null && $pdo->inTransaction()) {
            $pdo->rollBack();
        }

        return false;
    }
}
public static function ObtenerUsuarios($user_id,$es_public,$search, $order, $limit, $offset)
{
    $pdo = DB::conexion();

    $sql = "SELECT id, nombre, es_publico, is_admin FROM usuario WHERE id!=?" ;
    $valores = [];
    $valores[]=$user_id;
 // Buscar
    if(($es_public==0)||($es_public==1)){
      $sql.=" AND es_publico =?";
      $valores[]=$es_public;
    }else if($es_public==2){
       $sql.=" AND (es_publico =? OR es_publico=?) AND is_admin=0";
      $valores[]=0;
      $valores[]=1;
    }

    if (!empty($search)) {
        $sql .= " AND (username LIKE ? OR nombre LIKE ?)";
        $valores[] = "%$search%";
        $valores[] = "%$search%";
    }
    // Ordenar
    if (($order==="DESC")||($order==="ASC")) {
         $sql .= " ORDER BY nombre " . $order ;
    }
    // Límite
    if ((is_int($limit))&&($limit>0)) {
        $sql .= " LIMIT " . (int)$limit;
    }
    // Offset
    if ((is_int($limit))&&($offset>0)) {
        $sql .= " OFFSET " . (int)$offset;
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute($valores);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public static function ObtenerCantidad($id)
{    $pdo = DB::conexion();
      $sql="SELECT COUNT(*) FROM usuario JOIN chat ON (usuario.id=chat.usuario_id OR usuario.id=chat.creado_por) WHERE usuario.id=? AND (chat.usuario_id=? OR chat.creado_por=?)";
      $stmt=$pdo->prepare($sql);
      $stmt->execute([$id,$id,$id]);
      return $stmt->fetchColumn();

}

}
