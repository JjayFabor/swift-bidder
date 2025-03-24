<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Console\Scheduling\Schedule;
use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Middleware\HandleInertiaRequests;
use Symfony\Component\HttpFoundation\Response;
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
    })
    ->withSchedule(function (Schedule $schedule){
        $schedule->command('app:update-auction-status')->everyMinute();
    })->create();
