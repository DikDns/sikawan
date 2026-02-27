<?php

namespace App\Http\Controllers;

use App\Models\AreaGroup;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AreaGroupController extends Controller
{
    /**
     * Show create form
     */
    public function create()
    {
        return Inertia::render('areas/create');
    }

    /**
     * Store a new area group
     */
    public function store(Request $request)
    {
        // Uppercase code before validation for proper unique check
        $request->merge(['code' => strtoupper($request->code)]);

        $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('area_groups', 'code')],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'is_slum' => ['nullable', 'boolean'],
            'legend_color_hex' => ['required', 'string', 'regex:/^#(?:[0-9a-fA-F]{3}){1,2}$/'],
            'legend_icon' => ['nullable', 'string', 'max:150'],
            'geometry_json' => ['nullable', 'array'],
            'centroid_lat' => ['nullable', 'numeric'],
            'centroid_lng' => ['nullable', 'numeric'],
        ]);

        $group = AreaGroup::create([
            'code' => $request->code,
            'name' => $request->name,
            'description' => $request->description,
            'is_slum' => $request->boolean('is_slum'),
            'legend_color_hex' => $request->legend_color_hex,
            'legend_icon' => $request->legend_icon,
            'geometry_json' => $request->geometry_json,
            'centroid_lat' => $request->centroid_lat,
            'centroid_lng' => $request->centroid_lng,
        ]);

        return redirect()->route('areas')
            ->with('success', 'Kawasan berhasil dibuat (ID: ' . $group->id . ').');
    }

    /**
     * Show edit form
     */
    public function edit(int $id)
    {
        $group = AreaGroup::findOrFail($id);

        return Inertia::render('areas/edit', [
            'group' => $group,
        ]);
    }

    /**
     * Update an area group
     */
    public function update(Request $request, int $id)
    {
        // Uppercase code before validation for proper unique check
        $request->merge(['code' => strtoupper($request->code)]);

        $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('area_groups', 'code')->ignore($id)],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'is_slum' => ['nullable', 'boolean'],
            'legend_color_hex' => ['required', 'string', 'regex:/^#(?:[0-9a-fA-F]{3}){1,2}$/'],
            'legend_icon' => ['nullable', 'string', 'max:150'],
            'geometry_json' => ['nullable', 'array'],
            'centroid_lat' => ['nullable', 'numeric'],
            'centroid_lng' => ['nullable', 'numeric'],
        ]);

        $group = AreaGroup::findOrFail($id);
        $group->update([
            'code' => $request->code,
            'name' => $request->name,
            'description' => $request->description,
            'is_slum' => $request->boolean('is_slum'),
            'legend_color_hex' => $request->legend_color_hex,
            'legend_icon' => $request->legend_icon,
            'geometry_json' => $request->geometry_json,
            'centroid_lat' => $request->centroid_lat,
            'centroid_lng' => $request->centroid_lng,
        ]);

        return redirect()->route('areas')
            ->with('success', 'Kawasan berhasil diperbarui (ID: ' . $group->id . ').');
    }

    /**
     * Delete an area group
     */
    public function destroy(Request $request, int $id)
    {
        $group = AreaGroup::findOrFail($id);
        $group->delete();

        return redirect()->route('areas')
            ->with('success', 'Kawasan berhasil dihapus.');
    }
}
