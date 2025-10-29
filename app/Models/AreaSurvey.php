<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AreaSurvey extends Model
{
    use HasFactory;

    protected $fillable = [
        'province_id','regency_id','district_id','village_id','rt_rw','unit_name','survey_date','geometry_json','notes'
    ];

    protected $casts = [
        'survey_date' => 'date',
        'geometry_json' => 'array',
    ];

    public function province(): BelongsTo { return $this->belongsTo(AdminArea::class, 'province_id'); }
    public function regency(): BelongsTo { return $this->belongsTo(AdminArea::class, 'regency_id'); }
    public function district(): BelongsTo { return $this->belongsTo(AdminArea::class, 'district_id'); }
    public function village(): BelongsTo { return $this->belongsTo(AdminArea::class, 'village_id'); }

    public function features(): HasMany { return $this->hasMany(AreaFeature::class); }

    // B.1 – B.7 hasOne relations
    public function densityB1(): HasOne { return $this->hasOne(AreaDensityB1::class, 'area_survey_id'); }
    public function roadsB2(): HasOne { return $this->hasOne(AreaRoadsB2::class, 'area_survey_id'); }
    public function drainageB3(): HasOne { return $this->hasOne(AreaDrainageB3::class, 'area_survey_id'); }
    public function sanitationB4(): HasOne { return $this->hasOne(AreaSanitationB4::class, 'area_survey_id'); }
    public function wasteB5(): HasOne { return $this->hasOne(AreaWasteB5::class, 'area_survey_id'); }
    public function fireB6(): HasOne { return $this->hasOne(AreaFireB6::class, 'area_survey_id'); }
    public function socialB7(): HasOne { return $this->hasOne(AreaSocialB7::class, 'area_survey_id'); }
}
