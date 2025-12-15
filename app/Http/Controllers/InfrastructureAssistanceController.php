<?php

namespace App\Http\Controllers;

use App\Models\Infrastructure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InfrastructureAssistanceController extends Controller
{
    /**
     * Get all assistances for an infrastructure item
     */
    public function index(Request $request, $infrastructureId)
    {
        $infrastructure = Infrastructure::findOrFail($infrastructureId);

        $assistances = $infrastructure->assistances()
            ->orderBy('started_at', 'desc')
            ->get();

        return response()->json([
            'assistances' => $assistances,
        ]);
    }

    /**
     * Store a new assistance for an infrastructure item
     */
    public function store(Request $request, $infrastructureId)
    {
        $infrastructure = Infrastructure::findOrFail($infrastructureId);

        $validated = $request->validate([
            'assistance_type' => 'required|string|in:RELOKASI,REHABILITASI,BSPS,LAINNYA',
            'program' => 'nullable|string|max:100',
            'funding_source' => 'nullable|string|max:80',
            'status' => 'required|string|in:SELESAI,PROSES,DIBATALKAN',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'cost_amount_idr' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        // Handle document upload
        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('infrastructure-assistance-documents', 'public');
        }

        $assistance = $infrastructure->assistances()->create([
            'assistance_type' => $validated['assistance_type'],
            'program' => $validated['program'] ?? null,
            'funding_source' => $validated['funding_source'] ?? null,
            'status' => $validated['status'],
            'started_at' => $validated['started_at'] ?? null,
            'completed_at' => $validated['completed_at'] ?? null,
            'cost_amount_idr' => $validated['cost_amount_idr'] ?? null,
            'description' => $validated['description'] ?? null,
            'document_path' => $documentPath,
        ]);

        return response()->json([
            'assistance' => $assistance,
            'message' => 'Riwayat perbaikan berhasil ditambahkan',
        ], 201);
    }

    /**
     * Update an assistance
     */
    public function update(Request $request, $infrastructureId, $assistanceId)
    {
        $infrastructure = Infrastructure::findOrFail($infrastructureId);
        $assistance = $infrastructure->assistances()->findOrFail($assistanceId);

        $validated = $request->validate([
            'assistance_type' => 'required|string|in:RELOKASI,REHABILITASI,BSPS,LAINNYA',
            'program' => 'nullable|string|max:100',
            'funding_source' => 'nullable|string|max:80',
            'status' => 'required|string|in:SELESAI,PROSES,DIBATALKAN',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'cost_amount_idr' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        // Handle document upload
        if ($request->hasFile('document')) {
            // Delete old document if exists
            if ($assistance->document_path && Storage::disk('public')->exists($assistance->document_path)) {
                Storage::disk('public')->delete($assistance->document_path);
            }
            $validated['document_path'] = $request->file('document')->store('infrastructure-assistance-documents', 'public');
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
        ]);

        return response()->json([
            'assistance' => $assistance->fresh(),
            'message' => 'Riwayat perbaikan berhasil diperbarui',
        ]);
    }

    /**
     * Delete an assistance
     */
    public function destroy(Request $request, $infrastructureId, $assistanceId)
    {
        $infrastructure = Infrastructure::findOrFail($infrastructureId);
        $assistance = $infrastructure->assistances()->findOrFail($assistanceId);

        // Delete document if exists
        if ($assistance->document_path && Storage::disk('public')->exists($assistance->document_path)) {
            Storage::disk('public')->delete($assistance->document_path);
        }

        $assistance->delete();

        return response()->json([
            'message' => 'Riwayat perbaikan berhasil dihapus',
        ]);
    }
}
