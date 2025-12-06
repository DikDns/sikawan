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

        $conditions = ['baik', 'baik', 'baik', 'rusak_ringan', 'rusak_berat'];

        foreach ($groups as $groupIndex => $groupData) {
            $group = new InfrastructureGroup($groupData);
            if (\Illuminate\Support\Facades\Schema::hasColumn('infrastructure_groups', 'infrastructure_count')) {
                $group->infrastructure_count = 0;
            }
            $group->save();

            // Generate unique random offset for each group
            $groupOffsetLat = ($groupIndex * 0.008) - 0.02;
            $groupOffsetLng = ($groupIndex * 0.006) - 0.015;

            if ($group->type === 'Marker') {
                // Random number of points (3-6) for each group
                $pointCount = rand(3, 6);

                for ($idx = 0; $idx < $pointCount; $idx++) {
                    // Generate random offset for each point
                    $randomLat = $centerLat + $groupOffsetLat + (rand(-800, 800) / 100000);
                    $randomLng = $centerLng + $groupOffsetLng + (rand(-800, 800) / 100000);

                    Infrastructure::create([
                        'infrastructure_group_id' => $group->id,
                        'name' => $group->name . ' #' . ($idx + 1),
                        'description' => $this->generateDescription($group->code, $idx),
                        'geometry_type' => 'Point',
                        'geometry_json' => [
                            'type' => 'Point',
                            'coordinates' => [$randomLng, $randomLat],
                        ],
                        'condition_status' => $conditions[array_rand($conditions)],
                    ]);
                }
            } elseif ($group->type === 'Polyline') {
                // Random number of lines (2-4) for each group
                $lineCount = rand(2, 4);

                for ($idx = 0; $idx < $lineCount; $idx++) {
                    // Generate random line with 3-5 points
                    $pointsInLine = rand(3, 5);
                    $lineCoords = [];

                    $startLat = $centerLat + $groupOffsetLat + (rand(-500, 500) / 100000);
                    $startLng = $centerLng + $groupOffsetLng + (rand(-500, 500) / 100000);

                    for ($p = 0; $p < $pointsInLine; $p++) {
                        $lineCoords[] = [
                            $startLng + ($p * rand(2, 8) / 1000),
                            $startLat + ($p * rand(-3, 3) / 1000),
                        ];
                    }

                    Infrastructure::create([
                        'infrastructure_group_id' => $group->id,
                        'name' => $group->name . ' Jalur #' . ($idx + 1),
                        'description' => $this->generateDescription($group->code, $idx),
                        'geometry_type' => 'LineString',
                        'geometry_json' => [
                            'type' => 'LineString',
                            'coordinates' => $lineCoords,
                        ],
                        'condition_status' => $conditions[array_rand($conditions)],
                    ]);
                }
            } else {
                // Polygon for area-type infrastructure - random polygon for each
                $polygonOffset = rand(-500, 500) / 100000;
                $polygonSize = rand(5, 15) / 1000;

                $polygon = [
                    [$centerLng + $groupOffsetLng + $polygonOffset, $centerLat + $groupOffsetLat + $polygonOffset],
                    [$centerLng + $groupOffsetLng + $polygonOffset + $polygonSize, $centerLat + $groupOffsetLat + $polygonOffset],
                    [$centerLng + $groupOffsetLng + $polygonOffset + $polygonSize, $centerLat + $groupOffsetLat + $polygonOffset + $polygonSize],
                    [$centerLng + $groupOffsetLng + $polygonOffset, $centerLat + $groupOffsetLat + $polygonOffset + $polygonSize],
                    [$centerLng + $groupOffsetLng + $polygonOffset, $centerLat + $groupOffsetLat + $polygonOffset], // Close polygon
                ];

                Infrastructure::create([
                    'infrastructure_group_id' => $group->id,
                    'name' => $group->name . ' Area',
                    'description' => $this->generateDescription($group->code, 0),
                    'geometry_type' => 'Polygon',
                    'geometry_json' => [
                        'type' => 'Polygon',
                        'coordinates' => [$polygon],
                    ],
                    'condition_status' => $conditions[array_rand($conditions)],
                ]);
            }

            if (\Illuminate\Support\Facades\Schema::hasColumn('infrastructure_groups', 'infrastructure_count')) {
                $group->infrastructure_count = $group->infrastructures()->count();
                $group->save();
            }
        }

        $this->command->info('Infrastructure groups seeded successfully for Muara Enim!');
    }

    /**
     * Generate description based on infrastructure type
     */
    private function generateDescription(string $code, int $index): ?string
    {
        $descriptions = [
            'WATER_PIPE' => [
                'Pipa distribusi air bersih utama',
                'Pipa cabang distribusi air',
                'Jalur pipa air ke permukiman',
                'Pipa air bersih zona timur',
            ],
            'POWER_POLE' => [
                'Tiang listrik tegangan menengah',
                'Tiang distribusi listrik perumahan',
                'Tiang listrik zona industri',
                'Tiang listrik jalan utama',
            ],
            'SCHOOL' => [
                'SMA Negeri dengan fasilitas lengkap',
                'SMA Swasta terakreditasi A',
                'SMK Kejuruan bidang teknik',
                'Madrasah Aliyah Negeri',
            ],
            'HOSPITAL' => [
                'Rumah sakit umum daerah tipe B',
                'Rumah sakit swasta',
                'Rumah sakit ibu dan anak',
                'Klinik spesialis',
            ],
            'PUSKESMAS' => [
                'Puskesmas rawat inap',
                'Puskesmas pembantu',
                'Puskesmas keliling',
                'Pos kesehatan desa',
            ],
            'SD' => [
                'SD Negeri dengan 12 rombel',
                'SD Swasta terakreditasi A',
                'Madrasah Ibtidaiyah',
                'SD Inpres',
            ],
            'POWER_LINE' => [
                'Jaringan listrik tegangan tinggi',
                'Jaringan distribusi tegangan menengah',
                'Jaringan listrik perumahan',
                'Jaringan listrik zona komersial',
            ],
            'DRAINAGE' => [
                'Saluran drainase primer',
                'Saluran drainase sekunder',
                'Gorong-gorong jalan utama',
                'Saluran pembuangan air hujan',
            ],
        ];

        if (isset($descriptions[$code])) {
            return $descriptions[$code][$index % count($descriptions[$code])];
        }

        return null;
    }
}
