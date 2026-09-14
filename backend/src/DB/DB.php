<?php

namespace App\DB;

use PDO;
use PDOException;

class DB
{
    public static function conexion()
    {
        try {
            $conexion = new PDO(
                "mysql:host=" . $_ENV['DB_HOST'] .
                ";port=" . $_ENV['DB_PORT'] .
                ";dbname=" . $_ENV['DB_NAME'] .
                ";charset=utf8mb4",
                $_ENV['DB_USER'],
                $_ENV['DB_PASS']
            );
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conexion;

        } catch (PDOException $e) {
            die("Error de conexión a la base de datos: " . $e->getMessage());
        }
    }
}
