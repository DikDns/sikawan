<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AreaGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'legend_color_hex',
        'legend_icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'feature_count',
        'household_count',
        'family_count',
    ];

    public function features(): HasMany
    {
        return $this->hasMany(AreaFeature::class);
    }

    /**
     * Get the count of features in this area group
     * Uses eager loaded count if available, otherwise queries the database
     */
    public function getFeatureCountAttribute(): int
    {
        if (isset($this->attributes['features_count'])) {
            return (int) $this->attributes['features_count'];
        }

        if ($this->relationLoaded('features')) {
            return $this->features->count();
        }

        return $this->features()->count();
    }

    /**
     * Get the sum of household_count from all features in this area group
     * Uses eager loaded sum if available, otherwise queries the database
     */
    public function getHouseholdCountAttribute(): int
    {
        if (isset($this->attributes['features_sum_household_count'])) {
            return (int) ($this->attributes['features_sum_household_count'] ?? 0);
        }

        if ($this->relationLoaded('features')) {
            return (int) $this->features->sum('household_count');
        }

        return (int) ($this->features()->sum('household_count') ?? 0);
    }

    /**
     * Get the sum of family_count from all features in this area group
     * Uses eager loaded sum if available, otherwise queries the database
     */
    public function getFamilyCountAttribute(): int
    {
        if (isset($this->attributes['features_sum_family_count'])) {
            return (int) ($this->attributes['features_sum_family_count'] ?? 0);
        }

        if ($this->relationLoaded('features')) {
            return (int) $this->features->sum('family_count');
        }

        return (int) ($this->features()->sum('family_count') ?? 0);
    }

    /**
     * Scope to load features count and aggregated data efficiently
     */
    public function scopeWithCounts($query)
    {
        return $query->withCount('features')
            ->withSum('features', 'household_count')
            ->withSum('features', 'family_count');
    }

    /**
     * Get area groups with calculated counts (for API/JSON responses)
     */
    public static function withAggregatedCounts()
    {
        return static::query()
            ->withCount('features')
            ->withSum('features', 'household_count')
            ->withSum('features', 'family_count')
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'code' => $group->code,
                    'name' => $group->name,
                    'description' => $group->description,
                    'legend_color_hex' => $group->legend_color_hex,
                    'legend_icon' => $group->legend_icon,
                    'is_active' => $group->is_active,
                    'feature_count' => $group->features_count ?? 0,
                    'household_count' => (int) ($group->features_sum_household_count ?? 0),
                    'family_count' => (int) ($group->features_sum_family_count ?? 0),
                ];
            });
    }
}
