<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaSocialB7 extends Model
{
    use HasFactory;

    protected $table = 'area_social_b7';

    protected $fillable = [
        'area_survey_id','health_rs','health_clinic','health_puskesmas','health_traditional','health_midwife','health_none','edu_tk','edu_sd','edu_smp','edu_sma','edu_pt','edu_none'
    ];

    protected $casts = [
        'health_rs' => 'boolean',
        'health_clinic' => 'boolean',
        'health_puskesmas' => 'boolean',
        'health_traditional' => 'boolean',
        'health_midwife' => 'boolean',
        'health_none' => 'boolean',
        'edu_tk' => 'boolean',
        'edu_sd' => 'boolean',
        'edu_smp' => 'boolean',
        'edu_sma' => 'boolean',
        'edu_pt' => 'boolean',
        'edu_none' => 'boolean',
    ];

    public function survey(): BelongsTo { return $this->belongsTo(AreaSurvey::class, 'area_survey_id'); }
}
