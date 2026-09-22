<?php

namespace App\Routes;

use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Controllers\UserController;
use App\Controllers\AutenticacionController;
use App\Controllers\ChatController;
use App\Controllers\MessageController;
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
    $app->delete('/usuarios/{user_id}', [UserController::class, 'EliminarUsuario'])->add(new IsLoggedMiddleware($app->getResponseFactory()));
    $app->get('/usuarios', [UserController::class, 'ObtenerUsuarios']);    

    //----------Chat----------\\
    $app->post('/chats/{user_id}', [ChatController::class, 'newChat'])->add(new IsLoggedMiddleware($app->getResponseFactory()));
    $app->get('/chats', [ChatController::class, 'getChats'])->add(new IsLoggedMiddleware($app->getResponseFactory()));
    $app->put('/chats/{user_id}', [ChatController::class, 'putChat'])->add(new IsLoggedMiddleware($app->getResponseFactory()));
    $app->get('/chats/{user_id}/historia/{quantity}', [ChatController::class, 'getHistory'])->add(new IsLoggedMiddleware($app->getResponseFactory()));

    //----------Message----------\\
    $app->delete('/mensajes/{message_id}', [MessageController::class, 'deleteMessage'])->add(new IsLoggedMiddleware($app->getResponseFactory()));
    
};