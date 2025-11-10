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
}
