<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sanitaton extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','defecation_place','score_access','toilet_type','sewage_disposal','score_technical'
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
