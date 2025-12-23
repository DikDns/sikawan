<?php

namespace App\Models\Household;

use App\Models\Area;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Household extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by', // User yang membuat household ini
        // Data Wilayah (dari package SQLite: maftuhichsan/sqlite-wilayah-indonesia)
        // province_id = province_code, regency_id = city_code, district_id = sub_district_code, village_id = village_code
        'province_id',
        'province_name',
        'regency_id',
        'regency_name',
        'district_id',
        'district_name',
        'village_id',
        'village_name',
        'rt_rw',
        'survey_date',
        'address_text',
        'latitude',
        'longitude',
        'approval_status',
        'ownership_status_building',
        'ownership_status_land',
        'building_legal_status',
        'land_legal_status',
        'head_name',
        'nik',
        'status_mbr',
        'kk_count',
        'member_total',
        'male_count',
        'female_count',
        'disabled_count',
        'main_occupation',
        'monthly_income_idr',
        'health_facility_used',
        'health_facility_location',
        'education_facility_location',
        'habitability_status',
        'eligibility_score_total',
        'eligibility_computed_at',
        'area_id',
        'is_draft',
        'import_batch_id',
    ];

    protected $casts = [
        'survey_date' => 'date',
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'monthly_income_idr' => 'integer',
        'kk_count' => 'integer',
        'member_total' => 'integer',
        'male_count' => 'integer',
        'female_count' => 'integer',
        'disabled_count' => 'integer',
        'eligibility_score_total' => 'decimal:2',
        'eligibility_computed_at' => 'datetime',
        'is_draft' => 'boolean',
    ];

    // V2 Relationships
    public function technicalData(): HasOne
    {
        return $this->hasOne(TechnicalData::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function score(): HasOne
    {
        return $this->hasOne(Score::class);
    }

    public function assistances(): HasMany
    {
        return $this->hasMany(Assistance::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
}
