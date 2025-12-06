<?php

namespace App\Http\Controllers;

use App\Models\AreaGroup;
use App\Models\InfrastructureGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicDistributionMapController extends Controller
{
  public function index(Request $request)
  {
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
            'habitability_status' => $h->habitability_status,
            'province_name' => $h->province_name,
            'regency_name' => $h->regency_name,
            'district_name' => $h->district_name,
            'village_name' => $h->village_name,
          ];
        });

      $areaGroups = AreaGroup::with('areas')
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

      $infrastructureGroups = InfrastructureGroup::with('infrastructures')
        ->orderBy('name')
        ->get()
        ->map(function ($group) {
          return [
            'id' => $group->id,
            'code' => $group->code,
            'name' => $group->name,
            'category' => $group->category,
            'type' => $group->type,
            'legend_color_hex' => $group->legend_color_hex,
            'legend_icon' => $group->legend_icon,
            'description' => $group->description,
            'items' => $group->infrastructures->map(function ($item) use ($group) {
              return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'geometry_type' => $item->geometry_type,
                'geometry_json' => $item->geometry_json,
                'color' => $group->legend_color_hex,
              ];
            }),
          ];
        });

      return Inertia::render('public-distribution-map', [
        'households' => $households,
        'areaGroups' => $areaGroups,
        'infrastructureGroups' => $infrastructureGroups,
      ]);
    } catch (\Throwable $e) {
      return Inertia::render('public-distribution-map', [
        'households' => [],
        'areaGroups' => [],
        'infrastructureGroups' => [],
        'error' => 'Gagal memuat data: ' . $e->getMessage(),
      ]);
    }
  }
}

