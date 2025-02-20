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
use App\Models\Item;
use App\Observers\ItemObserver;
use App\Services\OrderService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Events\MigrationStarted;
use ReflectionClass;


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
        $this->app->singleton('orderService', function () {
            return new OrderService();
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
        Item::observe(ItemObserver::class);
        if ($this->app->runningInConsole()) {
            $this->preventMasterMigrations();
        }
    }

/**
 * Prevent Master module migrations from running.
 */

private function preventMasterMigrations(): void
{
    $masterMigrationsPath = base_path('Modules/Master/Database/Migrations');
    echo "🚫 Preventing Master Module Migrations\n";

    Event::listen(MigrationStarted::class, function (MigrationStarted $event) use ($masterMigrationsPath) {
        $migrationFile = (new \ReflectionClass($event->migration))->getFileName();

        if (str_contains($migrationFile, $masterMigrationsPath)) {
            echo "🚫 Skipping Master Module Migration: " . basename($migrationFile) . "\n";
            exit(0); // Prevent migration from running
        }
    });
}

}
