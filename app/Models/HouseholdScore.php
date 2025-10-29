<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseholdScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','score_a1','score_a2_floor_area','score_a2_roof_wall_floor','score_a2_total_pct','score_a3_access_water','score_a3_fulfillment','score_a4_access_sanitation','score_a4_technical','score_a5_waste','computed_at'
    ];

    protected $casts = [
        'computed_at' => 'datetime',
        'score_a2_total_pct' => 'decimal:2',
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
