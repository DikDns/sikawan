<?php

namespace App\Http\Controllers;

use App\Models\AreaGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    /**
     * Display a listing of area groups with aggregated counts
     */
    public function index(Request $request)
    {
        $query = AreaGroup::withCounts()
            ->where('is_active', true)
            ->orderBy('name');

        // Get all area groups with aggregated data
        $areaGroups = $query->get()->map(function ($group) {
            return [
                'id' => $group->id,
                'code' => $group->code,
                'name' => $group->name,
                'description' => $group->description,
                'legend_color_hex' => $group->legend_color_hex,
                'legend_icon' => $group->legend_icon,
                'is_active' => $group->is_active,
                'feature_count' => $group->features_count ?? 0,
                'household_count' => (int) ($group->features_sum_household_count ?? 0),
                'family_count' => (int) ($group->features_sum_family_count ?? 0),
            ];
        });

        // Calculate statistics
        $stats = [
            'totalGroups' => $areaGroups->count(),
            'totalFeatures' => $areaGroups->sum('feature_count'),
            'totalHouseholds' => $areaGroups->sum('household_count'),
        ];

        return Inertia::render('areas', [
            'areaGroups' => $areaGroups,
            'stats' => $stats,
        ]);
    }

    /**
     * Display the specified area group with its features
     */
    public function show(Request $request, $id)
    {
        $areaGroup = AreaGroup::withCounts()
            ->with(['features' => function ($query) {
                $query->where('is_visible', true)
                    ->orderBy('name');
            }])
            ->findOrFail($id);

        // Format area group data
        $groupData = [
            'id' => $areaGroup->id,
            'code' => $areaGroup->code,
            'name' => $areaGroup->name,
            'description' => $areaGroup->description,
            'legend_color_hex' => $areaGroup->legend_color_hex,
            'legend_icon' => $areaGroup->legend_icon,
            'is_active' => $areaGroup->is_active,
            'feature_count' => $areaGroup->features_count ?? 0,
            'household_count' => (int) ($areaGroup->features_sum_household_count ?? 0),
            'family_count' => (int) ($areaGroup->features_sum_family_count ?? 0),
        ];

        // Format features data
        $features = $areaGroup->features->map(function ($feature) use ($areaGroup) {
            return [
                'id' => $feature->id,
                'name' => $feature->name,
                'description' => $feature->description,
                'geometry_type' => $feature->geometry_type,
                'geometry_json' => $feature->geometry_json,
                'centroid_lat' => $feature->centroid_lat,
                'centroid_lng' => $feature->centroid_lng,
                'household_count' => $feature->household_count ?? 0,
                'family_count' => $feature->family_count ?? 0,
                'is_visible' => $feature->is_visible,
                'province_id' => $feature->province_id,
                'province_name' => $feature->province_name,
                'regency_id' => $feature->regency_id,
                'regency_name' => $feature->regency_name,
                'district_id' => $feature->district_id,
                'district_name' => $feature->district_name,
                'village_id' => $feature->village_id,
                'village_name' => $feature->village_name,
            ];
        });

        return Inertia::render('areas/detail', [
            'areaGroup' => $groupData,
            'features' => $features,
        ]);
    }
}
