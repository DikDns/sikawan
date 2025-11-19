<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <style>
        body {
            font-family: sans-serif;
            padding: 20px;
            color: #0f172a;
        }
        h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .subtitle {
            font-size: 14px;
            opacity: 0.7;
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            font-size: 13px;
        }
        th {
            text-align: left;
            background: #f1f5f9;
            padding: 6px;
            border-bottom: 1px solid #cbd5e1;
        }
        td {
            padding: 6px;
            border-bottom: 1px solid #e2e8f0;
        }
        .chart-image {
            margin: 20px 0;
            width: 100%;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            background: #e2e8f0;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <h1>{{ $title }}</h1>

    <div class="subtitle">
        Jenis Laporan: <b>{{ $type }}</b> <br>
        Periode:
        <b>{{ $start ? date('d M Y', strtotime($start)) : 'Semua' }}</b>
        -
        <b>{{ $end ? date('d M Y', strtotime($end)) : 'Semua' }}</b>
    </div>

    @if ($description)
        <p style="margin-bottom:20px;">{{ $description }}</p>
    @endif

    {{-- ====================== RUMAH ====================== --}}
    @if ($type === 'RUMAH')
        <div class="section-title">Ringkasan Data Rumah</div>

        {{-- Grafik Status Kelayakan --}}
        @php
            $statusCount = [
                'RLH' => $data->where('habitability_status', 'RLH')->count(),
                'RTLH' => $data->where('habitability_status', 'RTLH')->count(),
            ];

            $chartConfig = [
                "type" => "pie",
                "data" => [
                    "labels" => ["RLH", "RTLH"],
                    "datasets" => [[ "data" => array_values($statusCount) ]]
                ]
            ];
            $chartUrl = "https://quickchart.io/chart?w=600&h=350&chart=" . urlencode(json_encode($chartConfig));
        @endphp

        <img src="{{ $chartUrl }}" class="chart-image">

        <table>
            <thead>
                <tr>
                    <th>Nama Kepala</th>
                    <th>Alamat</th>
                    <th>Status</th>
                    <th>Total Jiwa</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $h)
                    <tr>
                        <td>{{ $h->head_name }}</td>
                        <td>{{ $h->address_text }}</td>
                        <td>{{ $h->habitability_status }}</td>
                        <td>{{ $h->member_total }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif


    {{-- ====================== PSU ====================== --}}
    @if ($type === 'PSU')
        <div class="section-title">Ringkasan PSU</div>

        @php
            $byJenis = [
                'PRASARANA' => $data->where('jenis', 'PRASARANA')->count(),
                'SARANA'    => $data->where('jenis', 'SARANA')->count(),
            ];

            $chartConfig = [
                "type" => "bar",
                "data" => [
                    "labels" => ["PRASARANA", "SARANA"],
                    "datasets" => [[
                        "data" => array_values($byJenis),
                        "backgroundColor" => ["#8B5CF6", "#22C55E"]
                    ]]
                ]
            ];
            $chartUrl = "https://quickchart.io/chart?w=700&h=350&chart=" . urlencode(json_encode($chartConfig));
        @endphp

        <img src="{{ $chartUrl }}" class="chart-image">

        <table>
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Jenis</th>
                    <th>Jumlah Infrastruktur</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $i)
                    <tr>
                        <td>{{ $i->name }}</td>
                        <td>{{ $i->category }}</td>
                        <td>{{ $i->jenis }}</td>
                        <td>{{ $i->infrastructure_count }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif


    {{-- ====================== KAWASAN ====================== --}}
    @if ($type === 'KAWASAN')
        <div class="section-title">List Kawasan</div>

        <table>
            <thead>
                <tr>
                    <th>Nama Kawasan</th>
                    <th>Deskripsi</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $a)
                    <tr>
                        <td>{{ $a->name }}</td>
                        <td>{{ $a->description }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    {{-- ====================== UMUM ====================== --}}
    @if ($type === 'UMUM')
        <div class="section-title">Ringkasan Laporan Umum</div>

        <p>Total Rumah: <b>{{ count($data['houses']) }}</b></p>
        <p>Total PSU: <b>{{ count($data['psu']) }}</b></p>
        <p>Total Kawasan: <b>{{ count($data['areas']) }}</b></p>

        <div class="section-title">Data Rumah</div>
        <table>
            <thead>
                <tr>
                    <th>Nama Kepala</th>
                    <th>Alamat</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['houses'] as $h)
                    <tr>
                        <td>{{ $h->head_name }}</td>
                        <td>{{ $h->address_text }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="section-title">Data PSU</div>
        <table>
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Jenis</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['psu'] as $p)
                    <tr>
                        <td>{{ $p->name }}</td>
                        <td>{{ $p->jenis }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="section-title">Data Kawasan</div>
        <table>
            <thead>
                <tr>
                    <th>Nama Kawasan</th>
                    <th>Deskripsi</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $a)
                    <tr>
                        <td>{{ $a->name }}</td>
                        <td>{{ $a->description }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

</body>
</html>
