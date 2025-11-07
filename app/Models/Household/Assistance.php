<?php

namespace App\Models\Household;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assistance extends Model
{
    use HasFactory;

    protected $table = 'house_assistances';

    protected $fillable = [
        'household_id',
        'assistance_type',
        'program',
        'funding_source',
        'status',
        'started_at',
        'completed_at',
        'cost_amount_idr',
        'description',
        'document_path',
    ];

    protected $casts = [
        'started_at' => 'date',
        'completed_at' => 'date',
        'cost_amount_idr' => 'integer',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
