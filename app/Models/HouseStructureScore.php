<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseStructureScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','a1_access_to_road','a1_facade_width_category','a1_facade_faces_road','a1_faces_waterbody','a1_in_setback','a1_hazard_area','score_a1','a2_length_m','a2_width_m','a2_floors','a2_area_m2','a2_occupants','a2_m2_per_person','score_a2_floor_area','a2_roof_condition','a2_wall_condition','a2_floor_type','score_a2_roof_wall_floor','score_a2_total_pct'
    ];

    protected $casts = [
        'a1_access_to_road' => 'boolean',
        'a1_facade_faces_road' => 'boolean',
        'a1_hazard_area' => 'boolean',
        'a2_length_m' => 'decimal:2',
        'a2_width_m' => 'decimal:2',
        'a2_area_m2' => 'decimal:2',
        'a2_m2_per_person' => 'decimal:2',
        'score_a2_total_pct' => 'decimal:2',
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
