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

    // Households Routes
    Route::get('households', [App\Http\Controllers\HouseholdController::class, 'index'])->name('households.index');
    Route::get('households/create', [App\Http\Controllers\HouseholdController::class, 'create'])->name('households.create');

    // Draft Routes (must be before {id} route to avoid route conflict)
    Route::post('households/draft', [App\Http\Controllers\HouseholdController::class, 'saveDraft'])->name('households.draft.save');
    Route::get('households/draft', [App\Http\Controllers\HouseholdController::class, 'getDraft'])->name('households.draft.get');

    Route::get('households/{id}', [App\Http\Controllers\HouseholdController::class, 'show'])->name('households.show');
    Route::get('households/{id}/edit', [App\Http\Controllers\HouseholdController::class, 'edit'])->name('households.edit');
    Route::post('households', [App\Http\Controllers\HouseholdController::class, 'store'])->name('households.store');
    Route::put('households/{id}', [App\Http\Controllers\HouseholdController::class, 'update'])->name('households.update');
    Route::delete('households/{id}', [App\Http\Controllers\HouseholdController::class, 'destroy'])->name('households.destroy');
    Route::post('households/{id}/finalize', [App\Http\Controllers\HouseholdController::class, 'finalize'])->name('households.finalize');

    // Assistance Routes
    Route::get('households/{householdId}/assistances', [App\Http\Controllers\AssistanceController::class, 'index'])->name('assistances.index');
    Route::post('households/{householdId}/assistances', [App\Http\Controllers\AssistanceController::class, 'store'])->name('assistances.store');
    Route::put('households/{householdId}/assistances/{assistanceId}', [App\Http\Controllers\AssistanceController::class, 'update'])->name('assistances.update');
    Route::patch('households/{householdId}/assistances/{assistanceId}/status', [App\Http\Controllers\AssistanceController::class, 'updateStatus'])->name('assistances.updateStatus');
    Route::delete('households/{householdId}/assistances/{assistanceId}', [App\Http\Controllers\AssistanceController::class, 'destroy'])->name('assistances.destroy');

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

    // Wilayah API Routes (for cascading select)
    Route::prefix('api/wilayah')->group(function () {
        Route::get('provinces', [App\Http\Controllers\WilayahController::class, 'provinces'])->name('api.wilayah.provinces');
        Route::get('cities/{provinceId}', [App\Http\Controllers\WilayahController::class, 'cities'])->name('api.wilayah.cities');
        Route::get('sub-districts/{cityId}', [App\Http\Controllers\WilayahController::class, 'subDistricts'])->name('api.wilayah.sub-districts');
        Route::get('villages/{subDistrictId}', [App\Http\Controllers\WilayahController::class, 'villages'])->name('api.wilayah.villages');
    });
});

require __DIR__.'/settings.php';
