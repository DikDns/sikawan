<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaSanitationB4 extends Model
{
    use HasFactory;

    protected $table = 'area_sanitation_b4';

    protected $fillable = [
        'area_survey_id','wastewater_separated'
    ];

    protected $casts = [
        'wastewater_separated' => 'boolean',
    ];

    public function survey(): BelongsTo { return $this->belongsTo(AreaSurvey::class, 'area_survey_id'); }
}
