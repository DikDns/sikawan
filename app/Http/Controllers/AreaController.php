<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\AreaGroup;
use Illuminate\Http\Request;
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
            ];
        });

        return Inertia::render('areas/detail', [
            'areaGroup' => $groupData,
            'areas' => $areas,
        ]);
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
