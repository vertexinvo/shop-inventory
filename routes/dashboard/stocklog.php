<?php


use App\Http\Controllers\StocklogController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->controller(StocklogController::class)->group(function () {
    Route::resource('stocklog', StocklogController::class);  
    Route::post('stocklog/bulkdestroy','bulkdestroy')->name('stocklog.bulkdestroy');
});