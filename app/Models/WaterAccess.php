<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaterAccess extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','source','distance_to_septic','skor_air','water_fulfillment','skor_fulfillment'
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
