<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdminArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'level', 'code', 'name', 'parent_id',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(AdminArea::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(AdminArea::class, 'parent_id');
    }
}
