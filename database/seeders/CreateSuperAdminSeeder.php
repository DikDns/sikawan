<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class CreateSuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'superadmin@sihuma.muaraenim.site'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('Password123!'),
                'email_verified_at' => now(),
            ]
        );

        $user->assignRole('superadmin');

        $this->command->info('Superadmin created: superadmin@sihuma.muaraenim.site');
    }
}
