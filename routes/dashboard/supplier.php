<?php

use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('supplier', SupplierController::class);  
    Route::get('supplier/invoices/{id}', [SupplierController::class, 'invoices'])->name('supplier.invoices');
    Route::get('supplier/invoices/csv/csvexport', [SupplierController::class, 'csvExportInvoices'])->name('supplierinvoices.csvexport');
    Route::post('supplier/bulkdestroy', [SupplierController::class, 'bulkdestroy'])->name('supplier.bulkdestroy');
    Route::get('supplier/csv/csvexport', [SupplierController::class, 'csvExport'])->name('supplier.csvexport');

});