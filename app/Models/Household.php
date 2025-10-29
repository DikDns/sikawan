<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Household extends Model
{
    use HasFactory;

    protected $fillable = [
        'province_id','regency_id','district_id','village_id','rt_rw','survey_date','head_name','nik','address_text','kk_count','status_mbr','member_total','male_count','female_count','disabled_count','latitude','longitude','location_json','photo_folder','ownership_status_building','ownership_status_land','building_legal_status','land_legal_status','monthly_income_idr','electricity_connected','area_survey_id','nearest_psu_json'
    ];

    protected $casts = [
        'survey_date' => 'date',
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'location_json' => 'array',
        'nearest_psu_json' => 'array',
        'electricity_connected' => 'boolean',
    ];

    public function province(): BelongsTo { return $this->belongsTo(AdminArea::class, 'province_id'); }
    public function regency(): BelongsTo { return $this->belongsTo(AdminArea::class, 'regency_id'); }
    public function district(): BelongsTo { return $this->belongsTo(AdminArea::class, 'district_id'); }
    public function village(): BelongsTo { return $this->belongsTo(AdminArea::class, 'village_id'); }

    public function structureScore(): HasOne { return $this->hasOne(HouseStructureScore::class); }
    public function waterAccess(): HasOne { return $this->hasOne(WaterAccess::class); }
    public function sanitaton(): HasOne { return $this->hasOne(Sanitaton::class); }
    public function wasteManagement(): HasOne { return $this->hasOne(WasteManagement::class); }
    public function nonPhysical(): HasOne { return $this->hasOne(HouseholdNonPhysical::class); }
    public function score(): HasOne { return $this->hasOne(HouseholdScore::class); }
    public function physicalDetail(): HasOne { return $this->hasOne(HousePhysicalDetail::class); }
    public function landDetail(): HasOne { return $this->hasOne(LandDetail::class); }
    public function eligibility(): HasOne { return $this->hasOne(HouseEligibility::class); }
    public function assistances(): HasMany { return $this->hasMany(HouseAssistance::class); }
    public function relocationAssessments(): HasMany { return $this->hasMany(RelocationAssessment::class); }
}
