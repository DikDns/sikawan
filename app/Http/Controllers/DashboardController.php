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
use App\Models\Household\Member;
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

      // Improved PSU Data (Perbaikan PSU) based on InfrastructureAssistance status
      // We need to filter assistance based on location filters as well
      // But Assistance belongs to Infrastructure.
      $assistanceQuery = \App\Models\InfrastructureAssistance::query()
        ->whereHas('infrastructure', function ($q) use ($district, $village) {
            if ($district) $q->where('district_id', $district);
            if ($village) $q->where('village_id', $village);
        });

      $assistanceStats = (clone $assistanceQuery)
        ->select('status', DB::raw('count(*) as total'))
        ->groupBy('status')
        ->get();

      $improvedPSUData = $assistanceStats->map(function($item) {
          $color = '#94a3b8'; // Default gray
          $statusUpper = strtoupper($item->status);

          switch ($statusUpper) {
              case 'SELESAI':
                  $color = '#10b981'; // Green
                  break;
              case 'PROSES':
                  $color = '#f59e0b'; // Yellow/Amber (matches bg-yellow-100)
                  break;
              case 'DIBATALKAN':
                  $color = '#ef4444'; // Red (matches bg-red-100)
                  break;
          }

          return [
              'name' => ucfirst(strtolower($item->status)),
              'value' => $item->total,
              'color' => $color
          ];
      })->toArray();

      if (empty($improvedPSUData)) {
          $improvedPSUData = []; // Return empty if no data
      }

      // Economic Data Calculations

      // 1. Average Income
      // Calculate average income (now stored as actual rupiah values)
      $avgIncome = (clone $housesQuery)
        ->whereNotNull('monthly_income_idr')
        ->where('monthly_income_idr', '>', 0)
        ->avg('monthly_income_idr');

      $avgIncomeStr = $avgIncome
        ? 'Rp ' . number_format((int) $avgIncome, 0, ',', '.') . '/Bulan' // Added /Bulan
        : '-';

      // 2. Unemployment Rate (Tingkat Pengangguran)
      // Logic: Members with 'tidak-ada' occupation / Total Members * 100
      // We need to query Members related to the filtered households
      $householdIds = (clone $housesQuery)->pluck('id');

      $totalMembers = Member::whereIn('household_id', $householdIds)->count();

      $unemployedMembers = Member::whereIn('household_id', $householdIds)
        ->where(function($q) {
             $q->where('occupation', 'like', 'tidak-ada%')
               ->orWhere('occupation', 'like', 'Tidak Ada%')
               ->orWhere('occupation', 'like', 'belum%') // Catch 'Belum/Tidak Bekerja'
               ->orWhereNull('occupation');
        })
        ->count();

      $unemploymentRate = $totalMembers > 0
        ? round(($unemployedMembers / $totalMembers) * 100, 1) . '%'
        : '0%';

      // 3. Poverty Count (Jumlah Penduduk Miskin)
      // Logic: Income per capita < 550,000
      // We iterate households to check per capita income
      // Optimization: Raw SQL might be faster but Collection filter is safer for logic
      // Using database query for efficiency:
      // where (monthly_income_idr / member_total) < 550000
      $poorPopulationCount = (clone $housesQuery)
        ->where('member_total', '>', 0)
        ->whereRaw('(monthly_income_idr / member_total) < 550000')
        ->sum('member_total');

      $poorPopulationStr = number_format($poorPopulationCount, 0, ',', '.') . ' Jiwa';

      $economicData = [
        ['indicator' => 'Pendapatan Rata-rata', 'value' => $avgIncomeStr],
        ['indicator' => 'Tingkat Pengangguran', 'value' => $unemploymentRate],
        ['indicator' => 'Jumlah Penduduk Miskin', 'value' => $poorPopulationStr],
      ];

      // Area summary rows with year filter - No logic change needed, just keep it clean
      $areaSummaryQuery = Area::query();

      if ($district) $areaSummaryQuery->where('district_id', $district);
      if ($village) $areaSummaryQuery->where('village_id', $village);

      // Simple Household Count
      $areaSummaryQuery->withCount([
        'households' => fn ($q) =>
        $this->applyFilters($q, $economicYear, $district, $village)
      ]);

            $areaSummaryRows = $areaSummaryQuery
                ->orderByDesc('households_count')
                ->limit(10)
                ->get()
                ->map(fn ($a) => [
                    'name' => $a->name,
                    'rumah' => $a->households_count,
                    'luas_m2' => (int) $a->area_total_m2,
                    ])
                ->toArray();

      $availableYears = Household::selectRaw('DISTINCT strftime("%Y", created_at) as year')
        ->whereNotNull('created_at')
        ->orderBy('year', 'desc')
        ->pluck('year')
        ->filter()
        ->values()
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
        'slumAreaTotalM2' => $slumAreaTotalM2,
        'householdsInSlumArea' => $householdsInSlumArea,
        'rtlhTotal' => $rtlhTotal,
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
