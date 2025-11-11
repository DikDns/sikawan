<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('province_id', 10)->nullable();
            $table->string('province_name', 150)->nullable();
            $table->string('regency_id', 10)->nullable();
            $table->string('regency_name', 150)->nullable();
            $table->string('district_id', 10)->nullable();
            $table->string('district_name', 150)->nullable();
            $table->string('village_id', 10)->nullable();
            $table->string('village_name', 150)->nullable();
            $table->text('description')->nullable();
            $table->text('geometry_json');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};
