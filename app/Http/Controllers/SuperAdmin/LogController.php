<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class LogController extends Controller
{
  public function index(Request $request)
  {
    // Gate::authorize('viewAny', AuditLog::class);

    $userId = $request->query('user_id');
    $entity = $request->query('model');
    $start = $request->query('start_date');
    $end = $request->query('end_date');
    $page = (int) ($request->query('page') ?: 1);

    $q = AuditLog::query()
      ->when($userId, fn($qq) => $qq->where('user_id', $userId))
      ->when($entity, fn($qq) => $qq->where('entity_type', $entity))
      ->when($start, fn($qq) => $qq->whereDate('created_at', '>=', $start))
      ->when($end, fn($qq) => $qq->whereDate('created_at', '<=', $end))
      ->orderByDesc('created_at');

    $logs = $q->paginate(15, ['*'], 'page', $page);

    $items = collect($logs->items())->map(function ($log) {
      return [
        'id' => $log->id,
        'user_id' => $log->user_id,
        'user_name' => optional($log->user)->name,
        'action' => $log->action,
        'entity_type' => $log->entity_type,
        'entity_id' => $log->entity_id,
        'metadata_json' => $log->metadata_json,
        'created_at' => $log->created_at?->toDateTimeString(),
      ];
    });

    $users = User::select('id', 'name')->orderBy('name')->get();

    // Mapping nama model teknis ke nama yang ramah pengguna
    $entityNames = [
      'AuditLog' => 'Log Aktivitas',
      'Area' => 'Kawasan',
      'AreaGroup' => 'Kelompok Kawasan',
      'Infrastructure' => 'PSU',
      'InfrastructureGroup' => 'Kelompok PSU',
      'Message' => 'Pesan',
      'Media' => 'Media',
      'RelocationAssessment' => 'Penilaian Relokasi',
      'Report' => 'Laporan',
      'User' => 'Pengguna',
      'Assistance' => 'Bantuan',
      'Household' => 'Rumah',
      'Member' => 'Anggota Keluarga',
      'Photo' => 'Foto',
      'Score' => 'Skor',
      'TechnicalData' => 'Data Teknis',
      'City' => 'Kota/Kabupaten',
      'Province' => 'Provinsi',
      'SubDistrict' => 'Kecamatan',
      'Village' => 'Desa/Kelurahan',
    ];

    $models = collect([
      AuditLog::class,
      \App\Models\Area::class,
      \App\Models\AreaGroup::class,
      \App\Models\Infrastructure::class,
      \App\Models\InfrastructureGroup::class,
      \App\Models\Message::class,
      \App\Models\Media::class,
      \App\Models\RelocationAssessment::class,
      \App\Models\Report::class,
      \App\Models\User::class,
      \App\Models\Household\Assistance::class,
      \App\Models\Household\Household::class,
      \App\Models\Household\Member::class,
      \App\Models\Household\Photo::class,
      \App\Models\Household\Score::class,
      \App\Models\Household\TechnicalData::class,
      \App\Models\Wilayah\City::class,
      \App\Models\Wilayah\Province::class,
      \App\Models\Wilayah\SubDistrict::class,
      \App\Models\Wilayah\Village::class,
    ])->map(fn($c) => [
      'name' => $entityNames[class_basename($c)] ?? class_basename($c),
      'value' => $c,
    ])->sortBy('name')->values();

    return Inertia::render('superadmin/logs', [
      'logs' => [
        'data' => $items,
        'current_page' => $logs->currentPage(),
        'last_page' => $logs->lastPage(),
        'per_page' => $logs->perPage(),
        'total' => $logs->total(),
      ],
      'filters' => [
        'users' => $users,
        'models' => $models,
        'applied' => [
          'user_id' => $userId,
          'model' => $entity,
          'start_date' => $start,
          'end_date' => $end,
        ],
      ],
    ]);
  }

  public function show($id)
  {
    Gate::authorize('view', AuditLog::class);
    $log = AuditLog::with('user')->findOrFail($id);
    return response()->json($log);
  }

  public function destroy($id)
  {
    Gate::authorize('delete', AuditLog::class);
    $log = AuditLog::findOrFail($id);
    $log->delete();
    return redirect()->back()->with('success', 'Log dihapus');
  }

  public function create()
  {
    abort(404);
  }
  public function store(Request $request)
  {
    abort(404);
  }
  public function edit($id)
  {
    abort(404);
  }
  public function update(Request $request, $id)
  {
    abort(404);
  }

  public function export(Request $request)
  {
    abort(404);
  }
}
