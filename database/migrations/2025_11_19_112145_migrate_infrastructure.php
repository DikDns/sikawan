<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  public function up(): void
  {
    // Drop index on is_active before dropping the column (SQLite requires this)
    if (Schema::hasColumn('infrastructure_groups', 'is_active')) {
      if (DB::getDriverName() === 'sqlite') {
        DB::statement('DROP INDEX IF EXISTS infrastructure_groups_is_active_index');
      } else {
        Schema::table('infrastructure_groups', function (Blueprint $table) {
          $table->dropIndex(['is_active']);
        });
      }
    }

    Schema::table('infrastructure_groups', function (Blueprint $table) {
      if (Schema::hasColumn('infrastructure_groups', 'is_active')) {
        $table->dropColumn('is_active');
      }

      if (!Schema::hasColumn('infrastructure_groups', 'type')) {
        $table->string('type', 12)->after('category');
      }
    });

    if (Schema::hasColumn('infrastructure_groups', 'jenis')) {
      // Drop composite index using jenis before removing the column
      if (DB::getDriverName() === 'sqlite') {
        DB::statement('DROP INDEX IF EXISTS infrastructure_groups_category_jenis_index');
      } else {
        Schema::table('infrastructure_groups', function (Blueprint $table) {
          $table->dropIndex(['category', 'jenis']);
        });
      }

      DB::table('infrastructure_groups')
        ->whereNull('type')
        ->update(['type' => DB::raw('jenis')]);

      Schema::table('infrastructure_groups', function (Blueprint $table) {
        $table->dropColumn('jenis');
      });
    }

    Schema::table('infrastructure_groups', function (Blueprint $table) {
      $table->index(['category', 'type']);
    });

    Schema::table('infrastructures', function (Blueprint $table) {
      if (!Schema::hasColumn('infrastructures', 'latitude')) {
        $table->dropColumn('latitude');
      }
      if (!Schema::hasColumn('infrastructures', 'longitude')) {
        $table->dropColumn('longitude');
      }
      if (!Schema::hasColumn('infrastructures', 'title')) {
        $table->dropColumn('title');
      }
      if (!Schema::hasColumn('infrastructures', 'is_visible')) {
        $table->dropColumn('is_visible');
      }
      if (!Schema::hasColumn('infrastructures', 'order_index')) {
        $table->dropColumn('order_index');
      }
      if (!Schema::hasColumn('infrastructures', 'type')) {
        $table->dropColumn('type');
      }
    });

    Schema::dropIfExists('infrastructure_photos');
  }

  public function down(): void
  {
    Schema::table('infrastructure_groups', function (Blueprint $table) {
      if (!Schema::hasColumn('infrastructure_groups', 'jenis')) {
        $table->string('jenis', 12)->after('category');
      }
    });

    if (Schema::hasColumn('infrastructure_groups', 'type')) {
      DB::table('infrastructure_groups')
        ->whereNull('jenis')
        ->update(['jenis' => DB::raw('type')]);

      // Drop composite index on (category, type) before removing type
      if (DB::getDriverName() === 'sqlite') {
        DB::statement('DROP INDEX IF EXISTS infrastructure_groups_category_type_index');
      } else {
        Schema::table('infrastructure_groups', function (Blueprint $table) {
          $table->dropIndex(['category', 'type']);
        });
      }

      Schema::table('infrastructure_groups', function (Blueprint $table) {
        $table->dropColumn('type');
        $table->index(['category', 'jenis']);
      });
    }

    Schema::table('infrastructure_groups', function (Blueprint $table) {
      if (!Schema::hasColumn('infrastructure_groups', 'is_active')) {
        $table->boolean('is_active')->default(true)->after('description');
        $table->index('is_active');
      }
    });

    Schema::create('infrastructure_photos', function (Blueprint $table) {
      $table->id();
      $table->foreignId('infrastructure_id')->constrained('infrastructures')->cascadeOnDelete();
      $table->string('file_path', 255);
      $table->string('caption', 150)->nullable();
      $table->timestamps();
      $table->index('infrastructure_id');
    });

    Schema::table('infrastructures', function (Blueprint $table) {
      $table->string('latitude')->nullable();
      $table->string('longitude')->nullable();
      $table->string('type')->nullable();
      $table->string('title', 150)->after('name');
      $table->boolean('is_visible')->default(true)->after('title');
      $table->integer('order_index')->after('is_visible');
    });
  }
};
