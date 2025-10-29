<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id','action','entity_type','entity_id','metadata_json'
    ];

    protected $casts = [
        'metadata_json' => 'array',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
