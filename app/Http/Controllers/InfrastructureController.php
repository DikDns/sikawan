<?php

namespace App\Http\Controllers;

use App\Models\InfrastructureGroup;
use App\Models\Infrastructure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfrastructureController extends Controller
{
  public function show(Request $request, int $id)
  {
    $group = InfrastructureGroup::with('infrastructures')->findOrFail($id);

    $groupData = [
      'id' => $group->id,
      'code' => $group->code,
      'name' => $group->name,
      'category' => $group->category,
      'type' => $group->type,
      'legend_color_hex' => $group->legend_color_hex,
      'legend_icon' => $group->legend_icon,
      'description' => $group->description,
    ];

    $items = $group->infrastructures->map(function ($item) {
      return [
        'id' => $item->id,
        'name' => $item->name,
        'description' => $item->description,
        'geometry_type' => $item->geometry_type,
        'geometry_json' => $item->geometry_json,
      ];
    });

    return Inertia::render('infrastructure/detail', [
      'group' => $groupData,
      'items' => $items,
    ]);
  }

  public function store(Request $request, int $groupId)
  {
    $group = InfrastructureGroup::findOrFail($groupId);

    $expectedGeometryType = match ($group->type) {
      'Marker' => 'Point',
      'Polyline' => 'LineString',
      'Polygon' => 'Polygon',
      default => null,
    };

    $request->validate([
      'name' => 'required|string|max:150',
      'description' => 'nullable|string',
      'geometry_type' => 'required|string|in:Point,LineString,Polygon',
      'geometry_json' => 'required|array',
    ]);

    if ($expectedGeometryType && $request->geometry_type !== $expectedGeometryType) {
      return response()->json([
        'message' => 'Tipe geometri tidak sesuai dengan tipe kelompok',
      ], 422);
    }

    $item = $group->infrastructures()->create([
      'name' => $request->name,
      'description' => $request->description,
      'geometry_type' => $request->geometry_type,
      'geometry_json' => $request->geometry_json,
    ]);

    return response()->json([
      'message' => 'PSU berhasil ditambahkan',
      'data' => [
        'item' => [
          'id' => $item->id,
          'name' => $item->name,
          'description' => $item->description,
          'geometry_type' => $item->geometry_type,
          'geometry_json' => $item->geometry_json,
        ],
      ],
    ], 201);
  }

  public function update(Request $request, int $groupId, int $itemId)
  {
    $item = Infrastructure::where('infrastructure_group_id', $groupId)->findOrFail($itemId);

    $request->validate([
      'name' => 'required|string|max:150',
      'description' => 'nullable|string',
      'geometry_type' => 'nullable|string|in:Point,LineString,Polygon',
      'geometry_json' => 'nullable|array',
    ]);

    $item->update([
      'name' => $request->name,
      'description' => $request->description ?? $item->description,
      'geometry_type' => $request->geometry_type ?? $item->geometry_type,
      'geometry_json' => $request->geometry_json ?? $item->geometry_json,
    ]);

    return response()->json([
      'message' => 'PSU berhasil diperbarui',
      'data' => [
        'item' => [
          'id' => $item->id,
          'name' => $item->name,
          'description' => $item->description,
          'geometry_type' => $item->geometry_type,
          'geometry_json' => $item->geometry_json,
        ],
      ],
    ]);
  }

  public function destroy(Request $request, int $groupId, int $itemId)
  {
    $item = Infrastructure::where('infrastructure_group_id', $groupId)->findOrFail($itemId);
    $item->delete();

    return response()->json([
      'message' => 'PSU berhasil dihapus',
    ]);
  }
}
