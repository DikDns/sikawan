<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseholdMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_id',
        'name',
        'nik',
        'relationship',
        'gender',
        'is_disabled',
        'birth_date',
        'occupation',
    ];

    protected $casts = [
        'is_disabled' => 'boolean',
        'birth_date' => 'date',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
