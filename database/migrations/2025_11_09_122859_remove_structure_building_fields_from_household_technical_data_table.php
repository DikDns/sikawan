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
        Schema::table('household_technical_data', function (Blueprint $table) {
            // Remove Struktur Bangunan fields (not in PENDATAAN BASELINE.md)
            $table->dropColumn([
                'has_foundation',
                'has_sloof',
                'has_ring_beam',
                'has_roof_structure',
                'has_columns',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('household_technical_data', function (Blueprint $table) {
            // Re-add Struktur Bangunan fields
            $table->boolean('has_foundation')->default(false)->after('score_a2_floor_area');
            $table->boolean('has_sloof')->default(false)->after('has_foundation');
            $table->boolean('has_ring_beam')->default(false)->after('has_sloof');
            $table->boolean('has_roof_structure')->default(false)->after('has_ring_beam');
            $table->boolean('has_columns')->default(false)->after('has_roof_structure');
        });
    }
};
