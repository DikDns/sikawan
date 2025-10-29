<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('infrastructure_groups', function (Blueprint $table) {
            $table->id();
            $table->string('code', 40)->unique();
            $table->string('name', 150);
            $table->string('category', 40); // Air Bersih, Listrik, dll
            $table->string('jenis', 12); // PRASARANA|SARANA
            $table->string('legend_color_hex', 7)->nullable();
            $table->string('legend_icon', 80)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['category', 'jenis']);
            $table->index('is_active');
        });

        Schema::create('infrastructures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('infrastructure_group_id')->constrained('infrastructure_groups')->cascadeOnDelete();
            $table->string('type', 20)->nullable(); // kept for compatibility
            $table->string('name', 150)->nullable();
            $table->text('attributes_json')->nullable();
            $table->string('geometry_type', 20);
            $table->text('geometry_json');
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->string('title', 150)->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('order_index')->nullable();
            $table->timestamps();
            $table->index('infrastructure_group_id');
            $table->index('is_visible');
        });

        Schema::create('infrastructure_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('infrastructure_id')->constrained('infrastructures')->cascadeOnDelete();
            $table->string('file_path', 255);
            $table->string('caption', 150)->nullable();
            $table->timestamps();
            $table->index('infrastructure_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('infrastructure_photos');
        Schema::dropIfExists('infrastructures');
        Schema::dropIfExists('infrastructure_groups');
    }
};
