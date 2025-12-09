<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;

class ReportExport implements FromArray
{
    protected $rows;

    public function __construct($data)
    {
        $this->rows = is_array($data) ? $data : $data->toArray();
    }

    public function array(): array
    {
        if (empty($this->rows)) return [[]];

        $headers = array_keys((array) $this->rows[0]);
        $body = array_map(fn($row) => (array) $row, $this->rows);

        return array_merge([$headers], $body);
    }
}
