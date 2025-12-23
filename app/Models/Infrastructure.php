<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Infrastructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'infrastructure_group_id',
        'name',
        'description',
        'geometry_type',
        'geometry_json',
        'condition_status',
    ];

    protected $casts = [
        'attributes_json' => 'array',
        'geometry_json' => 'array',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(InfrastructureGroup::class, 'infrastructure_group_id');
    }

    public function assistances(): HasMany
    {
        return $this->hasMany(InfrastructureAssistance::class);
    }
}
