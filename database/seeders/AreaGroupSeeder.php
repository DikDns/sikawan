<?php

namespace Database\Seeders;

use App\Models\AreaFeature;
use App\Models\AreaGroup;
use Illuminate\Database\Seeder;

class AreaGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seeds area groups and features based on mock data from areas.tsx
     */
    public function run(): void
    {
        // Sample GeoJSON polygon for area features
        $samplePolygon = json_encode([
                    [106.816666, -6.200000],
                    [106.820000, -6.200000],
                    [106.820000, -6.203000],
                    [106.816666, -6.203000],
                    [106.816666, -6.200000],
        ]);

        // Define area groups based on mock data
        $areaGroups = [
            [
                'id' => 1,
                'code' => 'SLUM',
                'name' => 'Kawasan Kumuh',
                'description' => 'Kawasan permukiman kumuh yang memerlukan penanganan',
                'legend_color_hex' => '#F28AAA',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -6.200000,
                'centroid_lng' => 106.816666,
            ],
            [
                'id' => 2,
                'code' => 'SETTLEMENT',
                'name' => 'Kawasan Pemukiman',
                'description' => 'Kawasan pemukiman yang telah tertata',
                'legend_color_hex' => '#B2F02C',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -6.200000,
                'centroid_lng' => 106.816666,
            ],
            [
                'id' => 3,
                'code' => 'DISASTER_RISK',
                'name' => 'Kawasan Rawan Bencana',
                'description' => 'Kawasan dengan risiko bencana tinggi',
                'legend_color_hex' => '#FF6B6B',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -6.200000,
                'centroid_lng' => 106.816666,
            ],
            [
                'id' => 4,
                'code' => 'PRIORITY_DEV',
                'name' => 'Lokasi Prioritas Pembangunan',
                'description' => 'Kawasan prioritas untuk pembangunan infrastruktur',
                'legend_color_hex' => '#4C6EF5',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -6.200000,
                'centroid_lng' => 106.816666,
            ],
        ];

        foreach ($areaGroups as $areaGroup) {
            AreaGroup::create($areaGroup);
        }

        $this->command->info('Area groups seeded successfully!');
    }
}
