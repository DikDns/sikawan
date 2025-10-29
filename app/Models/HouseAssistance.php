<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HouseAssistance extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id','assistance_type','funding_source','status','started_at','completed_at','cost_amount_idr','description','document_path'
    ];

    protected $casts = [
        'started_at' => 'date',
        'completed_at' => 'date',
    ];

    public function household(): BelongsTo { return $this->belongsTo(Household::class); }
    public function relocationAssessment(): HasOne { return $this->hasOne(RelocationAssessment::class); }
}
