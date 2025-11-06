<?php

namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    protected $connection = 'wilayah';
    protected $table = 'provinces';
    protected $primaryKey = 'province_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['province_code', 'province_name'];

    public function cities()
    {
        return $this->hasMany(City::class, 'city_province_code', 'province_code');
    }
}
