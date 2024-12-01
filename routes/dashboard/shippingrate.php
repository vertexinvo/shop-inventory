<?php

use App\Http\Controllers\ShippingRateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->controller(ShippingRateController::class)->group(function () {
    Route::resource('shippingrate',ShippingRateController::class);  
    Route::post('shippingrate/bulkdestroy','bulkdestroy')->name('shippingrate.bulkdestroy');
});