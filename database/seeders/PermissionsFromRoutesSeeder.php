<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;

class PermissionsFromRoutesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $routes = collect(Route::getRoutes())
            ->filter(fn($route) => in_array('GET', $route->methods()))
            ->pluck('action.as')
            ->filter()
            ->unique();

        foreach ($routes as $routeName) {
            $exclude = [
                'distribution-map.public',
                'home',
                'login',
                'password.confirm',
                'password.confirmation',
                'password.request',
                'password.reset',
                'storage.local',
                'verification.notice',
                'verification.verify',
                'two-factor.login',
                'two-factor.qr-code',
                'two-factor.secret-key',
                'two-factor.recovery-codes',
                'two-factor.show',
                'appearance.edit',
                'user-password.edit',
                'profile.edit',
                'assistances.index',
                'api.wilayah.provinces',
                'api.wilayah.cities',
                'api.wilayah.sub-districts',
                'api.wilayah.villages',
                'logs',
            ];
            if (in_array($routeName, $exclude)) continue;
            Permission::firstOrCreate(['name' => $routeName]);
        }

        $extraPermissions = [
            'messages.show',
            'messages.destroy',
            'levels.update',
            'levels.show',
            'levels.destroy',
            'reports.store',
            'reports.destroy',
            'reports.update',
            'users.destroy',
            'logs',
        ];

        foreach ($extraPermissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }
    }
}
