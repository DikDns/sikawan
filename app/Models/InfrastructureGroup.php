<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InfrastructureGroup extends Model
{
  use HasFactory;

  protected $fillable = [
    'code',
    'name',
    'category',
    'type',
    'legend_color_hex',
    'legend_icon',
    'description',
    'infrastructure_count',
  ];

  protected $casts = [
    'infrastructure_count' => 'integer',
  ];

  public function infrastructures(): HasMany
  {
    return $this->hasMany(Infrastructure::class);
  }
}
