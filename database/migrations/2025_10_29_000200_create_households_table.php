<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->foreignId('regency_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->foreignId('village_id')->nullable()->constrained('admin_areas')->nullOnDelete();
            $table->string('rt_rw', 20)->nullable();
            $table->date('survey_date')->nullable();
            $table->string('head_name', 150);
            $table->string('nik', 32)->nullable();
            $table->text('address_text')->nullable();
            $table->integer('kk_count')->default(1);
            $table->string('status_mbr', 8); // MBR | NON_MBR
            $table->integer('member_total')->default(0);
            $table->integer('male_count')->default(0);
            $table->integer('female_count')->default(0);
            $table->integer('disabled_count')->default(0);
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->text('location_json')->nullable();
            $table->string('photo_folder', 255)->nullable();

            // UI overview additions
            $table->string('ownership_status_building', 10)->nullable(); // OWN|RENT|OTHER
            $table->string('ownership_status_land', 10)->nullable();
            $table->string('building_legal_status', 6)->nullable(); // IMB|NONE
            $table->string('land_legal_status', 12)->nullable();
            $table->bigInteger('monthly_income_idr')->nullable();
            $table->boolean('electricity_connected')->nullable();

            // reference to area_surveys will be added later when table exists
            $table->unsignedBigInteger('area_survey_id')->nullable();
            $table->text('nearest_psu_json')->nullable();

            $table->timestamps();

            $table->index(['province_id', 'regency_id', 'district_id', 'village_id'], 'households_admin_idxs');
            $table->index(['latitude', 'longitude']);
            $table->index('area_survey_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};
