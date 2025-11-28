<?php

namespace App\Jobs;

use App\Models\Area;
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
    Area::query()
      ->whereNotNull('geometry_json')
      ->where(function ($q) {
        $q->whereNotNull('village_id')
          ->orWhereNotNull('district_id')
          ->orWhereNotNull('regency_id')
          ->orWhereNotNull('province_id');
      })
      ->select('id')
      ->orderBy('id')
      ->chunkById(200, function ($areas) {
        foreach ($areas as $area) {
          SyncAreaHouseholdsJob::dispatch($area->id);
        }
      });
  }
}
