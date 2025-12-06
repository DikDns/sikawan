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
            Permission::firstOrCreate(['name' => $this->formatLabel($routeName)]);
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
            Permission::firstOrCreate(['name' => $this->formatLabel($perm)]);
        }
    }

    private function formatLabel(string $routeName): string
    {
        $parts = explode('.', $routeName);

        if (count($parts) === 1) {
            return ucfirst(str_replace(['-', '_'], ' ', $parts[0]));
        }
        [$resource, $action] = $parts;

        $actionMap = [
            'index'   => 'Halaman',
            'create'  => 'Tambah',
            'store'   => 'Simpan',
            'edit'    => 'Edit',
            'update'  => 'Perbarui',
            'destroy' => 'Hapus',
            'delete'  => 'Hapus',
            'show'    => 'Lihat',
        ];

        $resourceLabel = ucfirst(str_replace(['-', '_'], ' ', $resource));
        $actionLabel = $actionMap[$action] ?? ucfirst($action);

        return "{$actionLabel} {$resourceLabel}";
    }
}
