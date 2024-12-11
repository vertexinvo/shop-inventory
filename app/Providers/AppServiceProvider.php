<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Stocklog;
use App\Observers\StocklogObserver;
use App\Services\BrandService;
use App\Services\UserService;
use App\Services\CategoryService;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('brandService', function () {
            return new BrandService();
        });
        $this->app->singleton('userService', function () {
            return new UserService();
        });
        $this->app->singleton('categoryService', function () {
            return new CategoryService();
        });

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Stocklog::observe(StocklogObserver::class);
    }
}
