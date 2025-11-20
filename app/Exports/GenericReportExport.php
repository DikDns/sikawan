<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;

class GenericReportExport implements FromArray
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $this->formatData($data);
    }

    private function formatData($data)
    {
        $result = [];

        if (isset($data['houses']) || isset($data['psu']) || isset($data['areas'])) {

            foreach ($data as $groupName => $rows) {

                if ($rows->isEmpty()) continue;

                $result[] = [$groupName];
                $result[] = [];

                $first = $rows->first()->toArray();
                $result[] = array_keys($first);

                foreach ($rows as $row) {
                    $result[] = array_values($row->toArray());
                }

                $result[] = [];
                $result[] = [];
            }

            return $result;
        }

        if (!$data->isEmpty()) {
            $first = $data->first()->toArray();
            $result[] = array_keys($first);

            foreach ($data as $row) {
                $result[] = array_values($row->toArray());
            }
        }

        return $result;
    }

    public function array(): array
    {
        return $this->data;
    }
}
