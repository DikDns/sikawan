<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('house_physical_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->decimal('building_area_m2', 10, 2)->nullable();
            $table->integer('room_count')->nullable();
            $table->integer('floor_count')->nullable();
            $table->decimal('floor_elevation_m', 6, 2)->nullable();
            $table->string('ventilation_quality', 8)->nullable(); // GOOD|FAIR|POOR
            $table->boolean('sanitation_facility_present')->nullable();
            $table->string('roof_material', 30)->nullable();
            $table->string('roof_condition_level', 12)->nullable();
            $table->string('wall_material', 30)->nullable();
            $table->string('wall_condition_level', 12)->nullable();
            $table->string('floor_material', 30)->nullable();
            $table->string('floor_condition_level', 12)->nullable();
            $table->timestamps();
            $table->unique('household_id');
        });

        Schema::create('land_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('owner_name', 150)->nullable();
            $table->text('land_address_text')->nullable();
            $table->decimal('land_area_m2', 10, 2)->nullable();
            $table->decimal('kdb_pct', 6, 2)->nullable();
            $table->decimal('klb_ratio', 6, 2)->nullable();
            $table->decimal('kdh_pct', 6, 2)->nullable();
            $table->decimal('front_setback_m', 6, 2)->nullable();
            $table->decimal('side_setback_m', 6, 2)->nullable();
            $table->decimal('rear_setback_m', 6, 2)->nullable();
            $table->timestamps();
            $table->unique('household_id');
        });

        Schema::create('house_eligibilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('habitability_status', 8); // LAYAK|RLH|RTLH
            $table->text('eligibility_reason')->nullable();
            $table->string('assistance_status', 6)->nullable(); // SUDAH|BELUM
            $table->string('assistance_type', 50)->nullable();
            $table->integer('assistance_year')->nullable();
            $table->timestamps();
            $table->unique('household_id');
        });

        Schema::create('house_assistances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('assistance_type', 30); // RELOKASI|REHABILITASI|BSPS|LAINNYA
            $table->string('funding_source', 80)->nullable();
            $table->string('status', 10)->nullable(); // SELESAI|PROSES|DIBATALKAN
            $table->date('started_at')->nullable();
            $table->date('completed_at')->nullable();
            $table->bigInteger('cost_amount_idr')->nullable();
            $table->text('description')->nullable();
            $table->string('document_path', 255)->nullable();
            $table->timestamps();
            $table->index(['household_id', 'assistance_type', 'status'], 'house_assist_types_idx');
        });

        Schema::create('relocation_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->foreignId('house_assistance_id')->nullable()->constrained('house_assistances')->nullOnDelete();
            $table->date('survey_date')->nullable();
            $table->text('location_admin_snapshot_json')->nullable();

            // identitas
            $table->string('full_name', 150);
            $table->text('full_address');
            $table->string('nik', 32)->nullable();
            $table->integer('kk_in_house_count');
            $table->string('gender', 10)->nullable(); // MALE|FEMALE
            $table->string('main_occupation', 40)->nullable();
            $table->string('income_band', 20)->nullable();
            $table->string('land_ownership_status', 16);
            $table->string('house_ownership_status', 16);
            $table->boolean('has_other_land_asset')->default(false);
            $table->text('settlement_zone_flags_json')->nullable();
            $table->string('hazard_distance_band', 16)->nullable();
            $table->string('hazard_type', 20)->nullable();

            // kondisi fisik
            $table->boolean('has_foundation')->default(false);
            $table->boolean('has_sloof')->default(false);
            $table->boolean('has_ring_beam')->default(false);
            $table->boolean('has_roof_structure')->default(false);
            $table->boolean('has_columns')->default(false);
            $table->decimal('house_area_m2', 10, 2)->nullable();
            $table->integer('occupants_count')->nullable();
            $table->string('roof_material', 20)->nullable();
            $table->string('roof_condition_level', 12)->nullable();
            $table->string('wall_material', 20)->nullable();
            $table->string('wall_condition_level', 12)->nullable();
            $table->string('floor_material', 15)->nullable();
            $table->string('floor_condition_level', 12)->nullable();

            // catatan
            $table->boolean('willing_to_relocate')->default(false);
            $table->boolean('relocation_land_available')->default(false);
            $table->text('team_recommendation')->nullable();
            $table->date('signed_at')->nullable();
            $table->text('signatories_json')->nullable();

            $table->timestamps();

            $table->index('household_id');
            $table->index('house_assistance_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relocation_assessments');
        Schema::dropIfExists('house_assistances');
        Schema::dropIfExists('house_eligibilities');
        Schema::dropIfExists('land_details');
        Schema::dropIfExists('house_physical_details');
    }
};
