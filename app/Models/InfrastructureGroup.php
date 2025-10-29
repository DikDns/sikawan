<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InfrastructureGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'code','name','category','jenis','legend_color_hex','legend_icon','description','is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function infrastructures(): HasMany { return $this->hasMany(Infrastructure::class); }
}
