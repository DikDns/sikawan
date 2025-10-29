<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseholdNonPhysical extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','main_occupation','electrical_power','health_facility_usage','education_access_summary'
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
