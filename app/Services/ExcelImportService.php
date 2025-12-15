<?php

namespace App\Services;

use App\Models\Household\Household;
use App\Models\Household\Member;
use App\Models\Household\TechnicalData;
use App\Models\Wilayah\City;
use App\Models\Wilayah\Province;
use App\Models\Wilayah\SubDistrict;
use App\Models\Wilayah\Village;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ExcelImportService
{
    // Sheet Indices (0-based)
    const SHEET_COVER = 1;

    const SHEET_A1 = 2;

    const SHEET_A2 = 4;

    const SHEET_A3 = 5;

    const SHEET_A4 = 6;

    const SHEET_A5 = 7;

    const SHEET_A6_1 = 8;

    const SHEET_A6_2 = 9;

    const SHEET_A6_3 = 10;

    // Seeder-Aligned Mappings
    private array $occupationMap = [
        3 => 'petani-perkebunan-kehutanan-peternakan',
        4 => 'perikanan-nelayan',
        5 => 'pertambangan-galian',
        6 => 'industri-pabrik',
        7 => 'konstruksi-bangunan',
        8 => 'perdagangan-jasa',
        9 => 'pegawai-pemerintah',
    ];

    private array $waterSourceMap = [
        3 => 'SR_METERAN',
        4 => 'SR_NONMETER',
        5 => 'SUMUR_BOR',
        6 => 'SUMUR_TRL',
        7 => 'MATA_AIR_TRL',
        8 => 'HUJAN',
        9 => 'KEMASAN',
        10 => 'SUMUR_TAK_TRL',
        11 => 'MATA_AIR_TAK_TRL',
        12 => 'SUNGAI',
        13 => 'TANGKI_MOBIL',
    ];

    private array $healthFacilityMap = [
        3 => 'Rumah Sakit',
        4 => 'Praktik Dokter',
        5 => 'Puskesmas',
        6 => 'Dukun/Tradisional',
        7 => 'Bidan/Mantri',
        8 => 'Tidak Pernah',
    ];

    /**
     * Parse and return structured data from Excel for verification (no DB writes).
     */
    public function parseForVerification(string $filepath): array
    {
        $sheets = Excel::toArray(new class implements \Maatwebsite\Excel\Concerns\ToArray
        {
            public function array(array $array)
            {
                return $array;
            }
        }, $filepath);

        if (! isset($sheets[self::SHEET_A1])) {
            throw new \Exception('Sheet A.1 (Index '.self::SHEET_A1.') not found.');
        }

        // Parse region from Cover sheet (Index 0) first, fallback to Index 1
        $regionData = $this->parseRegionHeader($sheets[0] ?? []);
        // If region names are formulas, try extracting from A.1 header (Rows 3-10)
        if (str_starts_with($regionData['province_name'] ?? '', '=')) {
            $regionData = $this->parseRegionHeader($sheets[self::SHEET_A1] ?? [], true);
        }

        // Survey date is at Sheet 1 (A. DP-RT), Row 7 (index 7), Col D (index 3)
        // Value format: ": 17 Juni 2025"
        if (empty($regionData['survey_date']) && isset($sheets[1][7][3])) {
            $dateValue = trim($sheets[1][7][3] ?? '');
            // Strip leading colon and spaces
            if (str_starts_with($dateValue, ':')) {
                $dateValue = trim(substr($dateValue, 1));
            }
            $regionData['survey_date'] = $this->parseIndonesianDate($dateValue);
        }

        $results = [
            'region' => $regionData,
            'households' => [],
        ];

        // Data rows start at index 16 (Row 17 in Excel = first data row "Jimmi Mustofa" NO=1)
        // Row 15 is column header [1],[2],[3], row 16 is first data
        $startRowIndex = 16;
        $sheetA1 = $sheets[self::SHEET_A1];
        $sheetA2 = $sheets[self::SHEET_A2] ?? [];
        $sheetA3 = $sheets[self::SHEET_A3] ?? [];
        $sheetA4 = $sheets[self::SHEET_A4] ?? [];
        $sheetA5 = $sheets[self::SHEET_A5] ?? [];
        $sheetA6_1 = $sheets[self::SHEET_A6_1] ?? [];
        $sheetA6_2 = $sheets[self::SHEET_A6_2] ?? [];
        $sheetA6_3 = $sheets[self::SHEET_A6_3] ?? [];

        $rowCount = count($sheetA1);

        for ($i = $startRowIndex; $i < $rowCount; $i++) {
            $rowA1 = $sheetA1[$i] ?? [];
            $name = trim($rowA1[2] ?? '');
            $nik = $rowA1[3] ?? null;

            // Stop at "Sub - Total" row
            if (str_contains(strtolower($name), 'sub - total') || str_contains(strtolower($name), 'sub-total')) {
                break;
            }

            if (empty($name) && empty($nik)) {
                continue;
            }

            $rowA2 = $sheetA2[$i] ?? [];
            $rowA3 = $sheetA3[$i] ?? [];
            $rowA4 = $sheetA4[$i] ?? [];
            $rowA5 = $sheetA5[$i] ?? [];
            $rowA6_1 = $sheetA6_1[$i] ?? [];
            $rowA6_2 = $sheetA6_2[$i] ?? [];
            $rowA6_3 = $sheetA6_3[$i] ?? [];

            $householdData = $this->mapHouseholdData($rowA1, $rowA6_1, $rowA6_2, $rowA6_3, $regionData);
            $technicalData = $this->mapTechnicalData($rowA1, $rowA2, $rowA3, $rowA4, $rowA5, $rowA6_1);
            $memberData = $this->mapMemberData($rowA1);

            $results['households'][] = [
                'row_index' => $i + 1, // 1-based for display
                'household' => $householdData,
                'technical_data' => $technicalData,
                'member' => $memberData,
            ];
        }

        return $results;
    }

    /**
     * Import households from Excel file and save to database as drafts.
     */
    public function importToDatabase(string $filepath): array
    {
        $parsed = $this->parseForVerification($filepath);

        // Generate a unique batch ID for this import session
        $importBatchId = Str::uuid()->toString();

        $summary = [
            'total' => count($parsed['households']),
            'imported' => 0,
            'skipped' => 0,
            'errors' => [],
            'batch_id' => $importBatchId,
        ];

        DB::beginTransaction();
        try {
            foreach ($parsed['households'] as $entry) {
                try {
                    $hData = $entry['household'];
                    $hData['created_by'] = auth()->id();
                    $hData['import_batch_id'] = $importBatchId; // Mark as imported

                    $household = Household::create($hData);

                    // Create Member (Head)
                    Member::create([
                        'household_id' => $household->id,
                        'name' => $entry['member']['name'],
                        'nik' => $entry['member']['nik'],
                        'relationship' => $entry['member']['relationship'],
                        'gender' => $entry['member']['gender'],
                    ]);

                    // Create TechnicalData
                    $techData = $entry['technical_data'];
                    $techData['household_id'] = $household->id;
                    TechnicalData::create($techData);

                    $summary['imported']++;
                } catch (\Exception $e) {
                    $summary['errors'][] = "Row {$entry['row_index']}: ".$e->getMessage();
                    $summary['skipped']++;
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $summary;
    }

    private function parseRegionHeader(array $rows, bool $useAltSearch = false): array
    {
        $data = [
            'province_id' => null, 'province_name' => null,
            'regency_id' => null, 'regency_name' => null,
            'district_id' => null, 'district_name' => null,
            'village_id' => null, 'village_name' => null,
            'rt_rw' => null,
            'survey_date' => null,
        ];

        foreach ($rows as $row) {
            if (empty($row)) {
                continue;
            }
            // Cover sheet uses Column 2 for key, Column 4 for value
            $key = strtolower(trim($row[2] ?? ''));
            $value = trim($row[4] ?? '');
            // Strip leading ": " from value
            if (str_starts_with($value, ':')) {
                $value = trim(substr($value, 1));
            }

            if (str_contains($key, 'provinsi')) {
                $data['province_name'] = $value;
                $p = Province::whereRaw('LOWER(province_name) LIKE ?', ['%'.strtolower($value).'%'])->first();
                if ($p) {
                    $data['province_id'] = $p->province_code;
                }
            } elseif (str_contains($key, 'kab/kota') || str_contains($key, 'kabupaten')) {
                $data['regency_name'] = $value;
                $c = City::whereRaw('LOWER(city_name) LIKE ?', ['%'.strtolower($value).'%'])->first();
                if ($c) {
                    $data['regency_id'] = $c->city_code;
                }
            } elseif (str_contains($key, 'kecamatan')) {
                $data['district_name'] = $value;
                $d = SubDistrict::whereRaw('LOWER(sub_district_name) LIKE ?', ['%'.strtolower($value).'%'])->first();
                if ($d) {
                    $data['district_id'] = $d->sub_district_code;
                }
            } elseif (str_contains($key, 'kelurahan') || str_contains($key, 'desa')) {
                $data['village_name'] = $value;
                $v = Village::whereRaw('LOWER(village_name) LIKE ?', ['%'.strtolower($value).'%'])->first();
                if ($v) {
                    $data['village_id'] = $v->village_code;
                }
            } elseif (str_contains($key, 'rt/rw') || str_contains($key, 'rt')) {
                // Parse RT/RW format like "RT.02 RW.02" or "RT 02 RW 02" to "02/02"
                $data['rt_rw'] = $this->parseRtRw($value);
            } elseif (str_contains($key, 'tanggal')) {
                // Parse date like "17 Juni 2025"
                $data['survey_date'] = $this->parseIndonesianDate($value);
            }
        }

        return $data;
    }

    /**
     * Parse RT/RW format to "NUMBER/NUMBER"
     * Handles: "RT.02 RW.02", "RT 02 RW 02", "RT.2/RW.2", etc.
     */
    private function parseRtRw(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        // Extract numbers from RT and RW patterns
        preg_match('/RT[.\s]*(\d+)/i', $value, $rtMatch);
        preg_match('/RW[.\s]*(\d+)/i', $value, $rwMatch);

        $rt = isset($rtMatch[1]) ? ltrim($rtMatch[1], '0') ?: '0' : null;
        $rw = isset($rwMatch[1]) ? ltrim($rwMatch[1], '0') ?: '0' : null;

        if ($rt !== null && $rw !== null) {
            return sprintf('%02d/%02d', (int) $rt, (int) $rw);
        }

        return $value; // Return original if can't parse
    }

    /**
     * Parse Indonesian date format like "17 Juni 2025" to Y-m-d
     */
    private function parseIndonesianDate(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        $months = [
            'januari' => 1, 'februari' => 2, 'maret' => 3, 'april' => 4,
            'mei' => 5, 'juni' => 6, 'juli' => 7, 'agustus' => 8,
            'september' => 9, 'oktober' => 10, 'november' => 11, 'desember' => 12,
        ];

        // Match pattern like "17 Juni 2025"
        preg_match('/(\d+)\s+(\w+)\s+(\d{4})/i', $value, $match);

        if (count($match) === 4) {
            $day = (int) $match[1];
            $monthName = strtolower($match[2]);
            $year = (int) $match[3];
            $month = $months[$monthName] ?? null;

            if ($month) {
                return sprintf('%04d-%02d-%02d', $year, $month, $day);
            }
        }

        return null;
    }

    private function mapHouseholdData(array $rowA1, array $rowA6_1, array $rowA6_2, array $rowA6_3, array $region): array
    {
        return [
            'head_name' => $rowA1[2] ?? null,
            'rt_rw' => $region['rt_rw'],
            'nik' => $this->formatNik($rowA1[3] ?? null),
            'survey_date' => $region['survey_date'],
            'province_id' => $region['province_id'],
            'province_name' => $region['province_name'],
            'regency_id' => $region['regency_id'],
            'regency_name' => $region['regency_name'],
            'district_id' => $region['district_id'],
            'district_name' => $region['district_name'],
            'village_id' => $region['village_id'],
            'village_name' => $region['village_name'],
            'main_occupation' => $this->mapFromColumns($rowA6_1, $this->occupationMap),
            'status_mbr' => ! empty($rowA6_1[16]) ? 'MBR' : 'NON_MBR',
            'kk_count' => (int) ($rowA6_1[18] ?? 1),
            'male_count' => (int) ($rowA6_1[19] ?? 0),
            'female_count' => (int) ($rowA6_1[20] ?? 0),
            'member_total' => (int) ($rowA6_1[21] ?? 0),
            'disabled_count' => (int) ($rowA6_1[22] ?? 0),
            'health_facility_used' => $this->mapFromColumns($rowA6_2, $this->healthFacilityMap),
            'health_facility_location' => ! empty($rowA6_2[9]) ? 'Dalam Kelurahan/Kecamatan' : (! empty($rowA6_2[10]) ? 'Luar Kelurahan/Kecamatan' : null),
            // Education facility: 12=dalam kec, 13=luar kec, 14=di kota lain, 15=tidak sekolah, 16=tidak ada anggota usia wajib belajar
            'education_facility_location' => $this->mapEducationLocation($rowA6_2),
            'ownership_status_building' => ! empty($rowA6_3[3]) ? 'OWN' : (! empty($rowA6_3[4]) ? 'RENT' : 'OTHER'),
            'building_legal_status' => ! empty($rowA6_3[6]) ? 'IMB' : 'NONE',
            'ownership_status_land' => ! empty($rowA6_3[8]) ? 'OWN' : (! empty($rowA6_3[9]) ? 'RENT' : 'OTHER'),
            'land_legal_status' => $this->mapLandLegalStatus($rowA6_3),
            'is_draft' => true,
        ];
    }

    /**
     * Map education facility location with 5 options
     */
    private function mapEducationLocation(array $rowA6_2): ?string
    {
        if (! empty($rowA6_2[12])) {
            return 'Dalam Kelurahan/Kecamatan';
        }
        if (! empty($rowA6_2[13])) {
            return 'Luar Kecamatan';
        }
        if (! empty($rowA6_2[14])) {
            return 'Di Kota Lain';
        }
        if (! empty($rowA6_2[15])) {
            return 'Tidak Sekolah';
        }
        if (! empty($rowA6_2[16])) {
            return 'Tidak Ada Anggota Usia Wajib Belajar';
        }

        return null;
    }

    private function mapTechnicalData(array $rowA1, array $rowA2, array $rowA3, array $rowA4, array $rowA5, array $rowA6_1): array
    {
        $buildingLength = (float) ($rowA2[3] ?? 0);
        $buildingWidth = (float) ($rowA2[4] ?? 0);
        $floorCount = (int) ($rowA2[5] ?? 1);
        $buildingArea = $buildingLength * $buildingWidth * $floorCount;
        $memberTotal = (int) ($rowA6_1[21] ?? 1);
        $areaPerPerson = $memberTotal > 0 ? $buildingArea / $memberTotal : 0;

        // Determine water source - check which column has value
        $waterSource = $this->mapFromColumns($rowA3, $this->waterSourceMap);
        // Only set water_distance_category if NOT using ledeng (SR_METERAN or SR_NONMETER)
        $isLedeng = in_array($waterSource, ['SR_METERAN', 'SR_NONMETER']);
        $waterDistanceCategory = null;
        if (! $isLedeng) {
            // Check if columns 14 or 15 have value
            if (! empty($rowA3[14])) {
                $waterDistanceCategory = 'GE10M';
            } elseif (! empty($rowA3[15])) {
                $waterDistanceCategory = 'LT10M';
            }
        }

        return [
            // A.1 Keteraturan
            // Column 4 = "YA" for road access, Column 5 = "TIDAK"
            'has_road_access' => ! empty($rowA1[4]),
            'facade_faces_road' => ! empty($rowA1[6]) || ! empty($rowA1[8]) || ! empty($rowA1[10]),
            'road_width_category' => $this->mapRoadWidth($rowA1),
            'faces_waterbody' => ! empty($rowA1[13]),
            'in_setback_area' => ! empty($rowA1[16]),
            // Column 18 = "Tidak" (NO for hazard), Column 19 = "Ya" (YES for hazard)
            'in_hazard_area' => ! empty($rowA1[19]),
            // A.2 Kelayakan
            'building_length_m' => $buildingLength,
            'building_width_m' => $buildingWidth,
            'floor_count' => $floorCount,
            'building_area_m2' => $buildingArea,
            'area_per_person_m2' => round($areaPerPerson, 2),
            'roof_condition' => ! empty($rowA2[12]) ? 'GOOD' : 'LEAK',
            'wall_condition' => ! empty($rowA2[14]) ? 'GOOD' : 'DAMAGED',
            'floor_material' => ! empty($rowA2[16]) ? 'SEMEN' : 'TANAH',
            'floor_condition' => ! empty($rowA2[16]) ? 'LAYAK' : 'TIDAK_LAYAK',
            // A.3 Air
            'water_source' => $waterSource,
            'water_distance_category' => $waterDistanceCategory,
            'water_fulfillment' => ! empty($rowA3[17]) ? 'ALWAYS' : (! empty($rowA3[18]) ? 'SEASONAL' : 'NEVER'),
            // A.4 Sanitasi
            'defecation_place' => ! empty($rowA4[3]) ? 'PRIVATE_SHARED' : (! empty($rowA4[4]) ? 'PUBLIC' : 'OPEN'),
            'toilet_type' => ! empty($rowA4[7]) ? 'S_TRAP' : 'NON_S_TRAP',
            'sewage_disposal' => ! empty($rowA4[9]) ? 'SEPTIC_IPAL' : 'NON_SEPTIC',
            // A.5 Sampah
            'waste_disposal_place' => $this->mapWasteDisposal($rowA5),
            'waste_collection_frequency' => ! empty($rowA5[8]) ? 'GE2X_WEEK' : 'LT1X_WEEK',
            // A.6.1 Listrik
            'electricity_power_watt' => $this->mapElectricityPower($rowA6_1),
            'electricity_source' => ! empty($rowA6_1[14]) ? 'MENUMPANG' : 'PLN',
            'electricity_connected' => empty($rowA6_1[14]),
        ];
    }

    private function mapMemberData(array $rowA1): array
    {
        return [
            'name' => $rowA1[2] ?? 'No Name',
            'nik' => $this->formatNik($rowA1[3] ?? null),
            'relationship' => 'HEAD',
            'gender' => 'MALE', // Default, not available in file
        ];
    }

    // Helper Methods
    private function formatNik($value): ?string
    {
        if (is_null($value)) {
            return null;
        }
        // Handle scientific notation from Excel
        if (is_float($value)) {
            return number_format($value, 0, '', '');
        }

        return (string) $value;
    }

    private function mapFromColumns(array $row, array $map): ?string
    {
        foreach ($map as $col => $value) {
            if (! empty($row[$col])) {
                return $value;
            }
        }

        return null;
    }

    private function mapRoadWidth(array $row): string
    {
        if (! empty($row[6]) || ! empty($row[7])) {
            return 'LE1_5';
        }
        if (! empty($row[8]) || ! empty($row[9])) {
            return 'EQ1_5';
        }
        if (! empty($row[10]) || ! empty($row[11])) {
            return 'GT1_5';
        }

        return 'LE1_5'; // Default
    }

    private function mapLandLegalStatus(array $row): string
    {
        if (! empty($row[11])) {
            return 'SHM';
        }
        if (! empty($row[12])) {
            return 'PERJANJIAN';
        }
        if (! empty($row[13])) {
            return 'LAINNYA';
        }

        return 'TIDAK_TAHU';
    }

    private function mapWasteDisposal(array $row): string
    {
        if (! empty($row[3])) {
            return 'PRIVATE_BIN';
        }
        if (! empty($row[4])) {
            return 'COMMUNAL';
        }
        if (! empty($row[5])) {
            return 'BURNT';
        }
        if (! empty($row[6])) {
            return 'OPENSPACE';
        }
        if (! empty($row[7])) {
            return 'WATERBODY';
        }

        return 'PRIVATE_BIN';
    }

    private function mapElectricityPower(array $row): int
    {
        if (! empty($row[10])) {
            return 450;
        }
        if (! empty($row[11])) {
            return 900;
        }
        if (! empty($row[12])) {
            return 1300;
        }
        if (! empty($row[13])) {
            return 2200;
        }

        return 450; // Default
    }
}
