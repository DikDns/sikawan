<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use App\Models\AuditLog;
use App\Helpers\ActivityLogFormatter;
use Illuminate\Support\Facades\Auth;

class ModelObserver
{
    protected function makeLog(string $action, Model $model, array $meta): void
    {
        // Skip logging for seeder operations (no authenticated user)
        if (!Auth::check()) {
            return;
        }

        try {
            $description = ActivityLogFormatter::format($action, get_class($model), $meta);
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'entity_type' => get_class($model),
                'entity_id' => $model->getKey(),
                'metadata_json' => $meta,
                'description' => $description,
            ]);
        } catch (\Throwable $e) {}
    }

    public function created(Model $model): void
    {
        $this->makeLog('CREATE', $model, [
            'after' => $model->getAttributes(),
        ]);
    }

    public function updated(Model $model): void
    {
        $dirty = $model->getDirty();
        $before = [];
        $after = [];
        foreach ($dirty as $key => $val) {
            $before[$key] = $model->getOriginal($key);
            $after[$key] = $val;
        }
        $this->makeLog('UPDATE', $model, [
            'before' => $before,
            'after' => $after,
        ]);
    }

    public function deleted(Model $model): void
    {
        $this->makeLog('DELETE', $model, [
            'before' => $model->getAttributes(),
        ]);
    }
}
