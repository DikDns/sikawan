<?php

namespace Database\Seeders;

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\HouseholdTechnicalData;
use App\Models\HouseholdScore;
use App\Models\HouseAssistance;
use App\Models\HouseholdPhoto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HouseholdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // Data wilayah Indonesia (contoh)
            $locations = [
                [
                    'province_id' => '31',
                    'province_name' => 'DKI JAKARTA',
                    'regency_id' => '3171',
                    'regency_name' => 'KOTA JAKARTA SELATAN',
                    'district_id' => '3171020',
                    'district_name' => 'KEBAYORAN BARU',
                    'village_id' => '3171020001',
                    'village_name' => 'SENAYAN',
                    'lat' => -6.2250,
                    'lng' => 106.8000,
                ],
                [
                    'province_id' => '32',
                    'province_name' => 'JAWA BARAT',
                    'regency_id' => '3273',
                    'regency_name' => 'KOTA BANDUNG',
                    'district_id' => '3273010',
                    'district_name' => 'BANDUNG WETAN',
                    'village_id' => '3273010001',
                    'village_name' => 'CIHAPIT',
                    'lat' => -6.9147,
                    'lng' => 107.6098,
                ],
                [
                    'province_id' => '33',
                    'province_name' => 'JAWA TENGAH',
                    'regency_id' => '3374',
                    'regency_name' => 'KOTA SEMARANG',
                    'district_id' => '3374010',
                    'district_name' => 'SEMARANG TENGAH',
                    'village_id' => '3374010001',
                    'village_name' => 'BANGUNHARJO',
                    'lat' => -6.9667,
                    'lng' => 110.4167,
                ],
                [
                    'province_id' => '35',
                    'province_name' => 'JAWA TIMUR',
                    'regency_id' => '3578',
                    'regency_name' => 'KOTA SURABAYA',
                    'district_id' => '3578010',
                    'district_name' => 'GENTENG',
                    'village_id' => '3578010001',
                    'village_name' => 'EMBONG KALIASIN',
                    'lat' => -7.2575,
                    'lng' => 112.7521,
                ],
                [
                    'province_id' => '51',
                    'province_name' => 'BALI',
                    'regency_id' => '5171',
                    'regency_name' => 'KOTA DENPASAR',
                    'district_id' => '5171010',
                    'district_name' => 'DENPASAR SELATAN',
                    'village_id' => '5171010001',
                    'village_name' => 'SESETAN',
                    'lat' => -8.6705,
                    'lng' => 115.2126,
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
                'Karyawan Swasta', 'Wiraswasta', 'Pedagang', 'Buruh', 'PNS',
                'Guru', 'Petani', 'Tukang', 'Sopir', 'Ibu Rumah Tangga',
                'Pegawai BUMN', 'Pensiunan', 'Mahasiswa', 'Freelancer',
            ];

            $streets = [
                'Jl. Merdeka', 'Jl. Sudirman', 'Jl. Gatot Subroto', 'Jl. Ahmad Yani',
                'Jl. Diponegoro', 'Jl. Veteran', 'Jl. Pahlawan', 'Jl. Kemerdekaan',
                'Jl. Mawar', 'Jl. Melati', 'Jl. Anggrek', 'Jl. Kenanga',
            ];

            // Generate 50 households
            for ($i = 0; $i < 50; $i++) {
                $location = $locations[$i % count($locations)];
                $isMBR = rand(0, 10) > 3; // 70% MBR
                $isRTLH = rand(0, 10) > 6; // 40% RTLH
                $memberTotal = rand(2, 7);
                $maleCount = rand(1, $memberTotal - 1);
                $femaleCount = $memberTotal - $maleCount;

                // Create Household
                $household = Household::create([
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
                    'address_text' => $streets[array_rand($streets)] . ' No. ' . rand(1, 200) . ', RT ' . sprintf('%03d', rand(1, 15)) . '/RW ' . sprintf('%03d', rand(1, 10)) . ', ' . $location['village_name'] . ', ' . $location['district_name'] . ', ' . $location['regency_name'],
                    'latitude' => $location['lat'] + (rand(-1000, 1000) / 10000),
                    'longitude' => $location['lng'] + (rand(-1000, 1000) / 10000),
                    'photo_folder' => 'households/' . date('Y/m') . '/' . uniqid(),

                    // Ownership
                    'ownership_status_building' => ['OWN', 'RENT', 'OTHER'][rand(0, 2)],
                    'ownership_status_land' => ['OWN', 'RENT', 'OTHER'][rand(0, 2)],
                    'building_legal_status' => ['IMB', 'NONE'][rand(0, 1)],
                    'land_legal_status' => ['SHM', 'HGB', 'SURAT_PEMERINTAH', 'PERJANJIAN', 'LAINNYA', 'TIDAK_TAHU'][rand(0, 5)],

                    // Head of household
                    'head_name' => $names[$i % count($names)],
                    'nik' => '31710' . str_pad($i + 1, 11, '0', STR_PAD_LEFT),
                    'status_mbr' => $isMBR ? 'MBR' : 'NON_MBR',
                    'kk_count' => rand(1, 2),
                    'member_total' => $memberTotal,
                    'male_count' => $maleCount,
                    'female_count' => $femaleCount,
                    'disabled_count' => rand(0, 2),

                    // Non-physical
                    'main_occupation' => $occupations[array_rand($occupations)],
                    'monthly_income_idr' => rand(1000000, 8000000),
                    'health_facility_used' => ['Puskesmas', 'Rumah Sakit', 'Klinik', 'Praktik Dokter'][rand(0, 3)],
                    'health_facility_location' => ['Dalam Kelurahan/Kecamatan', 'Luar Kelurahan/Kecamatan'][rand(0, 1)],
                    'education_facility_location' => ['Dalam Kelurahan/Kecamatan', 'Luar Kelurahan/Kecamatan'][rand(0, 1)],

                    // Status
                    'habitability_status' => $isRTLH ? 'RTLH' : 'RLH',
                    'eligibility_score_total' => $isRTLH ? rand(0, 50) : rand(51, 100),
                    'eligibility_computed_at' => now(),
                ]);

                // Create Technical Data
                $buildingLength = rand(6, 15);
                $buildingWidth = rand(4, 10);
                $buildingArea = $buildingLength * $buildingWidth;
                $areaPerPerson = $buildingArea / $memberTotal;

                HouseholdTechnicalData::create([
                    'household_id' => $household->id,

                    // A.1 Keteraturan Bangunan
                    'has_road_access' => rand(0, 1),
                    'road_width_category' => ['LE1_5', 'EQ1_5', 'GT1_5'][rand(0, 2)],
                    'facade_faces_road' => rand(0, 1),
                    'faces_waterbody' => rand(0, 1),
                    'in_setback_area' => rand(0, 1),
                    'in_hazard_area' => rand(0, 1),
                    'score_a1' => rand(0, 1),

                    // A.2 Kelayakan Bangunan
                    'building_length_m' => $buildingLength,
                    'building_width_m' => $buildingWidth,
                    'floor_count' => rand(1, 2),
                    'floor_height_m' => rand(25, 35) / 10,
                    'building_area_m2' => $buildingArea,
                    'area_per_person_m2' => round($areaPerPerson, 2),
                    'score_a2_floor_area' => $areaPerPerson >= 7.2 ? 1 : 0,

                    // Struktur
                    'has_foundation' => rand(0, 1),
                    'has_sloof' => rand(0, 1),
                    'has_ring_beam' => rand(0, 1),
                    'has_roof_structure' => rand(0, 1),
                    'has_columns' => rand(0, 1),

                    // Material & Kondisi
                    'roof_material' => ['Genteng', 'Seng', 'Asbes', 'Beton'][rand(0, 3)],
                    'roof_condition' => ['GOOD', 'LEAK', 'RINGAN', 'SEDANG', 'BERAT'][rand(0, 4)],
                    'wall_material' => ['Bata & Semen', 'Kayu', 'Bambu', 'Seng'][rand(0, 3)],
                    'wall_condition' => ['GOOD', 'DAMAGED', 'RINGAN', 'SEDANG', 'BERAT'][rand(0, 4)],
                    'floor_material' => ['Keramik', 'Semen', 'Tanah', 'Papan'][rand(0, 3)],
                    'floor_condition' => ['LAYAK', 'TIDAK_LAYAK', 'RINGAN', 'SEDANG', 'BERAT'][rand(0, 4)],
                    'score_a2_structure' => rand(0, 1),
                    'score_a2_total_pct' => rand(0, 100),

                    // A.3 Akses Air
                    'water_source' => ['SR_METERAN', 'SR_NONMETER', 'SUMUR_BOR', 'SUMUR_TRL', 'MATA_AIR_TRL'][rand(0, 4)],
                    'water_distance_to_septic_m' => rand(5, 15),
                    'water_distance_category' => rand(0, 1) ? 'GE10M' : 'LT10M',
                    'water_fulfillment' => ['ALWAYS', 'SEASONAL', 'NEVER'][rand(0, 2)],
                    'score_a3_access' => rand(0, 1),
                    'score_a3_fulfillment' => rand(0, 1),

                    // A.4 Sanitasi
                    'defecation_place' => ['PRIVATE_SHARED', 'PUBLIC', 'OPEN'][rand(0, 2)],
                    'toilet_type' => ['S_TRAP', 'NON_S_TRAP'][rand(0, 1)],
                    'sewage_disposal' => ['SEPTIC_IPAL', 'NON_SEPTIC'][rand(0, 1)],
                    'score_a4_access' => rand(0, 1),
                    'score_a4_technical' => rand(0, 1),

                    // A.5 Sampah
                    'waste_disposal_place' => ['PRIVATE_BIN', 'COMMUNAL', 'BURNT', 'OPENSPACE', 'WATERBODY'][rand(0, 4)],
                    'waste_collection_frequency' => ['GE2X_WEEK', 'LT1X_WEEK'][rand(0, 1)],
                    'score_a5' => rand(0, 1),

                    // Listrik
                    'electricity_source' => ['PLN', 'Genset', 'Surya', 'Lainnya'][rand(0, 3)],
                    'electricity_power_watt' => [450, 900, 1300, 2200][rand(0, 3)],
                    'electricity_connected' => rand(0, 1),
                ]);

                // Create Household Members
                $relationships = ['HEAD', 'SPOUSE', 'CHILD', 'CHILD', 'OTHER'];
                for ($j = 0; $j < min($memberTotal, 5); $j++) {
                    HouseholdMember::create([
                        'household_id' => $household->id,
                        'name' => $j === 0 ? $household->head_name : $names[rand(0, count($names) - 1)],
                        'nik' => '31710' . str_pad(($i * 10 + $j + 1), 11, '0', STR_PAD_LEFT),
                        'relationship' => $relationships[$j] ?? 'OTHER',
                        'gender' => rand(0, 1) ? 'MALE' : 'FEMALE',
                        'is_disabled' => rand(0, 10) > 8,
                        'birth_date' => now()->subYears(rand(1, 60)),
                        'occupation' => $j === 0 ? $household->main_occupation : ($j === 1 ? 'Ibu Rumah Tangga' : ($j > 1 ? 'Pelajar' : $occupations[array_rand($occupations)])),
                    ]);
                }

                // Create Household Score
                HouseholdScore::create([
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

                // Create Assistances (random, 30% mendapat bantuan)
                if (rand(0, 10) < 3) {
                    $assistanceCount = rand(1, 2);
                    for ($k = 0; $k < $assistanceCount; $k++) {
                        $startDate = now()->subMonths(rand(1, 24));
                        $isCompleted = rand(0, 1);

                        HouseAssistance::create([
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

                // Create Photos (random, 50% punya foto)
                if (rand(0, 1)) {
                    $photoCount = rand(2, 5);
                    for ($m = 0; $m < $photoCount; $m++) {
                        HouseholdPhoto::create([
                            'household_id' => $household->id,
                            'file_path' => $household->photo_folder . '/photo_' . ($m + 1) . '.jpg',
                            'caption' => ['Tampak Depan', 'Tampak Samping', 'Ruang Tamu', 'Kamar Tidur', 'Dapur', 'Kamar Mandi'][$m % 6],
                            'order_index' => $m + 1,
                        ]);
                    }
                }

                $this->command->info("Created household #{$household->id}: {$household->head_name}");
            }

            DB::commit();
            $this->command->info('Successfully seeded 50 households with related data!');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error seeding households: ' . $e->getMessage());
            throw $e;
        }
    }
}
