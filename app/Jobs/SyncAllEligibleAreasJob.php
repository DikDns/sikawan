<?php

namespace App\Jobs;

use App\Models\Area;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncAllEligibleAreasJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public function handle(): void
  {
    $query = Area::query()
      ->whereNotNull('geometry_json')
      ->where(function ($q) {
        $q->whereNotNull('village_id')
          ->orWhereNotNull('district_id')
          ->orWhereNotNull('regency_id')
          ->orWhereNotNull('province_id');
      });

    $total = (clone $query)->count();
    $runId = (string) Str::uuid();

    Cache::forever('sync-all:run', $runId);
    Cache::forever('sync-all:status', 'running');
    Cache::forever('sync-all:start', now());
    Cache::put("sync-all:total:$runId", $total, 3600);
    Cache::put("sync-all:pending:$runId", $total, 3600);

    $query->select('id')
      ->orderBy('id')
      ->chunkById(200, function ($areas) use ($runId) {
        foreach ($areas as $area) {
          SyncAreaHouseholdsJob::dispatch($area->id, $runId);
        }
      });

    if ($total === 0) {
      Cache::forever('sync-all:status', 'completed');
      Cache::forever('sync-all:last', now());
    }
  }
}
