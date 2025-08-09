<?php

use App\Http\Controllers\BankController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('bank', BankController::class);   
    Route::post('bank/bulkdestroy', [BankController::class, 'bulkdestroy'])->name('bank.bulkdestroy');

});