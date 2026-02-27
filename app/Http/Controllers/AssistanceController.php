<?php

namespace App\Http\Controllers;

use App\Models\Household\Assistance;
use App\Models\Household\Household;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssistanceController extends Controller
{
    /**
     * Get all assistances for a household
     */
    public function index(Request $request, $householdId)
    {
        $user = $request->user();

        // Verify household belongs to user
        $household = Household::where('id', $householdId)
            ->where('created_by', $user->id)
            ->firstOrFail();

        $assistances = $household->assistances()
            ->orderBy('started_at', 'desc')
            ->get();

        return response()->json([
            'assistances' => $assistances,
        ]);
    }

    /**
     * Store a new assistance
     */
    public function store(Request $request, $householdId)
    {
        $user = $request->user();

        // Verify household belongs to user
        $household = Household::where('id', $householdId)
            ->where('created_by', $user->id)
            ->firstOrFail();

        $validated = $request->validate([
            'assistance_type' => 'required|string|in:RELOKASI,REHABILITASI,BSPS,LAINNYA',
            'program' => 'nullable|string|max:100',
            'funding_source' => 'nullable|string|max:80',
            'status' => 'required|string|in:SELESAI,PROSES,DIBATALKAN',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'cost_amount_idr' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            'photos' => 'nullable|array|max:10',
            'photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120', // 5MB each
        ]);

        // Handle document upload
        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('assistance-documents', 'public');
        }

        // Handle multiple photo uploads
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photoPaths[] = $photo->store('assistance-photos', 'public');
            }
        }

        $assistance = $household->assistances()->create([
            'assistance_type' => $validated['assistance_type'],
            'program' => $validated['program'] ?? null,
            'funding_source' => $validated['funding_source'] ?? null,
            'status' => $validated['status'],
            'started_at' => $validated['started_at'] ?? null,
            'completed_at' => $validated['completed_at'] ?? null,
            'cost_amount_idr' => $validated['cost_amount_idr'] ?? null,
            'description' => $validated['description'] ?? null,
            'document_path' => $documentPath,
            'photo_paths' => !empty($photoPaths) ? $photoPaths : null,
        ]);

        return response()->json([
            'assistance' => $assistance,
            'message' => 'Bantuan berhasil ditambahkan',
        ], 201);
    }

    /**
     * Update an assistance
     */
    public function update(Request $request, $householdId, $assistanceId)
    {
        $user = $request->user();

        // Verify household belongs to user
        $household = Household::where('id', $householdId)
            ->where('created_by', $user->id)
            ->firstOrFail();

        $assistance = $household->assistances()->findOrFail($assistanceId);

        $validated = $request->validate([
            'assistance_type' => 'required|string|in:RELOKASI,REHABILITASI,BSPS,LAINNYA',
            'program' => 'nullable|string|max:100',
            'funding_source' => 'nullable|string|max:80',
            'status' => 'required|string|in:SELESAI,PROSES,DIBATALKAN',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'cost_amount_idr' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'photos' => 'nullable|array|max:10',
            'photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'remove_photo_paths' => 'nullable|array',
            'remove_photo_paths.*' => 'nullable|string',
        ]);

        // Handle document upload
        if ($request->hasFile('document')) {
            // Delete old document if exists
            if ($assistance->document_path && Storage::disk('public')->exists($assistance->document_path)) {
                Storage::disk('public')->delete($assistance->document_path);
            }
            $validated['document_path'] = $request->file('document')->store('assistance-documents', 'public');
        }

        // Handle new photo uploads — merge with existing, then remove requested
        $existingPhotos = $assistance->photo_paths ?? [];

        // Remove photos flagged for deletion
        $toRemove = $validated['remove_photo_paths'] ?? [];
        foreach ($toRemove as $path) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
            $existingPhotos = array_values(array_filter($existingPhotos, fn($p) => $p !== $path));
        }

        // Append new photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $existingPhotos[] = $photo->store('assistance-photos', 'public');
            }
        }

        $assistance->update([
            'assistance_type' => $validated['assistance_type'],
            'program' => $validated['program'] ?? null,
            'funding_source' => $validated['funding_source'] ?? null,
            'status' => $validated['status'],
            'started_at' => $validated['started_at'] ?? null,
            'completed_at' => $validated['completed_at'] ?? null,
            'cost_amount_idr' => $validated['cost_amount_idr'] ?? null,
            'description' => $validated['description'] ?? null,
            'document_path' => $validated['document_path'] ?? $assistance->document_path,
            'photo_paths' => !empty($existingPhotos) ? array_values($existingPhotos) : null,
        ]);

        return response()->json([
            'assistance' => $assistance->fresh(),
            'message' => 'Bantuan berhasil diperbarui',
        ]);
    }

    /**
     * Update only the status of an assistance
     */
    public function updateStatus(Request $request, $householdId, $assistanceId)
    {
        $user = $request->user();

        // Verify household belongs to user
        $household = Household::where('id', $householdId)
            ->where('created_by', $user->id)
            ->firstOrFail();

        $assistance = $household->assistances()->findOrFail($assistanceId);

        $validated = $request->validate([
            'status' => 'required|string|in:SELESAI,PROSES,DIBATALKAN',
        ]);

        $assistance->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'assistance' => $assistance->fresh(),
            'message' => 'Status bantuan berhasil diperbarui',
        ]);
    }

    /**
     * Delete an assistance
     */
    public function destroy(Request $request, $householdId, $assistanceId)
    {
        $user = $request->user();

        // Verify household belongs to user
        $household = Household::where('id', $householdId)
            ->where('created_by', $user->id)
            ->firstOrFail();

        $assistance = $household->assistances()->findOrFail($assistanceId);

        // Delete document if exists
        if ($assistance->document_path && Storage::disk('public')->exists($assistance->document_path)) {
            Storage::disk('public')->delete($assistance->document_path);
        }

        // Delete all photos if any
        foreach (($assistance->photo_paths ?? []) as $photoPath) {
            if (Storage::disk('public')->exists($photoPath)) {
                Storage::disk('public')->delete($photoPath);
            }
        }

        $assistance->delete();

        return response()->json([
            'message' => 'Bantuan berhasil dihapus',
        ]);
    }
}
