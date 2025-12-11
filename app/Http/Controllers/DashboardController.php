<?php

namespace App\Http\Controllers;

use App\Models\Household\Household;
use App\Models\InfrastructureGroup;
use App\Models\AreaGroup;
use App\Models\Area;
use App\Models\Infrastructure;
use App\Models\Wilayah\SubDistrict;
use App\Models\Wilayah\Village;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
  private function applyFilters($query, $economicYear, $district, $village) {
    if (!empty($economicYear)) {
      $query->whereIn(
        DB::raw('strftime("%Y", created_at)'),
        $economicYear
      );
    }
    if ($district) {
      $query->where('district_id', $district);
    }
    if ($village) {
      $query->where('village_id', $village);
    }
    return $query;
  }

  public function index(Request $request)
  {
    try {
      $period = $request->query('period');
      $start = $request->query('start_date');
      $end = $request->query('end_date');
      $region = $request->query('region');
      $regionYear = $request->query('region_year'); // New: year filter for region statistics
      $district = $request->query('district');
      $village = $request->query('village');
      $economicYear = $request->query('economic_year', []);

      if (!is_array($economicYear)) {
        $economicYear = $economicYear ? [$economicYear] : [];
      }

      $householdsQuery = Household::query();

      if ($start) {
        $householdsQuery->whereDate('created_at', '>=', $start);
      }
      if ($end) {
        $householdsQuery->whereDate('created_at', '<=', $end);
      }

      $housesQuery = $this->applyFilters($householdsQuery, $economicYear, $district, $village);

      $housesTotal = (clone $housesQuery)->count();
      $rlhTotal = (clone $housesQuery)->where('habitability_status', 'RLH')->count();
      $rtlhTotal = (clone $housesQuery)->where('habitability_status', 'RTLH')->count();

      $groupsTotal = InfrastructureGroup::count();
      $areasTotal = AreaGroup::count();

      // Slum area aggregation (items 6 & 7)
      $slumAreaIds = Area::where('is_slum', true)
        ->when($district, fn ($q) => $q->where('district_id', $district))
        ->when($village, fn ($q) => $q->where('village_id', $village))
        ->pluck('id');
      // $slumAreaTotalM2 = (float) Area::where('is_slum', true)->sum('area_total_m2');
      // $slumAreaIds = Area::where('is_slum', true)->pluck('id');
      // $householdsInSlumArea = Household::whereIn('area_id', $slumAreaIds)->count();
      $slumAreaTotalM2 = Area::whereIn('id', $slumAreaIds)->sum('area_total_m2');
      $householdsInSlumArea = Household::whereIn('area_id', $slumAreaIds)->count();

      $populationTotal = (clone $housesQuery)->sum('member_total');
      $kkTotal = (clone $housesQuery)->sum('kk_count');

      $statCardsData = [
        ['label' => 'Rumah', 'value' => $housesTotal, 'href' => route('households.index')],
        ['label' => 'RLH', 'value' => $rlhTotal, 'href' => route('households.index', ['habitability_status' => 'RLH'])],
        ['label' => 'RTLH', 'value' => $rtlhTotal, 'href' => route('households.index', ['habitability_status' => 'RTLH'])],
        ['label' => 'Backlog Kepemilikan', 'value' => max(0, $kkTotal - $housesTotal), 'href' => route('households.index')],
        ['label' => 'Backlog Kelayakan', 'value' => max(0, $housesTotal - $rtlhTotal), 'href' => route('households.index', ['habitability_status' => 'RLH'])],
      ];

      $yearsRaw = (clone $housesQuery)
        ->selectRaw('strftime("%Y", created_at) as y, count(*) as c')
        ->groupBy('y')
        ->orderBy('y')
        ->get();

      $analysisData = [];
      foreach ($yearsRaw as $row) {
        $year = $row->y;

        $analysisData[] = [
          'year' => $year,
          'rumah' => (int)$row->c,
          'rlh' => (clone $housesQuery)
            ->where('habitability_status', 'RLH')
            ->whereRaw('strftime("%Y", created_at) = ?', [$year])
            ->count(),
          'rtlh' => (clone $housesQuery)
            ->where('habitability_status', 'RTLH')
            ->whereRaw('strftime("%Y", created_at) = ?', [$year])
            ->count(),
        ];
      }

      $chartSectionData = [
        'rtlh' => [
          ['name' => 'Belum Dioperasikan', 'value' => $rtlhTotal, 'fill' => '#ef4444'],
          ['name' => 'Sedang Dioperasikan', 'value' => 0, 'fill' => '#fbbf24'],
          ['name' => 'Selesai', 'value' => $rlhTotal, 'fill' => '#10b981'],
        ],
      ];

      $infrastructureQuery = Infrastructure::query();
      if ($village) {
        $infrastructureQuery->where('village_id', $village);
      }
      if ($district) {
        $infrastructureQuery->where('district_id', $district);
      }

      // PSU data from Infrastructure condition_status
      $psuBaik = (clone $infrastructureQuery)->where('condition_status', 'baik')->count();
      $psuRusakRingan = (clone $infrastructureQuery)->where('condition_status', 'rusak_ringan')->count();
      $psuRusakBerat = (clone $infrastructureQuery)->where('condition_status', 'rusak_berat')->count();

      $psuData = [
        ['name' => 'Baik', 'value' => $psuBaik, 'color' => '#655B9C'],
        ['name' => 'Rusak Ringan', 'value' => $psuRusakRingan, 'color' => '#FFAA22'],
        ['name' => 'Rusak Berat', 'value' => $psuRusakBerat, 'color' => '#EF4C4C'],
      ];
      $improvedPSUData = $psuData;

      $economicQuery = clone $housesQuery;

      // Calculate average income (now stored as actual rupiah values)
      $avgIncome = (clone $economicQuery)
        ->whereNotNull('monthly_income_idr')
        ->where('monthly_income_idr', '>', 0)
        ->avg('monthly_income_idr');

      // Format average income as currency
      $avgIncomeStr = $avgIncome
        ? 'Rp ' . number_format((int) $avgIncome, 0, ',', '.')
        : '-';

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
        ['indicator' => 'Pendapatan Rata-rata', 'value' => $avgIncomeStr],
        ['indicator' => 'Akses Pendidikan Dasar', 'value' => $educationAccessPct],
        ['indicator' => 'Akses Kesehatan', 'value' => $healthAccessPct],
      ];

      // Region stats from Area model with year filter
      $regionYearFilter = count($economicYear) > 0 ? $economicYear : (count($availableYears) > 0 ? [$availableYears[0]] : []);

      $areasWithHouseholdsQuery = Area::query();
      if ($district) $areasWithHouseholdsQuery->where('district_id', $district);
      if ($village) $areasWithHouseholdsQuery->where('village_id', $village);

      if ($regionYearFilter) {
        $areasWithHouseholdsQuery->withCount([
          'households' => fn($q) => $q->whereIn(DB::raw('strftime("%Y", created_at)'), $regionYearFilter),
          'households as rlh_count' => fn($q) => $q->whereIn(DB::raw('strftime("%Y", created_at)'), $regionYearFilter)->where('habitability_status', 'RLH'),
          'households as rtlh_count' => fn($q) => $q->whereIn(DB::raw('strftime("%Y", created_at)'), $regionYearFilter)->where('habitability_status', 'RTLH'),
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

      if ($district) $areaSummaryQuery->where('district_id', $district);
      if ($village) $areaSummaryQuery->where('village_id', $village);

      $areaSummaryQuery->withCount([
        'households' => fn ($q) =>
        $this->applyFilters($q, $regionYearFilter, $district, $village)
      ]);

      if ($regionYearFilter) {
        $areaSummaryQuery->withCount([
          'households' => fn($q) => $q->whereIn(DB::raw('strftime("%Y", created_at)'), $regionYearFilter),
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

      $districts = SubDistrict::select('id', 'name')->get();
      $villages = Village::select('id', 'name')->get();

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
        'districts' => $districts,
        'villages' => $villages,
        'selectedDistrict' => $district,
        'selectedVillage' => $village,
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
