<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaDrainageB3 extends Model
{
    use HasFactory;

    protected $table = 'area_drainage_b3';

    protected $fillable = [
        'area_survey_id','flood_height','flood_duration','flood_frequency','flood_area_ha','flood_source','length_existing_m','has_new_plan','length_needed_new_m','has_city_link','length_city_link_m','is_clean','length_clean_m','length_structure_good_m','no_flood_event','no_flood_area_pct','length_needed_total_m','length_ideal_m','length_good_pct'
    ];

    protected $casts = [
        'has_new_plan' => 'boolean',
        'has_city_link' => 'boolean',
        'is_clean' => 'boolean',
        'no_flood_event' => 'boolean',
        'flood_area_ha' => 'decimal:2',
        'no_flood_area_pct' => 'decimal:2',
        'length_good_pct' => 'decimal:2',
    ];

    public function survey(): BelongsTo { return $this->belongsTo(AreaSurvey::class, 'area_survey_id'); }
}
