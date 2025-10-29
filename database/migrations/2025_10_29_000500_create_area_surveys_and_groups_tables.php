<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('area_surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->foreignId('regency_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->foreignId('village_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->string('rt_rw', 20)->nullable();
            $table->string('unit_name', 150)->nullable();
            $table->date('survey_date')->nullable();
            $table->text('geometry_json')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['province_id','regency_id','district_id','village_id'], 'area_surveys_admin_idxs');
        });

        Schema::create('area_groups', function (Blueprint $table) {
            $table->id();
            $table->string('code', 40)->unique();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('legend_color_hex', 7)->nullable();
            $table->string('legend_icon', 80)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index('is_active');
        });

        Schema::create('area_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_group_id')->constrained('area_groups')->cascadeOnDelete();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('geometry_type', 12);
            $table->text('geometry_json');
            $table->decimal('centroid_lat', 10, 6)->nullable();
            $table->decimal('centroid_lng', 10, 6)->nullable();
            $table->integer('household_count')->nullable();
            $table->integer('family_count')->nullable();
            $table->foreignId('area_survey_id')->nullable()->constrained('area_surveys')->nullOnDelete();
            $table->text('attributes_json')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            $table->index(['area_group_id', 'area_survey_id']);
            $table->index('is_visible');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('area_features');
        Schema::dropIfExists('area_groups');
        Schema::dropIfExists('area_surveys');
    }
};
