<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HousePhysicalDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','building_area_m2','room_count','floor_count','floor_elevation_m','ventilation_quality','sanitation_facility_present','roof_material','roof_condition_level','wall_material','wall_condition_level','floor_material','floor_condition_level'
    ];

    protected $casts = [
        'building_area_m2' => 'decimal:2',
        'floor_elevation_m' => 'decimal:2',
        'sanitation_facility_present' => 'boolean',
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
