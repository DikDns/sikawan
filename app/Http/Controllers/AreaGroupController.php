<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAreaGroupRequest;
use App\Http\Requests\UpdateAreaGroupRequest;
use App\Models\AreaGroup;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

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
    public function store(StoreAreaGroupRequest $request): RedirectResponse
    {
        $payload = $request->validated();

        // Normalize code to uppercase (server-side safety)
        if (isset($payload['code'])) {
            $payload['code'] = strtoupper($payload['code']);
        }

        $group = AreaGroup::create($payload);

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
          'group' => $group
        ]);
    }

    /**
     * Update an area group
     */
    public function update(UpdateAreaGroupRequest $request, int $id): RedirectResponse
    {
        $group = AreaGroup::findOrFail($id);
        $payload = $request->validated();

        if (isset($payload['code'])) {
            $payload['code'] = strtoupper($payload['code']);
        }

        $group->update($payload);

        return redirect()->route('areas')
            ->with('success', 'Kawasan berhasil diperbarui (ID: ' . $group->id . ').');
    }

    /**
     * Delete an area group
     */
    public function destroy(int $id): RedirectResponse
    {
        $group = AreaGroup::findOrFail($id);
        $group->delete();

        return redirect()->route('areas')
            ->with('success', 'Kawasan berhasil dihapus.');
    }
}
