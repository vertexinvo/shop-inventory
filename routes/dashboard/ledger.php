<?php

use App\Http\Controllers\LedgerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::get('ledger', [LedgerController::class, 'index'])->name('ledger.index');
    Route::get('ledger/sales', [LedgerController::class, 'sales'])->name('ledger.sales');
    Route::get('ledger/supplier', [LedgerController::class, 'supplier'])->name('ledger.supplier');
    Route::get('ledger/sales/csvexport', [LedgerController::class, 'csvExport'])->name('ledger.sales.csvexport');
    Route::get('/ledger/{userId}/sales-ledger', [LedgerController::class, 'customerSalesLedger'])->name('ledger.customers.salesLedger');

    Route::get('/ledger/{code}/supplier-ledger', [LedgerController::class, 'supplierLedger'])->name('ledger.supplier.supplierLedger');

});

