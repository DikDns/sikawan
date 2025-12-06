<?php

namespace App\Helpers;

/**
 * Format audit log entries to human-readable Indonesian text
 */
class ActivityLogFormatter
{
    /**
     * Entity name translations
     */
    private static array $entityNames = [
        'Household' => 'Rumah',
        'Area' => 'Kawasan',
        'AreaGroup' => 'Kelompok Kawasan',
        'Infrastructure' => 'PSU',
        'InfrastructureGroup' => 'Kelompok PSU',
        'User' => 'Pengguna',
        'Member' => 'Anggota Keluarga',
        'Photo' => 'Foto',
        'Score' => 'Skor',
        'TechnicalData' => 'Data Teknis',
        'Assistance' => 'Bantuan',
        'Report' => 'Laporan',
        'Message' => 'Pesan',
        'Media' => 'Media',
        'RelocationAssessment' => 'Penilaian Relokasi',
    ];

    /**
     * Field name translations
     */
    private static array $fieldNames = [
        'head_name' => 'nama kepala keluarga',
        'address_text' => 'alamat',
        'latitude' => 'koordinat lat',
        'longitude' => 'koordinat lng',
        'habitability_status' => 'status kelayakan',
        'member_total' => 'jumlah anggota',
        'kk_count' => 'jumlah KK',
        'name' => 'nama',
        'description' => 'deskripsi',
        'is_slum' => 'status kumuh',
        'area_total_m2' => 'luas area',
        'geometry_json' => 'geometri',
        'province_name' => 'provinsi',
        'regency_name' => 'kabupaten/kota',
        'district_name' => 'kecamatan',
        'village_name' => 'desa/kelurahan',
        'email' => 'email',
        'password' => 'kata sandi',
        'survey_date' => 'tanggal survei',
        'nik' => 'NIK',
        'status_mbr' => 'status MBR',
    ];

    /**
     * Format a log entry to human-readable description
     */
    public static function format(string $action, string $entityType, array $meta): string
    {
        $entityName = self::getEntityName($entityType);

        return match ($action) {
            'CREATE' => self::formatCreate($entityName, $meta),
            'UPDATE' => self::formatUpdate($entityName, $meta),
            'DELETE' => self::formatDelete($entityName, $meta),
            default => $action
        };
    }

    /**
     * Get translated entity name from FQCN
     */
    private static function getEntityName(string $fqcn): string
    {
        $short = class_basename($fqcn);
        return self::$entityNames[$short] ?? $short;
    }

    /**
     * Format CREATE action
     */
    private static function formatCreate(string $entity, array $meta): string
    {
        $identifier = self::extractIdentifier($meta['after'] ?? []);
        if ($identifier) {
            return "Membuat {$entity} baru: {$identifier}";
        }
        return "Membuat {$entity} baru";
    }

    /**
     * Format UPDATE action
     */
    private static function formatUpdate(string $entity, array $meta): string
    {
        $changes = $meta['after'] ?? [];
        $fields = array_keys($changes);

        // Filter out timestamps and internal fields
        $fields = array_filter($fields, fn($f) => !in_array($f, ['updated_at', 'created_at', 'id']));

        if (empty($fields)) {
            return "Mengubah {$entity}";
        }

        $readableFields = array_map(
            fn($f) => self::$fieldNames[$f] ?? str_replace('_', ' ', $f),
            array_slice($fields, 0, 3)
        );

        $text = "Mengubah {$entity}: " . implode(', ', $readableFields);
        if (count($fields) > 3) {
            $text .= ' (+' . (count($fields) - 3) . ' lainnya)';
        }
        return $text;
    }

    /**
     * Format DELETE action
     */
    private static function formatDelete(string $entity, array $meta): string
    {
        $identifier = self::extractIdentifier($meta['before'] ?? []);
        if ($identifier) {
            return "Menghapus {$entity}: {$identifier}";
        }
        return "Menghapus {$entity}";
    }

    /**
     * Extract a human-readable identifier from attributes
     */
    private static function extractIdentifier(array $attrs): ?string
    {
        // Priority order for identifier
        $identifierFields = ['head_name', 'name', 'email', 'title', 'code'];
        foreach ($identifierFields as $field) {
            if (!empty($attrs[$field])) {
                $value = $attrs[$field];
                // Truncate if too long
                if (strlen($value) > 50) {
                    $value = substr($value, 0, 47) . '...';
                }
                return $value;
            }
        }
        return null;
    }
}
