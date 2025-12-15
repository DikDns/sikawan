<?php

namespace App\Http\Controllers;

use App\Models\Household\Household;
use App\Services\HouseholdScoreCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HouseholdController extends Controller
{
  /**
   * Parse income value from frontend to integer for database
   * Now accepts direct numeric values (rupiah)
   *
   * @param string|int|null $incomeValue
   * @return int|null
   */
  private function parseIncomeToInt($incomeValue): ?int
  {
    if (empty($incomeValue)) {
      return null;
    }

    // Handle direct numeric input
    if (is_numeric($incomeValue)) {
      return (int) $incomeValue;
    }

    return null;
  }

  /**
   * Format income integer for frontend display
   * Returns the raw integer value - formatting is done on frontend
   *
   * @param int|null $incomeInt
   * @return int|null
   */
  private function formatIncomeForFrontend(?int $incomeInt): ?int
  {
    return $incomeInt;
  }

  /**
   * Convert TechnicalData model to frontend format
   *
   * @param \App\Models\Household\TechnicalData|null $technicalData
   * @return array|null
   */
  private function formatTechnicalDataForFrontend($technicalData): ?array
  {
    if (!$technicalData) {
      return null;
    }

    return [
      // A.1 KETERATURAN BANGUNAN HUNIAN
      'hasRoadAccess' => $technicalData->has_road_access,
      'roadWidthCategory' => $technicalData->road_width_category,
      'facadeFacesRoad' => $technicalData->facade_faces_road,
      'facesWaterbody' => $technicalData->faces_waterbody,
      'inSetbackArea' => $technicalData->in_setback_area,
      'inHazardArea' => $technicalData->in_hazard_area,

      // A.2 KELAYAKAN BANGUNAN HUNIAN
      'buildingLengthM' => $technicalData->building_length_m,
      'buildingWidthM' => $technicalData->building_width_m,
      'floorCount' => $technicalData->floor_count,
      'floorHeightM' => $technicalData->floor_height_m,
      'areaPerPersonM2' => $technicalData->area_per_person_m2,

      // Material & Kondisi
      'roofMaterial' => $technicalData->roof_material,
      'roofCondition' => $technicalData->roof_condition,
      'wallMaterial' => $technicalData->wall_material,
      'wallCondition' => $technicalData->wall_condition,
      'floorMaterial' => $technicalData->floor_material,
      'floorCondition' => $technicalData->floor_condition,

      // A.3 AKSES AIR MINUM
      'waterSource' => $technicalData->water_source,
      'waterDistanceToSepticM' => $technicalData->water_distance_to_septic_m,
      'waterDistanceCategory' => $technicalData->water_distance_category,
      'waterFulfillment' => $technicalData->water_fulfillment,

      // A.4 PENGELOLAAN SANITASI
      'defecationPlace' => $technicalData->defecation_place,
      'toiletType' => $technicalData->toilet_type,
      'sewageDisposal' => $technicalData->sewage_disposal,

      // A.5 PENGELOLAAN SAMPAH
      'wasteDisposalPlace' => $technicalData->waste_disposal_place,
      'wasteCollectionFrequency' => $technicalData->waste_collection_frequency,

      // SUMBER LISTRIK
      'electricitySource' => $technicalData->electricity_source,
      'electricityPowerWatt' => $technicalData->electricity_power_watt,
      'electricityConnected' => $technicalData->electricity_connected,
    ];
  }

  public function index(Request $request)
  {
    $user = $request->user();

    // Filter parameters
    $habitabilityStatus = $request->query('habitability_status');
    $districtId = $request->query('district_id');
    $villageId = $request->query('village_id');
    $areaId = $request->query('area_id');

    // Search parameter
    $search = $request->query('search');

    // Sorting parameters
    $sortBy = $request->query('sort_by', 'id');
    $sortOrder = $request->query('sort_order', 'desc');

    // Validate sort column to prevent SQL injection
    $allowedSortColumns = ['id', 'head_name', 'nik', 'address_text', 'village_name', 'habitability_status', 'ownership_status_building'];
    if (!in_array($sortBy, $allowedSortColumns)) {
      $sortBy = 'id';
    }
    $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';

    $query = Household::with(['score'])
      ->where('is_draft', false);

    // Apply search filter
    if ($search) {
      $query->where(function ($q) use ($search) {
        $q->where('head_name', 'like', "%{$search}%")
          ->orWhere('address_text', 'like', "%{$search}%")
          ->orWhere('nik', 'like', "%{$search}%");
      });
    }

    // Apply filters
    if ($habitabilityStatus) {
      $query->where('habitability_status', $habitabilityStatus);
    }

    if ($districtId) {
      $query->where('district_id', $districtId);
    }

    if ($villageId) {
      $query->where('village_id', $villageId);
    }

    if ($areaId) {
      $query->where('area_id', $areaId);
    }

    // Apply sorting and pagination
    $paginator = $query->orderBy($sortBy, $sortOrder)
      ->paginate(15)
      ->through(function ($household) {
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
          'member_total' => $household->member_total ?? 0,
          'male_count' => $household->male_count ?? 0,
          'female_count' => $household->female_count ?? 0,
          'kk_count' => $household->kk_count ?? 0,
          'habitability_status' => $household->habitability_status,
          'ownership_status_building' => $household->ownership_status_building,
          'latitude' => $household->latitude,
          'longitude' => $household->longitude,
        ];
      })
      ->withQueryString();

    $statsQuery = Household::where('is_draft', false);
    $stats = [
      'total' => $statsQuery->count(),
      'rlh' => (clone $statsQuery)->where('habitability_status', 'RLH')->count(),
      'rtlh' => (clone $statsQuery)->where('habitability_status', 'RTLH')->count(),
    ];

    // Fetch all areas for filter dropdown
    $areas = \App\Models\Area::orderBy('name')
      ->get(['id', 'name'])
      ->map(fn($area) => ['value' => (string) $area->id, 'label' => $area->name]);

    return Inertia::render('households', [
      'households' => $paginator,
      'stats' => $stats,
      'filters' => $request->only(['habitability_status', 'district_id', 'village_id', 'area_id', 'search', 'sort_by', 'sort_order']),
      'areas' => $areas,
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
        'monthly_income_idr' => $this->formatIncomeForFrontend($household->monthly_income_idr),
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
          'water_distance_category' => $household->technicalData->water_distance_category,
          'water_fulfillment' => $household->technicalData->water_fulfillment,

          // Listrik
          'electricity_source' => $household->technicalData->electricity_source,
          'electricity_power_watt' => $household->technicalData->electricity_power_watt,
          'electricity_connected' => $household->technicalData->electricity_connected,

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
            'started_at' => $assistance->started_at?->toISOString(),
            'completed_at' => $assistance->completed_at?->toISOString(),
            'cost_amount_idr' => $assistance->cost_amount_idr,
            'description' => $assistance->description,
            'document_path' => $assistance->document_path,
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

    // Load last MANUAL draft if exists (only for current user, not imported)
    $lastDraft = Household::where('is_draft', true)
      ->where('created_by', $user->id)
      ->whereNull('import_batch_id') // Only manual drafts, not imported
      ->with(['photos', 'technicalData'])
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
        'rtRw' => $lastDraft->rt_rw,
        'ownershipStatusBuilding' => $lastDraft->ownership_status_building,
        'ownershipStatusLand' => $lastDraft->ownership_status_land,
        'buildingLegalStatus' => $lastDraft->building_legal_status,
        'landLegalStatus' => $lastDraft->land_legal_status,
        'nik' => $lastDraft->nik,
        'headOfHouseholdName' => $lastDraft->head_name !== 'Draft' ? $lastDraft->head_name : null,
        'mainOccupation' => $lastDraft->main_occupation,
        'income' => $this->formatIncomeForFrontend($lastDraft->monthly_income_idr),
        'householdStatus' => $lastDraft->status_mbr,
        'numberOfHouseholds' => $lastDraft->kk_count,
        'maleMembers' => $lastDraft->male_count,
        'femaleMembers' => $lastDraft->female_count,
        'disabledMembers' => $lastDraft->disabled_count,
        'totalMembers' => $lastDraft->member_total,
        'educationFacilityLocation' => $lastDraft->education_facility_location,
        'healthFacilityUsed' => $lastDraft->health_facility_used,
        'healthFacilityLocation' => $lastDraft->health_facility_location,
      ];

      $mapLocation = null;
      if ($lastDraft->latitude !== null || $lastDraft->longitude !== null) {
        $mapLocation = [
          'latitude' => $lastDraft->latitude,
          'longitude' => $lastDraft->longitude,
        ];
      }

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
        'technicalData' => $this->formatTechnicalDataForFrontend($lastDraft->technicalData),
        'mapLocation' => $mapLocation,
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
      'technical_data' => 'nullable|string', // JSON string of technical data
      'map_location' => 'nullable|string', // JSON string of map location data
    ]);

    $photosData = json_decode($request->input('photos', '[]'), true);
    $generalInfoData = json_decode($request->input('general_info', '{}'), true);
    $technicalDataInput = json_decode($request->input('technical_data', '{}'), true);
    $mapLocationData = json_decode($request->input('map_location', '{}'), true);

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
        'rt_rw' => $generalInfoData['rtRw'] ?? null,
        'ownership_status_building' => $generalInfoData['ownershipStatusBuilding'] ?? null,
        'ownership_status_land' => $generalInfoData['ownershipStatusLand'] ?? null,
        'building_legal_status' => $generalInfoData['buildingLegalStatus'] ?? null,
        'land_legal_status' => $generalInfoData['landLegalStatus'] ?? null,
        'nik' => $generalInfoData['nik'] ?? null,
        'head_name' => $generalInfoData['headOfHouseholdName'] ?? 'Draft',
        'main_occupation' => $generalInfoData['mainOccupation'] ?? null,
        'monthly_income_idr' => $this->parseIncomeToInt($generalInfoData['income'] ?? null),
        'status_mbr' => $generalInfoData['householdStatus'] ?? 'NON_MBR',
        'kk_count' => $generalInfoData['numberOfHouseholds'] ?? 0,
        'male_count' => $generalInfoData['maleMembers'] ?? 0,
        'female_count' => $generalInfoData['femaleMembers'] ?? 0,
        'disabled_count' => $generalInfoData['disabledMembers'] ?? 0,
        'member_total' => $generalInfoData['totalMembers'] ?? 0,
        'education_facility_location' => $generalInfoData['educationFacilityLocation'] ?? null,
        'health_facility_used' => $generalInfoData['healthFacilityUsed'] ?? null,
        'health_facility_location' => $generalInfoData['healthFacilityLocation'] ?? null,
      ]);
    }

    // Reload household to get updated member_total
    $household->refresh();

    // Update or create technical data if provided
    if (!empty($technicalDataInput)) {
      // Calculate building area
      $buildingArea = null;
      if (isset($technicalDataInput['buildingLengthM']) && isset($technicalDataInput['buildingWidthM']) && isset($technicalDataInput['floorCount'])) {
        $buildingArea = $technicalDataInput['buildingLengthM'] * $technicalDataInput['buildingWidthM'] * $technicalDataInput['floorCount'];
      }

      // Calculate area per person (building_area_m2 / member_total)
      $areaPerPerson = null;
      if ($buildingArea !== null && $household->member_total && $household->member_total > 0) {
        $areaPerPerson = $buildingArea / $household->member_total;
      }

      $household->technicalData()->updateOrCreate(
        ['household_id' => $household->id],
        [
          // A.1 KETERATURAN BANGUNAN HUNIAN
          'has_road_access' => $technicalDataInput['hasRoadAccess'] ?? null,
          'road_width_category' => $technicalDataInput['roadWidthCategory'] ?? null,
          'facade_faces_road' => $technicalDataInput['facadeFacesRoad'] ?? null,
          'faces_waterbody' => $technicalDataInput['facesWaterbody'] === 'NONE' ? null : ($technicalDataInput['facesWaterbody'] ?? null),
          'in_setback_area' => $technicalDataInput['inSetbackArea'] === 'NONE' ? null : ($technicalDataInput['inSetbackArea'] ?? null),
          'in_hazard_area' => $technicalDataInput['inHazardArea'] ?? null,

          // A.2 KELAYAKAN BANGUNAN HUNIAN
          'building_length_m' => $technicalDataInput['buildingLengthM'] ?? null,
          'building_width_m' => $technicalDataInput['buildingWidthM'] ?? null,
          'floor_count' => $technicalDataInput['floorCount'] ?? null,
          'floor_height_m' => $technicalDataInput['floorHeightM'] ?? null,
          'building_area_m2' => $buildingArea,
          'area_per_person_m2' => $areaPerPerson,

          // Material & Kondisi
          'roof_material' => $technicalDataInput['roofMaterial'] ?? null,
          'roof_condition' => $technicalDataInput['roofCondition'] ?? null,
          'wall_material' => $technicalDataInput['wallMaterial'] ?? null,
          'wall_condition' => $technicalDataInput['wallCondition'] ?? null,
          'floor_material' => $technicalDataInput['floorMaterial'] ?? null,
          'floor_condition' => $technicalDataInput['floorCondition'] ?? null,

          // A.3 AKSES AIR MINUM
          'water_source' => $technicalDataInput['waterSource'] ?? null,
          'water_distance_to_septic_m' => $technicalDataInput['waterDistanceToSepticM'] ?? null,
          'water_distance_category' => $technicalDataInput['waterDistanceCategory'] ?? null,
          'water_fulfillment' => $technicalDataInput['waterFulfillment'] ?? null,

          // A.4 PENGELOLAAN SANITASI
          'defecation_place' => $technicalDataInput['defecationPlace'] ?? null,
          'toilet_type' => $technicalDataInput['toiletType'] ?? null,
          'sewage_disposal' => $technicalDataInput['sewageDisposal'] ?? null,

          // A.5 PENGELOLAAN SAMPAH
          'waste_disposal_place' => $technicalDataInput['wasteDisposalPlace'] ?? null,
          'waste_collection_frequency' => $technicalDataInput['wasteCollectionFrequency'] ?? null,

          // SUMBER LISTRIK
          'electricity_source' => $technicalDataInput['electricitySource'] ?? null,
          'electricity_power_watt' => $technicalDataInput['electricityPowerWatt'] ?? null,
          'electricity_connected' => $technicalDataInput['electricityConnected'] ?? null,
        ]
      );
    }

    // Update map location if provided
    if (!empty($mapLocationData)) {
      $household->update([
        'latitude' => $mapLocationData['latitude'] ?? null,
        'longitude' => $mapLocationData['longitude'] ?? null,
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

    // Reload household with photos and technical data for response
    $household->load(['photos', 'technicalData']);

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
      'rtRw' => $household->rt_rw,
      'ownershipStatusBuilding' => $household->ownership_status_building,
      'ownershipStatusLand' => $household->ownership_status_land,
      'buildingLegalStatus' => $household->building_legal_status,
      'landLegalStatus' => $household->land_legal_status,
      'nik' => $household->nik,
      'headOfHouseholdName' => $household->head_name !== 'Draft' ? $household->head_name : null,
      'mainOccupation' => $household->main_occupation,
      'income' => $this->formatIncomeForFrontend($household->monthly_income_idr),
      'householdStatus' => $household->status_mbr,
      'numberOfHouseholds' => $household->kk_count,
      'maleMembers' => $household->male_count,
      'femaleMembers' => $household->female_count,
      'disabledMembers' => $household->disabled_count,
      'totalMembers' => $household->member_total,
      'educationFacilityLocation' => $household->education_facility_location,
      'healthFacilityUsed' => $household->health_facility_used,
      'healthFacilityLocation' => $household->health_facility_location,
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
        'technicalData' => $this->formatTechnicalDataForFrontend($household->technicalData),
        'lastSaved' => $household->updated_at->toISOString(),
      ],
    ]);
  }

  public function getDraft(Request $request)
  {
    $user = $request->user();

    // Only get MANUAL draft for current user (not imported)
    $lastDraft = Household::where('is_draft', true)
      ->where('created_by', $user->id)
      ->whereNull('import_batch_id') // Only manual drafts, not imported
      ->with(['photos', 'technicalData'])
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
        'rtRw' => $lastDraft->rt_rw,
        'ownershipStatusBuilding' => $lastDraft->ownership_status_building,
        'ownershipStatusLand' => $lastDraft->ownership_status_land,
        'buildingLegalStatus' => $lastDraft->building_legal_status,
        'landLegalStatus' => $lastDraft->land_legal_status,
        'nik' => $lastDraft->nik,
        'headOfHouseholdName' => $lastDraft->head_name !== 'Draft' ? $lastDraft->head_name : null,
        'mainOccupation' => $lastDraft->main_occupation,
        'income' => $this->formatIncomeForFrontend($lastDraft->monthly_income_idr),
        'householdStatus' => $lastDraft->status_mbr,
        'numberOfHouseholds' => $lastDraft->kk_count ?? 0,
        'maleMembers' => $lastDraft->male_count ?? 0,
        'femaleMembers' => $lastDraft->female_count ?? 0,
        'disabledMembers' => $lastDraft->disabled_count ?? 0,
        'totalMembers' => $lastDraft->member_total ?? 0,
        'educationFacilityLocation' => $lastDraft->education_facility_location,
        'healthFacilityUsed' => $lastDraft->health_facility_used,
        'healthFacilityLocation' => $lastDraft->health_facility_location,
      ];

      $mapLocation = null;
      if ($lastDraft->latitude !== null || $lastDraft->longitude !== null) {
        $mapLocation = [
          'latitude' => $lastDraft->latitude,
          'longitude' => $lastDraft->longitude,
        ];
      }

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
        'technicalData' => $this->formatTechnicalDataForFrontend($lastDraft->technicalData),
        'mapLocation' => $mapLocation,
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

    $household = Household::with(['technicalData', 'members', 'photos'])
      ->findOrFail($id);

    // Check if user has access to edit this household
    // Admin can edit all, regular users only edit their own
    if (($user->role !== 'admin' && $user->role !== 'superadmin') && $household->created_by !== $user->id) {
      abort(403, 'Unauthorized access to edit this household');
    }

    // Format data for edit page (similar to show but with different structure)
    return Inertia::render('households/edit-household', [
      'household' => [
        'id' => $household->id,
        'head_name' => $household->head_name,
        'nik' => $household->nik,
        'survey_date' => $household->survey_date?->format('Y-m-d'),
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
        'monthly_income_idr' => $this->formatIncomeForFrontend($household->monthly_income_idr),
        'health_facility_used' => $household->health_facility_used,
        'health_facility_location' => $household->health_facility_location,
        'education_facility_location' => $household->education_facility_location,

        // Technical Data
        'technical_data' => $household->technicalData ? [
          'has_road_access' => $household->technicalData->has_road_access,
          'road_width_category' => $household->technicalData->road_width_category,
          'facade_faces_road' => $household->technicalData->facade_faces_road,
          'faces_waterbody' => $household->technicalData->faces_waterbody,
          'in_setback_area' => $household->technicalData->in_setback_area,
          'in_hazard_area' => $household->technicalData->in_hazard_area,
          'building_length_m' => $household->technicalData->building_length_m,
          'building_width_m' => $household->technicalData->building_width_m,
          'floor_count' => $household->technicalData->floor_count,
          'floor_height_m' => $household->technicalData->floor_height_m,
          'roof_material' => $household->technicalData->roof_material,
          'roof_condition' => $household->technicalData->roof_condition,
          'wall_material' => $household->technicalData->wall_material,
          'wall_condition' => $household->technicalData->wall_condition,
          'floor_material' => $household->technicalData->floor_material,
          'floor_condition' => $household->technicalData->floor_condition,
          'water_source' => $household->technicalData->water_source,
          'water_distance_to_septic_m' => $household->technicalData->water_distance_to_septic_m,
          'water_distance_category' => $household->technicalData->water_distance_category,
          'water_fulfillment' => $household->technicalData->water_fulfillment,
          'defecation_place' => $household->technicalData->defecation_place,
          'toilet_type' => $household->technicalData->toilet_type,
          'sewage_disposal' => $household->technicalData->sewage_disposal,
          'waste_disposal_place' => $household->technicalData->waste_disposal_place,
          'waste_collection_frequency' => $household->technicalData->waste_collection_frequency,
          'electricity_source' => $household->technicalData->electricity_source,
          'electricity_power_watt' => $household->technicalData->electricity_power_watt,
          'electricity_connected' => $household->technicalData->electricity_connected,
        ] : null,

        // Photos
        'photos' => $household->photos->sortBy('order_index')->map(function ($photo) {
          return [
            'id' => $photo->id,
            'file_path' => $photo->file_path,
            'caption' => $photo->caption,
            'order_index' => $photo->order_index,
          ];
        })->values()->toArray(),
      ],
    ]);
  }

  public function update(Request $request, $id)
  {
    // Log immediately at the start
    // Check all input methods to see what's available
    Log::info('Household Update Request - START', [
      'household_id' => $id,
      'method' => $request->method(),
      'url' => $request->fullUrl(),
      'content_type' => $request->header('Content-Type'),
      'has_general_info' => $request->has('general_info'),
      'has_technical_data' => $request->has('technical_data'),
      'has_map_location' => $request->has('map_location'),
      'has_photos' => $request->has('photos'),
      'has_photo_files' => $request->hasFile('photo_files'),
      'all_input_keys' => array_keys($request->all()),
      'input_general_info' => $request->input('general_info'),
      'input_technical_data' => $request->input('technical_data'),
      'input_map_location' => $request->input('map_location'),
      'input_photos' => $request->input('photos'),
    ]);

    $user = $request->user();

    $household = Household::findOrFail($id);

    // Check if user has access to update this household
    // Admin can update all, regular users only update their own
    if (($user->role !== 'admin' && $user->role !== 'superadmin') && $household->created_by !== $user->id) {
      Log::warning('Household Update - Unauthorized', ['household_id' => $id, 'user_id' => $user->id]);
      abort(403, 'Unauthorized access to update this household');
    }

    $request->validate([
      'photos' => 'nullable|string', // JSON string of photos metadata
      'photo_files' => 'nullable|array',
      'photo_files.*' => 'image|max:5120', // 5MB max per file
      'general_info' => 'nullable|string', // JSON string of general info data
      'technical_data' => 'nullable|string', // JSON string of technical data
      'map_location' => 'nullable|string', // JSON string of map location data
    ]);

    $photosData = json_decode($request->input('photos', '[]'), true) ?? [];
    $generalInfoData = json_decode($request->input('general_info', '{}'), true) ?? [];
    $technicalDataInput = json_decode($request->input('technical_data', '{}'), true) ?? [];
    $mapLocationData = json_decode($request->input('map_location', '{}'), true) ?? [];

    // Debug logging after parsing
    Log::info('Household Update Request - Data Parsed', [
      'household_id' => $id,
      'photos_count' => count($photosData),
      'general_info_keys' => array_keys($generalInfoData ?? []),
      'technical_data_keys' => array_keys($technicalDataInput ?? []),
      'map_location' => $mapLocationData,
      'general_info_raw' => $request->input('general_info'),
      'technical_data_raw' => $request->input('technical_data'),
      'map_location_raw' => $request->input('map_location'),
    ]);

    // Store raw inputs for logging
    $generalInfoInput = $request->input('general_info');
    $technicalDataInputRaw = $request->input('technical_data');
    $mapLocationInputRaw = $request->input('map_location');

    DB::beginTransaction();

    try {
      // Always update household with general info data if provided
      // Use input() instead of has() because has() may not work with FormData in PUT requests
      if ($generalInfoInput !== null && $generalInfoInput !== '') {
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
          'rt_rw' => $generalInfoData['rtRw'] ?? null,
          'ownership_status_building' => $generalInfoData['ownershipStatusBuilding'] ?? null,
          'ownership_status_land' => $generalInfoData['ownershipStatusLand'] ?? null,
          'building_legal_status' => $generalInfoData['buildingLegalStatus'] ?? null,
          'land_legal_status' => $generalInfoData['landLegalStatus'] ?? null,
          'nik' => $generalInfoData['nik'] ?? null,
          'head_name' => $generalInfoData['headOfHouseholdName'] ?? $household->head_name,
          'main_occupation' => $generalInfoData['mainOccupation'] ?? null,
          'monthly_income_idr' => $this->parseIncomeToInt($generalInfoData['income'] ?? null),
          'status_mbr' => $generalInfoData['householdStatus'] ?? $household->status_mbr,
          'kk_count' => $generalInfoData['numberOfHouseholds'] ?? null,
          'male_count' => $generalInfoData['maleMembers'] ?? null,
          'female_count' => $generalInfoData['femaleMembers'] ?? null,
          'disabled_count' => $generalInfoData['disabledMembers'] ?? null,
          'member_total' => $generalInfoData['totalMembers'] ?? null,
        ]);
      }

      // Reload household to get updated member_total
      $household->refresh();

      // Always update or create technical data if provided
      if ($technicalDataInputRaw !== null && $technicalDataInputRaw !== '') {
        // Calculate building area
        $buildingArea = null;
        if (isset($technicalDataInput['buildingLengthM']) && isset($technicalDataInput['buildingWidthM']) && isset($technicalDataInput['floorCount'])) {
          $buildingArea = $technicalDataInput['buildingLengthM'] * $technicalDataInput['buildingWidthM'] * $technicalDataInput['floorCount'];
        }

        // Calculate area per person (building_area_m2 / member_total)
        $areaPerPerson = null;
        if ($buildingArea !== null && $household->member_total && $household->member_total > 0) {
          $areaPerPerson = $buildingArea / $household->member_total;
        }

        $household->technicalData()->updateOrCreate(
          ['household_id' => $household->id],
          [
            // A.1 KETERATURAN BANGUNAN HUNIAN
            'has_road_access' => $technicalDataInput['hasRoadAccess'] ?? null,
            'road_width_category' => $technicalDataInput['roadWidthCategory'] ?? null,
            'facade_faces_road' => $technicalDataInput['facadeFacesRoad'] ?? null,
            'faces_waterbody' => $technicalDataInput['facesWaterbody'] === 'NONE' ? null : ($technicalDataInput['facesWaterbody'] ?? null),
            'in_setback_area' => $technicalDataInput['inSetbackArea'] === 'NONE' ? null : ($technicalDataInput['inSetbackArea'] ?? null),
            'in_hazard_area' => $technicalDataInput['inHazardArea'] ?? null,

            // A.2 KELAYAKAN BANGUNAN HUNIAN
            'building_length_m' => $technicalDataInput['buildingLengthM'] ?? null,
            'building_width_m' => $technicalDataInput['buildingWidthM'] ?? null,
            'floor_count' => $technicalDataInput['floorCount'] ?? null,
            'floor_height_m' => $technicalDataInput['floorHeightM'] ?? null,
            'building_area_m2' => $buildingArea,
            'area_per_person_m2' => $areaPerPerson,

            // Material & Kondisi
            'roof_material' => $technicalDataInput['roofMaterial'] ?? null,
            'roof_condition' => $technicalDataInput['roofCondition'] ?? null,
            'wall_material' => $technicalDataInput['wallMaterial'] ?? null,
            'wall_condition' => $technicalDataInput['wallCondition'] ?? null,
            'floor_material' => $technicalDataInput['floorMaterial'] ?? null,
            'floor_condition' => $technicalDataInput['floorCondition'] ?? null,

            // A.3 AKSES AIR MINUM
            'water_source' => $technicalDataInput['waterSource'] ?? null,
            'water_distance_to_septic_m' => $technicalDataInput['waterDistanceToSepticM'] ?? null,
            'water_distance_category' => $technicalDataInput['waterDistanceCategory'] ?? null,
            'water_fulfillment' => $technicalDataInput['waterFulfillment'] ?? null,

            // A.4 PENGELOLAAN SANITASI
            'defecation_place' => $technicalDataInput['defecationPlace'] ?? null,
            'toilet_type' => $technicalDataInput['toiletType'] ?? null,
            'sewage_disposal' => $technicalDataInput['sewageDisposal'] ?? null,

            // A.5 PENGELOLAAN SAMPAH
            'waste_disposal_place' => $technicalDataInput['wasteDisposalPlace'] ?? null,
            'waste_collection_frequency' => $technicalDataInput['wasteCollectionFrequency'] ?? null,

            // SUMBER LISTRIK
            'electricity_source' => $technicalDataInput['electricitySource'] ?? null,
            'electricity_power_watt' => $technicalDataInput['electricityPowerWatt'] ?? null,
            'electricity_connected' => $technicalDataInput['electricityConnected'] ?? null,
          ]
        );
      }

      // Always update map location if provided
      if ($mapLocationInputRaw !== null && $mapLocationInputRaw !== '') {
        $household->update([
          'latitude' => $mapLocationData['latitude'] ?? null,
          'longitude' => $mapLocationData['longitude'] ?? null,
        ]);
      }

      // Handle photo deletions - remove photos that are not in the metadata
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

      // Recalculate scores after update
      if ($household->technicalData) {
        $calculator = new HouseholdScoreCalculator();
        $calculator->calculateAndSave($household);
      }

      DB::commit();

      Log::info('Household Update - Success', [
        'household_id' => $id,
        'updated_fields' => [
          'general_info' => $generalInfoInput !== null && $generalInfoInput !== '',
          'technical_data' => $technicalDataInputRaw !== null && $technicalDataInputRaw !== '',
          'map_location' => $mapLocationInputRaw !== null && $mapLocationInputRaw !== '',
          'photos' => $request->has('photos') || $request->hasFile('photo_files'),
        ],
      ]);

      // Reload household with all relationships for response
      $household->refresh();
      $household->load(['photos', 'technicalData', 'members']);

      // Use back() for Inertia - 303 See Other is normal for redirects
      // Inertia will handle it properly with preserveState: true
      // The log should appear in Laravel log file (storage/logs/laravel.log)
      return back()->with('success', 'Data rumah berhasil diperbarui');
    } catch (\Exception $e) {
      DB::rollBack();

      Log::error('Household Update - Error', [
        'household_id' => $id,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
      ]);

      return redirect()->route('households.edit', $household->id)
        ->withErrors([
          'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
        ]);
    }
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

    // Check returnTo parameter and redirect accordingly
    $returnTo = $request->query('returnTo');
    if ($returnTo === 'preview') {
      return redirect()->route('households.preview')
        ->with('success', 'Data rumah berhasil dihapus');
    }

    return redirect()->route('households.index')
      ->with('success', 'Data rumah berhasil dihapus');
  }

  /**
   * Finalize household - calculate scores and set is_draft to false
   * Can be called multiple times to recalculate scores on update
   */
  public function finalize(Request $request, $id)
  {
    $user = $request->user();

    // Find household
    $household = Household::where('id', $id)
      ->where('created_by', $user->id)
      ->firstOrFail();

    // Check if technical data exists
    if (!$household->technicalData) {
      return response()->json([
        'message' => 'Data teknis belum lengkap. Mohon lengkapi data teknis terlebih dahulu.',
      ], 400);
    }

    DB::beginTransaction();

    try {
      // Calculate scores (recalculate if already finalized for updates)
      $calculator = new HouseholdScoreCalculator();
      $result = $calculator->calculateAndSave($household);

      // Set is_draft to false (or keep it false if already finalized)
      $household->update([
        'is_draft' => false,
      ]);

      DB::commit();

      $message = $household->wasChanged('is_draft')
        ? 'Pendataan rumah berhasil disimpan'
        : 'Perubahan data berhasil disimpan';

      return response()->json([
        'message' => $message,
        'data' => [
          'household_id' => $household->id,
          'habitability_status' => $result['habitability_status'],
          'total_score' => $result['total_score'],
          'scores' => $result['scores'],
        ],
      ]);
    } catch (\Exception $e) {
      DB::rollBack();

      return response()->json([
        'message' => 'Gagal menyimpan data: ' . $e->getMessage(),
      ], 500);
    }
  }

  /**
   * Validate if a household is still a valid draft for the current user
   * Used by frontend to check localStorage draft IDs before using them
   */
  public function validateDraft(Request $request, $id)
  {
    $user = $request->user();

    $household = Household::find($id);

    // Check if household exists
    if (!$household) {
      return response()->json([
        'valid' => false,
        'reason' => 'not_found',
      ], 404);
    }

    // Check if it belongs to current user
    if ($household->created_by !== $user->id) {
      return response()->json([
        'valid' => false,
        'reason' => 'not_owner',
      ], 403);
    }

    // Check if it's still a draft
    if (!$household->is_draft) {
      return response()->json([
        'valid' => false,
        'reason' => 'not_draft',
      ]);
    }

    return response()->json([
      'valid' => true,
      'householdId' => $household->id,
    ]);
  }

  /**
   * Show the import page with file upload form
   */
  public function importPage(Request $request)
  {
    $areas = \App\Models\Area::orderBy('name')
      ->get(['id', 'name'])
      ->map(fn($area) => ['value' => (string) $area->id, 'label' => $area->name]);

    return Inertia::render('households/import', [
      'areas' => $areas,
    ]);
  }

  /**
   * Process file upload and create draft households from Excel
   */
  public function importStore(Request $request)
  {
    $request->validate([
      'file' => 'required|file|mimes:xlsx,xls',
    ]);

    $importService = app(\App\Services\ExcelImportService::class);

    try {
      $file = $request->file('file');

      $summary = $importService->importToDatabase($file->getPathname());

      return redirect()->route('households.preview')->with('success',
        "Berhasil mengimpor {$summary['imported']} rumah tangga. {$summary['skipped']} dilewati."
      );
    } catch (\Exception $e) {
      Log::error('Import Error: ' . $e->getMessage());
      return back()->withErrors(['file' => 'Gagal mengimpor: ' . $e->getMessage()]);
    }
  }

  /**
   * Show preview of imported (draft) households
   */
  public function previewIndex(Request $request)
  {
    $user = $request->user();

    $query = Household::with(['technicalData', 'members'])
      ->where('is_draft', true);

    // Admin sees all, regular users see their own
    if ($user->role !== 'admin' && $user->role !== 'superadmin') {
      $query->where('created_by', $user->id);
    }

    $households = $query->orderBy('created_at', 'desc')
      ->get()
      ->map(function ($household) {
        return [
          'id' => $household->id,
          'head_name' => $household->head_name,
          'nik' => $household->nik,
          'province_name' => $household->province_name,
          'regency_name' => $household->regency_name,
          'district_name' => $household->district_name,
          'village_name' => $household->village_name,
          'status_mbr' => $household->status_mbr,
          'member_total' => $household->member_total ?? 0,
          'ownership_status_building' => $household->ownership_status_building,
          'created_at' => $household->created_at->format('d M Y H:i'),
        ];
      });

    $stats = [
      'total' => $households->count(),
    ];

    return Inertia::render('households/preview', [
      'households' => $households,
      'stats' => $stats,
    ]);
  }

  /**
   * Publish all draft households (set is_draft to false)
   */
  public function publishAll(Request $request)
  {
    $user = $request->user();

    $query = Household::where('is_draft', true);

    // Admin publishes all, regular users publish their own
    if ($user->role !== 'admin' && $user->role !== 'superadmin') {
      $query->where('created_by', $user->id);
    }

    $households = $query->get();
    $count = $households->count();

    if ($count === 0) {
      return redirect()->route('households.preview')->with('error', 'Tidak ada data draft untuk dipublikasi.');
    }

    DB::beginTransaction();

    try {
      $calculator = new HouseholdScoreCalculator();

      foreach ($households as $household) {
        // Calculate and save scores
        // This will update habitability_status and eligibility_score_total
        // and creates/updates HouseholdScore record
        $calculator->calculateAndSave($household);

        // Set as published
        $household->update(['is_draft' => false]);
      }

      DB::commit();

      return redirect()->route('households.index')->with('success',
        "Berhasil mempublikasi $count rumah tangga."
      );
    } catch (\Exception $e) {
      DB::rollBack();
      Log::error('Publish All Error: ' . $e->getMessage());

      return redirect()->route('households.preview')->with('error',
        "Gagal mempublikasi data: " . $e->getMessage()
      );
    }
  }
}
