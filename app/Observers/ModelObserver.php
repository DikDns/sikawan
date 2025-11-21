<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

class ModelObserver
{
    protected function makeLog(string $action, Model $model, array $meta): void
    {
        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'entity_type' => get_class($model),
                'entity_id' => $model->getKey(),
                'metadata_json' => $meta,
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