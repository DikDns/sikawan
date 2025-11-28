<?php

namespace App\Http\Controllers;

use App\Models\InfrastructureGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfrastructureGroupController extends Controller
{
  public function index(Request $request)
  {
    $groups = InfrastructureGroup::orderBy('name')
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
          'infrastructure_count' => $group->infrastructures()->count(),
        ];
      });

    $stats = [
      'totalGroups' => $groups->count(),
    ];

    return Inertia::render('infrastructure', [
      'groups' => $groups,
      'stats' => $stats,
    ]);
  }

  public function store(Request $request)
  {
    $request->validate([
      'code' => ['required', 'string', 'max:40', 'regex:/^[A-Z0-9_]+$/', 'unique:infrastructure_groups,code'],
      'name' => ['required', 'string', 'max:150'],
      'category' => ['required', 'string', 'in:Kesehatan,Pendidikan,Listrik,Air Bersih,Drainase,Sanitasi,Sampah,Jalan,Lainnya'],
      'type' => ['required', 'string', 'in:Marker,Polyline,Polygon'],
      'legend_color_hex' => ['nullable', 'string', 'regex:/^#(?:[0-9a-fA-F]{3}){1,2}$/'],
      'legend_icon' => ['nullable', 'string', 'in:hospital,graduation-cap,zap,droplet,trash-2,building-2'],
      'description' => ['nullable', 'string'],
    ]);

    InfrastructureGroup::create([
      'code' => $request->code,
      'name' => $request->name,
      'category' => $request->category,
      'type' => $request->type,
      'legend_color_hex' => $request->legend_color_hex,
      'legend_icon' => $request->legend_icon,
      'description' => $request->description,
      'infrastructure_count' => 0,
    ]);

    return redirect()->route('infrastructure')
      ->with('success', 'Kelompok PSU berhasil ditambahkan');
  }

  public function update(Request $request, $id)
  {
    $request->validate([
      'code' => ['required', 'string', 'max:40', 'regex:/^[A-Z0-9_]+$/', 'unique:infrastructure_groups,code,' . $id],
      'name' => ['required', 'string', 'max:150'],
      'category' => ['required', 'string', 'in:Kesehatan,Pendidikan,Listrik,Air Bersih,Drainase,Sanitasi,Sampah,Jalan,Lainnya'],
      'type' => ['required', 'string', 'in:Marker,Polyline,Polygon'],
      'legend_color_hex' => ['nullable', 'string', 'regex:/^#(?:[0-9a-fA-F]{3}){1,2}$/'],
      'legend_icon' => ['nullable', 'string', 'in:hospital,graduation-cap,zap,droplet,trash-2,building-2'],
      'description' => ['nullable', 'string'],
    ]);

    $group = InfrastructureGroup::findOrFail($id);
    $group->update([
      'code' => $request->code,
      'name' => $request->name,
      'category' => $request->category,
      'type' => $request->type,
      'legend_color_hex' => $request->legend_color_hex,
      'legend_icon' => $request->legend_icon,
      'description' => $request->description,
    ]);

    return redirect()->route('infrastructure')
      ->with('success', 'Kelompok PSU berhasil diperbarui');
  }

  public function destroy(Request $request, $id)
  {
    $group = InfrastructureGroup::findOrFail($id);
    $group->delete();

    return redirect()->route('infrastructure')
      ->with('success', 'Kelompok PSU berhasil dihapus');
  }
}
