<?php

namespace App\Models\Household;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    use HasFactory;

    protected $table = 'household_photos';

    protected $fillable = [
        'household_id',
        'file_path',
        'caption',
        'order_index',
    ];

    protected $casts = [
        'order_index' => 'integer',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
