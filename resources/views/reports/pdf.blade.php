<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <style>
        body {
            font-family: sans-serif;
            padding: 20px;
            color: #0f172a;
            font-size: 13px;
        }
        h1 {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 13px;
            margin-bottom: 18px;
            line-height: 1.4;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #cbd5e1;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            font-size: 12px;
        }
        th {
            text-align: left;
            background: #f1f5f9;
            padding: 6px;
            border-bottom: 1px solid #cbd5e1;
            font-weight: bold;
        }
        td {
            padding: 6px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }
        .muted { opacity: 0.7; }
    </style>
</head>
<body>

    <h1>{{ $title }}</h1>

    <div class="subtitle">
        Jenis Laporan: <b>{{ $type }}</b><br>
        Periode:
        <b>{{ $start ? date('d M Y', strtotime($start)) : 'Semua' }}</b>
        -
        <b>{{ $end ? date('d M Y', strtotime($end)) : 'Semua' }}</b>
    </div>

    @if ($description)
        <p style="margin-bottom:20px;">{{ $description }}</p>
    @endif

    {{-- households --}}
    @if ($type === 'RUMAH')
        <div class="section-title">Data Rumah Tangga</div>

        <table>
            <thead>
                <tr>
                    <th>Nama Kepala</th>
                    <th>Alamat</th>
                    <th>Status Kelayakan</th>
                    <th>Total Jiwa</th>
                    <th>Survey</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $h)
                    <tr>
                        <td>{{ $h->head_name }}</td>
                        <td>
                            {{ $h->address_text }}<br>
                            <span class="muted">
                                {{ $h->village_name }},
                                {{ $h->district_name }},
                                {{ $h->regency_name }},
                                {{ $h->province_name }}
                            </span>
                        </td>
                        <td>{{ $h->habitability_status ?? '-' }}</td>
                        <td>{{ $h->member_total }}</td>
                        <td>{{ $h->survey_date ? date('d M Y', strtotime($h->survey_date)) : '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    {{-- psu --}}
    @if ($type === 'PSU')
        <div class="section-title">Data PSU</div>

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

    {{-- areas --}}
    @if ($type === 'KAWASAN')
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
                        <td>{{ $a->description ?? '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    {{-- umum --}}
    @if ($type === 'UMUM')
        <div class="section-title">Ringkasan</div>

        <p>Total Rumah: <b>{{ count($data['houses']) }}</b></p>
        <p>Total PSU: <b>{{ count($data['psu']) }}</b></p>
        <p>Total Kawasan: <b>{{ count($data['areas']) }}</b></p>

        <div class="section-title">Data Rumah</div>
        <table>
            <thead>
                <tr>
                    <th>Nama Kepala</th>
                    <th>Alamat</th>
                    <th>Status</th>
                    <th>Anggota</th>
                    <th>Survey</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['houses'] as $h)
                    <tr>
                        <td>{{ $h->head_name }}</td>
                        <td>{{ $h->address_text }}</td>
                        <td>{{ $h->habitability_status ?? '-' }}</td>
                        <td>{{ $h->member_total ?? '-' }}</td>
                        <td>{{ $h->survey_date ? date('d M Y', strtotime($h->survey_date)) : '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="section-title">Data PSU</div>
        <table>
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Jenis</th>
                    <th>Infrastruktur</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['psu'] as $p)
                    <tr>
                        <td>{{ $p->name }}</td>
                        <td>{{ $p->category ?? '-' }}</td>
                        <td>{{ $p->jenis ?? '-' }}</td>
                        <td>{{ $p->infrastructure_count ?? '-' }}</td>
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
                    <th>Total Rumah</th>
                    <th>Total PSU</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['areas'] as $a)
                    <tr>
                        <td>{{ $a->name }}</td>
                        <td>{{ $a->description ?? '-' }}</td>
                        <td>{{ $a->house_total ?? '-' }}</td>
                        <td>{{ $a->psu_total ?? '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

</body>
</html>
