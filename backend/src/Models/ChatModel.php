<?php
    namespace App\Models;
    use PDO;
    use App\DB\DB;

    class ChatModel{

        public static function buscarChatEntreUsuarios($user_creador,$user_id){
            $pdo = DB::conexion();
            $query = "SELECT 1 FROM chat WHERE creado_por = :creado and usuario_id = :user_id";
            $stmt = $pdo->prepare($query);
            $stmt->execute([":creado" => $user_creador, ":user_id" => $user_id]);

            return $stmt->fetch();
        }

        public static function crearChat($user_creador, $user_id,$chat){
            $pdo = DB::conexion();
            $query = "INSERT INTO chat (creado_por,usuario_id,nombre,descripcion,color,esta_bloqueado) 
                                VALUES (:creado,:user_id,:name,:desc,:color,:esta_bloqueado)";
            $stmt = $pdo->prepare($query);
            $result = $stmt ->execute([":creado"=>$user_creador,
                             ":user_id"=>$user_id,
                             ":name"=>$chat['nombre'],
                             ":desc"=>$chat['descripcion'],
                             ":color"=> "#ffffff",
                             ":esta_bloqueado"=> 0]);
            if ($result) {
                // Devuelve el id generado para este nuevo chat
                return $pdo->lastInsertId(); 
            }
            return $result;
        }

        public static function listarChatsDeUsuario($user){
            $pdo = DB::conexion();
            $query = "SELECT * FROM chat WHERE creado_por = :user or usuario_id = :user";
            $stmt = $pdo->prepare($query);
            $stmt->execute([":user" => $user]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public static function actualizarChat($chat_id, $name,$desc,$color,$esta_bloqueado){
            $pdo = DB::conexion();
            $query = "UPDATE chat SET nombre = :name, descripcion = :desc, color = :color, :bloqueado = esta_bloqueado 
                      WHERE id = :chatid";
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute([
                ':name'   => $name,
                ':desc'   => $desc,
                ':color'  => $color,
                ':bloqueado' => $esta_bloqueado,
                ':chatid' => $chat_id]);
            
            return $result;
        }
        public static function obtenerHistoria(){
            
        }
    }