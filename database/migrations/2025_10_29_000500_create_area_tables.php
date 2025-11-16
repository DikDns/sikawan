<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('area_groups', function (Blueprint $table) {
            $table->id();
            $table->string('code', 40)->unique();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('legend_color_hex', 7)->nullable();
            $table->string('legend_icon', 80)->nullable();
            $table->text('geometry_json')->nullable();
            $table->decimal('centroid_lat', 10, 6)->nullable();
            $table->decimal('centroid_lng', 10, 6)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('area_groups');
    }
};
