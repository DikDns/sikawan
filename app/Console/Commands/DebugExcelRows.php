<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class DebugExcelRows extends Command
{
    protected $signature = 'app:debug-excel-rows {file}';

    protected $description = 'Debug Excel rows to find exact data structure';

    public function handle()
    {
        $file = $this->argument('file');

        if (! file_exists($file)) {
            $this->error("File not found: $file");

            return 1;
        }

        $sheets = Excel::toArray(new class implements \Maatwebsite\Excel\Concerns\ToArray
        {
            public function array(array $array)
            {
                return $array;
            }
        }, $file);

        // Check Sheet 2 (A.1) rows 28-40
        $sheetA1 = $sheets[2] ?? [];
        $this->info('=== Sheet A.1 (Index 2) - Rows 28-45 ===');

        // Check Cover sheet for RT/RW and Date
        $cover = $sheets[0] ?? [];
        $this->info('=== Cover Sheet (Index 0) - Rows 0-25 ===');
        for ($r = 0; $r < min(26, count($cover)); $r++) {
            $row = $cover[$r] ?? [];
            $colC = $row[2] ?? '-';
            $colD = $row[3] ?? '-';
            $colE = $row[4] ?? '-';
            $colF = $row[5] ?? '-';
            $this->line("Row $r: ColC=[$colC] ColD=[$colD] ColE=[$colE] ColF=[$colF]");
        }

        // Check DP-RT sheet (Index 1) for Date
        $dprt = $sheets[1] ?? [];
        $this->info('=== DP-RT Sheet (Index 1) - Rows 0-15 ===');
        for ($r = 0; $r < min(16, count($dprt)); $r++) {
            $row = $dprt[$r] ?? [];
            $colC = $row[2] ?? '-';
            $colD = $row[3] ?? '-';
            $colE = $row[4] ?? '-';
            $this->line("Row $r: ColC=[$colC] ColD=[$colD] ColE=[$colE]");
        }

        return 0;
    }
}
