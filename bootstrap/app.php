<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Render (and most PaaS) terminate TLS at their edge and forward over HTTP.
        // Without trusting the proxy headers Laravel builds http:// asset and Ziggy
        // URLs, which browsers then block as mixed content on an https:// page.
        $middleware->trustProxies(at: '*');

        $middleware->alias([
            'auth' => AuthMiddleware::class,
            'verified' => EnsureEmailIsVerified::class,
            'admin' => AdminMiddleware::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
        //     $statusCode = $response->getStatusCode();

        //     if ($statusCode === 419) {
        //         return redirect()->route('login')->with([
        //             'message' => 'Your session has expired or an error occurred. Please log in again.',
        //         ]);
        //     }

        //     if (! app()->environment(['local', 'testing']) && in_array($statusCode, [503, 404, 403])) {
        //         return Inertia::render('ErrorPage', ['status' => $statusCode])
        //             ->toResponse($request)
        //             ->setStatusCode($statusCode);
        //     }

        //     return $response;
        // });
    })->create();
