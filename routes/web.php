<?php

use App\Http\Controllers\ProfileController;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Supplierinvoice;
use App\Models\User;
use App\Models\Order;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


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

Route::get('/dashboard', function () {

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

    return Inertia::render('Dashboard',compact('totalOrder','totalProductInStock','totalProductOutofStock','outOfStockProductrecord','supplierBalanceRecord','latestOrder'));
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
