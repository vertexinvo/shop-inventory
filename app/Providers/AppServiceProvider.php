<?php

namespace App\Providers;

use App\Models\Stocklog;
use App\Observers\StocklogObserver;
use Illuminate\Support\ServiceProvider;

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
        Stocklog::observe(StocklogObserver::class);
    }
}
