<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('distribution-map', function () {
        return Inertia::render('distribution-map');
    })->name('distribution-map');

    Route::get('households', function () {
        return Inertia::render('households');
    })->name('households');

    Route::get('areas', function () {
        return Inertia::render('areas');
    })->name('areas');

    Route::get('infrastructure', function () {
        return Inertia::render('infrastructure');
    })->name('infrastructure');

    Route::get('reports', function () {
        return Inertia::render('reports');
    })->name('reports');

    Route::get('messages', function () {
        return Inertia::render('messages');
    })->name('messages');

    Route::get('users', function () {
        return Inertia::render('users');
    })->name('users');
});

require __DIR__.'/settings.php';
