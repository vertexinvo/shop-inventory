<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Stocklog;
use App\Observers\ProductObserver;
use App\Observers\StocklogObserver;
use App\Services\BrandService;
use App\Services\UserService;
use App\Services\CategoryService;
use App\Services\RoleService;
use App\Services\StockService;
use Illuminate\Support\ServiceProvider;
use App\Models\Order;
use App\Observers\OrderObserver;

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
        $this->app->singleton('roleService', function () {
            return new RoleService();
        });
        $this->app->singleton('stockService', function () {
            return new StockService();
        });


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Stocklog::observe(StocklogObserver::class);
        Product::observe(ProductObserver::class);
        Order::observe(OrderObserver::class);
    }
}
