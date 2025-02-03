<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->controller(OrderController::class)->group(function(){
    Route::resource('order',OrderController::class);
    Route::post('order/bulkdestroy','bulkdestroy')->name('order.bulkdestroy');
    Route::get('order/create/instantorder', 'instantorder')->name('order.instantorder');
    Route::post('order/instantorder', 'instantorderstore')->name('order.instantorderstore');
    Route::put('order/{id}/changestatus', 'changestatus')->name('order.changeStatus');
    Route::put('order/{id}/amountupdate', 'amountupdate')->name('order.amountupdate');
    Route::get('order/csv/csvexport', [OrderController::class, 'csvExport'])->name('order.csvexport');
    Route::get('order/scanproduct',  [OrderController::class, 'scanproduct'])->name('order.scanproduct');

});

