<?php

namespace App\Models\Household;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TechnicalData extends Model
{
    use HasFactory;

    protected $table = 'household_technical_data';

    protected $fillable = [
        'household_id',
        // A.1 KETERATURAN BANGUNAN HUNIAN
        'has_road_access',
        'road_width_category',
        'facade_faces_road',
        'faces_waterbody',
        'in_setback_area',
        'in_hazard_area',
        'score_a1',
        // A.2 KELAYAKAN BANGUNAN HUNIAN
        'building_length_m',
        'building_width_m',
        'floor_count',
        'floor_height_m',
        'building_area_m2',
        'area_per_person_m2',
        'score_a2_floor_area',
        // Material & Kondisi
        'roof_material',
        'roof_condition',
        'wall_material',
        'wall_condition',
        'floor_material',
        'floor_condition',
        'score_a2_structure',
        'score_a2_total_pct',
        // A.3 AKSES AIR MINUM
        'water_source',
        'water_distance_to_septic_m',
        'water_distance_category',
        'water_fulfillment',
        'score_a3_access',
        'score_a3_fulfillment',
        // A.4 PENGELOLAAN SANITASI
        'defecation_place',
        'toilet_type',
        'sewage_disposal',
        'score_a4_access',
        'score_a4_technical',
        // A.5 PENGELOLAAN SAMPAH
        'waste_disposal_place',
        'waste_collection_frequency',
        'score_a5',
        // Sumber Listrik
        'electricity_source',
        'electricity_power_watt',
        'electricity_connected',
    ];

    protected $casts = [
        // A.1
        'has_road_access' => 'boolean',
        'facade_faces_road' => 'boolean',
        'faces_waterbody' => 'boolean',
        'in_setback_area' => 'boolean',
        'in_hazard_area' => 'boolean',
        'score_a1' => 'integer',
        // A.2
        'building_length_m' => 'decimal:2',
        'building_width_m' => 'decimal:2',
        'floor_count' => 'integer',
        'floor_height_m' => 'decimal:2',
        'building_area_m2' => 'decimal:2',
        'area_per_person_m2' => 'decimal:2',
        'score_a2_floor_area' => 'integer',
        // Material & Kondisi
        'score_a2_structure' => 'integer',
        'score_a2_total_pct' => 'decimal:2',
        // A.3
        'water_distance_to_septic_m' => 'decimal:2',
        'score_a3_access' => 'integer',
        'score_a3_fulfillment' => 'integer',
        // A.4
        'score_a4_access' => 'integer',
        'score_a4_technical' => 'integer',
        // A.5
        'score_a5' => 'integer',
        // Listrik
        'electricity_power_watt' => 'integer',
        'electricity_connected' => 'boolean',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
