<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\AreaGroup;
use App\Models\Household\Household;
use App\Jobs\SyncAreaHouseholdsJob;
use App\Jobs\SyncAllEligibleAreasJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AreaController extends Controller
{
  /**
   * Display a listing of area groups
   */
  public function index(Request $request)
  {
    $query = AreaGroup::orderBy('name');

    // Get all area groups
    $areaGroups = $query->get()->map(function ($group) {
      return [
        'id' => $group->id,
        'code' => $group->code,
        'name' => $group->name,
        'description' => $group->description,
        'legend_color_hex' => $group->legend_color_hex,
        'legend_icon' => $group->legend_icon,
        'areas_count' => $group->areas()->count(),
        'geometry_json' => $group->geometry_json,
        'centroid_lat' => $group->centroid_lat,
        'centroid_lng' => $group->centroid_lng,
      ];
    });

    // Calculate statistics
    $stats = [
      'totalGroups' => $areaGroups->count(),
    ];

    return Inertia::render('areas', [
      'areaGroups' => $areaGroups,
      'stats' => $stats,
    ]);
  }

  /**
   * Display the specified area group
   */
  public function show(Request $request, $id)
  {
    $areaGroup = AreaGroup::with('areas')->findOrFail($id);

    // Format area group data
    $groupData = [
      'id' => $areaGroup->id,
      'code' => $areaGroup->code,
      'name' => $areaGroup->name,
      'description' => $areaGroup->description,
      'legend_color_hex' => $areaGroup->legend_color_hex,
      'legend_icon' => $areaGroup->legend_icon,
      'geometry_json' => $areaGroup->geometry_json,
      'centroid_lat' => $areaGroup->centroid_lat,
      'centroid_lng' => $areaGroup->centroid_lng,
    ];

    // Format areas data
    $areas = $areaGroup->areas->map(function ($area) {
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
        'is_slum' => $area->is_slum,
        'area_total_m2' => $area->area_total_m2,
      ];
    });

    // Get area IDs for filtering households
    $areaIds = $areaGroup->areas->pluck('id');

    $households = Household::query()
      ->whereIn('area_id', $areaIds)
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
          'habitability_status' => $h->habitability_status,
          'province_name' => $h->province_name,
          'regency_name' => $h->regency_name,
          'district_name' => $h->district_name,
          'village_name' => $h->village_name,
        ];
      });

    return Inertia::render('areas/detail', [
      'areaGroup' => $groupData,
      'areas' => $areas,
      'households' => $households,
    ]);
  }

  public function sync(Request $request, $areaId)
  {
    $area = Area::find($areaId);
    if (! $area) {
      return response()->json([
        'message' => 'Area tidak ditemukan',
      ], 404);
    }

    SyncAreaHouseholdsJob::dispatch($area->id);
    return response()->json([
      'message' => 'Sinkronisasi kawasan sedang diproses',
      'area_id' => $area->id,
    ], 202);
  }

  public function syncAll(Request $request)
  {
    SyncAllEligibleAreasJob::dispatch();
    return response()->json([
      'message' => 'Sinkronisasi seluruh kawasan yang memenuhi kriteria sedang diproses',
    ], 202);
  }

  public function syncAllStatus(Request $request)
  {
    $runId = Cache::get('sync-all:run');
    $status = Cache::get('sync-all:status', 'idle');
    $start = Cache::get('sync-all:start');
    $last = Cache::get('sync-all:last');
    $total = $runId ? (int) Cache::get("sync-all:total:$runId", 0) : 0;
    $pending = $runId ? (int) Cache::get("sync-all:pending:$runId", 0) : 0;

    return response()->json([
      'run_id' => $runId,
      'status' => $status,
      'start_at' => $start instanceof \Carbon\Carbon ? $start->toIso8601String() : $start,
      'last_at' => $last instanceof \Carbon\Carbon ? $last->toIso8601String() : $last,
      'total' => $total,
      'pending' => $pending,
    ]);
  }

  /**
   * Fetch households related to a specific area
   */
  public function householdsByArea(Request $request, $areaId)
  {
    $area = Area::find($areaId);
    if (! $area) {
      return response()->json([
        'message' => 'Area tidak ditemukan',
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      'limit' => 'sometimes|integer|min:1|max:200',
    ]);
    if ($validator->fails()) {
      return response()->json([
        'message' => 'Parameter tidak valid',
        'errors' => $validator->errors(),
      ], 422);
    }

    $limit = (int) ($request->input('limit', 50));
    $limit = max(1, min(200, $limit));

    try {
      $rows = Household::query()
        ->where('area_id', $area->id)
        ->orderByDesc('updated_at')
        ->limit($limit)
        ->get(['id', 'head_name', 'habitability_status', 'updated_at'])
        ->map(function ($h) {
          return [
            'id' => $h->id,
            'head_name' => $h->head_name,
            'habitability_status' => $h->habitability_status,
            'updated_at' => optional($h->updated_at)->toIso8601String(),
          ];
        });

      $status = Cache::get('area-sync-status-' . $area->id, 'unknown');
      $last = Cache::get('area-sync-last-' . $area->id);

      return response()->json([
        'data' => $rows,
        'sync' => [
          'status' => $status,
          'last_at' => $last instanceof \Carbon\Carbon ? $last->toIso8601String() : $last,
        ],
      ]);
    } catch (\Throwable $e) {
      return response()->json([
        'message' => 'Terjadi kesalahan saat mengambil data',
      ], 500);
    }
  }

  /**
   * Store a newly created area
   */
  public function storeArea(Request $request, $areaGroupId)
  {
    $request->validate([
      'name' => 'required|string|max:150',
      'description' => 'nullable|string',
      'geometry_json' => 'required|array',
      'province_id' => 'nullable|string|max:10',
      'province_name' => 'nullable|string|max:150',
      'regency_id' => 'nullable|string|max:10',
      'regency_name' => 'nullable|string|max:150',
      'district_id' => 'nullable|string|max:10',
      'district_name' => 'nullable|string|max:150',
      'village_id' => 'nullable|string|max:10',
      'village_name' => 'nullable|string|max:150',
      'is_slum' => 'nullable|boolean',
      'area_total_m2' => 'nullable|numeric|min:0',
    ]);

    $areaGroup = AreaGroup::findOrFail($areaGroupId);

    $area = $areaGroup->areas()->create([
      'name' => $request->name,
      'description' => $request->description,
      'geometry_json' => $request->geometry_json,
      'province_id' => $request->province_id,
      'province_name' => $request->province_name,
      'regency_id' => $request->regency_id,
      'regency_name' => $request->regency_name,
      'district_id' => $request->district_id,
      'district_name' => $request->district_name,
      'village_id' => $request->village_id,
      'village_name' => $request->village_name,
      'is_slum' => $request->boolean('is_slum'),
      'area_total_m2' => $request->area_total_m2,
    ]);

    return response()->json([
      'message' => 'Area berhasil ditambahkan',
      'area' => [
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
        'is_slum' => $area->is_slum,
        'area_total_m2' => $area->area_total_m2,
      ],
    ], 201);
  }

  /**
   * Update the specified area
   */
  public function updateArea(Request $request, $areaGroupId, $areaId)
  {
    $request->validate([
      'name' => 'required|string|max:150',
      'description' => 'nullable|string',
      'geometry_json' => 'required|array',
      'province_id' => 'nullable|string|max:10',
      'province_name' => 'nullable|string|max:150',
      'regency_id' => 'nullable|string|max:10',
      'regency_name' => 'nullable|string|max:150',
      'district_id' => 'nullable|string|max:10',
      'district_name' => 'nullable|string|max:150',
      'village_id' => 'nullable|string|max:10',
      'village_name' => 'nullable|string|max:150',
      'is_slum' => 'nullable|boolean',
      'area_total_m2' => 'nullable|numeric|min:0',
    ]);

    $area = Area::where('area_group_id', $areaGroupId)
      ->findOrFail($areaId);

    $area->update([
      'name' => $request->name,
      'description' => $request->description,
      'geometry_json' => $request->geometry_json,
      'province_id' => $request->province_id,
      'province_name' => $request->province_name,
      'regency_id' => $request->regency_id,
      'regency_name' => $request->regency_name,
      'district_id' => $request->district_id,
      'district_name' => $request->district_name,
      'village_id' => $request->village_id,
      'village_name' => $request->village_name,
      'is_slum' => $request->boolean('is_slum'),
      'area_total_m2' => $request->area_total_m2,
    ]);

    return response()->json([
      'message' => 'Area berhasil diperbarui',
      'area' => [
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
        'is_slum' => $area->is_slum,
        'area_total_m2' => $area->area_total_m2,
      ],
    ]);
  }

  /**
   * Delete the specified area
   */
  public function destroyArea(Request $request, $areaGroupId, $areaId)
  {
    $area = Area::where('area_group_id', $areaGroupId)
      ->findOrFail($areaId);

    $area->delete();

    return response()->json([
      'message' => 'Area berhasil dihapus',
    ]);
  }
}
