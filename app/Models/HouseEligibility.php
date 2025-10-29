<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseEligibility extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','habitability_status','eligibility_reason','assistance_status','assistance_type','assistance_year'
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
