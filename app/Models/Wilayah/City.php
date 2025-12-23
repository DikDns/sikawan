<?php

namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $connection = 'wilayah';

    protected $table = 'cities';

    protected $primaryKey = 'city_code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['city_code', 'city_name', 'city_province_code'];

    public $timestamps = false;

    public function province()
    {
        return $this->belongsTo(Province::class, 'city_province_code', 'province_code');
    }
}
