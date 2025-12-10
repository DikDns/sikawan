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
        Schema::create('infrastructure_assistances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('infrastructure_id')->constrained('infrastructures')->cascadeOnDelete();
            $table->string('assistance_type', 50)->default('LAINNYA'); // RELOKASI, REHABILITASI, BSPS, LAINNYA
            $table->string('program', 100)->nullable();
            $table->string('funding_source', 80)->nullable();
            $table->string('status', 30)->default('PROSES'); // SELESAI, PROSES, DIBATALKAN
            $table->date('started_at')->nullable();
            $table->date('completed_at')->nullable();
            $table->bigInteger('cost_amount_idr')->nullable();
            $table->text('description')->nullable();
            $table->string('document_path', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('infrastructure_assistances');
    }
};
