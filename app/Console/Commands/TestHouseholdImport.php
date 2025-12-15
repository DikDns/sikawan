<?php

namespace App\Console\Commands;

use App\Services\ExcelImportService;
use Illuminate\Console\Command;

class TestHouseholdImport extends Command
{
    protected $signature = 'app:test-household-import {file}';

    protected $description = 'Test household import parsing and output all field mappings for verification';

    public function handle(ExcelImportService $importService)
    {
        $file = $this->argument('file');

        if (! file_exists($file)) {
            $this->error("File not found: $file");

            return 1;
        }

        $this->info("Parsing file: $file");
        $this->newLine();

        try {
            $results = $importService->parseForVerification($file);

            // Output Region Data
            $this->info('=== REGION DATA ===');
            foreach ($results['region'] as $key => $value) {
                $this->line("  $key: ".($value ?? 'NULL'));
            }
            $this->newLine();

            // Output Household Data (first 3 for brevity)
            $this->info('=== HOUSEHOLD DATA (First 3 Rows) ===');
            $count = min(3, count($results['households']));

            for ($i = 0; $i < $count; $i++) {
                $entry = $results['households'][$i];
                $this->info("--- Row {$entry['row_index']} ---");

                $this->line('  [Household]');
                foreach ($entry['household'] as $key => $value) {
                    $display = is_bool($value) ? ($value ? 'true' : 'false') : ($value ?? 'NULL');
                    $this->line("    $key: $display");
                }

                $this->line('  [TechnicalData]');
                foreach ($entry['technical_data'] as $key => $value) {
                    $display = is_bool($value) ? ($value ? 'true' : 'false') : ($value ?? 'NULL');
                    $this->line("    $key: $display");
                }

                $this->line('  [Member (Head)]');
                foreach ($entry['member'] as $key => $value) {
                    $this->line("    $key: ".($value ?? 'NULL'));
                }
                $this->newLine();
            }

            $this->info('Total Rows Parsed: '.count($results['households']));

        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());

            return 1;
        }

        return 0;
    }
}
