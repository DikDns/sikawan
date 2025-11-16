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
            // Make faces_waterbody and in_setback_area nullable
            // These can be null when answer is "Tidak ada sungai/laut/rawa/danau"
            $table->boolean('faces_waterbody')->nullable()->change();
            $table->boolean('in_setback_area')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('household_technical_data', function (Blueprint $table) {
            // Revert to non-nullable with default false
            $table->boolean('faces_waterbody')->default(false)->change();
            $table->boolean('in_setback_area')->default(false)->change();
        });
    }
};
