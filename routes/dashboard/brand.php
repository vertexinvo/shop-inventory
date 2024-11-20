<?php

use App\Http\Controllers\BrandController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('brand', BrandController::class);   
    Route::post('brand/bulkdestroy', [BrandController::class, 'bulkdestroy'])->name('brand.bulkdestroy');

});