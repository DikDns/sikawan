<?php

namespace Database\Seeders;

use App\Models\AreaGroup;
use App\Models\Area;
use Illuminate\Database\Seeder;

class AreaGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seeds area groups and areas in Muara Enim, Sumatera Selatan
     *
     * Wilayah IDs from: vendor/maftuhichsan/sqlite-wilayah-indonesia/records.sqlite
     * Center: -3.6632234, 103.7781606
     */
    public function run(): void
    {
        // Sample GeoJSON polygon for Muara Enim area
        $samplePolygon = json_encode([
            [103.7750, -3.6600],
            [103.7850, -3.6600],
            [103.7850, -3.6700],
            [103.7750, -3.6700],
            [103.7750, -3.6600],
        ]);

        // Define area groups
        $areaGroups = [
            [
                'id' => 1,
                'code' => 'SLUM',
                'name' => 'Kawasan Kumuh',
                'description' => 'Kawasan permukiman kumuh yang memerlukan penanganan',
                'legend_color_hex' => '#F28AAA',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -3.6632,
                'centroid_lng' => 103.7782,
            ],
            [
                'id' => 2,
                'code' => 'SETTLEMENT',
                'name' => 'Kawasan Pemukiman',
                'description' => 'Kawasan pemukiman yang telah tertata',
                'legend_color_hex' => '#B2F02C',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -3.6550,
                'centroid_lng' => 103.7700,
            ],
            [
                'id' => 3,
                'code' => 'DISASTER_RISK',
                'name' => 'Kawasan Rawan Bencana',
                'description' => 'Kawasan dengan risiko bencana tinggi',
                'legend_color_hex' => '#FF6B6B',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -3.6700,
                'centroid_lng' => 103.7850,
            ],
            [
                'id' => 4,
                'code' => 'PRIORITY_DEV',
                'name' => 'Lokasi Prioritas Pembangunan',
                'description' => 'Kawasan prioritas untuk pembangunan infrastruktur',
                'legend_color_hex' => '#4C6EF5',
                'legend_icon' => null,
                'geometry_json' => $samplePolygon,
                'centroid_lat' => -3.6480,
                'centroid_lng' => 103.7950,
            ],
        ];

        foreach ($areaGroups as $areaGroup) {
            $group = AreaGroup::create($areaGroup);
            $this->createAreasForGroup($group);
        }

        $this->command->info('Area groups and areas seeded successfully for Muara Enim!');
    }

    private function createAreasForGroup(AreaGroup $group): void
    {
        // Sample areas with correct wilayah IDs from database
        $areas = [
            [
                'name' => $group->name . ' - Muara Enim',
                'description' => 'Kawasan di Kecamatan Muara Enim',
                'province_id' => '16',
                'province_name' => 'SUMATERA SELATAN',
                'regency_id' => '1603',
                'regency_name' => 'MUARA ENIM',
                'district_id' => '1603050',
                'district_name' => 'MUARA ENIM',
                'village_id' => '1603050001',
                'village_name' => 'PASAR II',
                'geometry_json' => [
                    'type' => 'Polygon',
                    'coordinates' => [[
                        [103.7750, -3.6600],
                        [103.7800, -3.6600],
                        [103.7800, -3.6650],
                        [103.7750, -3.6650],
                        [103.7750, -3.6600],
                    ]],
                ],
                'is_slum' => $group->code === 'SLUM',
                'area_total_m2' => rand(5000, 50000),
            ],
            [
                'name' => $group->name . ' - Lawang Kidul',
                'description' => 'Kawasan di Kecamatan Lawang Kidul',
                'province_id' => '16',
                'province_name' => 'SUMATERA SELATAN',
                'regency_id' => '1603',
                'regency_name' => 'MUARA ENIM',
                'district_id' => '1603040',
                'district_name' => 'LAWANG KIDUL',
                'village_id' => '1603040001',
                'village_name' => 'KARANG AGUNG',
                'geometry_json' => [
                    'type' => 'Polygon',
                    'coordinates' => [[
                        [103.7620, -3.6470],
                        [103.7680, -3.6470],
                        [103.7680, -3.6530],
                        [103.7620, -3.6530],
                        [103.7620, -3.6470],
                    ]],
                ],
                'is_slum' => $group->code === 'SLUM',
                'area_total_m2' => rand(5000, 50000),
            ],
        ];

        foreach ($areas as $areaData) {
            $group->areas()->create($areaData);
        }
    }
}
