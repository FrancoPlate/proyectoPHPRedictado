<?php

namespace App\Routes;

use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Controllers\UserController;
use App\Controllers\ChatsController;
use App\Controllers\AutenticacionController;
use App\Middleware\IsLoggedMiddleware;

return function (App $app) {

    $app->get('/saludo', function (Request $request, Response $response, $args) {
        $response->getBody()->write("Hola, Slim funciona desde Routes!");
        return $response;
    });

    $app->post('/usuarios', [UserController::class, 'crearUsuario']);
    $app->post('/login', [AutenticacionController::class, 'IniciarSesion']);
    $app->post('/logout', [AutenticacionController::class, 'Logout'])->add(new IsLoggedMiddleware($app->getResponseFactory())); // para probar
    $app->get('/usuarios/{user_id}', [UserController::class, 'ObtenerUsuario'])->add(new IsLoggedMiddleware($app->getResponseFactory()));
    $app->put('/usuarios/{user_id}', [UserController::class, 'EditarUsuario'])->add(new IsLoggedMiddleware($app->getResponseFactory()));
    
    //----------Chat----------\\
    $app->post('/chats/{user_id}', [ChatsController::class, 'newChat'])->add(IsLoggedMiddleware::class);
    $app->get('/chats', [ChatsController::class, 'getChats'])->add(IsLoggedMiddleware::class);
    $app->put('/chats/{user_id}', [ChatsController::class, 'putChat'])->add(IsLoggedMiddleware::class);
    $app->get('/chats/{user_id}/historia/{quantity}', [ChatsController::class, 'getHistory'])->add(IsLoggedMiddleware::class);
    
};