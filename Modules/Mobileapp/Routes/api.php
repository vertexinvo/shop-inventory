<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\Mobileapp\Http\Controllers\MobileappController;
//use Auth

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

Route::middleware('auth:api')->get('/mobileapp', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->prefix('mobileapp')->group(function() {

    Route::prefix('auth')->group(function() {
        Route::post('login-via-qr', [MobileappController::class, 'loginViaQr']);
    });
    
});