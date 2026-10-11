<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\NoCache;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Inertia's middleware on the web stack
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        // Alias so routes can use 'nocache'
        $middleware->alias([
            'nocache' => NoCache::class,
        ]);

        // Where logged-in users get sent when they hit a 'guest' route (e.g. back to login)
        $middleware->redirectUsersTo(function () {
            return auth()->user()?->role === 'admin'
                ? route('admin.dashboard')
                : route('dashboard');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();