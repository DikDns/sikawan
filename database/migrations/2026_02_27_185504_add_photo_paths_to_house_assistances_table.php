<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('house_assistances', function (Blueprint $table) {
            $table->json('photo_paths')->nullable()->after('document_path');
        });
    }

    public function down(): void
    {
        Schema::table('house_assistances', function (Blueprint $table) {
            $table->dropColumn('photo_paths');
        });
    }
};
