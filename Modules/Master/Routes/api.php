<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\Master\Http\Controllers\MasterController;

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

// Route::middleware('auth:api')->get('/master', function (Request $request) {
//     return $request->user();
// });

Route::prefix('master')->group(function() {

    Route::prefix('auth')->group(function() {
        Route::post('login-via-qr', [MasterController::class, 'loginViaQr']);
        Route::post('logout', [MasterController::class, 'logout']);
    });
    
});