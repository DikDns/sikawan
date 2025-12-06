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
        Schema::table('areas', function (Blueprint $table) {
            $table->boolean('is_slum')->default(false)->after('geometry_json');
            $table->decimal('area_total_m2', 12, 2)->nullable()->after('is_slum');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropColumn(['is_slum', 'area_total_m2']);
        });
    }
};
