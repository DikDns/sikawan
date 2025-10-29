<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteManagement extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','disposal_place','collection_frequency','score_a5_waste'
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
}
