<?php

namespace App\Models;
    use PDO;
    use App\DB\DB;

    class MessageModel{

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
            $query = "SELECT id,texto,created_at, enviado_por FROM mensaje WHERE chat_id = :chatid ORDER BY created_at DESC LIMIT :quantity OFFSET :offset";
            $stmt = $pdo->prepare($query);
            // añado los datos directamente explícito de tipos enteros
            $stmt->bindValue(':chatid', (int)$chat_id, PDO::PARAM_INT);
            $stmt->bindValue(':quantity', (int)$quantity, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public static function deleteMessage($message_id){
            $pdo = DB::conexion();
            $query = "DELETE FROM mensaje WHERE id= :message";
            $stmt = $pdo->prepare($query);
            $stmt->execute([':message' => $message_id]);
            // Retorna true si se borró al menos 1 fila, o false si no existía el id
            return $stmt->rowCount() > 0;
        }

        public static function getMessage($message_id){
            $pdo = DB::conexion();
            $query = "SELECT * FROM mensaje WHERE id= :message";
            $stmt = $pdo->prepare($query);
            $stmt->execute([':message' => $message_id]);
            return $stmt->fetch();
        }

    }