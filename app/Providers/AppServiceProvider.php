<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Observers\ModelObserver;
use App\Models\AuditLog;
use App\Models\Area;
use App\Models\AreaGroup;
use App\Models\Infrastructure;
use App\Models\InfrastructureGroup;
use App\Models\Message;
use App\Models\Media;
use App\Models\RelocationAssessment;
use App\Models\Report;
use App\Models\User;
use App\Models\Household\Assistance;
use App\Models\Household\Household;
use App\Models\Household\Member;
use App\Models\Household\Photo;
use App\Models\Household\Score;
use App\Models\Household\TechnicalData;
use App\Models\Wilayah\City;
use App\Models\Wilayah\Province;
use App\Models\Wilayah\SubDistrict;
use App\Models\Wilayah\Village;
use App\Policies\AuditLogPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'flash' => function() {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },
        ]);

        Gate::policy(AuditLog::class, AuditLogPolicy::class);

        foreach ([
            Area::class,
            AreaGroup::class,
            Infrastructure::class,
            InfrastructureGroup::class,
            Message::class,
            Media::class,
            RelocationAssessment::class,
            Report::class,
            User::class,
            Assistance::class,
            Household::class,
            Member::class,
            Photo::class,
            Score::class,
            TechnicalData::class,
            City::class,
            Province::class,
            SubDistrict::class,
            Village::class,
        ] as $model) {
            $model::observe(ModelObserver::class);
        }
    }
}
