<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->controller(OrderController::class)->group(function(){
    Route::resource('order',OrderController::class);
    Route::post('order/bulkdestroy','bulkdestroy')->name('order.bulkdestroy');
    Route::get('order/create/instantorder', 'instantorder')->name('order.instantorder');
    Route::post('order/instantorder', 'instantorderstore')->name('order.instantorderstore');
});

