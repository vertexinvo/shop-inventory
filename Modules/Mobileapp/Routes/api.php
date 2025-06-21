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

Route::middleware(\Modules\Mobileapp\Http\Middleware\CheckAppLoginToken::class)->prefix('mobileapp')->group(function() {

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

    Route::prefix('suppliers')->group(function() {
        Route::get('list', [MobileappController::class, 'suppliersList']);
        Route::get('search/{search}', [MobileappController::class, 'suppliersSearch']);
        Route::get('invoices/{id}', [MobileappController::class, 'supplierInvoices']);
    });


    Route::get('counts', [MobileappController::class, 'counts']);
    Route::get('shopinfo', [MobileappController::class, 'shopinfo']);
  
});

