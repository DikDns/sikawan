<?php

namespace App\Models;

use App\Models\Household\Household;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'area_group_id',
        'name',
        'province_id',
        'province_name',
        'regency_id',
        'regency_name',
        'district_id',
        'district_name',
        'village_id',
        'village_name',
        'description',
        'geometry_json',
        'is_slum',
        'area_total_m2',
    ];

    protected $casts = [
        'geometry_json' => 'array',
        'is_slum' => 'boolean',
        'area_total_m2' => 'decimal:2',
    ];

    public function areaGroup(): BelongsTo
    {
        return $this->belongsTo(AreaGroup::class);
    }

    public function households(): HasMany
    {
        return $this->hasMany(Household::class);
    }

    /**
     * Calculate centroid from geometry_json
     * Returns [lat, lng] or null if not calculable
     */
    public function getCentroid(): ?array
    {
        $geometry = $this->geometry_json;
        if (! $geometry) {
            return null;
        }

        // Handle GeoJSON format
        if (isset($geometry['type'])) {
            $coords = $geometry['coordinates'] ?? [];

            return $this->calculateCentroidFromCoordinates($geometry['type'], $coords);
        }

        // Handle rectangle format [[west, north], [east, south]]
        if (is_array($geometry) && count($geometry) === 2) {
            $west = $geometry[0][0] ?? 0;
            $north = $geometry[0][1] ?? 0;
            $east = $geometry[1][0] ?? 0;
            $south = $geometry[1][1] ?? 0;

            return [($north + $south) / 2, ($west + $east) / 2];
        }

        return null;
    }

    private function calculateCentroidFromCoordinates(string $type, array $coords): ?array
    {
        if ($type === 'Point' && count($coords) >= 2) {
            return [$coords[1], $coords[0]]; // [lat, lng]
        }

        if ($type === 'Polygon' && ! empty($coords[0])) {
            $ring = $coords[0];
            $sumLat = 0;
            $sumLng = 0;
            $count = count($ring);
            foreach ($ring as $point) {
                $sumLng += $point[0] ?? 0;
                $sumLat += $point[1] ?? 0;
            }

            return $count > 0 ? [$sumLat / $count, $sumLng / $count] : null;
        }

        if ($type === 'LineString' && count($coords) > 0) {
            $sumLat = 0;
            $sumLng = 0;
            $count = count($coords);
            foreach ($coords as $point) {
                $sumLng += $point[0] ?? 0;
                $sumLat += $point[1] ?? 0;
            }

            return $count > 0 ? [$sumLat / $count, $sumLng / $count] : null;
        }

        return null;
    }
}
