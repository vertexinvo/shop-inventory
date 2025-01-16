<?php

use App\Http\Controllers\ExpanceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('expense',ExpanceController::class);
    Route::post('expense/bulkdestroy', [ExpanceController::class, 'bulkdestroy'])->name('expense.bulkdestroy');

});

