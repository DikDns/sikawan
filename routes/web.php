<?php

use App\Http\Controllers\LevelController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SuperAdmin\LogController;
use App\Http\Controllers\PublicDistributionMapController;
use App\Http\Controllers\DistributionMapController;
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

Route::post('/messages/store', [MessageController::class, 'store'])->name('messages.store');

Route::get('/reports/preview/pdf', function () {
  return Inertia::render('reports/pdf-preview');
})->name('reports.preview.pdf');

Route::get('/reports/preview/excel', function () {
  return Inertia::render('reports/excel-preview');
})->name('reports.preview.excel');

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

  Route::get('distribution-map', [DistributionMapController::class, 'index'])->name('distribution-map');

  // Households Routes
  Route::get('households', [App\Http\Controllers\HouseholdController::class, 'index'])->name('households.index');
  Route::get('households/create', [App\Http\Controllers\HouseholdController::class, 'create'])->name('households.create');
  Route::get('households/approval', [App\Http\Controllers\HouseholdController::class, 'approval'])->name('households.approval');
  Route::get('households/rejected', [App\Http\Controllers\HouseholdController::class, 'rejected'])->name('households.rejected');

  // Draft Routes (must be before {id} route to avoid route conflict)
  Route::post('households/draft', [App\Http\Controllers\HouseholdController::class, 'saveDraft'])->name('households.draft.save');
  Route::get('households/draft', [App\Http\Controllers\HouseholdController::class, 'getDraft'])->name('households.draft.get');

  Route::get('households/{id}', [App\Http\Controllers\HouseholdController::class, 'show'])->name('households.show');
  Route::get('households/{id}/edit', [App\Http\Controllers\HouseholdController::class, 'edit'])->name('households.edit');
  Route::post('households', [App\Http\Controllers\HouseholdController::class, 'store'])->name('households.store');
  Route::match(['put', 'patch', 'post'], 'households/{id}', [App\Http\Controllers\HouseholdController::class, 'update'])->name('households.update');
  Route::delete('households/{id}', [App\Http\Controllers\HouseholdController::class, 'destroy'])->name('households.destroy');
  Route::post('households/{id}/finalize', [App\Http\Controllers\HouseholdController::class, 'finalize'])->name('households.finalize');
  Route::get('households/{id}/validate-draft', [App\Http\Controllers\HouseholdController::class, 'validateDraft'])->name('households.validateDraft');

  // Assistance Routes
  Route::get('households/{householdId}/assistances', [App\Http\Controllers\AssistanceController::class, 'index'])->name('assistances.index');
  Route::post('households/{householdId}/assistances', [App\Http\Controllers\AssistanceController::class, 'store'])->name('assistances.store');
  Route::put('households/{householdId}/assistances/{assistanceId}', [App\Http\Controllers\AssistanceController::class, 'update'])->name('assistances.update');
  Route::patch('households/{householdId}/assistances/{assistanceId}/status', [App\Http\Controllers\AssistanceController::class, 'updateStatus'])->name('assistances.updateStatus');
  Route::delete('households/{householdId}/assistances/{assistanceId}', [App\Http\Controllers\AssistanceController::class, 'destroy'])->name('assistances.destroy');

  // Approval Routes
  Route::post('households/approval/approve/{householdId}', [App\Http\Controllers\HouseholdController::class, 'approve'])->name('households.approval.approve');
  Route::post('households/approval/reject/{householdId}', [App\Http\Controllers\HouseholdController::class, 'reject'])->name('households.approval.reject');
  Route::post('households/approval/resubmit/{householdId}', [App\Http\Controllers\HouseholdController::class, 'resubmit'])->name('household.approval.resubmit');

  // AreaGroup CRUD Routes (Create/Update/Delete for AreaGroup)
  Route::get('areas/create', [App\Http\Controllers\AreaGroupController::class, 'create'])->name('areas.create');
  Route::post('areas', [App\Http\Controllers\AreaGroupController::class, 'store'])->name('areaGroups.store');
  Route::get('areas/{id}/edit', [App\Http\Controllers\AreaGroupController::class, 'edit'])->whereNumber('id')->name('areas.edit');
  Route::match(['put', 'patch', 'post'], 'areas/{id}', [App\Http\Controllers\AreaGroupController::class, 'update'])->whereNumber('id')->name('areaGroups.update');
  Route::delete('areas/{id}', [App\Http\Controllers\AreaGroupController::class, 'destroy'])->whereNumber('id')->name('areaGroups.destroy');

  // Areas Routes
  Route::get('areas', [App\Http\Controllers\AreaController::class, 'index'])->name('areas');
  Route::get('areas/{id}', [App\Http\Controllers\AreaController::class, 'show'])->whereNumber('id')->name('areas.show');
  Route::post('areas/sync-all', [App\Http\Controllers\AreaController::class, 'syncAll'])->name('areas.syncAll');
  Route::get('areas/sync-all/status', [App\Http\Controllers\AreaController::class, 'syncAllStatus'])->name('areas.syncAllStatus');
  Route::get('areas/{areaId}/households', [App\Http\Controllers\AreaController::class, 'householdsByArea'])->whereNumber('areaId')->name('areas.households');
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

  // Infrastructure Assistance Routes
  Route::get('infrastructure-items/{infrastructureId}/assistances', [App\Http\Controllers\InfrastructureAssistanceController::class, 'index'])->name('infrastructure.assistances.index');
  Route::post('infrastructure-items/{infrastructureId}/assistances', [App\Http\Controllers\InfrastructureAssistanceController::class, 'store'])->name('infrastructure.assistances.store');
  Route::put('infrastructure-items/{infrastructureId}/assistances/{assistanceId}', [App\Http\Controllers\InfrastructureAssistanceController::class, 'update'])->name('infrastructure.assistances.update');
  Route::delete('infrastructure-items/{infrastructureId}/assistances/{assistanceId}', [App\Http\Controllers\InfrastructureAssistanceController::class, 'destroy'])->name('infrastructure.assistances.destroy');

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
    Route::post('/messages/destroy', 'destroy')->name('messages.destroy');
  });

  Route::controller(ReportController::class)->group(function () {
    Route::get('/reports', 'index')->name('reports');
    Route::post('/reports/store', 'store')->where('encoded', '.*')->name('reports.store');
    Route::post('/reports/destroy', 'destroy')->name('reports.destroy');
    Route::get('/reports/download/{encoded}', 'download')->where('encoded', '.*')->name('reports.download');
    Route::post('/reports/update/{report_id}', 'update')->name('reports.update');
    Route::post('/reports/preview', 'preview')->name('reports.preview');
    Route::get('/reports/preview/pdf', 'previewPdf')->name('reports.pdf-preview');
    Route::post('/reports/preview/pdf/store', 'storePreview')->name('reports.pdf-store');
    Route::get('/reports/preview/excel', 'previewExcel')->name('reports.excel-preview');
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
