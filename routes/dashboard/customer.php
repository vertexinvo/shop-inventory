<?php

use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('customer',CustomerController::class);
    Route::put('customer/status/{id}', [CustomerController::class, 'status'])->name('customer.status');
    Route::get('customer/csv/csvexport', [CustomerController::class, 'csvExport'])->name('customer.csvexport');
    Route::post('customer/bulkdestroy', [CustomerController::class, 'bulkdestroy'])->name('customer.bulkdestroy');

});

