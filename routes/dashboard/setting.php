<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('setting')->group(function(){
    Route::get('', [SettingController::class, 'index'])->name('setting');
});
