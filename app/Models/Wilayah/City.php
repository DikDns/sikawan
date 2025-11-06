<?php

namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $connection = 'wilayah';
    protected $table = 'cities';
    protected $primaryKey = 'city_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['city_code', 'city_name', 'city_province_code'];

    public function province()
    {
        return $this->belongsTo(Province::class, 'city_province_code', 'province_code');
    }

    public function subDistricts()
    {
        return $this->hasMany(SubDistrict::class, 'sub_district_city_code', 'city_code');
    }
}
