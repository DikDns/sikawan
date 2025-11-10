<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add indexes to optimize queries for area groups with aggregated counts
     */
    public function up(): void
    {
        // Add composite index for filtering and aggregating by area_group_id and is_visible
        // This optimizes queries that filter features by group and visibility status
        Schema::table('area_features', function (Blueprint $table) {
            try {
                $table->index(['area_group_id', 'is_visible'], 'area_features_group_visible_idx');
            } catch (\Exception $e) {
                // Index might already exist, ignore error
            }
        });

        // Add composite index for filtering active area groups by code
        // This optimizes queries that filter active groups and search by code
        Schema::table('area_groups', function (Blueprint $table) {
            try {
                $table->index(['is_active', 'code'], 'area_groups_active_code_idx');
            } catch (\Exception $e) {
                // Index might already exist, ignore error
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('area_features', function (Blueprint $table) {
            try {
                $table->dropIndex('area_features_group_visible_idx');
            } catch (\Exception $e) {
                // Index might not exist, ignore error
            }
        });

        Schema::table('area_groups', function (Blueprint $table) {
            try {
                $table->dropIndex('area_groups_active_code_idx');
            } catch (\Exception $e) {
                // Index might not exist, ignore error
            }
        });
    }
};
