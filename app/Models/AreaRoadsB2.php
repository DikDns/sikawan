<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaRoadsB2 extends Model
{
    use HasFactory;

    protected $table = 'area_roads_b2';

    protected $fillable = [
        'area_survey_id','length_total_m','length_ge_1_5_m','length_ge_1_5_hardened_m','length_needed_new_m','length_ideal_m','coverage_pct','length_ge_1_5_good_m','length_ge_1_5_soil_good_m','length_lt_1_5_hardened_good_m','length_lt_1_5_soil_good_m','length_with_side_drain_ge_1_5_m','length_with_side_drain_lt_1_5_m','length_good_total_m','good_over_total_pct'
    ];

    protected $casts = [
        'coverage_pct' => 'decimal:2',
        'good_over_total_pct' => 'decimal:2',
    ];

    public function survey(): BelongsTo { return $this->belongsTo(AreaSurvey::class, 'area_survey_id'); }
}
