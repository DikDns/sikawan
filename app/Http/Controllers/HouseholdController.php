<?php

namespace App\Http\Controllers;

use App\Models\Household\Household;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    /**
     * Map income string from frontend to integer for database
     *
     * @param string|null $incomeString
     * @return int|null
     */
    private function mapIncomeStringToInt(?string $incomeString): ?int
    {
        if (empty($incomeString)) {
            return null;
        }

        $mapping = [
            '<1jt' => 1,
            '1-3jt' => 2,
            '3-5jt' => 3,
            '>5jt' => 4,
        ];

        return $mapping[$incomeString] ?? null;
    }

    /**
     * Map income integer from database to string for frontend
     *
     * @param int|null $incomeInt
     * @return string|null
     */
    private function mapIncomeIntToString(?int $incomeInt): ?string
    {
        if ($incomeInt === null) {
            return null;
        }

        $mapping = [
            1 => '<1jt',
            2 => '1-3jt',
            3 => '3-5jt',
            4 => '>5jt',
        ];

        return $mapping[$incomeInt] ?? null;
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $query = Household::with(['score'])
            ->where('is_draft', false);

        $households = $query->orderBy('created_at', 'desc')
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

        $statsQuery = Household::where('is_draft', false);
        $stats = [
            'total' => $statsQuery->count(),
            'rlh' => (clone $statsQuery)->where('habitability_status', 'RLH')->count(),
            'rtlh' => (clone $statsQuery)->where('habitability_status', 'RTLH')->count(),
        ];

        return Inertia::render('households', [
            'households' => $households,
            'stats' => $stats,
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $household = Household::with([
            'technicalData',
            'members',
            'score',
            'assistances',
            'photos',
        ])->findOrFail($id);

        // Check if user has access to this household
        // Admin can see all, regular users only see their own
        if ($user->role !== 'admin' && $household->created_by !== $user->id) {
            abort(403, 'Unauthorized access to this household');
        }

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
                'monthly_income_idr' => $this->mapIncomeIntToString($household->monthly_income_idr),
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

    public function create(Request $request)
    {
        $user = $request->user();

        // Check if draft data is passed from redirect (after save)
        $redirectDraft = $request->session()->get('draft');
        $redirectHouseholdId = $request->session()->get('householdId');

        if ($redirectDraft && $redirectHouseholdId) {
            // Use draft data from redirect
            $draft = $redirectDraft;
            $draft['householdId'] = $redirectHouseholdId;

            // Clear session data
            $request->session()->forget(['draft', 'householdId']);

            return Inertia::render('households/create-household', [
                'draft' => $draft,
            ]);
        }

        // Load last draft if exists (only for current user)
        $lastDraft = Household::where('is_draft', true)
            ->where('created_by', $user->id)
            ->orderBy('updated_at', 'desc')
            ->first();

        $draftData = null;
        if ($lastDraft) {
            $generalInfo = [
                'dataCollectionDate' => $lastDraft->survey_date,
                'address' => $lastDraft->address_text,
                'provinceId' => $lastDraft->province_id,
                'provinceName' => $lastDraft->province_name,
                'regencyId' => $lastDraft->regency_id,
                'regencyName' => $lastDraft->regency_name,
                'districtId' => $lastDraft->district_id,
                'districtName' => $lastDraft->district_name,
                'villageId' => $lastDraft->village_id,
                'villageName' => $lastDraft->village_name,
                'ownershipStatusBuilding' => $lastDraft->ownership_status_building,
                'ownershipStatusLand' => $lastDraft->ownership_status_land,
                'buildingLegalStatus' => $lastDraft->building_legal_status,
                'landLegalStatus' => $lastDraft->land_legal_status,
                'nik' => $lastDraft->nik,
                'headOfHouseholdName' => $lastDraft->head_name !== 'Draft' ? $lastDraft->head_name : null,
                'mainOccupation' => $lastDraft->main_occupation,
                'income' => $this->mapIncomeIntToString($lastDraft->monthly_income_idr),
                'householdStatus' => $lastDraft->status_mbr,
                'numberOfHouseholds' => $lastDraft->kk_count,
                'maleMembers' => $lastDraft->male_count,
                'femaleMembers' => $lastDraft->female_count,
                'disabledMembers' => $lastDraft->disabled_count,
                'totalMembers' => $lastDraft->member_total,
            ];

            $draftData = [
                'householdId' => $lastDraft->id,
                'photos' => $lastDraft->photos->map(function ($photo) {
                    return [
                        'id' => $photo->id,
                        'path' => $photo->file_path,
                        'preview' => asset('storage/' . $photo->file_path),
                        'uploaded' => true,
                    ];
                })->toArray(),
                'generalInfo' => $generalInfo,
                'lastSaved' => $lastDraft->updated_at->toISOString(),
            ];
        }

        return Inertia::render('households/create-household', [
            'draft' => $draftData,
        ]);
    }

    public function store(Request $request)
    {
        // Validation and store logic
        // Will be implemented later
    }

    public function saveDraft(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'household_id' => 'nullable|exists:households,id',
            'photos' => 'nullable|string', // JSON string of photos metadata
            'photo_files' => 'nullable|array',
            'photo_files.*' => 'image|max:5120', // 5MB max per file
            'general_info' => 'nullable|string', // JSON string of general info data
        ]);

        $photosData = json_decode($request->input('photos', '[]'), true);
        $generalInfoData = json_decode($request->input('general_info', '{}'), true);

        // If household_id exists, update existing draft (only if owned by current user)
        if ($request->has('household_id') && $request->household_id) {
            $household = Household::where('id', $request->household_id)
                ->where('created_by', $user->id)
                ->where('is_draft', true)
                ->firstOrFail();
        } else {
            // Create new draft household
            $household = Household::create([
                'created_by' => $user->id,
                'head_name' => 'Draft',
                'status_mbr' => 'NON_MBR',
                'is_draft' => true,
            ]);
        }

        // Update household with general info data if provided
        if (!empty($generalInfoData)) {
            $household->update([
                'survey_date' => $generalInfoData['dataCollectionDate'] ?? null,
                'address_text' => $generalInfoData['address'] ?? null,
                'province_id' => $generalInfoData['provinceId'] ?? null,
                'province_name' => $generalInfoData['provinceName'] ?? null,
                'regency_id' => $generalInfoData['regencyId'] ?? null,
                'regency_name' => $generalInfoData['regencyName'] ?? null,
                'district_id' => $generalInfoData['districtId'] ?? null,
                'district_name' => $generalInfoData['districtName'] ?? null,
                'village_id' => $generalInfoData['villageId'] ?? null,
                'village_name' => $generalInfoData['villageName'] ?? null,
                'ownership_status_building' => $generalInfoData['ownershipStatusBuilding'] ?? null,
                'ownership_status_land' => $generalInfoData['ownershipStatusLand'] ?? null,
                'building_legal_status' => $generalInfoData['buildingLegalStatus'] ?? null,
                'land_legal_status' => $generalInfoData['landLegalStatus'] ?? null,
                'nik' => $generalInfoData['nik'] ?? null,
                'head_name' => $generalInfoData['headOfHouseholdName'] ?? 'Draft',
                'main_occupation' => $generalInfoData['mainOccupation'] ?? null,
                'monthly_income_idr' => $this->mapIncomeStringToInt($generalInfoData['income'] ?? null),
                'status_mbr' => $generalInfoData['householdStatus'] ?? 'NON_MBR',
                'kk_count' => $generalInfoData['numberOfHouseholds'] ?? null,
                'male_count' => $generalInfoData['maleMembers'] ?? null,
                'female_count' => $generalInfoData['femaleMembers'] ?? null,
                'disabled_count' => $generalInfoData['disabledMembers'] ?? null,
                'member_total' => $generalInfoData['totalMembers'] ?? null,
            ]);
        }

        // Handle photo deletions - remove photos that are not in the metadata
        if ($household->id) {
            $existingPhotoIds = $household->photos()->pluck('id')->toArray();
            $submittedPhotoIds = array_filter(
                array_column($photosData, 'id'),
                fn($id) => !empty($id) && is_numeric($id)
            );

            // Find photos to delete (exist in DB but not in submitted metadata)
            $photosToDelete = array_diff($existingPhotoIds, $submittedPhotoIds);

            if (!empty($photosToDelete)) {
                $photosToDeleteModels = $household->photos()
                    ->whereIn('id', $photosToDelete)
                    ->get();

                // Delete files from storage
                foreach ($photosToDeleteModels as $photo) {
                    if ($photo->file_path && Storage::disk('public')->exists($photo->file_path)) {
                        Storage::disk('public')->delete($photo->file_path);
                    }
                }

                // Delete photo records from database
                $household->photos()->whereIn('id', $photosToDelete)->delete();
            }
        }

        // Handle photo uploads (new files)
        if ($request->hasFile('photo_files')) {
            $photoFolder = 'households/' . date('Y/m') . '/' . $household->id;

            foreach ($request->file('photo_files') as $index => $file) {
                $path = $file->store($photoFolder, 'public');

                // Get existing photo count to set order_index
                $existingCount = $household->photos()->count();

                $household->photos()->create([
                    'file_path' => $path,
                    'order_index' => $existingCount + $index + 1,
                ]);
            }
        }

        // Update order_index for remaining photos based on metadata order
        if (!empty($photosData)) {
            foreach ($photosData as $index => $photoData) {
                if (!empty($photoData['id']) && is_numeric($photoData['id'])) {
                    $household->photos()
                        ->where('id', $photoData['id'])
                        ->update(['order_index' => $index + 1]);
                }
            }
        }

        // Reload household with photos for response
        $household->load('photos');

        // Prepare general info data for response
        $generalInfo = [
            'dataCollectionDate' => $household->survey_date,
            'address' => $household->address_text,
            'provinceId' => $household->province_id,
            'provinceName' => $household->province_name,
            'regencyId' => $household->regency_id,
            'regencyName' => $household->regency_name,
            'districtId' => $household->district_id,
            'districtName' => $household->district_name,
            'villageId' => $household->village_id,
            'villageName' => $household->village_name,
            'ownershipStatusBuilding' => $household->ownership_status_building,
            'ownershipStatusLand' => $household->ownership_status_land,
            'buildingLegalStatus' => $household->building_legal_status,
            'landLegalStatus' => $household->land_legal_status,
            'nik' => $household->nik,
            'headOfHouseholdName' => $household->head_name !== 'Draft' ? $household->head_name : null,
            'mainOccupation' => $household->main_occupation,
            'income' => $this->mapIncomeIntToString($household->monthly_income_idr),
            'householdStatus' => $household->status_mbr,
            'numberOfHouseholds' => $household->kk_count,
            'maleMembers' => $household->male_count,
            'femaleMembers' => $household->female_count,
            'disabledMembers' => $household->disabled_count,
            'totalMembers' => $household->member_total,
        ];

        // Redirect back to create page with draft data
        // Inertia will automatically pass this data to the component props
        return redirect()->route('households.create')->with([
            'householdId' => $household->id,
            'draft' => [
                'householdId' => $household->id,
                'photos' => $household->photos->map(function ($photo) {
                    return [
                        'id' => $photo->id,
                        'path' => $photo->file_path,
                        'preview' => asset('storage/' . $photo->file_path),
                        'uploaded' => true,
                    ];
                })->toArray(),
                'generalInfo' => $generalInfo,
                'lastSaved' => $household->updated_at->toISOString(),
            ],
        ]);
    }

    public function getDraft(Request $request)
    {
        $user = $request->user();

        // Only get draft for current user
        $lastDraft = Household::where('is_draft', true)
            ->where('created_by', $user->id)
            ->with('photos')
            ->orderBy('updated_at', 'desc')
            ->first();

        $draftData = null;
        if ($lastDraft) {
            $generalInfo = [
                'dataCollectionDate' => $lastDraft->survey_date,
                'address' => $lastDraft->address_text,
                'provinceId' => $lastDraft->province_id,
                'provinceName' => $lastDraft->province_name,
                'regencyId' => $lastDraft->regency_id,
                'regencyName' => $lastDraft->regency_name,
                'districtId' => $lastDraft->district_id,
                'districtName' => $lastDraft->district_name,
                'villageId' => $lastDraft->village_id,
                'villageName' => $lastDraft->village_name,
                'ownershipStatusBuilding' => $lastDraft->ownership_status_building,
                'ownershipStatusLand' => $lastDraft->ownership_status_land,
                'buildingLegalStatus' => $lastDraft->building_legal_status,
                'landLegalStatus' => $lastDraft->land_legal_status,
                'nik' => $lastDraft->nik,
                'headOfHouseholdName' => $lastDraft->head_name !== 'Draft' ? $lastDraft->head_name : null,
                'mainOccupation' => $lastDraft->main_occupation,
                'income' => $this->mapIncomeIntToString($lastDraft->monthly_income_idr),
                'householdStatus' => $lastDraft->status_mbr,
                'numberOfHouseholds' => $lastDraft->kk_count,
                'maleMembers' => $lastDraft->male_count,
                'femaleMembers' => $lastDraft->female_count,
                'disabledMembers' => $lastDraft->disabled_count,
                'totalMembers' => $lastDraft->member_total,
            ];

            $draftData = [
                'householdId' => $lastDraft->id,
                'photos' => $lastDraft->photos->map(function ($photo) {
                    return [
                        'id' => $photo->id,
                        'path' => $photo->file_path,
                        'preview' => asset('storage/' . $photo->file_path),
                        'uploaded' => true,
                    ];
                })->toArray(),
                'generalInfo' => $generalInfo,
                'lastSaved' => $lastDraft->updated_at->toISOString(),
            ];
        }

        // Return JSON response for API endpoint
        // This is called via router.get() from frontend, not a page navigation
        return response()->json([
            'draft' => $draftData,
        ]);
    }

    public function edit(Request $request, $id)
    {
        $user = $request->user();

        $household = Household::with(['technicalData', 'members'])->findOrFail($id);

        // Check if user has access to edit this household
        // Admin can edit all, regular users only edit their own
        if (($user->role !== 'admin' && $user->role !== 'superadmin') && $household->created_by !== $user->id) {
            abort(403, 'Unauthorized access to edit this household');
        }

        return Inertia::render('households/edit-household', [
            'household' => $household,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        $household = Household::findOrFail($id);

        // Check if user has access to update this household
        // Admin can update all, regular users only update their own
        if (($user->role !== 'admin' && $user->role !== 'superadmin') && $household->created_by !== $user->id) {
            abort(403, 'Unauthorized access to update this household');
        }

        // Validation and update logic
        // Will be implemented later
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $household = Household::findOrFail($id);

        // Check if user has access to delete this household
        // Admin can delete all, regular users only delete their own
        if (($user->role !== 'admin' && $user->role !== 'superadmin') && $household->created_by !== $user->id) {
            abort(403, 'Unauthorized access to delete this household');
        }

        $household->delete();

        return redirect()->route('households.index')
            ->with('success', 'Data rumah berhasil dihapus');
    }
}
