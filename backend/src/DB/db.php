<?php

namespace App\DB;

use PDO;


class DB
{

    public static function conexion()
    {
        return new PDO(
            "mysql:host={$_ENV['DB_HOST']};port={$_ENV['DB_PORT']};dbname={$_ENV['DB_NAME']};charset=utf8mb4",
            $_ENV['DB_USER'],
            $_ENV['DB_PASS']
        );
    }

}