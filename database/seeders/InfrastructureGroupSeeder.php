<?php

namespace Database\Seeders;

use App\Models\InfrastructureGroup;
use App\Models\Infrastructure;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InfrastructureGroupSeeder extends Seeder
{
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

    foreach ($groups as $groupData) {
      $group = new InfrastructureGroup($groupData);
      if (\Illuminate\Support\Facades\Schema::hasColumn('infrastructure_groups', 'infrastructure_count')) {
        $group->infrastructure_count = 0;
      }
      $group->save();

      if ($group->type === 'Marker') {
        $points = [
          [106.816666, -6.200000],
          [106.820000, -6.205000],
          [106.825000, -6.198000],
          [106.810000, -6.195000],
        ];
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
          ]);
        }
      } elseif ($group->type === 'Polyline') {
        $lines = [
          [
            [106.810000, -6.210000],
            [106.815000, -6.208000],
            [106.820000, -6.205000],
          ],
          [
            [106.825000, -6.200000],
            [106.830000, -6.198000],
            [106.835000, -6.196000],
          ],
        ];
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
          ]);
        }
      } else {
        $polygon = [
          [106.810000, -6.210000],
          [106.815000, -6.208000],
          [106.820000, -6.212000],
          [106.812000, -6.215000],
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
        ]);
      }

      if (\Illuminate\Support\Facades\Schema::hasColumn('infrastructure_groups', 'infrastructure_count')) {
        $group->infrastructure_count = $group->infrastructures()->count();
        $group->save();
      }
    }
  }
}
