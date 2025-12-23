<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\AreaGroup;
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
        // Define area groups with unique polygons
        $areaGroups = [
            [
                'id' => 1,
                'code' => 'SLUM',
                'name' => 'Kawasan Kumuh',
                'description' => 'Kawasan permukiman kumuh yang memerlukan penanganan',
                'legend_color_hex' => '#F28AAA',
                'legend_icon' => null,
                'geometry_json' => json_encode([
                    [103.7720, -3.6580],
                    [103.7820, -3.6580],
                    [103.7820, -3.6680],
                    [103.7720, -3.6680],
                    [103.7720, -3.6580],
                ]),
                'centroid_lat' => -3.6630,
                'centroid_lng' => 103.7770,
            ],
            [
                'id' => 2,
                'code' => 'SETTLEMENT',
                'name' => 'Kawasan Pemukiman',
                'description' => 'Kawasan pemukiman yang telah tertata',
                'legend_color_hex' => '#B2F02C',
                'legend_icon' => null,
                'geometry_json' => json_encode([
                    [103.7650, -3.6500],
                    [103.7750, -3.6500],
                    [103.7750, -3.6600],
                    [103.7650, -3.6600],
                    [103.7650, -3.6500],
                ]),
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
                'geometry_json' => json_encode([
                    [103.7800, -3.6650],
                    [103.7900, -3.6650],
                    [103.7900, -3.6750],
                    [103.7800, -3.6750],
                    [103.7800, -3.6650],
                ]),
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
                'geometry_json' => json_encode([
                    [103.7880, -3.6420],
                    [103.7980, -3.6420],
                    [103.7980, -3.6520],
                    [103.7880, -3.6520],
                    [103.7880, -3.6420],
                ]),
                'centroid_lat' => -3.6470,
                'centroid_lng' => 103.7930,
            ],
        ];

        // Different villages for each group
        $villageData = [
            [
                'district_id' => '1603050',
                'district_name' => 'MUARA ENIM',
                'villages' => [
                    ['id' => '1603050001', 'name' => 'PASAR II', 'baseLat' => -3.6630, 'baseLng' => 103.7780],
                    ['id' => '1603050002', 'name' => 'PASAR I', 'baseLat' => -3.6610, 'baseLng' => 103.7760],
                    ['id' => '1603050003', 'name' => 'AIR LINTANG', 'baseLat' => -3.6650, 'baseLng' => 103.7800],
                ],
            ],
            [
                'district_id' => '1603040',
                'district_name' => 'LAWANG KIDUL',
                'villages' => [
                    ['id' => '1603040001', 'name' => 'KARANG AGUNG', 'baseLat' => -3.6500, 'baseLng' => 103.7650],
                    ['id' => '1603040002', 'name' => 'LAWANG KIDUL', 'baseLat' => -3.6480, 'baseLng' => 103.7630],
                    ['id' => '1603040003', 'name' => 'TANJUNG ENIM', 'baseLat' => -3.6520, 'baseLng' => 103.7670],
                ],
            ],
            [
                'district_id' => '1603020',
                'district_name' => 'TANJUNG AGUNG',
                'villages' => [
                    ['id' => '1603020001', 'name' => 'TANJUNG AGUNG', 'baseLat' => -3.6850, 'baseLng' => 103.7920],
                    ['id' => '1603020002', 'name' => 'SUMBER AGUNG', 'baseLat' => -3.6870, 'baseLng' => 103.7940],
                ],
            ],
            [
                'district_id' => '1603031',
                'district_name' => 'RAMBANG',
                'villages' => [
                    ['id' => '1603031001', 'name' => 'RAMBANG JAYA', 'baseLat' => -3.6450, 'baseLng' => 103.8050],
                    ['id' => '1603031002', 'name' => 'RAMBANG MULIA', 'baseLat' => -3.6430, 'baseLng' => 103.8070],
                ],
            ],
        ];

        foreach ($areaGroups as $groupIndex => $areaGroup) {
            $group = AreaGroup::create($areaGroup);
            $this->createAreasForGroup($group, $villageData, $groupIndex);
        }

        $this->command->info('Area groups and areas seeded successfully for Muara Enim!');
    }

    private function createAreasForGroup(AreaGroup $group, array $villageData, int $groupIndex): void
    {
        // Each group gets 2-4 areas with different villages
        $areaCount = rand(2, 4);

        // Shuffle village data to get different combinations for each group
        $shuffledDistricts = $villageData;
        shuffle($shuffledDistricts);

        $areasCreated = 0;

        foreach ($shuffledDistricts as $districtIndex => $district) {
            if ($areasCreated >= $areaCount) {
                break;
            }

            // Pick a random village from this district
            $villageIndex = ($groupIndex + $districtIndex) % count($district['villages']);
            $village = $district['villages'][$villageIndex];

            // Generate unique polygon for each area based on village location
            $offsetLat = (rand(-50, 50) / 10000);
            $offsetLng = (rand(-50, 50) / 10000);
            $size = rand(40, 80) / 10000;

            $baseLat = $village['baseLat'] + $offsetLat;
            $baseLng = $village['baseLng'] + $offsetLng;

            $areaData = [
                'name' => $group->name.' - '.$village['name'],
                'description' => 'Kawasan '.strtolower($group->name).' di Desa '.$village['name'].', Kec. '.$district['district_name'],
                'province_id' => '16',
                'province_name' => 'SUMATERA SELATAN',
                'regency_id' => '1603',
                'regency_name' => 'MUARA ENIM',
                'district_id' => $district['district_id'],
                'district_name' => $district['district_name'],
                'village_id' => $village['id'],
                'village_name' => $village['name'],
                'geometry_json' => [
                    'type' => 'Polygon',
                    'coordinates' => [[
                        [$baseLng, $baseLat],
                        [$baseLng + $size, $baseLat],
                        [$baseLng + $size, $baseLat + $size],
                        [$baseLng, $baseLat + $size],
                        [$baseLng, $baseLat], // Close polygon
                    ]],
                ],
                'is_slum' => $group->code === 'SLUM',
                'area_total_m2' => rand(8000, 80000),
            ];

            $group->areas()->create($areaData);
            $areasCreated++;
        }
    }
}
