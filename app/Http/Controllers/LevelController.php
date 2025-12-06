<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class LevelController extends Controller
{
    private function formatLabel(string $routeName): string {
        $custom = [
            'dashboard' => 'Halaman Dashboard',
            'distribution-map' => 'Halaman Peta Sebaran',
            'infrastructure' => 'Halaman infrastructure',
            'households.index' => 'Halaman Data Rumah',
            'households.create' => 'Buat Data Rumah',
            'households.draft.get' => 'Ambil Data Draft Rumah',
            'households.show' => 'Lihat Data Rumah',
            'households.edit' => 'Edit Data Rumah',
            'levels' => 'Halaman Level',
            'levels.create' => 'Tambah Level',
            'levels.update' => 'Edit Level',
            'levels.show' => 'Lihat Level',
            'levels.destroy' => 'Hapus Level',
            'messages' => 'Halaman Pesan',
            'messages.show' => 'Lihat Pesan',
            'messages.destroy' => 'Hapus Pesan',
            'reports' => 'Halaman Laporan',
            'reports.download' => 'Download Laporan',
            'reports.store' => 'Tambah laporan',
            'reports.update' => 'Edit Laporan',
            'reports.destroy' => 'Hapus Laporan',
            'users' => 'Halaman Pengguna',
            'users.create' => 'Tambah Pengguna',
            'users.show' => 'Lihat Data Pengguna',
            'users.edit' => 'Edit Data Pengguna',
            'users.destroy' => 'Hapus Data Pengguna',
            'superadmin.logs.activity.create' => 'Membuat Log Aktivitas',
            'superadmin.logs.activity.index' => 'Halaman Log Aktivitas',
            'superadmin.logs.activity.edit' => 'Edit Log Aktivitas',
            'superadmin.logs.activity.show' => 'Lihat Log Aktivitas',
            'superadmin.logs.index' => 'Halaman Log',
            'api.wilayah.provinces' => 'API Provinsi',
            'api.wilayah.cities' => 'API Kota',
            'api.wilayah.sub-districts' => 'API Kecamatan',
            'api.wilayah.villages' => 'API Kelurahan/Desa',
            'areas' => 'Halaman Kawasan',
            'areas.create' => 'Tambah Kawasan',
            'areas.edit' => 'Edit Kawasan',
            'areas.show' => 'Lihat Kawasan',
            'areas.syncAllStatus' => 'Sinkron Semua Status Kawasan',
            'areas.households' => 'Rumah Berdasarkan Kawasan',

            // settings route
            'appearance.edit' => 'Edit Tampilan',
        ];

        if (isset($custom[$routeName])) {
            return $custom[$routeName];
        }

        $parts = explode('.', $routeName);
        $count = count($parts);

        $last = $parts[$count - 1];
        $resources = array_slice($parts, 0, $count - 1);

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

        $actionLabel = $actionMap[$last] ?? ucfirst($last);

        $resourceLabel = implode(' ', array_map(function ($item) {
            return ucfirst(str_replace(['-', '_'], ' ', $item));
        }, $resources));

        return "{$actionLabel} {$resourceLabel}";
    }

    private function groupPermissions() {
        $permissions = Permission::orderBy('name')->get();

        $grouped = [];

        foreach ($permissions as $permission) {
            $parts = explode('.', $permission->name);
            $group = $parts[0];

            if (!isset($grouped[$group])) {
                $grouped[$group] = [
                    'group_name' => ucwords(str_replace(['-', '_'], ' ', $group)),
                    'children' => [],
                ];
            }

            $grouped[$group]['children'][] = [
                'id' => $permission->id,
                'name' => $permission->name,
                'label' => $this->formatLabel($permission->name),
            ];
        }

        return array_values($grouped);
    }

    public function index() {
        $roles = Role::with('permissions')->get();
        $permissionGroups = $this->groupPermissions();

        $formatted = $roles->map(function ($role) use ($permissionGroups) {
            $groups = collect($permissionGroups)->map(function ($group) use ($role) {
                return [
                    'id' => $group['group_name'],
                    'name' => $group['group_name'],
                    'features' => collect($group['children'])->map(function ($child) use ($role) {
                        $can = $role->permissions->contains('id', $child['id']);
                        return [
                            'id' => $child['id'],
                            'name' => $child['label'],
                            'can_access' => $can,
                        ];
                    })->values(),
                ];
            })->values();

            return [
                'id' => $role->id,
                'name' => $role->name,
                'created_at' => $role->created_at,
                'feature_groups' => $groups,
                'is_superadmin' => $role->name === 'superadmin',
            ];
        });

        return Inertia::render('levels', [
            'roles' => $formatted,
        ]);
    }

    public function create() {
        $permissionGroups = $this->groupPermissions();

        $groups = collect($permissionGroups)->map(function ($group) {
            return [
                'id' => $group['group_name'],
                'name' => $group['group_name'],
                'features' => collect($group['children'])->map(function ($child) {
                    return [
                        'id' => $child['id'],
                        'name' => $child['label'],
                        'can_access' => false,
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('levels/create-level', [
            'permissions' => $groups,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($request->permission_ids);

        return redirect()
            ->route('levels')
            ->withSuccess('Level berhasil dibuat.');
    }

    public function update(Request $request, $role_id) {
        $request->validate([
            'name' => 'required|string|max:255',
            'permission_ids' => 'array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        $role = Role::findOrFail($role_id);

        if ($role->name === 'superadmin') {
            return back()->with('error', 'Level Superadmin tidak dapat diubah.');
        }

        $role->update([
            'name' => $request->name,
        ]);

        $role->syncPermissions($request->permission_ids ?? []);

        return back()->withSuccess('Level berhasil diperbarui.');
    }

    public function destroy(Request $request) {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
        ]);

        $roles = Role::whereIn('id', $request->ids)->get();
        $rolesInUse = [];

        foreach ($roles as $role) {
            if ($role->users()->exists()) {
                $rolesInUse[] = $role->name;
                continue;
            }
            $role->syncPermissions([]);
            $role->delete();
        }

        if (!empty($rolesInUse)) {
            return back()->withErrors([
                'delete' => 'Level berikut tidak dapat dihapus karena masih digunakan oleh pengguna: ' . implode(', ', $rolesInUse)
            ]);
        }

        return back()->withSuccess('Level berhasil dihapus.');
    }
}
