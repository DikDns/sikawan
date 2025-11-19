<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionsFromRoutesSeeder::class,
            RoleSeeder::class,
        ]);

        $user = User::firstOrCreate(
            ['email' => 'superadmin@sikawan.com'],
            [
                'name' => 'Super Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $user->assignRole('superadmin');

        // Seed households and related data
        $this->call([
            HouseholdSeeder::class,
            AreaGroupSeeder::class,
            InfrastructureGroupSeeder::class,
            ReportSeeder::class,
        ]);
    }
}
