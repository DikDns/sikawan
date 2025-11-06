<?php

namespace App\Http\Controllers;

use App\Models\Household;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    public function index()
    {
        $households = Household::with(['score'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($household) {
                return [
                    'id' => $household->id,
                    'head_name' => $household->head_name,
                    'nik' => $household->nik,
                    'address_text' => $household->address_text,
                    'province_name' => $household->province_name,
                    'regency_name' => $household->regency_name,
                    'district_name' => $household->district_name,
                    'village_name' => $household->village_name,
                    'rt_rw' => $household->rt_rw,
                    'status_mbr' => $household->status_mbr,
                    'member_total' => $household->member_total,
                    'male_count' => $household->male_count,
                    'female_count' => $household->female_count,
                    'kk_count' => $household->kk_count,
                    'habitability_status' => $household->habitability_status,
                    'ownership_status_building' => $household->ownership_status_building,
                    'latitude' => $household->latitude,
                    'longitude' => $household->longitude,
                ];
            });

        $stats = [
            'total' => Household::count(),
            'rlh' => Household::where('habitability_status', 'RLH')->count(),
            'rtlh' => Household::where('habitability_status', 'RTLH')->count(),
        ];

        return Inertia::render('households', [
            'households' => $households,
            'stats' => $stats,
        ]);
    }

    public function show($id)
    {
        $household = Household::with([
            'technicalData',
            'members',
            'score',
            'assistances',
            'photos',
        ])->findOrFail($id);

        return Inertia::render('households/detail-households', [
            'household' => [
                // General Info
                'id' => $household->id,
                'head_name' => $household->head_name,
                'nik' => $household->nik,
                'survey_date' => $household->survey_date?->format('d F Y'),
                'address_text' => $household->address_text,
                'province_id' => $household->province_id,
                'province_name' => $household->province_name,
                'regency_id' => $household->regency_id,
                'regency_name' => $household->regency_name,
                'district_id' => $household->district_id,
                'district_name' => $household->district_name,
                'village_id' => $household->village_id,
                'village_name' => $household->village_name,
                'rt_rw' => $household->rt_rw,
                'latitude' => $household->latitude,
                'longitude' => $household->longitude,

                // Ownership
                'ownership_status_building' => $household->ownership_status_building,
                'ownership_status_land' => $household->ownership_status_land,
                'building_legal_status' => $household->building_legal_status,
                'land_legal_status' => $household->land_legal_status,

                // Household Members
                'status_mbr' => $household->status_mbr,
                'kk_count' => $household->kk_count,
                'member_total' => $household->member_total,
                'male_count' => $household->male_count,
                'female_count' => $household->female_count,
                'disabled_count' => $household->disabled_count,

                // Non-Physical Data
                'main_occupation' => $household->main_occupation,
                'monthly_income_idr' => $household->monthly_income_idr,
                'health_facility_used' => $household->health_facility_used,
                'health_facility_location' => $household->health_facility_location,
                'education_facility_location' => $household->education_facility_location,

                // Status
                'habitability_status' => $household->habitability_status,
                'eligibility_score_total' => $household->eligibility_score_total,

                // Technical Data
                'technical_data' => $household->technicalData ? [
                    // A.1 Keteraturan Bangunan
                    'has_road_access' => $household->technicalData->has_road_access,
                    'road_width_category' => $household->technicalData->road_width_category,
                    'facade_faces_road' => $household->technicalData->facade_faces_road,
                    'faces_waterbody' => $household->technicalData->faces_waterbody,
                    'in_setback_area' => $household->technicalData->in_setback_area,
                    'in_hazard_area' => $household->technicalData->in_hazard_area,

                    // A.2 Kelayakan Bangunan
                    'building_length_m' => $household->technicalData->building_length_m,
                    'building_width_m' => $household->technicalData->building_width_m,
                    'floor_count' => $household->technicalData->floor_count,
                    'floor_height_m' => $household->technicalData->floor_height_m,
                    'building_area_m2' => $household->technicalData->building_area_m2,
                    'area_per_person_m2' => $household->technicalData->area_per_person_m2,

                    // Struktur
                    'has_foundation' => $household->technicalData->has_foundation,
                    'has_sloof' => $household->technicalData->has_sloof,
                    'has_ring_beam' => $household->technicalData->has_ring_beam,
                    'has_roof_structure' => $household->technicalData->has_roof_structure,
                    'has_columns' => $household->technicalData->has_columns,

                    // Material & Kondisi
                    'roof_material' => $household->technicalData->roof_material,
                    'roof_condition' => $household->technicalData->roof_condition,
                    'wall_material' => $household->technicalData->wall_material,
                    'wall_condition' => $household->technicalData->wall_condition,
                    'floor_material' => $household->technicalData->floor_material,
                    'floor_condition' => $household->technicalData->floor_condition,

                    // A.3 Akses Air
                    'water_source' => $household->technicalData->water_source,
                    'water_distance_to_septic_m' => $household->technicalData->water_distance_to_septic_m,
                    'water_fulfillment' => $household->technicalData->water_fulfillment,

                    // Listrik
                    'electricity_source' => $household->technicalData->electricity_source,
                    'electricity_power_watt' => $household->technicalData->electricity_power_watt,

                    // A.4 Sanitasi
                    'defecation_place' => $household->technicalData->defecation_place,
                    'toilet_type' => $household->technicalData->toilet_type,
                    'sewage_disposal' => $household->technicalData->sewage_disposal,

                    // A.5 Sampah
                    'waste_disposal_place' => $household->technicalData->waste_disposal_place,
                    'waste_collection_frequency' => $household->technicalData->waste_collection_frequency,
                ] : null,

                // Members
                'members' => $household->members->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'nik' => $member->nik,
                        'relationship' => $member->relationship,
                        'gender' => $member->gender,
                        'is_disabled' => $member->is_disabled,
                        'birth_date' => $member->birth_date?->format('d F Y'),
                        'occupation' => $member->occupation,
                    ];
                }),

                // Assistances
                'assistances' => $household->assistances->map(function ($assistance) {
                    return [
                        'id' => $assistance->id,
                        'assistance_type' => $assistance->assistance_type,
                        'program' => $assistance->program,
                        'funding_source' => $assistance->funding_source,
                        'status' => $assistance->status,
                        'started_at' => $assistance->started_at?->format('d F Y'),
                        'completed_at' => $assistance->completed_at?->format('d F Y'),
                        'cost_amount_idr' => $assistance->cost_amount_idr,
                        'description' => $assistance->description,
                    ];
                }),

                // Photos
                'photos' => $household->photos->map(function ($photo) {
                    return [
                        'id' => $photo->id,
                        'file_path' => $photo->file_path,
                        'caption' => $photo->caption,
                        'order_index' => $photo->order_index,
                    ];
                }),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('households/create-household');
    }

    public function store(Request $request)
    {
        // Validation and store logic
        // Will be implemented later
    }

    public function edit($id)
    {
        $household = Household::with(['technicalData', 'members'])->findOrFail($id);

        return Inertia::render('households/edit-household', [
            'household' => $household,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validation and update logic
        // Will be implemented later
    }

    public function destroy($id)
    {
        $household = Household::findOrFail($id);
        $household->delete();

        return redirect()->route('households.index')
            ->with('success', 'Data rumah berhasil dihapus');
    }
}
