<?php

namespace App\Models;
    use PDO;
    use App\DB\DB;

    class MensajeModel{

        public static function newMessage($chatId, $creado, $mensaje){
            $pdo = DB::conexion();
            $query = "INSERT INTO mensaje (chat_id,enviado_por,texto)
                                    VALUE(:chatid,:creado,:mensaje)";
            $stmt = $pdo->prepare($query);
            return $stmt->execute([':chatid' => $chatId,
                            ':creado' => $creado,
                            ':mensaje' => $mensaje]);
            
        }

        public static function obtenerHistoria($chat_id, $quantity,$offset){
            $pdo = DB::conexion();
            $query = "SELECT id,texto,fecha_creación, enviado_por FROM mensaje ORDER BY create_at DESC LIMIT :quantity OFFSET :offset WHERE chat_id = :chatid ";
            $stmt = $pdo->prepare($query);
            $stmt->execute([':quantity' => $quantity,
                            ':offset' => $offset,
                            ':chatid' => $chat_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public static function deleteMessage($message_id){
            $pdo = DB::conexion();
            $query = "DELETE FROM mensaje WHERE id= :message";
            $stmt = $pdo->prepare($query);
            return $stmt->execute([':message' => $message_id]);
        }

    }