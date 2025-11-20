<?php

namespace App\Http\Controllers;

use App\Models\Household\Household;
use App\Models\InfrastructureGroup;
use App\Models\AreaGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $period = $request->query('period');
            $start = $request->query('start_date');
            $end = $request->query('end_date');
            $region = $request->query('region');

            $householdsQuery = Household::query();
            if ($start) { $householdsQuery->whereDate('created_at', '>=', $start); }
            if ($end) { $householdsQuery->whereDate('created_at', '<=', $end); }

            $housesTotal = (clone $householdsQuery)->count();
            $rlhTotal = (clone $householdsQuery)->where('habitability_status', 'RLH')->count();
            $rtlhTotal = (clone $householdsQuery)->where('habitability_status', 'RTLH')->count();
            $newHouseNeededTotal = 0;

            $groupsTotal = InfrastructureGroup::count();
            $areasTotal = AreaGroup::count();

            $statCardsData = [
                ['label' => 'Rumah', 'value' => $housesTotal],
                ['label' => 'RLH', 'value' => $rlhTotal],
                ['label' => 'RTLH', 'value' => $rtlhTotal],
                ['label' => 'Butuh Rumah Baru', 'value' => $newHouseNeededTotal],
            ];

            $years = [];
            $households = (clone $householdsQuery)->selectRaw('strftime("%Y", created_at) as y, count(*) as c')
                ->groupBy('y')->orderBy('y')->get();
            foreach ($households as $row) {
                $years[$row->y] = [
                    'rumah' => (int) $row->c,
                    'rlh' => (int) (clone $householdsQuery)->whereRaw('strftime("%Y", created_at) = ?', [$row->y])->where('habitability_status', 'RLH')->count(),
                    'rtuh' => (int) (clone $householdsQuery)->whereRaw('strftime("%Y", created_at) = ?', [$row->y])->where('habitability_status', 'RTLH')->count(),
                    'rumahBaru' => 0,
                ];
            }
            $analysisData = [];
            foreach ($years as $y => $agg) {
                $analysisData[] = array_merge(['year' => $y], $agg);
            }

            $chartSectionData = [
                'rtlh' => [
                    ['name' => 'Belum Dioperasikan', 'value' => $rtlhTotal, 'fill' => '#ef4444'],
                    ['name' => 'Sedang Dioperasikan', 'value' => 0, 'fill' => '#fbbf24'],
                    ['name' => 'Selesai', 'value' => $rlhTotal, 'fill' => '#10b981'],
                ],
                'rumahBaru' => [
                    ['name' => 'Butuh Dibangun', 'value' => $newHouseNeededTotal, 'fill' => '#6366f1'],
                    ['name' => 'Sedang Dibangun', 'value' => 0, 'fill' => '#fbbf24'],
                    ['name' => 'Selesai', 'value' => 0, 'fill' => '#10b981'],
                ],
            ];

            $psuTotal = $groupsTotal;
            $psuData = [
                ['name' => 'Baik', 'value' => $psuTotal, 'color' => '#655B9C'],
                ['name' => 'Rusak Ringan', 'value' => 0, 'color' => '#FFAA22'],
                ['name' => 'Rusak Berat', 'value' => 0, 'color' => '#EF4C4C'],
            ];
            $improvedPSUData = $psuData;

            $populationTotal = (int) Household::sum('member_total');
            $kkTotal = (int) Household::sum('kk_count');

            $avgIncome = Household::whereNotNull('monthly_income_idr')->avg('monthly_income_idr');
            $avgIncomeStr = $avgIncome ? 'Rp' . number_format($avgIncome, 0, ',', '.') . '/bulan' : '-';
            $totalHouseholds = (int) Household::count();
            $educationAccessCount = (int) Household::whereNotNull('education_facility_location')->count();
            $healthAccessCount = (int) Household::whereNotNull('health_facility_used')->count();
            $educationAccessPct = $totalHouseholds > 0 ? round(($educationAccessCount / $totalHouseholds) * 100, 1) . '%' : '-';
            $healthAccessPct = $totalHouseholds > 0 ? round(($healthAccessCount / $totalHouseholds) * 100, 1) . '%' : '-';

            $economicData = [
                ['indicator' => 'Pendapatan rata-rata', 'value' => $avgIncomeStr],
                ['indicator' => 'Tingkat Pengangguran', 'value' => '-'],
                ['indicator' => 'Akses Pendidikan Dasar', 'value' => $educationAccessPct],
                ['indicator' => 'Akses Kesehatan', 'value' => $healthAccessPct],
            ];

            $regionsAgg = Household::selectRaw('district_name as name, count(*) as houses, sum(case when habitability_status = "RLH" then 1 else 0 end) as rlh, sum(case when habitability_status = "RTLH" then 1 else 0 end) as rtlh')
                ->groupBy('district_name')
                ->orderByDesc('houses')
                ->limit(5)
                ->get();

            $regionStats = [];
            foreach ($regionsAgg as $r) {
                $regionStats[] = [
                    'region' => [
                        'name' => $r->name ?? 'Tidak diketahui',
                        'houses' => number_format((int) $r->houses, 0, ',', '.') . ' Rumah',
                    ],
                    'data' => [
                        ['label' => 'RLH', 'value' => (int) $r->rlh, 'color' => '#B2F02C'],
                        ['label' => 'RTLH', 'value' => (int) $r->rtlh, 'color' => '#FFAA22'],
                        ['label' => 'Butuh Rumah Baru', 'value' => 0, 'color' => '#655B9C'],
                    ],
                ];
            }

            $areaSummaryRows = [];
            foreach ($regionsAgg as $r) {
                $areaSummaryRows[] = [
                    'name' => $r->name ?? 'Tidak diketahui',
                    'rumah' => (int) $r->houses,
                    'psu' => 0,
                ];
            }

            return Inertia::render('dashboard', [
                'statCardsData' => $statCardsData,
                'analysisData' => $analysisData,
                'chartSectionData' => $chartSectionData,
                'psuData' => $psuData,
                'improvedPSUData' => $improvedPSUData,
                'bottomStatsData' => ['population' => $populationTotal, 'kk' => $kkTotal],
                'economicData' => $economicData,
                'areaSummaryRows' => $areaSummaryRows,
                'regionStats' => $regionStats,
            ]);
        } catch (\Throwable $e) {
            return Inertia::render('dashboard', [
                'error' => 'Gagal memuat analytics: ' . $e->getMessage(),
                'statCardsData' => [],
                'analysisData' => [],
                'chartSectionData' => ['rtlh' => [], 'rumahBaru' => []],
                'psuData' => [],
                'improvedPSUData' => [],
                'bottomStatsData' => ['population' => 0, 'kk' => 0],
                'economicData' => [],
                'areaSummaryRows' => [],
                'regionStats' => [],
            ]);
        }
    }
}