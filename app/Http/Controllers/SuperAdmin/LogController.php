<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index(Request $request)
    {
        // Gate::authorize('viewAny', AuditLog::class);

        $userId = $request->query('user_id');
        $entity = $request->query('model');
        $start = $request->query('start_date');
        $end = $request->query('end_date');
        $page = (int) ($request->query('page') ?: 1);

        $q = AuditLog::query()
            ->when($userId, fn ($qq) => $qq->where('user_id', $userId))
            ->when($entity, fn ($qq) => $qq->where('entity_type', $entity))
            ->when($start, fn ($qq) => $qq->whereDate('created_at', '>=', $start))
            ->when($end, fn ($qq) => $qq->whereDate('created_at', '<=', $end))
            ->orderByDesc('created_at');

        $logs = $q->paginate(15, ['*'], 'page', $page);

        $fieldLabels = $this->getFieldLabels();

        $items = collect($logs->items())->map(function ($log) use ($fieldLabels) {
            $metadata = $log->metadata_json;

            // Translate metadata keys to Indonesian
            if (is_array($metadata)) {
                if (isset($metadata['before']) || isset($metadata['after'])) {
                    // Handle UPDATE action with before/after
                    if (isset($metadata['before']) && is_array($metadata['before'])) {
                        $newBefore = [];
                        foreach ($metadata['before'] as $k => $v) {
                            $label = $fieldLabels[$k] ?? ucwords(str_replace('_', ' ', $k));
                            $newBefore[$label] = $v;
                        }
                        $metadata['before'] = $newBefore;
                    }
                    if (isset($metadata['after']) && is_array($metadata['after'])) {
                        $newAfter = [];
                        foreach ($metadata['after'] as $k => $v) {
                            $label = $fieldLabels[$k] ?? ucwords(str_replace('_', ' ', $k));
                            $newAfter[$label] = $v;
                        }
                        $metadata['after'] = $newAfter;
                    }
                } else {
                    // Handle CREATE/DELETE action (flat attributes)
                    $newMetadata = [];
                    foreach ($metadata as $k => $v) {
                        $label = $fieldLabels[$k] ?? ucwords(str_replace('_', ' ', $k));
                        $newMetadata[$label] = $v;
                    }
                    $metadata = $newMetadata;
                }
            }

            return [
                'id' => $log->id,
                'user_id' => $log->user_id,
                'user_name' => optional($log->user)->name,
                'action' => $log->action,
                'entity_type' => $log->entity_type,
                'entity_id' => $log->entity_id,
                'metadata_json' => $metadata,
                'created_at' => $log->created_at?->toDateTimeString(),
            ];
        });

        $users = User::select('id', 'name')->orderBy('name')->get();

        // Mapping nama model teknis ke nama yang ramah pengguna
        $entityNames = [
            'AuditLog' => 'Log Aktivitas',
            'Area' => 'Kawasan',
            'AreaGroup' => 'Kelompok Kawasan',
            'Infrastructure' => 'PSU',
            'InfrastructureAssistance' => 'Riwayat Perbaikan PSU',
            'InfrastructureGroup' => 'Kelompok PSU',
            'Message' => 'Pesan',
            'Media' => 'Media',
            'RelocationAssessment' => 'Penilaian Relokasi',
            'Report' => 'Laporan',
            'User' => 'Pengguna',
            'Assistance' => 'Bantuan',
            'Household' => 'Rumah',
            'Member' => 'Anggota Keluarga',
            'Photo' => 'Foto',
            'Score' => 'Skor',
            'TechnicalData' => 'Data Teknis',
            'City' => 'Kota/Kabupaten',
            'Province' => 'Provinsi',
            'SubDistrict' => 'Kecamatan',
            'Village' => 'Desa/Kelurahan',
        ];

        $models = collect([
            AuditLog::class,
            \App\Models\Area::class,
            \App\Models\AreaGroup::class,
            \App\Models\Infrastructure::class,
            \App\Models\InfrastructureAssistance::class,
            \App\Models\InfrastructureGroup::class,
            \App\Models\Message::class,
            \App\Models\Media::class,
            \App\Models\RelocationAssessment::class,
            \App\Models\Report::class,
            \App\Models\User::class,
            \App\Models\Household\Assistance::class,
            \App\Models\Household\Household::class,
            \App\Models\Household\Member::class,
            \App\Models\Household\Photo::class,
            \App\Models\Household\Score::class,
            \App\Models\Household\TechnicalData::class,
            \App\Models\Wilayah\City::class,
            \App\Models\Wilayah\Province::class,
            \App\Models\Wilayah\SubDistrict::class,
            \App\Models\Wilayah\Village::class,
        ])->map(fn ($c) => [
            'name' => $entityNames[class_basename($c)] ?? class_basename($c),
            'value' => $c,
        ])->sortBy('name')->values();

        return Inertia::render('superadmin/logs', [
            'logs' => [
                'data' => $items,
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
            'filters' => [
                'users' => $users,
                'models' => $models,
                'applied' => [
                    'user_id' => $userId,
                    'model' => $entity,
                    'start_date' => $start,
                    'end_date' => $end,
                ],
            ],
        ]);
    }

    /**
     * Get comprehensive field labels mapping from English to Indonesian
     */
    private function getFieldLabels(): array
    {
        return [
            // Common fields
            'id' => 'ID',
            'created_at' => 'Dibuat Pada',
            'updated_at' => 'Diperbarui Pada',
            'deleted_at' => 'Dihapus Pada',
            'created_by' => 'Dibuat Oleh',
            'updated_by' => 'Diperbarui Oleh',
            'name' => 'Nama',
            'description' => 'Deskripsi',
            'status' => 'Status',
            'type' => 'Tipe',
            'code' => 'Kode',
            'notes' => 'Catatan',

            // User fields
            'email' => 'Email',
            'email_verified_at' => 'Email Diverifikasi Pada',
            'password' => 'Kata Sandi',
            'remember_token' => 'Token Remember',
            'two_factor_secret' => 'Rahasia 2FA',
            'two_factor_recovery_codes' => 'Kode Pemulihan 2FA',
            'two_factor_confirmed_at' => '2FA Dikonfirmasi Pada',

            // Location/Wilayah fields
            'province_id' => 'ID Provinsi',
            'province_name' => 'Provinsi',
            'regency_id' => 'ID Kabupaten/Kota',
            'regency_name' => 'Kabupaten/Kota',
            'district_id' => 'ID Kecamatan',
            'district_name' => 'Kecamatan',
            'village_id' => 'ID Desa/Kelurahan',
            'village_name' => 'Desa/Kelurahan',
            'rt_rw' => 'RT/RW',
            'address_text' => 'Alamat Lengkap',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',

            // Household fields
            'survey_date' => 'Tanggal Survei',
            'ownership_status_building' => 'Status Kepemilikan Bangunan',
            'ownership_status_land' => 'Status Kepemilikan Lahan',
            'building_legal_status' => 'Legalitas Bangunan',
            'land_legal_status' => 'Legalitas Lahan',
            'head_name' => 'Nama Kepala Keluarga',
            'nik' => 'NIK',
            'status_mbr' => 'Status MBR',
            'kk_count' => 'Jumlah KK',
            'member_total' => 'Total Anggota Keluarga',
            'male_count' => 'Jumlah Laki-laki',
            'female_count' => 'Jumlah Perempuan',
            'disabled_count' => 'Jumlah Disabilitas',
            'main_occupation' => 'Pekerjaan Utama',
            'monthly_income_idr' => 'Pendapatan Bulanan (IDR)',
            'health_facility_used' => 'Fasilitas Kesehatan Digunakan',
            'health_facility_location' => 'Lokasi Fasilitas Kesehatan',
            'education_facility_location' => 'Lokasi Fasilitas Pendidikan',
            'habitability_status' => 'Status Layak Huni',
            'eligibility_score_total' => 'Total Skor Kelayakan',
            'eligibility_computed_at' => 'Waktu Hitung Kelayakan',
            'area_id' => 'ID Kawasan',
            'is_draft' => 'Draft',

            // Member fields
            'household_id' => 'ID Rumah Tangga',
            'relationship' => 'Hubungan dengan KK',
            'gender' => 'Jenis Kelamin',
            'is_disabled' => 'Disabilitas',
            'birth_date' => 'Tanggal Lahir',
            'occupation' => 'Pekerjaan',

            // Score fields
            'score_a1' => 'Skor A1 (Keteraturan)',
            'score_a2_floor_area' => 'Skor A2 Luas Lantai',
            'score_a2_structure' => 'Skor A2 Struktur',
            'score_a2_total_pct' => 'Skor A2 Total (%)',
            'score_a3_access' => 'Skor A3 Akses Air',
            'score_a3_fulfillment' => 'Skor A3 Pemenuhan Air',
            'score_a4_access' => 'Skor A4 Akses Sanitasi',
            'score_a4_technical' => 'Skor A4 Teknis Sanitasi',
            'score_a5' => 'Skor A5 (Sampah)',
            'total_score' => 'Total Skor',
            'computed_at' => 'Dihitung Pada',
            'computation_notes' => 'Catatan Perhitungan',

            // TechnicalData fields - A.1 Keteraturan Bangunan
            'has_road_access' => 'Akses Jalan',
            'road_width_category' => 'Kategori Lebar Jalan',
            'facade_faces_road' => 'Fasad Menghadap Jalan',
            'faces_waterbody' => 'Menghadap Badan Air',
            'in_setback_area' => 'Di Area Sempadan',
            'in_hazard_area' => 'Di Area Rawan Bencana',

            // TechnicalData fields - A.2 Kelayakan Bangunan
            'building_length_m' => 'Panjang Bangunan (m)',
            'building_width_m' => 'Lebar Bangunan (m)',
            'floor_count' => 'Jumlah Lantai',
            'floor_height_m' => 'Tinggi Lantai (m)',
            'building_area_m2' => 'Luas Bangunan (m²)',
            'area_per_person_m2' => 'Luas per Orang (m²)',
            'roof_material' => 'Material Atap',
            'roof_condition' => 'Kondisi Atap',
            'wall_material' => 'Material Dinding',
            'wall_condition' => 'Kondisi Dinding',
            'floor_material' => 'Material Lantai',
            'floor_condition' => 'Kondisi Lantai',

            // TechnicalData fields - A.3 Akses Air Minum
            'water_source' => 'Sumber Air',
            'water_distance_to_septic_m' => 'Jarak ke Septik (m)',
            'water_distance_category' => 'Kategori Jarak Air',
            'water_fulfillment' => 'Pemenuhan Air',

            // TechnicalData fields - A.4 Pengelolaan Sanitasi
            'defecation_place' => 'Tempat BAB',
            'toilet_type' => 'Jenis Toilet',
            'sewage_disposal' => 'Pembuangan Limbah',

            // TechnicalData fields - A.5 Pengelolaan Sampah
            'waste_disposal_place' => 'Tempat Pembuangan Sampah',
            'waste_collection_frequency' => 'Frekuensi Pengangkutan Sampah',

            // TechnicalData fields - Listrik
            'electricity_source' => 'Sumber Listrik',
            'electricity_power_watt' => 'Daya Listrik (Watt)',
            'electricity_connected' => 'Tersambung Listrik',

            // Photo fields
            'file_path' => 'Path File',
            'caption' => 'Keterangan',
            'order_index' => 'Urutan',

            // Assistance fields
            'assistance_type' => 'Jenis Bantuan',
            'program' => 'Program',
            'funding_source' => 'Sumber Pendanaan',
            'started_at' => 'Tanggal Mulai',
            'completed_at' => 'Tanggal Selesai',
            'cost_amount_idr' => 'Jumlah Biaya (IDR)',
            'document_path' => 'Path Dokumen',

            // Area fields
            'area_group_id' => 'ID Kelompok Kawasan',
            'geometry_json' => 'Data Geometri',
            'is_slum' => 'Status Kumuh',
            'area_total_m2' => 'Total Luas Area (m²)',

            // AreaGroup fields
            'legend_color_hex' => 'Warna Legenda',
            'legend_icon' => 'Ikon Legenda',
            'centroid_lat' => 'Latitude Centroid',
            'centroid_lng' => 'Longitude Centroid',

            // Infrastructure fields
            'infrastructure_group_id' => 'ID Kelompok PSU',
            'geometry_type' => 'Tipe Geometri',
            'condition_status' => 'Status Kondisi',

            // InfrastructureGroup fields
            'category' => 'Kategori',
            'infrastructure_count' => 'Jumlah PSU',
        ];
    }

    public function show($id)
    {
        Gate::authorize('view', AuditLog::class);
        $log = AuditLog::with('user')->findOrFail($id);

        return response()->json($log);
    }

    public function destroy($id)
    {
        Gate::authorize('delete', AuditLog::class);
        $log = AuditLog::findOrFail($id);
        $log->delete();

        return redirect()->back()->with('success', 'Log dihapus');
    }

    public function create()
    {
        abort(404);
    }

    public function store(Request $request)
    {
        abort(404);
    }

    public function edit($id)
    {
        abort(404);
    }

    public function update(Request $request, $id)
    {
        abort(404);
    }

    public function export(Request $request)
    {
        abort(404);
    }
}
