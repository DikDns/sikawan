<?php

namespace Database\Seeders;

use App\Models\Household\Household;
use App\Models\Household\Member;
use App\Models\Household\TechnicalData;
use App\Models\Household\Score;
use App\Models\Household\Assistance;
use App\Models\Household\Photo;
use App\Models\Area;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HouseholdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seeds households in Muara Enim, Sumatera Selatan
     *
     * Wilayah IDs from: vendor/maftuhichsan/sqlite-wilayah-indonesia/records.sqlite
     * Center: -3.6632234, 103.7781606
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // Get first user (superadmin) as creator for seeded households
            $creator = User::first();
            if (!$creator) {
                throw new \Exception('No user found. Please run DatabaseSeeder first to create a user.');
            }

            // Data wilayah Muara Enim, Sumatera Selatan
            // IDs from wilayah SQLite database
            $locations = [
                [
                    'province_id' => '16',
                    'province_name' => 'SUMATERA SELATAN',
                    'regency_id' => '1603',
                    'regency_name' => 'MUARA ENIM',
                    'district_id' => '1603050',
                    'district_name' => 'MUARA ENIM',
                    'village_id' => '1603050001',
                    'village_name' => 'PASAR II',
                    'lat' => -3.6632,
                    'lng' => 103.7782,
                ],
                [
                    'province_id' => '16',
                    'province_name' => 'SUMATERA SELATAN',
                    'regency_id' => '1603',
                    'regency_name' => 'MUARA ENIM',
                    'district_id' => '1603040',
                    'district_name' => 'LAWANG KIDUL',
                    'village_id' => '1603040001',
                    'village_name' => 'KARANG AGUNG',
                    'lat' => -3.6500,
                    'lng' => 103.7650,
                ],
                [
                    'province_id' => '16',
                    'province_name' => 'SUMATERA SELATAN',
                    'regency_id' => '1603',
                    'regency_name' => 'MUARA ENIM',
                    'district_id' => '1603020',
                    'district_name' => 'TANJUNG AGUNG',
                    'village_id' => '1603020001',
                    'village_name' => 'TANJUNG AGUNG',
                    'lat' => -3.6850,
                    'lng' => 103.7920,
                ],
                [
                    'province_id' => '16',
                    'province_name' => 'SUMATERA SELATAN',
                    'regency_id' => '1603',
                    'regency_name' => 'MUARA ENIM',
                    'district_id' => '1603031',
                    'district_name' => 'RAMBANG',
                    'village_id' => '1603031001',
                    'village_name' => 'RAMBANG JAYA',
                    'lat' => -3.6450,
                    'lng' => 103.8050,
                ],
                [
                    'province_id' => '16',
                    'province_name' => 'SUMATERA SELATAN',
                    'regency_id' => '1603',
                    'regency_name' => 'MUARA ENIM',
                    'district_id' => '1603051',
                    'district_name' => 'UJAN MAS',
                    'village_id' => '1603051001',
                    'village_name' => 'UJAN MAS',
                    'lat' => -3.7200,
                    'lng' => 103.7400,
                ],
            ];

            $names = [
                'Budi Santoso', 'Siti Nurjanah', 'Ahmad Hidayat', 'Dewi Lestari',
                'Joko Widodo', 'Sri Rahayu', 'Hendra Gunawan', 'Rina Wijaya',
                'Agus Setiawan', 'Maya Sari', 'Rudi Hartono', 'Ani Susanti',
                'Bambang Prasetyo', 'Lina Marlina', 'Dedi Kurniawan', 'Fitri Handayani',
                'Eko Wahyudi', 'Yuli Astuti', 'Fauzi Rahman', 'Nurul Hidayah',
                'Tono Sumarno', 'Ratna Dewi', 'Wawan Setiawan', 'Evi Susanti',
                'Indra Kusuma', 'Diah Permata', 'Riko Saputra', 'Linda Wati',
                'Doni Prasetya', 'Mega Sari', 'Yoga Pratama', 'Siska Amelia',
                'Adi Nugroho', 'Rina Anggraini', 'Hadi Wijaya', 'Lisa Melati',
                'Budi Cahyono', 'Dewi Fortuna', 'Andi Saputra', 'Nina Kartika',
                'Rahmat Hidayat', 'Sari Indah', 'Dimas Prasetyo', 'Ayu Lestari',
                'Fajar Ramadhan', 'Wulan Dari', 'Heru Sutanto', 'Dina Mariana',
                'Yanto Wijaya', 'Ika Puspita', 'Rian Pratama', 'Tari Rahmawati',
            ];

            $occupations = [
                'pegawai-pemerintah',
                'perdagangan-jasa',
                'petani-perkebunan-kehutanan-peternakan',
                'perikanan-nelayan',
                'pertambangan-galian',
                'industri-pabrik',
                'konstruksi-bangunan',
            ];

            $incomeOptions = [1, 2, 3, 4];

            $streets = [
                'Jl. Merdeka', 'Jl. Sudirman', 'Jl. Gatot Subroto', 'Jl. Ahmad Yani',
                'Jl. Diponegoro', 'Jl. Veteran', 'Jl. Pahlawan', 'Jl. Kemerdekaan',
                'Jl. Mawar', 'Jl. Melati', 'Jl. Anggrek', 'Jl. Kenanga',
            ];

            // Get available areas to link households (for dashboard regionStats)
            $areas = Area::all();
            $areaIds = $areas->pluck('id')->toArray();

            // Generate 50 households
            for ($i = 0; $i < 50; $i++) {
                $location = $locations[$i % count($locations)];
                $isMBR = rand(0, 10) > 3;
                $isRTLH = rand(0, 10) > 6;
                $memberTotal = rand(2, 7);
                $maleCount = rand(1, $memberTotal - 1);
                $femaleCount = $memberTotal - $maleCount;

                $household = Household::create([
                    'created_by' => $creator->id,
                    'is_draft' => false,
                    'area_id' => count($areaIds) > 0 ? $areaIds[$i % count($areaIds)] : null,
                    'province_id' => $location['province_id'],
                    'province_name' => $location['province_name'],
                    'regency_id' => $location['regency_id'],
                    'regency_name' => $location['regency_name'],
                    'district_id' => $location['district_id'],
                    'district_name' => $location['district_name'],
                    'village_id' => $location['village_id'],
                    'village_name' => $location['village_name'],
                    'rt_rw' => sprintf('%03d/%03d', rand(1, 15), rand(1, 10)),
                    'survey_date' => now()->subDays(rand(1, 365)),
                    'address_text' => $streets[array_rand($streets)] . ' No. ' . rand(1, 200) . ', RT ' . sprintf('%03d', rand(1, 15)) . '/RW ' . sprintf('%03d', rand(1, 10)) . ', ' . $location['village_name'] . ', ' . $location['district_name'],
                    'latitude' => $location['lat'] + (rand(-500, 500) / 10000),
                    'longitude' => $location['lng'] + (rand(-500, 500) / 10000),
                    'ownership_status_building' => ['OWN', 'RENT', 'OTHER'][rand(0, 2)],
                    'ownership_status_land' => ['OWN', 'RENT', 'OTHER'][rand(0, 2)],
                    'building_legal_status' => ['IMB', 'NONE'][rand(0, 1)],
                    'land_legal_status' => ['SHM', 'HGB', 'SURAT_PEMERINTAH', 'PERJANJIAN', 'LAINNYA', 'TIDAK_TAHU'][rand(0, 5)],
                    'head_name' => $names[$i % count($names)],
                    'nik' => '1603' . str_pad($i + 1, 12, '0', STR_PAD_LEFT),
                    'status_mbr' => $isMBR ? 'MBR' : 'NON_MBR',
                    'kk_count' => rand(1, 2),
                    'member_total' => $memberTotal,
                    'male_count' => $maleCount,
                    'female_count' => $femaleCount,
                    'disabled_count' => rand(0, 2),
                    'main_occupation' => $occupations[array_rand($occupations)],
                    'monthly_income_idr' => $incomeOptions[array_rand($incomeOptions)],
                    'education_facility_location' => ['Dalam Kelurahan/Kecamatan', 'Luar Kelurahan/Kecamatan'][rand(0, 1)],
                    'health_facility_used' => ['Puskesmas', 'Rumah Sakit', 'Klinik', 'Praktik Dokter'][rand(0, 3)],
                    'health_facility_location' => ['Dalam Kelurahan/Kecamatan', 'Luar Kelurahan/Kecamatan'][rand(0, 1)],
                    'created_at' => now()->subDays(rand(1, 365)), // Spread over last year
                    'habitability_status' => $isRTLH ? 'RTLH' : 'RLH',
                    'eligibility_score_total' => $isRTLH ? rand(0, 50) : rand(51, 100),
                    'eligibility_computed_at' => now(),
                ]);

                $buildingLength = rand(6, 15);
                $buildingWidth = rand(4, 10);
                $buildingArea = $buildingLength * $buildingWidth;
                $areaPerPerson = $buildingArea / $memberTotal;

                TechnicalData::create([
                    'household_id' => $household->id,
                    'has_road_access' => (bool) rand(0, 1),
                    'road_width_category' => ['LE1_5', 'EQ1_5', 'GT1_5'][rand(0, 2)],
                    'facade_faces_road' => (bool) rand(0, 1),
                    'faces_waterbody' => rand(0, 10) > 2 ? (bool) rand(0, 1) : null,
                    'in_setback_area' => rand(0, 10) > 2 ? (bool) rand(0, 1) : null,
                    'in_hazard_area' => (bool) rand(0, 1),
                    'score_a1' => rand(0, 1),
                    'building_length_m' => $buildingLength,
                    'building_width_m' => $buildingWidth,
                    'floor_count' => rand(1, 2),
                    'floor_height_m' => rand(25, 35) / 10,
                    'building_area_m2' => $buildingArea,
                    'area_per_person_m2' => round($areaPerPerson, 2),
                    'score_a2_floor_area' => $areaPerPerson >= 7.2 ? 1 : 0,
                    'roof_material' => ['SENG', 'GENTENG', 'ASBES', 'BETON', 'IJUK', 'KAYU', 'DAUN', 'LAINNYA'][rand(0, 7)],
                    'roof_condition' => ['GOOD', 'LEAK'][rand(0, 1)],
                    'wall_material' => ['TEMBOK', 'KAYU', 'SENG', 'BAMBU', 'LAINNYA'][rand(0, 4)],
                    'wall_condition' => ['GOOD', 'DAMAGED'][rand(0, 1)],
                    'floor_material' => ['KERAMIK', 'SEMEN', 'KAYU', 'TANAH', 'LAINNYA'][rand(0, 4)],
                    'floor_condition' => ['LAYAK', 'TIDAK_LAYAK'][rand(0, 1)],
                    'score_a2_structure' => rand(0, 1),
                    'score_a2_total_pct' => rand(0, 100),
                    'water_source' => ['SR_METERAN', 'SR_NONMETER', 'SUMUR_BOR', 'SUMUR_TRL', 'MATA_AIR_TRL', 'HUJAN', 'KEMASAN', 'SUMUR_TAK_TRL', 'MATA_AIR_TAK_TRL', 'SUNGAI', 'TANGKI_MOBIL'][rand(0, 10)],
                    'water_distance_to_septic_m' => rand(5, 15),
                    'water_distance_category' => rand(0, 1) ? 'GE10M' : 'LT10M',
                    'water_fulfillment' => ['ALWAYS', 'SEASONAL', 'NEVER'][rand(0, 2)],
                    'score_a3_access' => rand(0, 1),
                    'score_a3_fulfillment' => rand(0, 1),
                    'defecation_place' => ['PRIVATE_SHARED', 'PUBLIC', 'OPEN'][rand(0, 2)],
                    'toilet_type' => ['S_TRAP', 'NON_S_TRAP'][rand(0, 1)],
                    'sewage_disposal' => ['SEPTIC_IPAL', 'NON_SEPTIC'][rand(0, 1)],
                    'score_a4_access' => rand(0, 1),
                    'score_a4_technical' => rand(0, 1),
                    'waste_disposal_place' => ['PRIVATE_BIN', 'COMMUNAL', 'BURNT', 'OPENSPACE', 'WATERBODY'][rand(0, 4)],
                    'waste_collection_frequency' => ['GE2X_WEEK', 'LT1X_WEEK'][rand(0, 1)],
                    'score_a5' => rand(0, 1),
                    'electricity_source' => ['PLN', 'GENSET', 'SOLAR', 'MENUMPANG', 'TIDAK_ADA', 'LAINNYA'][rand(0, 5)],
                    'electricity_power_watt' => [450, 900, 1300, 2200][rand(0, 3)],
                    'electricity_connected' => (bool) rand(0, 1),
                ]);

                $relationships = ['HEAD', 'SPOUSE', 'CHILD', 'CHILD', 'OTHER'];
                for ($j = 0; $j < min($memberTotal, 5); $j++) {
                    Member::create([
                        'household_id' => $household->id,
                        'name' => $j === 0 ? $household->head_name : $names[rand(0, count($names) - 1)],
                        'nik' => '1603' . str_pad(($i * 10 + $j + 1), 12, '0', STR_PAD_LEFT),
                        'relationship' => $relationships[$j] ?? 'OTHER',
                        'gender' => rand(0, 1) ? 'MALE' : 'FEMALE',
                        'is_disabled' => rand(0, 10) > 8,
                        'birth_date' => now()->subYears(rand(1, 60)),
                        'occupation' => $j === 0 ? $household->main_occupation : ($j === 1 ? 'Ibu Rumah Tangga' : ($j > 1 ? 'Pelajar' : $occupations[array_rand($occupations)])),
                    ]);
                }

                Score::create([
                    'household_id' => $household->id,
                    'score_a1' => rand(0, 1),
                    'score_a2_floor_area' => rand(0, 1),
                    'score_a2_structure' => rand(0, 1),
                    'score_a2_total_pct' => rand(0, 100),
                    'score_a3_access' => rand(0, 1),
                    'score_a3_fulfillment' => rand(0, 1),
                    'score_a4_access' => rand(0, 1),
                    'score_a4_technical' => rand(0, 1),
                    'score_a5' => rand(0, 1),
                    'total_score' => $household->eligibility_score_total,
                    'habitability_status' => $household->habitability_status,
                    'computed_at' => now(),
                    'computation_notes' => 'Computed by seeder',
                ]);

                if (rand(0, 10) < 3) {
                    $assistanceCount = rand(1, 2);
                    for ($k = 0; $k < $assistanceCount; $k++) {
                        $startDate = now()->subMonths(rand(1, 24));
                        $isCompleted = rand(0, 1);
                        Assistance::create([
                            'household_id' => $household->id,
                            'assistance_type' => ['RELOKASI', 'REHABILITASI', 'BSPS', 'LAINNYA'][rand(0, 3)],
                            'program' => ['Peningkatan Kualitas', 'Bantuan Stimulan Perumahan', 'Rehab Berat', 'Rehab Sedang'][rand(0, 3)],
                            'funding_source' => ['APBN', 'APBD', 'CSR', 'Swadaya'][rand(0, 3)],
                            'status' => $isCompleted ? 'SELESAI' : ['PROSES', 'DIBATALKAN'][rand(0, 1)],
                            'started_at' => $startDate,
                            'completed_at' => $isCompleted ? $startDate->addMonths(rand(3, 12)) : null,
                            'cost_amount_idr' => rand(10, 150) * 1000000,
                            'description' => 'Bantuan untuk perbaikan ' . ['atap', 'dinding', 'lantai', 'kamar mandi', 'dapur'][rand(0, 4)],
                            'document_path' => rand(0, 1) ? 'documents/assistance_' . uniqid() . '.pdf' : null,
                        ]);
                    }
                }

                if (rand(0, 1)) {
                    $photoCount = rand(2, 5);
                    $photoFolderRel = 'households/' . date('Y/m') . '/' . $household->id;
                    $photoFolderAbs = storage_path('app/public/' . $photoFolderRel);

                    if (!file_exists($photoFolderAbs)) {
                        mkdir($photoFolderAbs, 0755, true);
                    }

                    // Source folder for seed photos (must be prepared manually)
                    $seedPhotoSource = storage_path('app/public/seed-photos');
                    // Fallback to placeholder if seed folder doesn't exist
                    $useRealPhotos = file_exists($seedPhotoSource);

                    for ($m = 0; $m < $photoCount; $m++) {
                        $fileName = 'photo_' . ($m + 1) . '.jpg';
                        $destPath = $photoFolderAbs . '/' . $fileName;

                        // Copy real photo or create placeholder
                        if ($useRealPhotos && file_exists($seedPhotoSource . '/' . $fileName)) {
                             copy($seedPhotoSource . '/' . $fileName, $destPath);
                        } else {
                            // Create a placeholder image
                            $image = imagecreatetruecolor(640, 480);
                            $bgColor = imagecolorallocate($image, rand(200, 255), rand(200, 255), rand(200, 255));
                            imagefill($image, 0, 0, $bgColor);
                            $textColor = imagecolorallocate($image, 0, 0, 0);
                            imagestring($image, 5, 250, 220, "Placeholder Photo " . ($m + 1), $textColor);
                            imagejpeg($image, $destPath);
                            imagedestroy($image);
                        }

                        Photo::create([
                            'household_id' => $household->id,
                            'file_path' => $photoFolderRel . '/' . $fileName,
                            'caption' => ['Tampak Depan', 'Tampak Samping', 'Ruang Tamu', 'Kamar Tidur', 'Dapur', 'Kamar Mandi'][$m % 6],
                            'order_index' => $m + 1,
                        ]);
                    }
                }

                $this->command->info("Created household #{$household->id}: {$household->head_name}");
            }

            DB::commit();
            $this->command->info('Successfully seeded 50 households in Muara Enim!');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error seeding households: ' . $e->getMessage());
            throw $e;
        }
    }
}
