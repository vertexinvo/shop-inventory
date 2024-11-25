<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('order',OrderController::class);
    Route::post('order/bulkdestroy', [OrderController::class, 'bulkdestroy'])->name('order.bulkdestroy');
});

