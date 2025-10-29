<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sanitaton extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','defecation_place','score_a4_access_sanitation','toilet_type','sewage_disposal','score_a4_technical'
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
