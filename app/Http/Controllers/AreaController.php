<?php

namespace App\Http\Controllers;

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
        $areaGroup = AreaGroup::findOrFail($id);

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

        return Inertia::render('areas/detail', [
            'areaGroup' => $groupData,
        ]);
    }
}
