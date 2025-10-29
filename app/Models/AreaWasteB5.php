<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaWasteB5 extends Model
{
    use HasFactory;

    protected $table = 'area_waste_b5';

    protected $fillable = [
        'area_survey_id','has_facility','has_transport','facility_condition_good','transport_condition_good','sapras_pct','sapras_good_pct'
    ];

    protected $casts = [
        'has_facility' => 'boolean',
        'has_transport' => 'boolean',
        'facility_condition_good' => 'boolean',
        'transport_condition_good' => 'boolean',
        'sapras_pct' => 'decimal:2',
        'sapras_good_pct' => 'decimal:2',
    ];

    public function survey(): BelongsTo { return $this->belongsTo(AreaSurvey::class, 'area_survey_id'); }
}
