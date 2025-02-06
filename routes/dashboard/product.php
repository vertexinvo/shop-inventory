<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('product',ProductController::class);
    // Route::get('product/{product}/view', [ProductController::class, 'view'])->name('product.view');
    Route::put('product/status/{id}', [ProductController::class, 'status'])->name('product.status');
    Route::get('product/csv/csvexport', [ProductController::class, 'csvExport'])->name('product.csvexport');
    Route::post('product/bulkdestroy', [ProductController::class, 'bulkdestroy'])->name('product.bulkdestroy');
    Route::post('/product/csvstore', [ProductController::class, 'csvstore'])->name('product.csvstore');
    Route::get('product/printqr/{id}', [ProductController::class, 'printqr'])->name('product.printqr');
    Route::get('scanproduct', [ProductController::class, 'scanproduct'])->name('product.scanproduct');

});

