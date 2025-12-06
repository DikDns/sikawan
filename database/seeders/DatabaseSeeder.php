<?php

namespace Database\Seeders;

use App\Models\User;
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

        // Create superadmin user
        $user = User::firstOrCreate(
            ['email' => 'superadmin@sikawan.com'],
            [
                'name' => 'Super Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $user->assignRole('superadmin');

        // Seed main data
        // Order matters: AreaGroupSeeder creates Areas first,
        // then HouseholdSeeder can link households to areas
        $this->call([
            AreaGroupSeeder::class,
            InfrastructureGroupSeeder::class,
            HouseholdSeeder::class,
            ReportSeeder::class,
        ]);

        $this->command->info('All seeders completed successfully!');
    }
}
