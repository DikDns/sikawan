<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A.1 & A.2
        Schema::create('house_structure_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();

            // A.1
            $table->boolean('a1_access_to_road')->default(false);
            $table->string('a1_facade_width_category', 8)->nullable(); // LE1_5|EQ1_5|GT1_5
            $table->boolean('a1_facade_faces_road')->default(false);
            $table->string('a1_faces_waterbody', 8)->nullable(); // NONE|YES|NO
            $table->string('a1_in_setback', 8)->nullable(); // NONE|YES|NO
            $table->boolean('a1_hazard_area')->default(false);
            $table->unsignedTinyInteger('skor_a1')->default(0);

            // A.2
            $table->decimal('a2_length_m', 8, 2)->nullable();
            $table->decimal('a2_width_m', 8, 2)->nullable();
            $table->integer('a2_floors')->nullable();
            $table->decimal('a2_area_m2', 10, 2)->nullable();
            $table->integer('a2_occupants')->nullable();
            $table->decimal('a2_m2_per_person', 10, 2)->nullable();
            $table->unsignedTinyInteger('a2_floor_area_score')->default(0);
            $table->string('a2_roof_condition', 8)->nullable(); // GOOD|LEAK
            $table->string('a2_wall_condition', 8)->nullable(); // GOOD|DAMAGED
            $table->string('a2_floor_type', 10)->nullable(); // NON_SOIL|SOIL
            $table->unsignedTinyInteger('a2_roof_wall_floor_score')->default(0);
            $table->decimal('a2_total_score_pct', 5, 2)->nullable();

            $table->timestamps();

            $table->unique('household_id');
        });

        // A.3
        Schema::create('water_accesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('source', 20); // SR_METERAN|...
            $table->string('distance_to_septic', 6)->nullable(); // GE10M|LT10M
            $table->unsignedTinyInteger('skor_air')->default(0);
            $table->string('water_fulfillment', 10); // ALWAYS|SEASONAL|NEVER
            $table->unsignedTinyInteger('skor_fulfillment')->default(0);
            $table->timestamps();
            $table->unique('household_id');
        });

        // A.4
        Schema::create('sanitatons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('defecation_place', 14); // PRIVATE_SHARED|PUBLIC|OPEN
            $table->unsignedTinyInteger('score_access')->default(0);
            $table->string('toilet_type', 10); // S_TRAP|NON_S_TRAP
            $table->string('sewage_disposal', 12); // SEPTIC_IPAL|NON_SEPTIC
            $table->unsignedTinyInteger('score_technical')->default(0);
            $table->timestamps();
            $table->unique('household_id');
        });

        // A.5
        Schema::create('waste_managements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('disposal_place', 12); // PRIVATE_BIN|COMMUNAL|BURNT|OPENSPACE|WATERBODY
            $table->string('collection_frequency', 12)->nullable(); // GE2X_WEEK|LT1X_WEEK
            $table->unsignedTinyInteger('score')->default(0);
            $table->timestamps();
            $table->unique('household_id');
        });

        // A.6 non-physical
        Schema::create('household_non_physicals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->string('main_occupation', 40)->nullable();
            $table->string('electrical_power', 10)->nullable();
            $table->string('health_facility_usage', 20)->nullable();
            $table->string('education_access_summary', 50)->nullable();
            $table->timestamps();
            $table->unique('household_id');
        });

        // recap
        Schema::create('household_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->unsignedTinyInteger('skor_a1')->default(0);
            $table->unsignedTinyInteger('skor_a2_floor_area')->default(0);
            $table->unsignedTinyInteger('skor_a2_roof_wall_floor')->default(0);
            $table->decimal('skor_a2_total_pct', 5, 2)->nullable();
            $table->unsignedTinyInteger('skor_a3_access')->default(0);
            $table->unsignedTinyInteger('skor_a3_fulfillment')->default(0);
            $table->unsignedTinyInteger('skor_a4_access')->default(0);
            $table->unsignedTinyInteger('skor_a4_technical')->default(0);
            $table->unsignedTinyInteger('skor_a5')->default(0);
            $table->dateTime('computed_at')->nullable();
            $table->timestamps();
            $table->unique('household_id');
        });

        // relocation histories (simple)
        Schema::create('relocation_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->boolean('willing_to_relocate')->default(false);
            $table->boolean('relocation_land_available')->default(false);
            $table->text('team_recommendation')->nullable();
            $table->date('surveyed_at')->nullable();
            $table->string('attachments_folder', 255)->nullable();
            $table->timestamps();
            $table->index(['household_id', 'surveyed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relocation_histories');
        Schema::dropIfExists('household_scores');
        Schema::dropIfExists('household_non_physicals');
        Schema::dropIfExists('waste_managements');
        Schema::dropIfExists('sanitatons');
        Schema::dropIfExists('water_accesses');
        Schema::dropIfExists('house_structure_scores');
    }
};
