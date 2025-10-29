<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfrastructurePhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'infrastructure_id','file_path','caption'
    ];

    public function infrastructure(): BelongsTo { return $this->belongsTo(Infrastructure::class); }
}
