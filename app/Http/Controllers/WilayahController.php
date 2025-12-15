<?php

namespace App\Http\Controllers;

use App\Models\Wilayah\City;
use App\Models\Wilayah\Province;
use App\Models\Wilayah\SubDistrict;
use App\Models\Wilayah\Village;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WilayahController extends Controller
{
    /**
     * Get all provinces
     */
    public function provinces(): JsonResponse
    {
        $provinces = Province::orderBy('province_name')
            ->get()
            ->map(function ($province) {
                return [
                    'id' => (string) $province->province_code,
                    'name' => $province->province_name,
                ];
            });

        return response()->json($provinces);
    }

    /**
     * Get cities by province
     */
    public function cities(Request $request, string $provinceId): JsonResponse
    {
        $cities = City::where('city_province_code', $provinceId)
            ->orderBy('city_name')
            ->get()
            ->map(function ($city) {
                return [
                    'id' => (string) $city->city_code,
                    'name' => $city->city_name,
                ];
            });

        return response()->json($cities);
    }

    /**
     * Get sub-districts (kecamatan) by city
     */
    public function subDistricts(Request $request, string $cityId): JsonResponse
    {
        $subDistricts = SubDistrict::where('sub_district_city_code', $cityId)
            ->orderBy('sub_district_name')
            ->get()
            ->map(function ($subDistrict) {
                return [
                    'id' => (string) $subDistrict->sub_district_code,
                    'name' => $subDistrict->sub_district_name,
                ];
            });

        return response()->json($subDistricts);
    }

    /**
     * Get villages (desa/kelurahan) by sub-district
     */
    public function villages(Request $request, string $subDistrictId): JsonResponse
    {
        $villages = Village::where('village_sub_district_code', $subDistrictId)
            ->orderBy('village_name')
            ->get()
            ->map(function ($village) {
                return [
                    'id' => (string) $village->village_code,
                    'name' => $village->village_name,
                ];
            });

        return response()->json($villages);
    }
}
