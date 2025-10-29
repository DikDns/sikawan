<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
