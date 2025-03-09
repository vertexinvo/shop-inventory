<?php

use App\Facades\OrderService;
use App\Http\Controllers\ProductController;
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
use App\Models\QrLoginSession;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Modules\Master\Entities\Applogin;
use Modules\Master\Entities\Tenancy;

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

    return Inertia::render('Welcome' );
});



Route::get('/dashboard', function (Request $request) {
    $totalOrder = Order::whereNotIn('status', ['cancel'])->count();
    $totalProductInStock = Product::whereHas('stock', function ($query) {
        $query->where('quantity', '>', 0)->orWhere('status', true);
    })->count();

    $totalProductOutofStock = Product::whereHas('stock', function ($query) {
        $query->where('quantity', 0)->orWhere('status', false);
    })->count();


    $outOfStockProductrecord = Product::whereHas('stock', function ($query) {
        $query->where('quantity', 0)->orWhere('status', false);
    })->with('categories', 'stock', 'brands')->latest()->paginate(6);


    $supplierBalanceRecord = Supplier::withPendingAmount()->paginate(6);

    $latestOrder = Order::latest()->paginate(4);


    $period = $request->period ?? 'day';

    if (str_contains($period, '~')) {
        // Split the period into start and end dates and ensure they're valid strings
        $period = array_map(fn($date) => Carbon::parse(trim($date))->toDateString(), explode('~', $period, 2));
    }

    $groupedDataLabels = LaravelMetrics::query(Order::query()->whereNotIn('status', ['cancel']))->dateColumn('order_date')->labelColumn('order_date')->trends();
  

    $trend = Metrics::trends(
        Order::metrics()
        ->dateColumn('order_date')
        // check where status is not cancel
        ->fillMissingData(),
        $period,
        $groupedDataLabels["labels"],
        'order_date'
    );

    $totalStockValue = Product::with('stock')->whereHas('stock')->get()->sum(function ($product) {
        return $product->purchase_price * $product->stock->quantity;
    });

    $totaliteminstock = Product::with('stock')->whereHas('stock')->get()->sum('stock.quantity');

    $totalOrderAmountPending = Order::where('status', 'pending')->get()->sum(function ($order) {
        return $order->payable_amount - $order->paid_amount;
    });

    $allsuppliers = Supplier::all();

    $totalSupplierPendingAmount = $allsuppliers->sum(function ($supplier) {
        return $supplier->total_amount_pending; // Use the accessor
    });

    $todaysOrder = Order::where('status', '!=', 'cancel')->whereDate('order_date', Carbon::today())->count();

    $todayProfit = OrderService::getTodayNetProfit();
    $weekProfit = OrderService::getThisWeekNetProfit();
    $monthProfit = OrderService::getThisMonthNetProfit();
    $yearProfit = OrderService::getThisYearNetProfit();

    $todaysPendingOrderAmount = Order::todaysPendingAmount();
    
    return Inertia::render('Dashboard',compact('todaysOrder','todaysPendingOrderAmount','todayProfit','weekProfit','monthProfit','yearProfit','totalSupplierPendingAmount','totalOrderAmountPending','totaliteminstock', 'totalStockValue','trend','period','totalOrder','totalProductInStock','totalProductOutofStock','outOfStockProductrecord','supplierBalanceRecord','latestOrder'));
})->name('dashboard')->middleware(['auth']);


Route::get('/scanner/product', [ProductController::class, 'scanProduct'])->middleware(['auth'])->name('product.scan');

Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

Route::get('/generated-via-qr', function (Request $request) {
    
    //Applogin 
    //generate unique a hash
    $dataHash = Date('Y-m-d H:i:s').Str::random(10);
    $dataHash = Crypt::encryptString($dataHash);
    $dataHash = Hash::make($dataHash);


    $domainurl = $request->getScheme() . '://' . $request->getHttpHost();
    $tenant = Tenancy::where('domain',  $domainurl)->first();

    $qrLoginSession = Applogin::create([
        'token' => $dataHash,
        'ip_address' => $request->ip(),
        'expired_at' => Carbon::now()->addMinutes(5),
        'tenant_id' => $tenant->id,
    ]);

    //get linked device to the tenant
    $linkeddevices = $tenant->applogin()->where('status', 'active')->get(); 
   

    return Inertia::render('Profile/GeneratedViaQr', compact('dataHash','linkeddevices'));
})->name('profile.generated-via-qr');

//unlinkdevice
Route::delete('/unlinkdevice/{token}', function (Request $request, $token) {
    $applogin = Applogin::where('token', $token)->first();
    if(!$applogin){
        session()->flash('error', 'Device not found');
        return redirect()->route('profile.generated-via-qr');
    }
    $applogin->status = 'logout';
    $applogin->save();
    session()->flash('message', 'Device unlinked successfully');
    return redirect()->route('profile.generated-via-qr');
})->name('profile.unlinkdevice');


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
require __DIR__.'/dashboard/expence.php';
require __DIR__.'/dashboard/ledger.php';
