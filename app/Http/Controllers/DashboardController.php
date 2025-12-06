<?php

namespace App\Http\Controllers;

use App\Models\Household\Household;
use App\Models\InfrastructureGroup;
use App\Models\AreaGroup;
use App\Models\Area;
use App\Models\Infrastructure;
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
      $economicYear = $request->query('economic_year');

      $householdsQuery = Household::query();
      if ($start) {
        $householdsQuery->whereDate('created_at', '>=', $start);
      }
      if ($end) {
        $householdsQuery->whereDate('created_at', '<=', $end);
      }

      $housesTotal = (clone $householdsQuery)->count();
      $rlhTotal = (clone $householdsQuery)->where('habitability_status', 'RLH')->count();
      $rtlhTotal = (clone $householdsQuery)->where('habitability_status', 'RTLH')->count();
      $newHouseNeededTotal = 0;

      $groupsTotal = InfrastructureGroup::count();
      $areasTotal = AreaGroup::count();

      // Slum area aggregation (items 6 & 7)
      $slumAreaTotalM2 = (float) Area::where('is_slum', true)->sum('area_total_m2');
      $slumAreaIds = Area::where('is_slum', true)->pluck('id');
      $householdsInSlumArea = Household::whereIn('area_id', $slumAreaIds)->count();

      $populationTotal = (int) Household::sum('member_total');
      $kkTotal = (int) Household::sum('kk_count');

      $statCardsData = [
        ['label' => 'Rumah', 'value' => $housesTotal, 'href' => route('households.index')],
        ['label' => 'RLH', 'value' => $rlhTotal, 'href' => route('households.index', ['habitability_status' => 'RLH'])],
        ['label' => 'RTLH', 'value' => $rtlhTotal, 'href' => route('households.index', ['habitability_status' => 'RTLH'])],
        ['label' => 'Backlog Kepemilikan', 'value' => max(0, $kkTotal - $housesTotal), 'href' => route('households.index')],
        ['label' => 'Backlog Kelayakan', 'value' => max(0, $housesTotal - $rtlhTotal), 'href' => route('households.index', ['habitability_status' => 'RLH'])],
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

      // PSU data from Infrastructure condition_status
      $psuBaik = Infrastructure::where('condition_status', 'baik')->count();
      $psuRusakRingan = Infrastructure::where('condition_status', 'rusak_ringan')->count();
      $psuRusakBerat = Infrastructure::where('condition_status', 'rusak_berat')->count();
      $psuData = [
        ['name' => 'Baik', 'value' => $psuBaik, 'color' => '#655B9C'],
        ['name' => 'Rusak Ringan', 'value' => $psuRusakRingan, 'color' => '#FFAA22'],
        ['name' => 'Rusak Berat', 'value' => $psuRusakBerat, 'color' => '#EF4C4C'],
      ];
      $improvedPSUData = $psuData;

      // Economic data with year filter
      $economicQuery = Household::query();
      if ($economicYear) {
        $economicQuery->whereRaw('strftime("%Y", created_at) = ?', [$economicYear]);
      }
      $avgIncome = (clone $economicQuery)->whereNotNull('monthly_income_idr')->avg('monthly_income_idr');
      $avgIncomeStr = $avgIncome ? 'Rp' . number_format($avgIncome, 0, ',', '.') . '/bulan' : '-';
      $totalHouseholdsEco = (int) (clone $economicQuery)->count();
      $educationAccessCount = (int) (clone $economicQuery)->whereNotNull('education_facility_location')->count();
      $healthAccessCount = (int) (clone $economicQuery)->whereNotNull('health_facility_used')->count();
      $educationAccessPct = $totalHouseholdsEco > 0 ? round(($educationAccessCount / $totalHouseholdsEco) * 100, 1) . '%' : '-';
      $healthAccessPct = $totalHouseholdsEco > 0 ? round(($healthAccessCount / $totalHouseholdsEco) * 100, 1) . '%' : '-';

      // Available years for filter
      $availableYears = Household::selectRaw('DISTINCT strftime("%Y", created_at) as year')
        ->whereNotNull('created_at')
        ->orderBy('year', 'desc')
        ->pluck('year')
        ->filter()
        ->values()
        ->toArray();

      $economicData = [
        ['indicator' => 'Pendapatan rata-rata', 'value' => $avgIncomeStr],
        ['indicator' => 'Tingkat Pengangguran', 'value' => '-'],
        ['indicator' => 'Akses Pendidikan Dasar', 'value' => $educationAccessPct],
        ['indicator' => 'Akses Kesehatan', 'value' => $healthAccessPct],
      ];

      // Region stats from Area model
      $areasWithHouseholds = Area::withCount([
        'households',
        'households as rlh_count' => fn($q) => $q->where('habitability_status', 'RLH'),
        'households as rtlh_count' => fn($q) => $q->where('habitability_status', 'RTLH'),
      ])->having('households_count', '>', 0)
        ->orderByDesc('households_count')
        ->limit(5)
        ->get();

      $regionStats = [];
      foreach ($areasWithHouseholds as $area) {
        $regionStats[] = [
          'region' => [
            'name' => $area->name ?? 'Tidak diketahui',
            'houses' => number_format($area->households_count, 0, ',', '.') . ' Rumah',
          ],
          'data' => [
            ['label' => 'RLH', 'value' => (int) $area->rlh_count, 'color' => '#B2F02C'],
            ['label' => 'RTLH', 'value' => (int) $area->rtlh_count, 'color' => '#FFAA22'],
            ['label' => 'Butuh Rumah Baru', 'value' => 0, 'color' => '#655B9C'],
          ],
        ];
      }

      // Area summary rows (no PSU column)
      $areaSummaryRows = Area::withCount('households')
        ->orderByDesc('households_count')
        ->limit(10)
        ->get()
        ->map(fn($a) => ['name' => $a->name, 'rumah' => $a->households_count])
        ->toArray();

      return Inertia::render('dashboard', [
        'statCardsData' => $statCardsData,
        'analysisData' => $analysisData,
        'chartSectionData' => $chartSectionData,
        'psuData' => $psuData,
        'improvedPSUData' => $improvedPSUData,
        'bottomStatsData' => ['population' => $populationTotal, 'kk' => $kkTotal],
        'economicData' => $economicData,
        'availableYears' => $availableYears,
        'selectedEconomicYear' => $economicYear,
        'areaSummaryRows' => $areaSummaryRows,
        'regionStats' => $regionStats,
        'slumAreaTotalM2' => $slumAreaTotalM2,
        'householdsInSlumArea' => $householdsInSlumArea,
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
        'availableYears' => [],
        'selectedEconomicYear' => null,
        'areaSummaryRows' => [],
        'regionStats' => [],
        'slumAreaTotalM2' => 0,
        'householdsInSlumArea' => 0,
      ]);
    }
  }
}
