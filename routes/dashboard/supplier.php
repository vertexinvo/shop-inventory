<?php

use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('supplier', SupplierController::class);  
    Route::get('supplier/invoices/{id}', [SupplierController::class, 'invoices'])->name('supplier.invoices');
    Route::post('supplier/bulkdestroy', [SupplierController::class, 'bulkdestroy'])->name('supplier.bulkdestroy');
});