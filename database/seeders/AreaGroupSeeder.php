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
            'type' => 'Polygon',
            'coordinates' => [
                [
                    [106.816666, -6.200000],
                    [106.820000, -6.200000],
                    [106.820000, -6.203000],
                    [106.816666, -6.203000],
                    [106.816666, -6.200000],
                ],
            ],
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
                'is_active' => true,
                'features' => [
                    ['name' => 'Kawasan Kumuh 1', 'household_count' => 40, 'family_count' => 36],
                    ['name' => 'Kawasan Kumuh 2', 'household_count' => 38, 'family_count' => 35],
                    ['name' => 'Kawasan Kumuh 3', 'household_count' => 39, 'family_count' => 36],
                    ['name' => 'Kawasan Kumuh 4', 'household_count' => 39, 'family_count' => 35],
                ],
            ],
            [
                'id' => 2,
                'code' => 'SETTLEMENT',
                'name' => 'Kawasan Pemukiman',
                'description' => 'Kawasan pemukiman yang telah tertata',
                'legend_color_hex' => '#B2F02C',
                'legend_icon' => null,
                'is_active' => true,
                'features' => [
                    ['name' => 'Kawasan Pemukiman 1', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 2', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 3', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 4', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 5', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 6', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 7', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 8', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 9', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 10', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 11', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 12', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 13', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 14', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 15', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 16', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 17', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 18', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 19', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 20', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 21', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 22', 'household_count' => 35, 'family_count' => 32],
                    ['name' => 'Kawasan Pemukiman 23', 'household_count' => 36, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 24', 'household_count' => 37, 'family_count' => 33],
                    ['name' => 'Kawasan Pemukiman 25', 'household_count' => 37, 'family_count' => 33],
                ],
                // Total: 892 households, 814 families
            ],
            [
                'id' => 3,
                'code' => 'DISASTER_RISK',
                'name' => 'Kawasan Rawan Bencana',
                'description' => 'Kawasan dengan risiko bencana tinggi',
                'legend_color_hex' => '#FF6B6B',
                'legend_icon' => null,
                'is_active' => true,
                'features' => [
                    ['name' => 'Kawasan Rawan Bencana 1', 'household_count' => 34, 'family_count' => 29],
                    ['name' => 'Kawasan Rawan Bencana 2', 'household_count' => 33, 'family_count' => 29],
                ],
            ],
            [
                'id' => 4,
                'code' => 'PRIORITY_DEV',
                'name' => 'Lokasi Prioritas Pembangunan',
                'description' => 'Kawasan prioritas untuk pembangunan infrastruktur',
                'legend_color_hex' => '#4C6EF5',
                'legend_icon' => null,
                'is_active' => true,
                'features' => [
                    ['name' => 'Lokasi Prioritas 1', 'household_count' => 43, 'family_count' => 39],
                    ['name' => 'Lokasi Prioritas 2', 'household_count' => 42, 'family_count' => 38],
                    ['name' => 'Lokasi Prioritas 3', 'household_count' => 43, 'family_count' => 39],
                    ['name' => 'Lokasi Prioritas 4', 'household_count' => 42, 'family_count' => 38],
                    ['name' => 'Lokasi Prioritas 5', 'household_count' => 43, 'family_count' => 39],
                    ['name' => 'Lokasi Prioritas 6', 'household_count' => 42, 'family_count' => 38],
                    ['name' => 'Lokasi Prioritas 7', 'household_count' => 43, 'family_count' => 39],
                    ['name' => 'Lokasi Prioritas 8', 'household_count' => 42, 'family_count' => 38],
                    ['name' => 'Lokasi Prioritas 9', 'household_count' => 41, 'family_count' => 40],
                    ['name' => 'Lokasi Prioritas 10', 'household_count' => 42, 'family_count' => 38],
                ],
                // Total: 423 households, 387 families
            ],
        ];

        foreach ($areaGroups as $groupData) {
            $features = $groupData['features'];
            unset($groupData['features']);

            // Create or update area group
            $areaGroup = AreaGroup::updateOrCreate(
                ['id' => $groupData['id']],
                $groupData
            );

            // Create area features for this group
            foreach ($features as $index => $featureData) {
                AreaFeature::updateOrCreate(
                    [
                        'area_group_id' => $areaGroup->id,
                        'name' => $featureData['name'],
                    ],
                    [
                        'description' => null,
                        'geometry_type' => 'POLYGON',
                        'geometry_json' => $samplePolygon,
                        'centroid_lat' => -6.200000 + ($index * 0.001),
                        'centroid_lng' => 106.816666 + ($index * 0.001),
                        'household_count' => $featureData['household_count'],
                        'family_count' => $featureData['family_count'],
                        'province_id' => '32',
                        'province_name' => 'Jawa Barat',
                        'regency_id' => '3273',
                        'regency_name' => 'Kota Bandung',
                        'district_id' => '3273070',
                        'district_name' => 'Cibeunying Kidul',
                        'village_id' => '3273070001',
                        'village_name' => 'Cikutra',
                        'attributes_json' => null,
                        'is_visible' => true,
                    ]
                );
            }
        }

        $this->command->info('Area groups and features seeded successfully!');
    }
}
