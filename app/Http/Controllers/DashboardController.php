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
      $regionYear = $request->query('region_year'); // New: year filter for region statistics

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
          'rtlh' => (int) (clone $householdsQuery)->whereRaw('strftime("%Y", created_at) = ?', [$row->y])->where('habitability_status', 'RTLH')->count(),
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
      // Income is stored as category index: 1=<1jt, 2=1-3jt, 3=3-5jt, 4=>5jt
      // Calculate mode (most common income category) instead of meaningless average
      $incomeLabels = [
        1 => '< 1 Juta',
        2 => '1-3 Juta',
        3 => '3-5 Juta',
        4 => '> 5 Juta',
      ];
      $incomeCounts = (clone $economicQuery)
        ->whereNotNull('monthly_income_idr')
        ->selectRaw('monthly_income_idr, count(*) as cnt')
        ->groupBy('monthly_income_idr')
        ->orderByDesc('cnt')
        ->first();
      $avgIncomeStr = $incomeCounts ? ($incomeLabels[$incomeCounts->monthly_income_idr] ?? '-') : '-';
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
        ['indicator' => 'Pendapatan mayoritas', 'value' => $avgIncomeStr],
        ['indicator' => 'Akses Pendidikan Dasar', 'value' => $educationAccessPct],
        ['indicator' => 'Akses Kesehatan', 'value' => $healthAccessPct],
      ];

      // Region stats from Area model with year filter
      $regionYearFilter = $regionYear ?: (count($availableYears) > 0 ? $availableYears[0] : null);

      $areasWithHouseholdsQuery = Area::query();

      if ($regionYearFilter) {
        $areasWithHouseholdsQuery->withCount([
          'households' => fn($q) => $q->whereRaw('strftime("%Y", created_at) = ?', [$regionYearFilter]),
          'households as rlh_count' => fn($q) => $q->whereRaw('strftime("%Y", created_at) = ?', [$regionYearFilter])->where('habitability_status', 'RLH'),
          'households as rtlh_count' => fn($q) => $q->whereRaw('strftime("%Y", created_at) = ?', [$regionYearFilter])->where('habitability_status', 'RTLH'),
        ]);
      } else {
        $areasWithHouseholdsQuery->withCount([
          'households',
          'households as rlh_count' => fn($q) => $q->where('habitability_status', 'RLH'),
          'households as rtlh_count' => fn($q) => $q->where('habitability_status', 'RTLH'),
        ]);
      }

      $areasWithHouseholds = $areasWithHouseholdsQuery
        ->has('households')
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
          ],
        ];
      }

      // Area summary rows with year filter
      $areaSummaryQuery = Area::query();

      if ($regionYearFilter) {
        $areaSummaryQuery->withCount([
          'households' => fn($q) => $q->whereRaw('strftime("%Y", created_at) = ?', [$regionYearFilter]),
        ]);
      } else {
        $areaSummaryQuery->withCount('households');
      }

      $areaSummaryRows = $areaSummaryQuery
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
        'selectedRegionYear' => $regionYearFilter,
        'areaSummaryRows' => $areaSummaryRows,
        'regionStats' => $regionStats,
        'slumAreaTotalM2' => $slumAreaTotalM2,
        'householdsInSlumArea' => $householdsInSlumArea,
        'rtlhTotal' => $rtlhTotal,
      ]);
    } catch (\Throwable $e) {
      return Inertia::render('dashboard', [
        'error' => 'Gagal memuat analytics: ' . $e->getMessage(),
        'statCardsData' => [],
        'analysisData' => [],
        'chartSectionData' => ['rtlh' => []],
        'psuData' => [],
        'improvedPSUData' => [],
        'bottomStatsData' => ['population' => 0, 'kk' => 0],
        'economicData' => [],
        'availableYears' => [],
        'selectedEconomicYear' => null,
        'selectedRegionYear' => null,
        'areaSummaryRows' => [],
        'regionStats' => [],
        'slumAreaTotalM2' => 0,
        'householdsInSlumArea' => 0,
      ]);
    }
  }
}
