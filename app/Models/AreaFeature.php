<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'area_group_id',
        'name',
        'description',
        'geometry_type',
        'geometry_json',
        'centroid_lat',
        'centroid_lng',
        'household_count',
        'family_count',
        'area_survey_id',
        'province_id',
        'province_name',
        'regency_id',
        'regency_name',
        'district_id',
        'district_name',
        'village_id',
        'village_name',
        'attributes_json',
        'is_visible',
    ];

    protected $casts = [
        'centroid_lat' => 'decimal:6',
        'centroid_lng' => 'decimal:6',
        'attributes_json' => 'array',
        'is_visible' => 'boolean',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(AreaGroup::class, 'area_group_id');
    }
}
