<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','owner_name','land_address_text','land_area_m2','kdb_pct','klb_ratio','kdh_pct','front_setback_m','side_setback_m','rear_setback_m'
    ];

    protected $casts = [
        'land_area_m2' => 'decimal:2',
        'kdb_pct' => 'decimal:2',
        'klb_ratio' => 'decimal:2',
        'kdh_pct' => 'decimal:2',
        'front_setback_m' => 'decimal:2',
        'side_setback_m' => 'decimal:2',
        'rear_setback_m' => 'decimal:2',
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
