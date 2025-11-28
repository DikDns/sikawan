<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\AreaGroup;
use App\Models\Household\Household;

class Area extends Model
{
  use HasFactory;

  protected $fillable = [
    'area_group_id',
    'name',
    'province_id',
    'province_name',
    'regency_id',
    'regency_name',
    'district_id',
    'district_name',
    'village_id',
    'village_name',
    'description',
    'geometry_json',
  ];

  protected $casts = [
    'geometry_json' => 'array',
  ];

  public function areaGroup(): BelongsTo
  {
    return $this->belongsTo(AreaGroup::class);
  }

  public function households(): HasMany
  {
    return $this->hasMany(Household::class);
  }
}
