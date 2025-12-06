<?php

namespace Database\Seeders;

use App\Models\InfrastructureGroup;
use App\Models\Infrastructure;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InfrastructureGroupSeeder extends Seeder
{
    /**
     * Seeds infrastructure groups and infrastructures in Muara Enim
     * Center: -3.6632234, 103.7781606
     */
    public function run(): void
    {
        $groups = [
            [
                'code' => 'WATER_PIPE',
                'name' => 'Jalur Pipa Air',
                'category' => 'Air Bersih',
                'type' => 'Polyline',
                'legend_color_hex' => '#00D9FF',
                'legend_icon' => 'droplet',
                'description' => null,
            ],
            [
                'code' => 'POWER_POLE',
                'name' => 'Tiang PLN',
                'category' => 'Listrik',
                'type' => 'Marker',
                'legend_color_hex' => '#FFD700',
                'legend_icon' => 'zap',
                'description' => null,
            ],
            [
                'code' => 'SCHOOL',
                'name' => 'Sekolah Menengah Atas',
                'category' => 'Pendidikan',
                'type' => 'Marker',
                'legend_color_hex' => '#4C6EF5',
                'legend_icon' => 'graduation-cap',
                'description' => null,
            ],
            [
                'code' => 'HOSPITAL',
                'name' => 'Rumah Sakit',
                'category' => 'Kesehatan',
                'type' => 'Marker',
                'legend_color_hex' => '#FF6B9D',
                'legend_icon' => 'hospital',
                'description' => null,
            ],
            [
                'code' => 'PUSKESMAS',
                'name' => 'Puskesmas',
                'category' => 'Kesehatan',
                'type' => 'Marker',
                'legend_color_hex' => '#FA5252',
                'legend_icon' => 'hospital',
                'description' => null,
            ],
            [
                'code' => 'SD',
                'name' => 'Sekolah Dasar',
                'category' => 'Pendidikan',
                'type' => 'Marker',
                'legend_color_hex' => '#20C997',
                'legend_icon' => 'graduation-cap',
                'description' => null,
            ],
            [
                'code' => 'POWER_LINE',
                'name' => 'Jaringan Listrik',
                'category' => 'Listrik',
                'type' => 'Polyline',
                'legend_color_hex' => '#FFA94D',
                'legend_icon' => 'zap',
                'description' => null,
            ],
            [
                'code' => 'DRAINAGE',
                'name' => 'Saluran Drainase',
                'category' => 'Drainase',
                'type' => 'Polyline',
                'legend_color_hex' => '#74C0FC',
                'legend_icon' => 'droplet',
                'description' => null,
            ],
        ];

        // Muara Enim center coordinates
        $centerLat = -3.6632;
        $centerLng = 103.7782;

        foreach ($groups as $groupData) {
            $group = new InfrastructureGroup($groupData);
            if (\Illuminate\Support\Facades\Schema::hasColumn('infrastructure_groups', 'infrastructure_count')) {
                $group->infrastructure_count = 0;
            }
            $group->save();

            if ($group->type === 'Marker') {
                // Points around Muara Enim
                $points = [
                    [$centerLng + 0.005, $centerLat + 0.003],
                    [$centerLng - 0.008, $centerLat - 0.005],
                    [$centerLng + 0.012, $centerLat - 0.002],
                    [$centerLng - 0.003, $centerLat + 0.008],
                ];
                $conditions = ['baik', 'baik', 'rusak_ringan', 'rusak_berat'];

                foreach ($points as $idx => $lngLat) {
                    Infrastructure::create([
                        'infrastructure_group_id' => $group->id,
                        'name' => $group->name . ' #' . ($idx + 1),
                        'description' => null,
                        'geometry_type' => 'Point',
                        'geometry_json' => [
                            'type' => 'Point',
                            'coordinates' => $lngLat,
                        ],
                        'condition_status' => $conditions[$idx],
                    ]);
                }
            } elseif ($group->type === 'Polyline') {
                // Lines around Muara Enim
                $lines = [
                    [
                        [$centerLng - 0.010, $centerLat + 0.005],
                        [$centerLng - 0.005, $centerLat + 0.003],
                        [$centerLng, $centerLat],
                    ],
                    [
                        [$centerLng + 0.005, $centerLat - 0.005],
                        [$centerLng + 0.010, $centerLat - 0.003],
                        [$centerLng + 0.015, $centerLat - 0.001],
                    ],
                ];
                $conditions = ['baik', 'rusak_ringan'];

                foreach ($lines as $idx => $coords) {
                    Infrastructure::create([
                        'infrastructure_group_id' => $group->id,
                        'name' => $group->name . ' Jalur #' . ($idx + 1),
                        'description' => null,
                        'geometry_type' => 'LineString',
                        'geometry_json' => [
                            'type' => 'LineString',
                            'coordinates' => $coords,
                        ],
                        'condition_status' => $conditions[$idx],
                    ]);
                }
            } else {
                // Polygon for area-type infrastructure
                $polygon = [
                    [$centerLng - 0.010, $centerLat + 0.010],
                    [$centerLng - 0.005, $centerLat + 0.008],
                    [$centerLng, $centerLat + 0.012],
                    [$centerLng - 0.008, $centerLat + 0.015],
                ];
                Infrastructure::create([
                    'infrastructure_group_id' => $group->id,
                    'name' => $group->name . ' Area',
                    'description' => null,
                    'geometry_type' => 'Polygon',
                    'geometry_json' => [
                        'type' => 'Polygon',
                        'coordinates' => [$polygon],
                    ],
                    'condition_status' => 'baik',
                ]);
            }

            if (\Illuminate\Support\Facades\Schema::hasColumn('infrastructure_groups', 'infrastructure_count')) {
                $group->infrastructure_count = $group->infrastructures()->count();
                $group->save();
            }
        }

        $this->command->info('Infrastructure groups seeded successfully for Muara Enim!');
    }
}
