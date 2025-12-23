<?php

namespace App\Models\Wilayah;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $connection = 'wilayah';

    protected $table = 'provinces';

    protected $primaryKey = 'province_code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['province_code', 'province_name'];

    public $timestamps = false;
}
