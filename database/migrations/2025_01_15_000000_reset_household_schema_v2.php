<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop old household-related tables in reverse dependency order
        Schema::dropIfExists('relocation_assessments');
        Schema::dropIfExists('house_assistances');
        Schema::dropIfExists('house_eligibilities');
        Schema::dropIfExists('land_details');
        Schema::dropIfExists('house_physical_details');
        Schema::dropIfExists('relocation_histories');
        Schema::dropIfExists('household_scores');
        Schema::dropIfExists('household_non_physicals');
        Schema::dropIfExists('waste_managements');
        Schema::dropIfExists('sanitatons');
        Schema::dropIfExists('water_accesses');
        Schema::dropIfExists('house_structure_scores');

        // Drop and recreate households table with new schema
        Schema::dropIfExists('households');

        Schema::create('households', function (Blueprint $table) {
            $table->id();
            // Data Wilayah (dari package SQLite: maftuhichsan/sqlite-wilayah-indonesia)
            $table->string('province_id', 10)->nullable(); // province_code dari tabel provinces (contoh: "31")
            $table->string('province_name', 150)->nullable(); // Nama provinsi (contoh: "DKI JAKARTA")
            $table->string('regency_id', 10)->nullable(); // city_code dari tabel cities (contoh: "3171")
            $table->string('regency_name', 150)->nullable(); // Nama kab/kota (contoh: "KOTA JAKARTA SELATAN")
            $table->string('district_id', 10)->nullable(); // sub_district_code dari tabel sub_districts (contoh: "3171020")
            $table->string('district_name', 150)->nullable(); // Nama kecamatan (contoh: "KEBAYORAN BARU")
            $table->string('village_id', 10)->nullable(); // village_code dari tabel villages (contoh: "3171020001")
            $table->string('village_name', 150)->nullable(); // Nama kelurahan/desa (contoh: "SENAYAN")
            $table->string('rt_rw', 20)->nullable();
            $table->date('survey_date')->nullable();
            $table->text('address_text')->nullable();
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->string('photo_folder', 255)->nullable();
            $table->string('approval_status', 12)->nullable()->default('NOT_VERIFIED'); // VERIFIED|NOT_VERIFIED|REJECTED

            // Penguasaan Bangunan & Lahan (Tab Umum)
            $table->string('ownership_status_building', 10)->nullable(); // OWN|RENT|OTHER
            $table->string('ownership_status_land', 10)->nullable(); // OWN|RENT|OTHER
            $table->string('building_legal_status', 6)->nullable(); // IMB|NONE
            $table->string('land_legal_status', 12)->nullable(); // SHM|HGB|SURAT_PEMERINTAH|PERJANJIAN|LAINNYA|TIDAK_TAHU

            // Data Penghuni (Ringkasan - detail di household_members)
            $table->string('head_name', 150); // Nama Kepala Keluarga
            $table->string('nik', 32)->nullable();
            $table->string('status_mbr', 8); // MBR|NON_MBR
            $table->integer('kk_count')->default(1); // Jumlah Kepala Keluarga
            $table->integer('member_total')->default(0); // Total Jiwa
            $table->integer('male_count')->default(0);
            $table->integer('female_count')->default(0);
            $table->integer('disabled_count')->default(0);

            // Data Non-Fisik (Tab Umum)
            $table->string('main_occupation', 40)->nullable(); // Pekerjaan Utama
            $table->bigInteger('monthly_income_idr')->nullable(); // Penghasilan Bulanan (Rp)
            $table->string('health_facility_used', 50)->nullable(); // Fasilitas kesehatan yang digunakan
            $table->string('health_facility_location', 100)->nullable(); // Lokasi fasilitas kesehatan
            $table->string('education_facility_location', 100)->nullable(); // Lokasi fasilitas pendidikan

            // Status Kelayakan (Dihitung Otomatis)
            $table->string('habitability_status', 8)->nullable(); // RLH|RTLH
            $table->decimal('eligibility_score_total', 5, 2)->nullable(); // Total skor kelayakan (0-100)
            $table->dateTime('eligibility_computed_at')->nullable();

            $table->timestamps();

            // Index untuk pencarian berdasarkan wilayah
            $table->index('province_id');
            $table->index('regency_id');
            $table->index('district_id');
            $table->index('village_id');
            $table->index(['latitude', 'longitude']);
            $table->index('habitability_status');
            $table->index('status_mbr');
        });

        // Create household_technical_data table (combines A.1-A.5)
        Schema::create('household_technical_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->unique()->constrained('households')->cascadeOnDelete();

            // A.1 KETERATURAN BANGUNAN HUNIAN
            $table->boolean('has_road_access')->default(false); // Akses langsung ke jalan
            $table->string('road_width_category', 8)->nullable(); // LE1_5|EQ1_5|GT1_5
            $table->boolean('facade_faces_road')->default(false); // Hadap jalan
            $table->boolean('faces_waterbody')->default(false); // Menghadap sungai/laut/rawa/danau
            $table->boolean('in_setback_area')->default(false); // Di atas sempadan
            $table->boolean('in_hazard_area')->default(false); // Daerah limbah/dibawah jalur listrik tegangan tinggi
            $table->unsignedTinyInteger('score_a1')->nullable(); // Skor A.1 (0 atau 1)

            // A.2 KELAYAKAN BANGUNAN HUNIAN
            $table->decimal('building_length_m', 8, 2)->nullable(); // Panjang Bangunan
            $table->decimal('building_width_m', 8, 2)->nullable(); // Lebar Bangunan
            $table->integer('floor_count')->nullable(); // Jumlah Lantai
            $table->decimal('floor_height_m', 6, 2)->nullable(); // Ketinggian per lantai
            $table->decimal('building_area_m2', 10, 2)->nullable(); // Luas Bangunan (calculated)
            $table->decimal('area_per_person_m2', 10, 2)->nullable(); // Luas Lantai/jiwa (calculated)
            $table->unsignedTinyInteger('score_a2_floor_area')->nullable(); // Skor luas lantai (0 atau 1)

            // Material & Kondisi (A.2)
            $table->string('roof_material', 30)->nullable(); // Material Atap (SENG, GENTENG, ASBES, dll)
            $table->string('roof_condition', 12)->nullable(); // GOOD|LEAK|RINGAN|SEDANG|BERAT
            $table->string('wall_material', 30)->nullable(); // Material Dinding
            $table->string('wall_condition', 12)->nullable(); // GOOD|DAMAGED|RINGAN|SEDANG|BERAT
            $table->string('floor_material', 30)->nullable(); // Material Lantai
            $table->string('floor_condition', 12)->nullable(); // LAYAK|TIDAK_LAYAK|RINGAN|SEDANG|BERAT
            $table->unsignedTinyInteger('score_a2_structure')->nullable(); // Skor kondisi atap, dinding, lantai (0 atau 1)
            $table->decimal('score_a2_total_pct', 5, 2)->nullable(); // Skor total A.2 (persentase)

            // A.3 AKSES AIR MINUM
            $table->string('water_source', 20)->nullable(); // SR_METERAN|SR_NONMETER|SUMUR_BOR|SUMUR_TRL|MATA_AIR_TRL|HUJAN|KEMASAN|SUMUR_TAK_TRL|MATA_AIR_TAK_TRL|SUNGAI|TANGKI_MOBIL
            $table->decimal('water_distance_to_septic_m', 6, 2)->nullable(); // Jarak sumber air ke penampung tinja (meter)
            $table->string('water_distance_category', 6)->nullable(); // GE10M|LT10M
            $table->string('water_fulfillment', 10)->nullable(); // ALWAYS|SEASONAL|NEVER
            $table->unsignedTinyInteger('score_a3_access')->nullable(); // Skor akses air (0 atau 1)
            $table->unsignedTinyInteger('score_a3_fulfillment')->nullable(); // Skor pemenuhan kebutuhan air (0 atau 1)

            // A.4 PENGELOLAAN SANITASI
            $table->string('defecation_place', 14)->nullable(); // PRIVATE_SHARED|PUBLIC|OPEN
            $table->string('toilet_type', 10)->nullable(); // S_TRAP|NON_S_TRAP
            $table->string('sewage_disposal', 12)->nullable(); // SEPTIC_IPAL|NON_SEPTIC
            $table->unsignedTinyInteger('score_a4_access')->nullable(); // Skor akses sanitasi (0 atau 1)
            $table->unsignedTinyInteger('score_a4_technical')->nullable(); // Skor kelayakan teknis sarana BAB (0 atau 1)

            // A.5 PENGELOLAAN SAMPAH
            $table->string('waste_disposal_place', 12)->nullable(); // PRIVATE_BIN|COMMUNAL|BURNT|OPENSPACE|WATERBODY
            $table->string('waste_collection_frequency', 12)->nullable(); // GE2X_WEEK|LT1X_WEEK
            $table->unsignedTinyInteger('score_a5')->nullable(); // Skor A.5 (0 atau 1)

            // Sumber Listrik (Tab Data Teknis)
            $table->string('electricity_source', 30)->nullable(); // Sumber Utama Listrik
            $table->integer('electricity_power_watt')->nullable(); // Daya Listrik (Watt)
            $table->boolean('electricity_connected')->default(false); // Listrik tersambung

            $table->timestamps();
        });

        // Create household_members table
        Schema::create('household_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('name', 150); // Nama
            $table->string('nik', 32)->nullable();
            $table->string('relationship', 20)->nullable(); // HEAD|SPOUSE|CHILD|OTHER
            $table->string('gender', 10)->nullable(); // MALE|FEMALE
            $table->boolean('is_disabled')->default(false);
            $table->date('birth_date')->nullable();
            $table->string('occupation', 40)->nullable();
            $table->timestamps();

            $table->index('household_id');
            $table->index('relationship');
        });

        // Create household_scores table (rekap skor)
        Schema::create('household_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->unique()->constrained('households')->cascadeOnDelete();

            // Skor Individual
            $table->unsignedTinyInteger('score_a1')->nullable(); // Skor A.1 Keteraturan Bangunan
            $table->unsignedTinyInteger('score_a2_floor_area')->nullable(); // Skor A.2 Luas Lantai
            $table->unsignedTinyInteger('score_a2_structure')->nullable(); // Skor A.2 Struktur (atap, dinding, lantai)
            $table->decimal('score_a2_total_pct', 5, 2)->nullable(); // Skor A.2 Total (persentase)
            $table->unsignedTinyInteger('score_a3_access')->nullable(); // Skor A.3 Akses Air
            $table->unsignedTinyInteger('score_a3_fulfillment')->nullable(); // Skor A.3 Pemenuhan Air
            $table->unsignedTinyInteger('score_a4_access')->nullable(); // Skor A.4 Akses Sanitasi
            $table->unsignedTinyInteger('score_a4_technical')->nullable(); // Skor A.4 Teknis Sanitasi
            $table->unsignedTinyInteger('score_a5')->nullable(); // Skor A.5 Sampah

            // Skor Total
            $table->decimal('total_score', 5, 2)->nullable(); // Total skor (0-100)
            $table->string('habitability_status', 8)->nullable(); // RLH|RTLH

            // Metadata
            $table->dateTime('computed_at')->nullable();
            $table->text('computation_notes')->nullable(); // Catatan perhitungan

            $table->timestamps();
        });

        // Create house_assistances table (update existing)
        Schema::create('house_assistances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('assistance_type', 30); // RELOKASI|REHABILITASI|BSPS|LAINNYA
            $table->string('program', 100)->nullable(); // Program bantuan
            $table->string('funding_source', 80)->nullable(); // Sumber dana
            $table->string('status', 10)->nullable(); // SELESAI|PROSES|DIBATALKAN
            $table->date('started_at')->nullable(); // Tanggal Penanganan
            $table->date('completed_at')->nullable(); // Tanggal Selesai
            $table->bigInteger('cost_amount_idr')->nullable(); // Biaya
            $table->text('description')->nullable();
            $table->string('document_path', 255)->nullable(); // Dokumen

            $table->timestamps();

            $table->index(['household_id', 'assistance_type', 'status'], 'house_assist_types_idx');
        });

        // Create household_photos table
        Schema::create('household_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('file_path', 255);
            $table->string('caption', 150)->nullable();
            $table->integer('order_index')->nullable(); // Urutan tampil
            $table->timestamps();

            $table->index('household_id');
            $table->index('order_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('household_photos');
        Schema::dropIfExists('house_assistances');
        Schema::dropIfExists('household_scores');
        Schema::dropIfExists('household_members');
        Schema::dropIfExists('household_technical_data');
        Schema::dropIfExists('households');
    }
};
