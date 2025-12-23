<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_type', 'owner_id', 'path', 'type', 'meta_json',
    ];

    protected $casts = [
        'meta_json' => 'array',
    ];
}
