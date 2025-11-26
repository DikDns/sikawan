<?php

use App\Http\Controllers\LevelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SuperAdmin\LogController;
use App\Http\Controllers\PublicDistributionMapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
  return Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
  ]);
})->name('home');

// Public Distribution Map (no auth)
Route::get('peta-sebaran', [PublicDistributionMapController::class, 'index'])
  ->name('distribution-map.public');

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

  Route::get('distribution-map', function () {
    try {
      $households = \App\Models\Household\Household::query()
        ->where('is_draft', false)
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->orderByDesc('updated_at')
        ->limit(2000)
        ->get()
        ->map(function ($h) {
          return [
            'id' => $h->id,
            'head_name' => $h->head_name,
            'address_text' => $h->address_text,
            'latitude' => (float) $h->latitude,
            'longitude' => (float) $h->longitude,
            'habitability_status' => $h->habitability_status, // RLH | RTLH
            'province_name' => $h->province_name,
            'regency_name' => $h->regency_name,
            'district_name' => $h->district_name,
            'village_name' => $h->village_name,
          ];
        });

      $areaGroups = \App\Models\AreaGroup::with('areas')
        ->orderBy('name')
        ->get()
        ->map(function ($group) {
          return [
            'id' => $group->id,
            'code' => $group->code,
            'name' => $group->name,
            'description' => $group->description,
            'legend_color_hex' => $group->legend_color_hex,
            'legend_icon' => $group->legend_icon,
            'geometry_json' => $group->geometry_json,
            'centroid_lat' => $group->centroid_lat,
            'centroid_lng' => $group->centroid_lng,
            'areas' => $group->areas->map(function ($area) use ($group) {
              return [
                'id' => $area->id,
                'name' => $area->name,
                'description' => $area->description,
                'geometry_json' => $area->geometry_json,
                'province_id' => $area->province_id,
                'province_name' => $area->province_name,
                'regency_id' => $area->regency_id,
                'regency_name' => $area->regency_name,
                'district_id' => $area->district_id,
                'district_name' => $area->district_name,
                'village_id' => $area->village_id,
                'village_name' => $area->village_name,
                'color' => $group->legend_color_hex,
              ];
            }),
          ];
        });

      return Inertia::render('distribution-map', [
        'households' => $households,
        'areaGroups' => $areaGroups,
      ]);
    } catch (\Throwable $e) {
      return Inertia::render('distribution-map', [
        'households' => [],
        'areaGroups' => [],
        'error' => 'Gagal memuat data: ' . $e->getMessage(),
      ]);
    }
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
  Route::match(['put', 'patch', 'post'], 'households/{id}', [App\Http\Controllers\HouseholdController::class, 'update'])->name('households.update');
  Route::delete('households/{id}', [App\Http\Controllers\HouseholdController::class, 'destroy'])->name('households.destroy');
  Route::post('households/{id}/finalize', [App\Http\Controllers\HouseholdController::class, 'finalize'])->name('households.finalize');

  // Assistance Routes
  Route::get('households/{householdId}/assistances', [App\Http\Controllers\AssistanceController::class, 'index'])->name('assistances.index');
  Route::post('households/{householdId}/assistances', [App\Http\Controllers\AssistanceController::class, 'store'])->name('assistances.store');
  Route::put('households/{householdId}/assistances/{assistanceId}', [App\Http\Controllers\AssistanceController::class, 'update'])->name('assistances.update');
  Route::patch('households/{householdId}/assistances/{assistanceId}/status', [App\Http\Controllers\AssistanceController::class, 'updateStatus'])->name('assistances.updateStatus');
  Route::delete('households/{householdId}/assistances/{assistanceId}', [App\Http\Controllers\AssistanceController::class, 'destroy'])->name('assistances.destroy');

  // AreaGroup CRUD Routes (Create/Update/Delete for AreaGroup)
  Route::get('areas/create', [App\Http\Controllers\AreaGroupController::class, 'create'])->name('areas.create');
  Route::post('areas', [App\Http\Controllers\AreaGroupController::class, 'store'])->name('areaGroups.store');
  Route::get('areas/{id}/edit', [App\Http\Controllers\AreaGroupController::class, 'edit'])->name('areas.edit');
  Route::match(['put', 'patch', 'post'], 'areas/{id}', [App\Http\Controllers\AreaGroupController::class, 'update'])->name('areaGroups.update');
  Route::delete('areas/{id}', [App\Http\Controllers\AreaGroupController::class, 'destroy'])->name('areaGroups.destroy');

  // Areas Routes
  Route::get('areas', [App\Http\Controllers\AreaController::class, 'index'])->name('areas');
  Route::get('areas/{id}', [App\Http\Controllers\AreaController::class, 'show'])->name('areas.show');
  Route::post('areas/{areaGroupId}/areas', [App\Http\Controllers\AreaController::class, 'storeArea'])->name('areas.store');
  Route::put('areas/{areaGroupId}/areas/{areaId}', [App\Http\Controllers\AreaController::class, 'updateArea'])->name('areas.update');
  Route::delete('areas/{areaGroupId}/areas/{areaId}', [App\Http\Controllers\AreaController::class, 'destroyArea'])->name('areas.destroy');



  Route::get('infrastructure', [App\Http\Controllers\InfrastructureGroupController::class, 'index'])->name('infrastructure');
  Route::post('infrastructure', [App\Http\Controllers\InfrastructureGroupController::class, 'store'])->name('infrastructure.store');
  Route::match(['put', 'patch'], 'infrastructure/{id}', [App\Http\Controllers\InfrastructureGroupController::class, 'update'])->name('infrastructure.update');
  Route::delete('infrastructure/{id}', [App\Http\Controllers\InfrastructureGroupController::class, 'destroy'])->name('infrastructure.destroy');

  Route::get('infrastructure/{groupId}', [App\Http\Controllers\InfrastructureController::class, 'show'])->name('infrastructure.show');
  Route::post('infrastructure/{groupId}/items', [App\Http\Controllers\InfrastructureController::class, 'store'])->name('infrastructure.items.store');
  Route::put('infrastructure/{groupId}/items/{itemId}', [App\Http\Controllers\InfrastructureController::class, 'update'])->name('infrastructure.items.update');
  Route::delete('infrastructure/{groupId}/items/{itemId}', [App\Http\Controllers\InfrastructureController::class, 'destroy'])->name('infrastructure.items.destroy');

  Route::controller(UserController::class)->group(function () {
    Route::get('/users', 'index')->name('users');
    Route::get('/users/create', 'create')->name('users.create');
    Route::post('/users/store', 'store')->name('users.store');
    Route::get('/users/show/{user_id}', 'show')->name('users.show');
    Route::get('/users/edit/{user_id}', 'edit')->name('users.edit');
    Route::post('/users/update/{user_id}', 'update')->name('users.update');
    Route::post('/users/delete', 'destroy')->name('users.destroy');
  });

  Route::controller(LevelController::class)->group(function () {
    Route::get('/levels', 'index')->name('levels');
    Route::get('/levels/create', 'create')->name('levels.create');
    Route::post('/levels/store', 'store')->name('levels.store');
    Route::post('/levels/update/{role_id}', 'update')->name('levels.update');
    Route::post('/levels/destroy', 'destroy')->name('levels.destroy');
  });

  Route::controller(MessageController::class)->group(function () {
    Route::get('/messages', 'index')->name('messages');
    Route::post('/messages/store', 'store')->name('messages.store');
    Route::post('/messages/destroy', 'destroy')->name('messages.destroy');
  });

  Route::controller(ReportController::class)->group(function () {
    Route::get('/reports', 'index')->name('reports');
    Route::post('/reports/store', 'store')->where('encoded', '.*')->name('reports.store');
    Route::post('/reports/destroy', 'destroy')->name('reports.destroy');
    Route::get('/reports/download/{encoded}', 'download')->where('encoded', '.*')->name('reports.download');
    Route::post('/reports/update/{report_id}', 'update')->name('reports.update');
  });

  Route::prefix('superadmin/logs')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [LogController::class, 'index'])->name('superadmin.logs.index');
    Route::resource('activity', LogController::class)->names([
      'index' => 'superadmin.logs.activity.index',
      'create' => 'superadmin.logs.activity.create',
      'store' => 'superadmin.logs.activity.store',
      'show' => 'superadmin.logs.activity.show',
      'edit' => 'superadmin.logs.activity.edit',
      'update' => 'superadmin.logs.activity.update',
      'destroy' => 'superadmin.logs.activity.destroy',
    ]);
  });

  // Wilayah API Routes (for cascading select)
  Route::prefix('api/wilayah')->group(function () {
    Route::get('provinces', [App\Http\Controllers\WilayahController::class, 'provinces'])->name('api.wilayah.provinces');
    Route::get('cities/{provinceId}', [App\Http\Controllers\WilayahController::class, 'cities'])->name('api.wilayah.cities');
    Route::get('sub-districts/{cityId}', [App\Http\Controllers\WilayahController::class, 'subDistricts'])->name('api.wilayah.sub-districts');
    Route::get('villages/{subDistrictId}', [App\Http\Controllers\WilayahController::class, 'villages'])->name('api.wilayah.villages');
  });
});

require __DIR__ . '/settings.php';
