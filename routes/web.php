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
    
    return Inertia::render('Dashboard',compact('todaysOrder','todayProfit','weekProfit','monthProfit','yearProfit','totalSupplierPendingAmount','totalOrderAmountPending','totaliteminstock', 'totalStockValue','trend','period','totalOrder','totalProductInStock','totalProductOutofStock','outOfStockProductrecord','supplierBalanceRecord','latestOrder'));
})->name('dashboard')->middleware(['auth']);


Route::get('/scanner/product', [ProductController::class, 'scanProduct'])->middleware(['auth'])->name('product.scan');

Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

Route::get('/generated-via-qr', function (Request $request) {
    $user = auth()->user(); // Get the currently logged-in user
    $qrcodeData = [];

    if ($user) {
        // Generate a unique token
        $rawToken = Str::random(32);
        $secretKey = config('app.qr_login_secret'); // Retrieve secret key from .env

        // Hash the token for security (Note: Hashing is one-way, cannot be decrypted)
        $hashedToken = Hash::make($rawToken . $secretKey);

        // Store in the QR login session table
        $qrSession = QrLoginSession::create([
            'user_id' => $user->id,
            'qr_token' => $hashedToken,
            'expires_at' => Carbon::now()->addMinutes(5), // Expires in 5 minutes
        ]);

        // Encrypt user ID and token before sharing (this is reversible)
        $encryptedUserId = Crypt::encryptString($user->id);
        $encryptedToken = Crypt::encryptString($rawToken);

        // Get current domain dynamically
        $currentDomain = URL::to('/');

        // Generate a login link for mobile scanning
        $qrLoginLink = "{$currentDomain}/api/qr-login?user={$encryptedUserId}&token={$encryptedToken}";

        // Data to be hashed for verification
        $dataToHash = [
            'domain' => $currentDomain,
            'qr_login_link' => $qrLoginLink,
        ];

        // Generate a secure hash of the data
        $dataHash = hash_hmac('sha256', json_encode($dataToHash), $secretKey);

        // Instead of decrypting (which is not possible for hashes), verify by recomputing
        $recomputedHash = hash_hmac('sha256', json_encode($dataToHash), $secretKey);

        if (hash_equals($recomputedHash, $dataHash)) {
            dd($dataHash,[
                'message' => 'Hash matches: Data integrity verified.',
                'qr_login_link' => $qrLoginLink,
                'encrypted_user_id' => $encryptedUserId,
                'encrypted_token' => $encryptedToken,
                'hashed_token' => $hashedToken, // Stored in DB (not reversible)
                'data_hash' => $dataHash,
            ]);
        } else {
            dd('Hash mismatch: Data may have been tampered with.');
        }
        
    }

 
})->name('profile.generated-via-qr');


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
