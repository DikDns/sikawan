<?php

namespace Database\Seeders;

use App\Models\InfrastructureGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InfrastructureGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $infrastructures = [
            [
                'code' => 'WATER_PIPE',
                'name' => 'Jalur Pipa Air',
                'category' => 'Air Bersih',
                'jenis' => 'PRASARANA',
                'legend_color_hex' => '#00D9FF',
                'legend_icon' => 'droplet',
                'infrastructure_count' => 4,
            ],
            [
                'code' => 'POWER_POLE',
                'name' => 'Tiang PLN',
                'category' => 'Listrik',
                'jenis' => 'PRASARANA',
                'legend_color_hex' => '#FFD700',
                'legend_icon' => 'zap',
                'infrastructure_count' => 4,
            ],
            [
                'code' => 'SCHOOL',
                'name' => 'Sekolah Menengah Atas',
                'category' => 'Pendidikan',
                'jenis' => 'SARANA',
                'legend_color_hex' => '#4C6EF5',
                'legend_icon' => 'graduation-cap',
                'infrastructure_count' => 4,
            ],
            [
                'code' => 'HOSPITAL',
                'name' => 'Rumah Sakit',
                'category' => 'Kesehatan',
                'jenis' => 'SARANA',
                'legend_color_hex' => '#FF6B9D',
                'legend_icon' => 'hospital',
                'infrastructure_count' => 4,
            ],
            [
                'code' => 'PUSKESMAS',
                'name' => 'Puskesmas',
                'category' => 'Kesehatan',
                'jenis' => 'SARANA',
                'legend_color_hex' => '#FA5252',
                'legend_icon' => 'hospital',
                'infrastructure_count' => 8,
            ],
            [
                'code' => 'SD',
                'name' => 'Sekolah Dasar',
                'category' => 'Pendidikan',
                'jenis' => 'SARANA',
                'legend_color_hex' => '#20C997',
                'legend_icon' => 'graduation-cap',
                'infrastructure_count' => 15,
            ],
            [
                'code' => 'POWER_LINE',
                'name' => 'Jaringan Listrik',
                'category' => 'Listrik',
                'jenis' => 'PRASARANA',
                'legend_color_hex' => '#FFA94D',
                'legend_icon' => 'zap',
                'infrastructure_count' => 12,
            ],
            [
                'code' => 'DRAINAGE',
                'name' => 'Saluran Drainase',
                'category' => 'Drainase',
                'jenis' => 'PRASARANA',
                'legend_color_hex' => '#74C0FC',
                'legend_icon' => 'droplet',
                'infrastructure_count' => 6,
            ],
        ];

        foreach($infrastructures as $infrastructure) {
            InfrastructureGroup::create($infrastructure);
        }
    }
}
