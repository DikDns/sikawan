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
            Permission::firstOrCreate(['name' => $routeName]);
        }

        $extraPermissions = [
            'messages.show',
            'messages.destroy',
            'levels.update',
            'levels.destroy',
            'levels.show',
            'logs',
        ];

        foreach ($extraPermissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }
    }
}
