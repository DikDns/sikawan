<?php

namespace App\Jobs;

use App\Models\Area;
use App\Models\Household\Household;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class SyncAreaHouseholdsJob implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public int $areaId;
  public ?string $runId;

  public function __construct(int $areaId, ?string $runId = null)
  {
    $this->areaId = $areaId;
    $this->runId = $runId;
  }

  public function handle(): void
  {
    $lock = Cache::lock('sync-area-' . $this->areaId, 300);
    if (! $lock->get()) {
      return;
    }

    try {
      Cache::forever('area-sync-status-' . $this->areaId, 'running');
      Cache::forever('area-sync-start-' . $this->areaId, now());
      $area = Area::find($this->areaId);
      if (! $area) {
        Cache::forever('area-sync-status-' . $this->areaId, 'not_found');
        return;
      }

      $geometry = $area->geometry_json;
      if (is_string($geometry)) {
        $decoded = json_decode($geometry, true);
        if (json_last_error() === JSON_ERROR_NONE) {
          $geometry = $decoded;
        }
      }
      if (! $geometry) {
        Cache::forever('area-sync-status-' . $area->id, 'skipped');
        return;
      }

      $bounds = $this->computeBounds($geometry);
      if (! $bounds) {
        Cache::forever('area-sync-status-' . $area->id, 'skipped');
        return;
      }

      [$minLat, $maxLat, $minLng, $maxLng] = $bounds;

      // Pure geographic query - no wilayah filtering
      $base = Household::query()
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->whereBetween('latitude', [$minLat, $maxLat])
        ->whereBetween('longitude', [$minLng, $maxLng])
        ->select(['id', 'latitude', 'longitude']);

      $matchingIds = [];

      $isRectangle = $this->isRectangle($geometry);
      $polygonRings = $this->extractPolygonRings($geometry);

      $base->chunkById(1000, function ($chunk) use (&$matchingIds, $isRectangle, $polygonRings, $geometry, $minLat, $maxLat, $minLng, $maxLng) {
        foreach ($chunk as $h) {
          $lat = (float) $h->latitude;
          $lng = (float) $h->longitude;

          if ($isRectangle) {
            if ($lat >= $minLat && $lat <= $maxLat && $lng >= $minLng && $lng <= $maxLng) {
              $matchingIds[] = $h->id;
            }
            continue;
          }

          if ($polygonRings) {
            $insideExterior = $this->pointInRing($lng, $lat, $polygonRings[0]);
            if (! $insideExterior) {
              continue;
            }
            $insideHole = false;
            $holesCount = count($polygonRings) - 1;
            if ($holesCount > 0) {
              for ($i = 1; $i < count($polygonRings); $i++) {
                if ($this->pointInRing($lng, $lat, $polygonRings[$i])) {
                  $insideHole = true;
                  break;
                }
              }
            }
            if (! $insideHole) {
              $matchingIds[] = $h->id;
            }
          }
        }
      });

      if (! empty($matchingIds)) {
        Household::whereIn('id', $matchingIds)->update(['area_id' => $area->id]);
      }

      $assignedIds = Household::query()
        ->where('area_id', $area->id)
        ->pluck('id')
        ->all();

      $toDetach = array_diff($assignedIds, $matchingIds);
      if (! empty($toDetach)) {
        Household::whereIn('id', $toDetach)->update(['area_id' => null]);
      }
      Cache::forever('area-sync-status-' . $area->id, 'completed');
      Cache::forever('area-sync-last-' . $area->id, now());

      if ($this->runId) {
        $pendingKey = 'sync-all:pending:' . $this->runId;
        $remaining = null;
        try {
          $remaining = Cache::decrement($pendingKey);
        } catch (\Throwable $e) {
          $remaining = Cache::get($pendingKey);
          if (is_numeric($remaining)) {
            Cache::put($pendingKey, max(0, (int) $remaining - 1), 3600);
            $remaining = (int) Cache::get($pendingKey);
          } else {
            $remaining = null;
          }
        }
        if (is_int($remaining) && $remaining <= 0) {
          Cache::forever('sync-all:status', 'completed');
          Cache::forever('sync-all:last', now());
        }
      }
    } finally {
      $lock->release();
    }
  }

  private function isRectangle($geometry): bool
  {
    if (! is_array($geometry)) {
      return false;
    }
    if (isset($geometry['type'])) {
      return false;
    }
    $isList = array_keys($geometry) === range(0, count($geometry) - 1);
    if (! $isList || count($geometry) !== 2) {
      return false;
    }
    if (! isset($geometry[0], $geometry[1])) {
      return false;
    }
    if (! is_array($geometry[0]) || ! is_array($geometry[1])) {
      return false;
    }
    if (count($geometry[0]) !== 2 || count($geometry[1]) !== 2) {
      return false;
    }
    return isset($geometry[0][0], $geometry[0][1], $geometry[1][0], $geometry[1][1])
      && is_numeric($geometry[0][0]) && is_numeric($geometry[0][1])
      && is_numeric($geometry[1][0]) && is_numeric($geometry[1][1]);
  }

  private function extractPolygonRings($geometry): ?array
  {
    if (is_array($geometry) && isset($geometry['type']) && $geometry['type'] === 'Polygon' && isset($geometry['coordinates']) && is_array($geometry['coordinates'])) {
      $rings = [];
      foreach ($geometry['coordinates'] as $ring) {
        $ringPoints = [];
        foreach ($ring as $pair) {
          $lng = (float) ($pair[0] ?? 0);
          $lat = (float) ($pair[1] ?? 0);
          $ringPoints[] = [$lng, $lat];
        }
        $rings[] = $ringPoints;
      }
      return $rings;
    }
    return null;
  }

  private function computeBounds($geometry): ?array
  {
    if ($this->isRectangle($geometry)) {
      $west = (float) $geometry[0][0];
      $north = (float) $geometry[0][1];
      $east = (float) $geometry[1][0];
      $south = (float) $geometry[1][1];
      $minLat = min($south, $north);
      $maxLat = max($south, $north);
      $minLng = min($west, $east);
      $maxLng = max($west, $east);
      return [$minLat, $maxLat, $minLng, $maxLng];
    }

    $rings = $this->extractPolygonRings($geometry);
    if (! $rings) {
      return null;
    }
    $minLat = 90.0;
    $maxLat = -90.0;
    $minLng = 180.0;
    $maxLng = -180.0;
    foreach ($rings as $ring) {
      foreach ($ring as [$lng, $lat]) {
        if ($lat < $minLat) $minLat = $lat;
        if ($lat > $maxLat) $maxLat = $lat;
        if ($lng < $minLng) $minLng = $lng;
        if ($lng > $maxLng) $maxLng = $lng;
      }
    }
    return [$minLat, $maxLat, $minLng, $maxLng];
  }

  private function pointInRing(float $lng, float $lat, array $ring): bool
  {
    $inside = false;
    $j = count($ring) - 1;
    for ($i = 0; $i < count($ring); $i++) {
      $xi = (float) $ring[$i][0];
      $yi = (float) $ring[$i][1];
      $xj = (float) $ring[$j][0];
      $yj = (float) $ring[$j][1];
      $intersect = (($yi > $lat) !== ($yj > $lat)) && ($lng < ($xj - $xi) * ($lat - $yi) / (($yj - $yi) ?: 1e-12) + $xi);
      if ($intersect) {
        $inside = ! $inside;
      }
      $j = $i;
    }
    return $inside;
  }
}
