<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\Mobileapp\Http\Controllers\MobileappController;
use Modules\Mobileapp\Http\Middleware\CheckAppLoginToken;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Modules\Master\Entities\Tenancy;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/mobileapp', function (Request $request) {
//     return $request->user();
// });

Route::middleware(CheckAppLoginToken::class)->prefix('mobileapp')->group(function() {

    Route::prefix('products')->group(function() {
        Route::get('list', [MobileappController::class, 'productsList']);
        Route::get('search/{search}', [MobileappController::class, 'productsSearch']);
        Route::get('detail/{code}', [MobileappController::class, 'productDetail']);
    });

    Route::prefix('orders')->group(function() {
        Route::get('list', [MobileappController::class, 'ordersList']);
        Route::get('today-orders', [MobileappController::class, 'todayOrders']);
        Route::get('view-order/{code}', [MobileappController::class, 'viewOrder']);
        Route::get('search/{search}', [MobileappController::class, 'ordersSearch']);
    });


    Route::get('counts', [MobileappController::class, 'counts']);

    Route::get('tanency-config',function(Request $request){


         $domainurl = $request->getScheme() . '://' . $request->getHttpHost();

        // $tenants = Tenancy::all();

        Config::set('app.url', $domainurl);

        $tenant = Tenancy::where('domain',  $domainurl)->first();

        // Set up dynamic database connection
        $newDbConfig = [
            'driver'    => 'mysql',
            'host'      => $tenant->db_host,
            'database'  => $tenant->db_name,
            'username'  => $tenant->db_user,
            'password'  => $tenant->db_password,
            
        ];

        Config::set('database.connections.mysql', $newDbConfig);
        DB::purge('mysql'); // Clear any existing connections
        DB::setDefaultConnection('mysql'); // Switch to new database connection
        DB::reconnect('mysql'); // Reconnect with new settings


        //get database connection
        $connection = config('database.connections.mysql');

        return response()->json($connection, 200);
    });
    
});

