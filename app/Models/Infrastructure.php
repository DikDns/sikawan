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
        'infrastructure_group_id','type','name','attributes_json','geometry_type','geometry_json','latitude','longitude','title','is_visible','order_index'
    ];

    protected $casts = [
        'attributes_json' => 'array',
        'geometry_json' => 'array',
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'is_visible' => 'boolean',
    ];

    public function group(): BelongsTo { return $this->belongsTo(InfrastructureGroup::class, 'infrastructure_group_id'); }
    public function photos(): HasMany { return $this->hasMany(InfrastructurePhoto::class); }
}
