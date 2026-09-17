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


            //actual 
            //$query = "SELECT  id,creado_por, usuario_id, nombre, descripción, esta_bloqueado  FROM chat WHERE creado_por = :user or usuario_id = :user";
            //sugerido ?
            $query2 = "SELECT 
                c.id,
                c.nombre,
                c.descripcion,
                c.esta_bloqueado,
                c.creado_por,
                c.usuario_id,
                -- Nombre del OTRO usuario
                u.nombre AS nombre_interlocutor,
                -- Texto del último mensaje enviado/recibido (NULL si no hay mensajes aún)
                m.texto AS ultimo_mensaje
            FROM chat c
            -- 1. Unimos con la tabla usuario para obtener los datos del interlocutor
            JOIN usuario u ON u.id = CASE 
                WHEN c.creado_por = :user THEN c.usuario_id 
                ELSE c.creado_por 
            END
            -- 2. Traemos solo el último mensaje de cada chat usando una subconsulta
            LEFT JOIN mensaje m ON m.id = (
                SELECT id 
                FROM mensaje 
                WHERE id = c.id 
                ORDER BY created_at DESC, id DESC 
                LIMIT 1
            )
            -- 3. Filtramos para que traiga únicamente los chats del usuario actual
            WHERE c.creado_por = :user OR c.usuario_id = :user
            ORDER BY COALESCE(m.created_at, c.created_at) DESC";
            
            
            $stmt = $pdo->prepare($query2);
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
    }