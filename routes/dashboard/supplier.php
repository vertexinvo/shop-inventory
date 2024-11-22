<?php

use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('supplier', SupplierController::class);  
    Route::post('supplier/generatecode', [SupplierController::class, 'generatecode'])->name('supplier.generatecode');
    // Route::post('brand/bulkdestroy', [SupplierController::class, 'bulkdestroy'])->name('brand.bulkdestroy');
});