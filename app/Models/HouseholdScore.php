<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseholdScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','skor_a1','skor_a2_floor_area','skor_a2_roof_wall_floor','skor_a2_total_pct','skor_a3_access','skor_a3_fulfillment','skor_a4_access','skor_a4_technical','skor_a5','computed_at'
    ];

    protected $casts = [
        'computed_at' => 'datetime',
        'skor_a2_total_pct' => 'decimal:2',
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
