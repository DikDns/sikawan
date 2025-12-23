<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable = [
        'title', 'description', 'type', 'category', 'file_path',
        'generated_by', 'start_date', 'end_date', 'status', 'metadata_json',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'metadata_json' => 'array',
    ];

    // Add a validation method for status
    public function setStatusAttribute($value)
    {
        $allowedStatuses = ['DRAFT', 'GENERATED'];

        if (! in_array($value, $allowedStatuses)) {
            throw new \InvalidArgumentException('Invalid report status. Must be one of: '.implode(', ', $allowedStatuses));
        }

        $this->attributes['status'] = $value;
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
