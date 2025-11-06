<?php

namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    use HasFactory;

    protected $connection = 'wilayah';
    protected $table = 'villages';
    protected $primaryKey = 'village_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['village_code', 'village_name', 'village_sub_district_code'];

    public function subDistrict()
    {
        return $this->belongsTo(SubDistrict::class, 'village_sub_district_code', 'sub_district_code');
    }
}
