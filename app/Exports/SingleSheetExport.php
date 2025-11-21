<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;

class SingleSheetExport implements FromArray, WithTitle
{
    protected $title;
    protected $rows;

    public function __construct($title, $rows)
    {
        $this->title = $title;
        $this->rows = $rows;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function array(): array
    {
        $result = [];

        if ($this->rows->isNotEmpty()) {
            $first = $this->rows->first()->toArray();
            $result[] = array_keys($first);

            foreach ($this->rows as $row) {
                $result[] = array_values($row->toArray());
            }
        }

        return $result;
    }
}
