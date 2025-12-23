<?php

namespace App\Http\Controllers;

use App\Models\Infrastructure;
use App\Models\InfrastructureGroup;
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
                'condition_status' => $item->condition_status,
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
            'condition_status' => 'required|string|in:baik,rusak_ringan,rusak_berat',
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
            'condition_status' => $request->condition_status,
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
                    'condition_status' => $item->condition_status,
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
            'condition_status' => 'nullable|string|in:baik,rusak_ringan,rusak_berat',
        ]);

        $item->update([
            'name' => $request->name,
            'description' => $request->description ?? $item->description,
            'geometry_type' => $request->geometry_type ?? $item->geometry_type,
            'geometry_json' => $request->geometry_json ?? $item->geometry_json,
            'condition_status' => $request->condition_status ?? $item->condition_status,
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
                    'condition_status' => $item->condition_status,
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
