<?php

namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubDistrict extends Model
{
    use HasFactory;

    protected $connection = 'wilayah';
    protected $table = 'sub_districts';
    protected $primaryKey = 'sub_district_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['sub_district_code', 'sub_district_name', 'sub_district_city_code'];

    public function city()
    {
        return $this->belongsTo(City::class, 'sub_district_city_code', 'city_code');
    }

    public function villages()
    {
        return $this->hasMany(Village::class, 'village_sub_district_code', 'sub_district_code');
    }
}
