<?php

use App\Http\Middleware\CheckFeatureAccess;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias(['feature' => CheckFeatureAccess::class]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Trust all proxies (for reverse proxy setup like Nginx)
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'reports/preview',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response) {
            $status = $response->getStatusCode();

            // Handle specific HTTP error codes with Inertia
            if (in_array($status, [403, 404, 500, 503])) {
                return Inertia::render('Error', [
                    'status' => $status,
                ])->toResponse(request())->setStatusCode($status);
            }

            return $response;
        });
    })->create();
