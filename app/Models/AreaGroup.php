<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Area;

class AreaGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'legend_color_hex',
        'legend_icon',
        'geometry_json',
        'centroid_lat',
        'centroid_lng',
    ];

    protected $casts = [
        'geometry_json' => 'array',
        'centroid_lat' => 'decimal:6',
        'centroid_lng' => 'decimal:6',
    ];

    public function areas(): HasMany
    {
        return $this->hasMany(Area::class);
    }
}
