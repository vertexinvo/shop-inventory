<?php

use App\Http\Controllers\ExpanceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('expence',ExpanceController::class);
});

