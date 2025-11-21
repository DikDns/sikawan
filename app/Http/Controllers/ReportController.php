<?php

namespace App\Http\Controllers;

use App\Models\Household\Household;
use App\Models\InfrastructureGroup;
use App\Models\AreaGroup;
use App\Models\Report;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index() {
        $reports = Report::all();
        $houses = Household::all();
        $infrastructures = InfrastructureGroup::all();
        $areas = AreaGroup::all();
        return Inertia::render('reports', [
            'reports' => $reports,
            'houses' => $houses,
            'infrastructures' => $infrastructures,
            'areas' => $areas,
        ]);
    }

    public function store(Request $request) {
        $format = $request->input('format');
        $request->validate([
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'type'        => 'required|in:RUMAH,KAWASAN,PSU,UMUM',
            'format'      => 'required|in:PDF,EXCEL',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $start = $request->start_date ? date($request->start_date) : null;
        $end   = $request->end_date ? date($request->end_date) : null;

        $data = [];

        if ($request->type === 'RUMAH') {
            $data = Household::query()
                ->when($start, fn($q) => $q->whereDate('created_at', '>=', $start))
                ->when($end, fn($q) => $q->whereDate('created_at', '<=', $end))
                ->get();
        }

        if ($request->type === 'PSU') {
            $data = InfrastructureGroup::query()
                ->when($start, fn($q) => $q->whereDate('created_at', '>=', $start))
                ->when($end, fn($q) => $q->whereDate('created_at', '<=', $end))
                ->get();
        }

        if ($request->type === 'KAWASAN') {
            $data = AreaGroup::query()
                ->when($start, fn($q) => $q->whereDate('created_at', '>=', $start))
                ->when($end, fn($q) => $q->whereDate('created_at', '<=', $end))
                ->get();
        }

        if ($request->type === 'UMUM') {
            $houses = Household::query()
                ->when($start, fn($q) => $q->whereDate('created_at', '>=', $start))
                ->when($end, fn($q) => $q->whereDate('created_at', '<=', $end))
                ->get();

            $infrastructures = InfrastructureGroup::query()
                ->when($start, fn($q) => $q->whereDate('created_at', '>=', $start))
                ->when($end, fn($q) => $q->whereDate('created_at', '<=', $end))
                ->get();

            $areas = AreaGroup::query()
                ->when($start, fn($q) => $q->whereDate('created_at', '>=', $start))
                ->when($end, fn($q) => $q->whereDate('created_at', '<=', $end))
                ->get();

            $data = [
                'houses' => $houses,
                'psu'    => $infrastructures,
                'areas'  => $areas,
            ];
        }

        $report = Report::create([
            'title'         => $request->title,
            'description'   => $request->description,
            'type'          => $request->type,
            'category'      => $request->type,
            'generated_by'  => Auth::id(),
            'start_date'    => $request->start_date,
            'end_date'      => $request->end_date,
            'status'        => 'GENERATED',
            'metadata_json' => json_encode([
                'total_records' => is_array($data) ? count($data ?? []) : (is_countable($data) ? count($data) : 0)
            ]),
        ]);

        $cleanTitle = Str::slug($request->title);

        if (!File::exists(storage_path('app/public/reports'))) {
            File::makeDirectory(storage_path('app/public/reports'), 0775, true, true);
        }

        $extension = $format === 'EXCEL' ? 'xlsx' : 'pdf';

        $fileName = strtoupper($request->type) . '_' . $cleanTitle . '_' . time() . '.' . $extension;
        $filePath = "reports/" . $fileName;

        if ($format === 'PDF') {
            $pdf = Pdf::loadView('reports.pdf', [
                'title' => $request->title,
                'description' => $request->description,
                'type' => $request->type,
                'data' => $data,
                'start' => $start,
                'end' => $end,
            ]);

            File::put(storage_path("app/public/$filePath"), $pdf->output());
        }

        if ($format === 'EXCEL') {

            $export = new \App\Exports\GenericReportExport($data);

            Excel::store($export, $filePath, 'public');
        }

        $report->update([
            'file_path' => $filePath
        ]);

        return redirect()->back()->with([
            'success' => [
                'message' => 'Laporan berhasil digenerate.',
                'download_url' => asset('storage/' . $filePath),
            ],
        ]);
    }

    public function update(Request $request, $report_id) {
        $report = Report::findOrFail($report_id);

        $request->validate([
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
        ]);

        $report->update([
            'title'       => $request->title,
            'description' => $request->description,
            'start_date'  => $request->start_date,
            'end_date'    => $request->end_date,
        ]);

        return redirect()->back()->with([
            'success' => [
                'message' => 'Data Laporan berhasil diperbarui.',
            ],
        ]);
    }

    public function destroy(Request $request) {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:reports,id',
        ]);

        $ids = $request->ids;

        $reports = Report::whereIn('id', $ids)->get();

        foreach ($reports as $report) {
            if ($report->file_path && Storage::disk('public')->exists($report->file_path)) {
                Storage::disk('public')->delete($report->file_path);
            }

            $report->delete();
        }

        return redirect()->back()->with([
            'success' => [
                'message' => count($ids) . ' laporan berhasil dihapus.',
            ],
        ]);
    }

    public function download($filePath) {
        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, 'File tidak ditemukan.');
        }

        $fullPath = Storage::disk('public')->path($filePath);
        $fileName = basename($filePath);

        return response()->download($fullPath, $fileName, [
            'Content-Type' => Storage::mimeType($fullPath)
        ]);
    }
}
