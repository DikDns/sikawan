<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class GenericReportExport implements WithMultipleSheets
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function sheets(): array
    {
        $sheets = [];

        if (isset($this->data['houses']) || isset($this->data['psu']) || isset($this->data['areas'])) {
            if (!empty($this->data['houses'])) {
                $sheets[] = new SingleSheetExport('Rumah', $this->data['houses']);
            }

            if (!empty($this->data['psu'])) {
                $sheets[] = new SingleSheetExport('PSU', $this->data['psu']);
            }

            if (!empty($this->data['areas'])) {
                $sheets[] = new SingleSheetExport('Kawasan', $this->data['areas']);
            }

            return $sheets;
        }

        $sheets[] = new SingleSheetExport('Data', $this->data);

        return $sheets;
    }
}
