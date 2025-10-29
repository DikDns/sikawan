<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AreaGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'code','name','description','legend_color_hex','legend_icon','is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function features(): HasMany { return $this->hasMany(AreaFeature::class); }
}
