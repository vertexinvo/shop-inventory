<?php

use Illuminate\Support\Facades\Route;
use App\Models\Product;

Route::prefix('qrcode')->group(function () {
    Route::get('/product/{id}', function ($code) {
        $product = Product::with('stock','categories','brands')->where('code', $code)->first();

        if ($product === null) {
            $product = Product::where('id', $code)->firstOrFail();
        }

        return view('ProductDetail',compact('product'));
    }); 
});

