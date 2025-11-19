<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Report;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reports = [
            [
                'title' => 'Laporan Kondisi Rumah Tahun 2025',
                'description' => 'Laporan komprehensif kondisi perumahan di wilayah Muara Enim',
                'type' => 'RUMAH',
                'category' => 'Kelayakan',
                'file_path' => '/storage/reports/laporan_rumah_2025.pdf',
                'generated_by' => 1,
                'start_date' => '2025-01-01',
                'end_date' => '2025-12-31',
                'status' => 'GENERATED',
            ],
            [
                'title' => 'Analisis Kawasan Kumuh',
                'description' => 'Identifikasi dan pemetaan kawasan kumuh di Muara Enim',
                'type' => 'KAWASAN',
                'category' => 'Infrastruktur',
                'file_path' => '/storage/reports/kawasan_kumuh_2025.pdf',
                'generated_by' => 1,
                'start_date' => '2025-03-01',
                'end_date' => '2025-06-30',
                'status' => 'GENERATED',
            ],
            [
                'title' => 'Laporan PSU Tahunan',
                'description' => 'Tinjauan prasarana dan sarana infrastruktur',
                'type' => 'PSU',
                'category' => 'Infrastruktur',
                'file_path' => '/storage/reports/psu_2025.pdf',
                'generated_by' => 1,
                'start_date' => '2025-01-01',
                'end_date' => '2025-12-31',
                'status' => 'DRAFT',
            ],
            [
                'title' => 'Laporan Umum Pembangunan',
                'description' => 'Ringkasan keseluruhan pembangunan di Muara Enim',
                'type' => 'UMUM',
                'category' => 'Pembangunan',
                'file_path' => '/storage/reports/laporan_umum_2025.pdf',
                'generated_by' => 1,
                'start_date' => '2025-01-01',
                'end_date' => '2025-12-31',
                'status' => 'DRAFT',
            ],
        ];

        foreach($reports as $report) {
            Report::create($report);
        }
    }
}
