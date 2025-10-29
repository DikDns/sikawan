<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaDensityB1 extends Model
{
    use HasFactory;

    protected $table = 'area_density_b1';

    protected $fillable = [
        'area_survey_id','area_total_ha','settlement_area_ha','buildings_total','slope_gt15_pct','building_density_unit_per_ha','density_status'
    ];

    protected $casts = [
        'area_total_ha' => 'decimal:2',
        'settlement_area_ha' => 'decimal:2',
        'slope_gt15_pct' => 'decimal:2',
        'building_density_unit_per_ha' => 'decimal:2',
    ];

    public function survey(): BelongsTo { return $this->belongsTo(AreaSurvey::class, 'area_survey_id'); }
}
