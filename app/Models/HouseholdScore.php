<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseholdScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id',
        // Skor Individual
        'score_a1',
        'score_a2_floor_area',
        'score_a2_structure',
        'score_a2_total_pct',
        'score_a3_access',
        'score_a3_fulfillment',
        'score_a4_access',
        'score_a4_technical',
        'score_a5',
        // Skor Total
        'total_score',
        'habitability_status',
        // Metadata
        'computed_at',
        'computation_notes',
    ];

    protected $casts = [
        'score_a1' => 'integer',
        'score_a2_floor_area' => 'integer',
        'score_a2_structure' => 'integer',
        'score_a2_total_pct' => 'decimal:2',
        'score_a3_access' => 'integer',
        'score_a3_fulfillment' => 'integer',
        'score_a4_access' => 'integer',
        'score_a4_technical' => 'integer',
        'score_a5' => 'integer',
        'total_score' => 'decimal:2',
        'computed_at' => 'datetime',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
