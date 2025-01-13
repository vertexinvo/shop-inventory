<?php

use App\Http\Controllers\ExpanceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::get('ledger/sales', [ExpanceController::class, 'sales'])->name('ledger.sales');
});

