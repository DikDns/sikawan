<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_areas', function (Blueprint $table) {
            $table->id();
            $table->string('level', 16); // province, regency, district, village
            $table->string('code', 32);
            $table->string('name', 150);
            $table->foreignId('parent_id')->nullable()->constrained('admin_areas')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['level', 'code']);
            $table->index('parent_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_areas');
    }
};
