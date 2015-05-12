<?php

require_once __DIR__.'/../vendor/autoload.php';

// Dotenv::load(__DIR__.'/../');

$app = new Laravel\Lumen\Application(
	realpath(__DIR__.'/../')
);

// $app->withFacades();

// $app->withEloquent();

$app->singleton(
    'Illuminate\Contracts\Debug\ExceptionHandler',
    'App\Exceptions\Handler'
);

$app->singleton(
    'Illuminate\Contracts\Console\Kernel',
    'App\Console\Kernel'
);

// $app->middleware([
//     // 'Illuminate\Cookie\Middleware\EncryptCookies',
//     // 'Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse',
//     // 'Illuminate\Session\Middleware\StartSession',
//     // 'Illuminate\View\Middleware\ShareErrorsFromSession',
//     // 'Laravel\Lumen\Http\Middleware\VerifyCsrfToken',
// ]);

// $app->routeMiddleware([

// ]);

// $app->register('App\Providers\AppServiceProvider');

require __DIR__.'/../app/Http/routes.php';

return $app;
