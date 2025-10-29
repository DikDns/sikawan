<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaterAccess extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','source','distance_to_septic','score_a3_access_water','water_fulfillment','score_a3_fulfillment'
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
