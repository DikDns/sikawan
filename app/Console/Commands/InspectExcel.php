<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Row;
use Illuminate\Support\Collection;

class InspectExcel extends Command
{
    protected $signature = 'app:inspect-excel {file}';
    protected $description = 'Inspect structure of an Excel file for import planning';

    public function handle()
    {
        $file = $this->argument('file');

        if (!file_exists($file)) {
            $this->error("File not found: $file");
            return 1;
        }

        $this->info("Scanning file: $file");

        try {
            // Use a simple anonymous class implementing ToArray to get raw data
            $sheets = Excel::toArray(new class implements \Maatwebsite\Excel\Concerns\ToArray {
                public function array(array $array) { return $array; }
            }, $file);

            // Define Sheet mappings to verify
            // Sheet Index => [Sheet Name, [Column Index => Model Field Name]]
            $map = [
                0 => ['Cover', [
                    17 => 'Province (Assuming E17)',
                    18 => 'Regency (E18)',
                    19 => 'District (E19)',
                    20 => 'Village (E20)',
                ]],
                2 => ['A.1 Keteraturan', [
                    6 => 'facade_faces_road (Q2a, <=1.5m)',
                    13 => 'faces_waterbody (Q3)',
                    16 => 'in_setback_area (Q4)',
                    18 => 'in_hazard_area (Q5)',
                    20 => 'score_a1'
                ]],
                4 => ['A.2 Kelayakan', [
                    3 => 'building_length_m',
                    4 => 'building_width_m',
                    5 => 'floor_count',
                    12 => 'roof_condition (1=NoLeak)',
                    14 => 'wall_condition (1=Good)',
                    16 => 'floor_material (1=NonSoil)',
                    18 => 'score_a2_structure',
                    19 => 'score_a2_total_pct'
                ]],
                5 => ['A.3 Air Minum', [
                    3 => 'water_source (Ledeng M)',
                    5 => 'water_source (Sumur Bor)',
                    14 => 'water_distance (>=10m)',
                    17 => 'water_fulfillment (Yearly)',
                    16 => 'score_a3_access',
                    20 => 'score_a3_fulfillment'
                ]],
                6 => ['A.4 Sanitasi', [
                    3 => 'defecation_place (Private)',
                    7 => 'toilet_type (GooseNeck)',
                    9 => 'sewage_disposal (Septic)',
                    6 => 'score_a4_access',
                    11 => 'score_a4_technical'
                ]],
                7 => ['A.5 Sampah', [
                    3 => 'waste_disposal (Private)',
                    4 => 'waste_disposal (TPS)',
                    8 => 'waste_freq (>=2x)',
                    10 => 'score_a5'
                ]],
                8 => ['A.6.1 Pendapatan/Listrik', [
                   3 => 'occupation (Pertanian)',
                   9 => 'occupation (PNS)',
                   10 => 'elec_power (450VA)',
                   14 => 'elec_source (Non-PLN)',
                   16 => 'status_mbr (MBR)',
                   22 => 'difabel_count'
                ]],
                9 => ['A.6.2 Fasilitas Sosial', [
                    3 => 'health_facility (RS)',
                    8 => 'health_facility (Tidak Pernah)',
                    9 => 'health_loc (Dalam Kec)',
                    12 => 'edu_loc (Dalam Kec)'
                ]],
                10 => ['A.6.3 Penguasaan Bangunan', [
                    3 => 'building_status (Milik)',
                    6 => 'building_legal (IMB)',
                    8 => 'land_status (Milik)',
                    11 => 'land_legal (SHM)'
                ]]
            ];

            foreach ($map as $sheetIdx => $info) {
                $sheetName = $info[0];
                $cols = $info[1];
                $rows = $sheets[$sheetIdx] ?? [];

                $this->info(str_repeat('=', 40));
                $this->info("Sheet [$sheetIdx]: $sheetName");

                if (empty($rows)) {
                    $this->warn("  (Empty)");
                    continue;
                }

                $rowCount = count($rows);
                $this->info("  Total Rows: $rowCount");

                // For Cover sheet (Index 0), print all rows (0-20)
                if ($sheetIdx === 0) {
                    for ($r = 0; $r < min(21, $rowCount); $r++) {
                        $row = $rows[$r] ?? [];
                        $this->line("  Row $r: " . json_encode(array_filter($row, fn($v) => $v !== null && $v !== '')));
                    }
                    continue;
                }

                // For A.1 (Index 2), also print rows 28-40 to find data start
                if ($sheetIdx === 2) {
                    $this->info("  Rows 28-40 (find data start):");
                    for ($r = 28; $r < min(41, $rowCount); $r++) {
                        $row = $rows[$r] ?? [];
                        $name = $row[2] ?? 'EMPTY';
                        $nik = $row[3] ?? 'EMPTY';
                        $this->line("    Row $r: Name=[$name] NIK=[$nik]");
                    }

                    // Find "Sub - Total" row
                    for ($r = 30; $r < $rowCount; $r++) {
                        $row = $rows[$r] ?? [];
                        $name = strtolower(trim($row[2] ?? ''));
                        if (str_contains($name, 'sub - total') || str_contains($name, 'sub-total')) {
                            $this->warn("  STOP ROW (Sub-Total) found at: $r");
                            break;
                        }
                    }
                }

                // Check Row 30 (Sample Data)
                $sampleRow = $rows[30] ?? []; // Index 30 = Row 31
                if (empty($sampleRow)) {
                     $this->warn("  Row 30 is empty (maybe less data?)");
                     continue;
                }

                $this->info("  Sample Data (Row 31):");
                foreach ($cols as $idx => $field) {
                    $val = $sampleRow[$idx] ?? 'NULL';
                    $this->line("    Col [$idx] -> $val  (Maps to: $field)");
                }
            }

        } catch (\Exception $e) {
            $this->error("Error extracting excel: " . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function printRow($row)
    {
        // Unused in verification mode
    }
}
