<?php

use App\Http\Controllers\TaxController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('tax', TaxController::class);  
    Route::post('tax/bulkdestroy', [TaxController::class, 'bulkdestroy'])->name('tax.bulkdestroy');
});