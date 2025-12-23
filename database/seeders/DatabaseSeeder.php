<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core permissions and roles
        $this->call([
            PermissionsFromRoutesSeeder::class,
            RoleSeeder::class,
        ]);

        $this->call([
            CreateSuperAdminSeeder::class,
            AreaGroupSeeder::class,
            InfrastructureGroupSeeder::class,
            HouseholdSeeder::class,
            ReportSeeder::class,
        ]);

        $this->command->info('All seeders completed successfully!');
    }
}
