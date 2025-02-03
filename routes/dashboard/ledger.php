<?php

use App\Http\Controllers\LedgerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::get('ledger/sales', [LedgerController::class, 'sales'])->name('ledger.sales');
    Route::get('ledger/sales/csvexport', [LedgerController::class, 'csvExport'])->name('ledger.sales.csvexport');
    Route::get('/ledger/{userId}/sales-ledger', [LedgerController::class, 'customerSalesLedger'])->name('ledger.customers.salesLedger');
});

