<?php

use App\Http\Controllers\ProfileController;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Supplierinvoice;
use App\Models\User;
use App\Models\Order;
use App\Services\Metrics;
use Carbon\Carbon;
use Eliseekn\LaravelMetrics\Enums\Aggregate;
use Eliseekn\LaravelMetrics\LaravelMetrics;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SaKanjo\EasyMetrics\Metrics\Trend;
use Illuminate\Http\Request;
use Eliseekn\LaravelMetrics\Enums\Period;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function (Request $request) {

    $totalOrder = Order::count();
    $totalProductInStock = Product::whereHas('stock', function ($query) {
        $query->where('quantity', '>', 0);
    })->count();
    $totalProductOutofStock = Product::whereHas('stock', function ($query) {
        $query->where('quantity', 0);
    })->count();


    $outOfStockProductrecord = Product::whereHas('stock', function ($query) {
        $query->where('quantity', 0);
    })->with('categories', 'stock', 'brands')->latest()->paginate(6);


    $supplierBalanceRecord = Supplier::withPendingAmount()->paginate(6);

    $latestOrder = Order::latest()->paginate(4);


    $period = $request->period ?? 'day';

    if (str_contains($period, '~')) {
        // Split the period into start and end dates and ensure they're valid strings
        $period = array_map(fn($date) => Carbon::parse(trim($date))->toDateString(), explode('~', $period, 2));
    }

    $groupedDataLabels = LaravelMetrics::query(Order::query())->dateColumn('order_date')->labelColumn('order_date')->trends();

    $trend = Metrics::trends(
        Order::metrics()->dateColumn('order_date')->fillMissingData(),
        $period,
        $groupedDataLabels["labels"],
        'order_date'
    );

 
    return Inertia::render('Dashboard',compact('trend','period','totalOrder','totalProductInStock','totalProductOutofStock','outOfStockProductrecord','supplierBalanceRecord','latestOrder'));
})->name('dashboard');






    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


require __DIR__.'/auth.php';
require __DIR__.'/dashboard/user.php';
require __DIR__.'/dashboard/customer.php';
require __DIR__.'/dashboard/product.php';
require __DIR__.'/dashboard/setting.php';
require __DIR__.'/dashboard/role.php';
require __DIR__.'/dashboard/category.php';
require __DIR__.'/dashboard/brand.php';
require __DIR__.'/dashboard/supplier.php';
require __DIR__.'/dashboard/supplierinvoice.php';
require __DIR__.'/dashboard/order.php';
require __DIR__.'/dashboard/tax.php';
require __DIR__.'/dashboard/shippingrate.php';
require __DIR__.'/dashboard/stock.php';
require __DIR__.'/dashboard/stocklog.php';
