<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaFireB6 extends Model
{
    use HasFactory;

    protected $table = 'area_fire_b6';

    protected $fillable = [
        'area_survey_id','fire_freq','causes_json','has_station','has_hydrant','has_vehicle_apar','has_access_road_ge_3_5m','prasarana_pct','sarana_pct'
    ];

    protected $casts = [
        'causes_json' => 'array',
        'has_station' => 'boolean',
        'has_hydrant' => 'boolean',
        'has_vehicle_apar' => 'boolean',
        'has_access_road_ge_3_5m' => 'boolean',
        'prasarana_pct' => 'decimal:2',
        'sarana_pct' => 'decimal:2',
    ];

    public function survey(): BelongsTo { return $this->belongsTo(AreaSurvey::class, 'area_survey_id'); }
}
