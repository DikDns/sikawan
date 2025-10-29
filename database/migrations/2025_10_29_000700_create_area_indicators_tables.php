<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('area_density_b1', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_survey_id')->constrained('area_surveys')->cascadeOnDelete();
            $table->decimal('area_total_ha', 10, 2);
            $table->decimal('settlement_area_ha', 10, 2);
            $table->integer('buildings_total');
            $table->decimal('slope_gt15_pct', 5, 2);
            $table->decimal('building_density_unit_per_ha', 10, 2);
            $table->string('density_status', 8); // LOW|MEDIUM|HIGH
            $table->timestamps();
            $table->unique('area_survey_id');
        });

        Schema::create('area_roads_b2', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_survey_id')->constrained('area_surveys')->cascadeOnDelete();
            $table->integer('length_total_m');
            $table->integer('length_ge_1_5_m');
            $table->integer('length_ge_1_5_hardened_m');
            $table->integer('length_needed_new_m');
            $table->integer('length_ideal_m');
            $table->decimal('coverage_pct', 5, 2);
            $table->integer('length_ge_1_5_good_m');
            $table->integer('length_ge_1_5_soil_good_m');
            $table->integer('length_lt_1_5_hardened_good_m');
            $table->integer('length_lt_1_5_soil_good_m');
            $table->integer('length_with_side_drain_ge_1_5_m');
            $table->integer('length_with_side_drain_lt_1_5_m');
            $table->integer('length_good_total_m');
            $table->decimal('good_over_total_pct', 5, 2);
            $table->timestamps();
            $table->unique('area_survey_id');
        });

        Schema::create('area_drainage_b3', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_survey_id')->constrained('area_surveys')->cascadeOnDelete();
            $table->string('flood_height', 8); // NONE|LT30CM|GT30CM
            $table->string('flood_duration', 6)->nullable(); // LT2H|GT2H
            $table->string('flood_frequency', 10)->nullable(); // LT2_YEAR|GT2_YEAR
            $table->decimal('flood_area_ha', 10, 2);
            $table->string('flood_source', 10)->nullable(); // TIDE|RIVER|RUNOFF
            $table->integer('length_existing_m');
            $table->boolean('has_new_plan')->default(false);
            $table->integer('length_needed_new_m')->nullable();
            $table->boolean('has_city_link')->default(false);
            $table->integer('length_city_link_m')->nullable();
            $table->boolean('is_clean')->default(false);
            $table->integer('length_clean_m')->nullable();
            $table->integer('length_structure_good_m');
            $table->boolean('no_flood_event')->default(false);
            $table->decimal('no_flood_area_pct', 5, 2);
            $table->integer('length_needed_total_m');
            $table->integer('length_ideal_m');
            $table->decimal('length_good_pct', 5, 2);
            $table->timestamps();
            $table->unique('area_survey_id');
        });

        Schema::create('area_sanitation_b4', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_survey_id')->constrained('area_surveys')->cascadeOnDelete();
            $table->boolean('wastewater_separated')->default(false);
            $table->timestamps();
            $table->unique('area_survey_id');
        });

        Schema::create('area_waste_b5', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_survey_id')->constrained('area_surveys')->cascadeOnDelete();
            $table->boolean('has_facility')->default(false);
            $table->boolean('has_transport')->default(false);
            $table->boolean('facility_condition_good')->default(false);
            $table->boolean('transport_condition_good')->default(false);
            $table->decimal('sapras_pct', 5, 2)->default(0);
            $table->decimal('sapras_good_pct', 5, 2)->default(0);
            $table->timestamps();
            $table->unique('area_survey_id');
        });

        Schema::create('area_fire_b6', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_survey_id')->constrained('area_surveys')->cascadeOnDelete();
            $table->string('fire_freq', 10); // NEVER|ONCE_5Y|TWICE_5Y|GT2_5Y
            $table->text('causes_json')->nullable();
            $table->boolean('has_station')->default(false);
            $table->boolean('has_hydrant')->default(false);
            $table->boolean('has_vehicle_apar')->default(false);
            $table->boolean('has_access_road_ge_3_5m')->default(false);
            $table->decimal('prasarana_pct', 5, 2)->default(0);
            $table->decimal('sarana_pct', 5, 2)->default(0);
            $table->timestamps();
            $table->unique('area_survey_id');
        });

        Schema::create('area_social_b7', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_survey_id')->constrained('area_surveys')->cascadeOnDelete();
            $table->boolean('health_rs')->default(false);
            $table->boolean('health_clinic')->default(false);
            $table->boolean('health_puskesmas')->default(false);
            $table->boolean('health_traditional')->default(false);
            $table->boolean('health_midwife')->default(false);
            $table->boolean('health_none')->default(false);
            $table->boolean('edu_tk')->default(false);
            $table->boolean('edu_sd')->default(false);
            $table->boolean('edu_smp')->default(false);
            $table->boolean('edu_sma')->default(false);
            $table->boolean('edu_pt')->default(false);
            $table->boolean('edu_none')->default(false);
            $table->timestamps();
            $table->unique('area_survey_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('area_social_b7');
        Schema::dropIfExists('area_fire_b6');
        Schema::dropIfExists('area_waste_b5');
        Schema::dropIfExists('area_sanitation_b4');
        Schema::dropIfExists('area_drainage_b3');
        Schema::dropIfExists('area_roads_b2');
        Schema::dropIfExists('area_density_b1');
    }
};
