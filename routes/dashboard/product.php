<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('product',ProductController::class);
    // Route::get('product/{product}/view', [ProductController::class, 'view'])->name('product.view');
    Route::put('product/status/{id}', [ProductController::class, 'status'])->name('product.status');
    Route::get('product/csv/csvexport', [ProductController::class, 'csvExport'])->name('product.csvexport');
    Route::post('product/bulkdestroy', [ProductController::class, 'bulkdestroy'])->name('product.bulkdestroy');
    Route::post('/product/csvstore', [ProductController::class, 'csvstore'])->name('product.csvstore');
    Route::post('/product/updatewithimage/{product}', [ProductController::class, 'updatewithimage'])->name('product.updatewithimage');
    Route::get('/product/{product}/stock-logs', [ProductController::class, 'stockLogs'])->name('product.stockLogs');
    Route::get('/product/printqr/{id}', [ProductController::class, 'printqr'])->name('product.printqr');
});

Route::prefix('qrcode')->group(function () {
    Route::get('/product/{id}', function ($code) {
        $product = Product::with('stock','categories','brands')->where('code', $code)->first();

        if ($product === null) {
            $product = Product::where('id', $code)->firstOrFail();
        }

        return view('ProductDetail',compact('product'));
    })->name('product.detail'); 
});



