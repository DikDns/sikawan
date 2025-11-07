<?php

namespace App\Models;

use App\Models\Household\Household;
use App\Models\Household\Assistance;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RelocationAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','house_assistance_id','survey_date','location_admin_snapshot_json','full_name','full_address','nik','kk_in_house_count','gender','main_occupation','income_band','land_ownership_status','house_ownership_status','has_other_land_asset','settlement_zone_flags_json','hazard_distance_band','hazard_type','has_foundation','has_sloof','has_ring_beam','has_roof_structure','has_columns','house_area_m2','occupants_count','roof_material','roof_condition_level','wall_material','wall_condition_level','floor_material','floor_condition_level','willing_to_relocate','relocation_land_available','team_recommendation','signed_at','signatories_json'
    ];

    protected $casts = [
        'survey_date' => 'date',
        'location_admin_snapshot_json' => 'array',
        'settlement_zone_flags_json' => 'array',
        'signed_at' => 'date',
        'has_foundation' => 'boolean',
        'has_sloof' => 'boolean',
        'has_ring_beam' => 'boolean',
        'has_roof_structure' => 'boolean',
        'has_columns' => 'boolean',
        'willing_to_relocate' => 'boolean',
        'relocation_land_available' => 'boolean',
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
    public function houseAssistance(): BelongsTo { return $this->belongsTo(Assistance::class); }
}
